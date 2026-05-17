import 'dotenv/config';
import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';
import { TelegramMessage, CommandRequest, CommandResponse } from '../shared/types';

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

if (!TELEGRAM_BOT_TOKEN) {
  console.error('错误: 请设置 TELEGRAM_BOT_TOKEN 环境变量 (在 bot-server/.env 文件中)');
  process.exit(1);
}
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// 跳过代理，直连 Telegram API
const axiosInstance = axios.create({
  proxy: false,
});

const authenticatedUsers = new Set<number>();

// VS Code WebSocket 连接状态
let vscodeWs: WebSocket | null = null;
let vscodeConnected = false;

// 内置命令，由 bot server 直接处理
const builtinCommands = ['/start', '/help', '/auth', '/new', '/reset'];

app.use(express.json());

// ========== 轮询模式 (无需 ngrok) ==========

let lastUpdateId = 0;

async function startPolling() {
  console.log('启动轮询模式（无需公网URL）...');

  // 先清除可能存在的 webhook
  try {
    await axiosInstance.post(`${TELEGRAM_API_URL}/deleteWebhook`, { drop_pending_updates: false });
  } catch (e) {
    // 忽略
  }

  while (true) {
    try {
      const res = await axiosInstance.get(`${TELEGRAM_API_URL}/getUpdates`, {
        params: { offset: lastUpdateId + 1 },
      });

      if (!res.data.ok) continue;

      for (const update of res.data.result) {
        lastUpdateId = update.update_id;
        console.log(`收到消息: ${update.message?.text || '[无文本]'}`);
        if (update.message?.text) {
          await handleTelegramMessage(update);
        }
      }
    } catch (error: any) {
      console.error('轮询错误:', error.code, error.message);
    }
    // 每秒轮询一次
    await new Promise(r => setTimeout(r, 1000));
  }
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', vscodeConnected });
});

// ========== WebSocket Server (VS Code 连接) ==========

const wss = new WebSocketServer({ port: Number(WS_PORT) });

wss.on('connection', (ws: WebSocket) => {
  console.log('VS Code extension 已连接');
  vscodeWs = ws;
  vscodeConnected = true;

  ws.on('message', async (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'response' && msg.chatId) {
        await sendTelegramMessage(msg.chatId, msg.text);
      } else if (msg.type === 'status' && msg.chatId) {
        // 状态消息：短暂的思考提示，如果结果很快回来就不发这条
        // 先跳过，避免刷屏
      } else if (msg.type === 'ready') {
        console.log(`VS Code 已就绪，工作区: ${msg.workspace || '未知'}`);
      }
    } catch (e) {
      console.error('解析 VS Code 消息失败:', e);
    }
  });

  ws.on('close', () => {
    console.log('VS Code extension 断开连接');
    vscodeWs = null;
    vscodeConnected = false;
  });

  ws.on('error', (err) => {
    console.error('WebSocket 错误:', err.message);
    vscodeWs = null;
    vscodeConnected = false;
  });
});

// ========== 消息处理 ==========

async function handleTelegramMessage(update: TelegramMessage) {
  if (!update.message) return;

  const userId = update.message.from.id;
  const text = update.message.text?.trim() || '';
  const chatId = update.message.chat.id;

  if (!text.startsWith('/')) {
    // 自然语言消息 → 转发给 Claude Code
    if (!authenticatedUsers.has(userId)) {
      await sendTelegramMessage(chatId, '请先认证。发送 /auth 开始认证。');
      return;
    }
    await forwardToClaude(chatId, text);
    return;
  }

  // 命令消息
  const commandName = text.split(' ')[0].toLowerCase();

  if (builtinCommands.includes(commandName)) {
    const response = handleBuiltinCommand(commandName, userId);
    await sendTelegramMessage(chatId, response.message);
    return;
  }

  // 非内置命令 → 需要认证后转发给 Claude Code
  if (!authenticatedUsers.has(userId)) {
    await sendTelegramMessage(chatId, '请先认证。发送 /auth 开始认证。');
    return;
  }

  // 即便是命令形式，也转发给 Claude Code 处理
  await forwardToClaude(chatId, text);
}

function handleBuiltinCommand(command: string, userId: number): CommandResponse {
  switch (command) {
    case '/start':
      return {
        success: true,
        message:
          '🤖 VS Code 远程控制机器人已启动\n\n' +
          '发送 /auth 完成认证后，你就可以用自然语言让我控制 Claude Code 了。\n\n' +
          '示例：\n' +
          '"帮我在 src 下加一个 utils.ts"\n' +
          '"修复 app.ts 里的类型错误"\n\n' +
          '命令：\n' +
          '/help - 帮助\n/auth - 认证\n/new - 开始新对话',
      };

    case '/help':
      return {
        success: true,
        message:
          '📋 使用说明\n\n' +
          '直接发送自然语言指令即可让 Claude Code 执行任务。\n\n' +
          '内置命令：\n' +
          '/start - 开始\n/help - 本帮助\n/auth - 身份认证\n/new - 清空上下文，开始新对话\n\n' +
          '认证后，你说的每一句话都会发给 VS Code 里的 Claude Code。',
      };

    case '/auth':
      return {
        success: true,
        message:
          '🔐 认证流程：\n\n' +
          '1. 在 VS Code 中按 Ctrl+Shift+P\n' +
          '2. 运行 "Telegram Remote: Authenticate"\n' +
          '3. 将显示的认证码发送到这里\n\n' +
          '注意：认证码 5 分钟有效。',
      };

    case '/new':
    case '/reset': {
      // 通知 VS Code 重置对话
      if (vscodeWs && vscodeWs.readyState === WebSocket.OPEN) {
        vscodeWs.send(JSON.stringify({ type: 'reset' }));
      }
      return {
        success: true,
        message: '🆕 已开始新对话。之前的上下文已清除。',
      };
    }

    default:
      return { success: false, message: '未知命令' };
  }
}

async function forwardToClaude(chatId: number, message: string) {
  if (!vscodeWs || vscodeWs.readyState !== WebSocket.OPEN) {
    await sendTelegramMessage(
      chatId,
      '⚠️ VS Code 未连接。请确保：\n1. VS Code 已打开\n2. 扩展已激活\n3. Bot 服务器正在运行'
    );
    return;
  }

  // 发一条状态消息
  await sendTelegramMessage(chatId, '⏳');

  // 转发给 VS Code
  vscodeWs.send(JSON.stringify({
    type: 'command',
    chatId,
    message,
  }));
}

// ========== Telegram 消息发送 ==========

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    const chunks = splitMessage(text, 4000);

    for (const chunk of chunks) {
      await axiosInstance.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: chunk,
        // plain text 模式，避免 Markdown 特殊字符导致发送失败
      });
    }
  } catch (error: any) {
    console.error('发送 Telegram 消息失败:', error?.response?.data || error.message);
  }
}

function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let current = '';

  for (const line of text.split('\n')) {
    if (current.length + line.length + 1 <= maxLength) {
      current += (current ? '\n' : '') + line;
    } else {
      if (current) chunks.push(current);
      current = line;
      if (current.length > maxLength) {
        while (current.length > maxLength) {
          chunks.push(current.slice(0, maxLength));
          current = current.slice(maxLength);
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ========== 认证处理 ==========

// 用户发送的认证码（格式：/auth CODE 或直接发认证码）
app.post('/internal/authenticate', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (userId) {
    authenticatedUsers.add(userId);
    console.log(`用户 ${userId} 已认证`);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// ========== 启动 ==========

app.listen(HTTP_PORT, () => {
  console.log(`Bot server 运行在 http://localhost:${HTTP_PORT}`);
  console.log(`WebSocket 等待 VS Code 连接: ws://localhost:${WS_PORT}`);
  console.log(`内置命令: ${builtinCommands.join(', ')}`);
  startPolling();
});
