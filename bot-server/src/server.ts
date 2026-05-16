// bot-server/src/server.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import { TelegramMessage, CommandRequest, CommandResponse } from '../shared/types';

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// 存储已认证用户的会话
const authenticatedUsers = new Set<number>();

// 验证命令白名单
const allowedCommands = [
  '/start',
  '/help',
  '/auth',
  '/run',
  '/list',
  '/file',
  '/task'
];

app.use(express.json());

// Telegram webhook endpoint
app.post('/webhook', async (req: Request, res: Response) => {
  try {
    const update: TelegramMessage = req.body;

    if (update.message && update.message.text) {
      await handleTelegramMessage(update);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error');
  }
});

async function handleTelegramMessage(update: TelegramMessage) {
  if (!update.message) return;

  const userId = update.message.from.id;
  const command = update.message.text?.trim() || '';
  const chatId = update.message.chat.id;

  // 检查用户是否被认证
  const isAuthenticated = authenticatedUsers.has(userId);

  let response: CommandResponse;

  if (command.startsWith('/')) {
    response = await processCommand({ userId, command, timestamp: Date.now() }, isAuthenticated);
  } else {
    response = {
      success: false,
      message: '请发送有效的命令。发送 /help 获取帮助信息。',
    };
  }

  await sendMessage(chatId, response.message);
}

async function processCommand(request: CommandRequest, isAuthenticated: boolean): Promise<CommandResponse> {
  const { userId, command } = request;
  const commandName = command.split(' ')[0];

  // 验证命令是否在白名单中
  if (!allowedCommands.includes(commandName)) {
    return {
      success: false,
      message: `未授权的命令: ${commandName}. 请联系管理员。`,
    };
  }

  // 一些命令不需要认证
  if (['/start', '/help', '/auth'].includes(commandName)) {
    return handleAuthCommand(commandName, userId);
  }

  // 其他命令需要认证
  if (!isAuthenticated) {
    return {
      success: false,
      message: '请先进行身份认证。发送 /auth 开始认证过程。',
    };
  }

  // 处理认证后的命令
  return handleAuthenticatedCommand(commandName, request);
}

function handleAuthCommand(commandName: string, userId: number): CommandResponse {
  switch (commandName) {
    case '/start':
      return {
        success: true,
        message: '欢迎使用 VS Code 远程控制机器人！\n\n' +
          '您可以使用以下命令：\n' +
          '/auth - 开始身份认证\n' +
          '/help - 显示帮助信息',
      };

    case '/help':
      return {
        success: true,
        message: 'VS Code 远程控制机器人使用指南：\n\n' +
          '基础命令：\n' +
          '/start - 启动机器人\n' +
          '/help - 显示此帮助\n' +
          '/auth - 身份认证\n\n' +
          '认证后可用命令：\n' +
          '/run <file> - 运行代码文件\n' +
          '/list - 列出可用任务\n' +
          '/file <path> - 读取文件内容\n' +
          '/task <name> - 执行VS Code任务',
      };

    case '/auth':
      // 实际应用中应该发送一个临时认证码到用户的VS Code或其他地方
      return {
        success: true,
        message: '请在您的 VS Code 中打开认证页面以获取认证码。\n' +
          '认证后您将能够远程控制 VS Code。',
      };

    default:
      return {
        success: false,
        message: '无效的命令',
      };
  }
}

async function handleAuthenticatedCommand(commandName: string, request: CommandRequest): Promise<CommandResponse> {
  const { userId, command, args } = request;

  switch (commandName) {
    case '/run':
      // 解析文件路径
      const filePath = command.split(' ').slice(1).join(' ');
      if (!filePath) {
        return {
          success: false,
          message: '请指定要运行的文件路径。用法: /run <file>',
        };
      }
      return executeFile(filePath);

    case '/list':
      return listTasks();

    case '/file':
      const filePathRead = command.split(' ').slice(1).join(' ');
      if (!filePathRead) {
        return {
          success: false,
          message: '请指定要读取的文件路径。用法: /file <path>',
        };
      }
      return readFileContent(filePathRead);

    case '/task':
      const taskName = command.split(' ').slice(1).join(' ');
      if (!taskName) {
        return {
          success: false,
          message: '请指定要执行的任务名称。用法: /task <name>',
        };
      }
      return executeTask(taskName);

    default:
      return {
        success: false,
        message: '未实现的命令',
      };
  }
}

// 模拟执行文件
async function executeFile(filePath: string): Promise<CommandResponse> {
  // 这里应该是实际的VS Code任务执行逻辑
  // 为了演示，我们只是返回一个模拟响应
  return {
    success: true,
    message: `正在尝试运行文件: ${filePath}`,
    output: `执行完成: ${filePath}\n这是模拟输出结果。\n在实际部署中，这里会显示真实的执行结果。`,
  };
}

// 模拟列出任务
async function listTasks(): Promise<CommandResponse> {
  // 这里应该是实际从VS Code获取任务列表的逻辑
  return {
    success: true,
    message: '可用的VS Code任务：\n\n' +
      '• build - 构建项目\n' +
      '• test - 运行测试\n' +
      '• debug - 调试模式\n' +
      '• deploy - 部署项目',
  };
}

// 模拟读取文件内容
async function readFileContent(filePath: string): Promise<CommandResponse> {
  // 这里应该是实际从VS Code读取文件的逻辑
  return {
    success: true,
    message: `文件内容: ${filePath}`,
    output: `// 这是 ${filePath} 的内容\nconsole.log("Hello from VS Code!");\n\n// 在实际部署中，这里会显示真实的文件内容`,
  };
}

// 模拟执行任务
async function executeTask(taskName: string): Promise<CommandResponse> {
  // 这里应该是实际执行VS Code任务的逻辑
  return {
    success: true,
    message: `正在执行任务: ${taskName}`,
    output: `任务 ${taskName} 开始执行...\n执行中...\n任务完成！\n在实际部署中，这里会显示真实任务执行结果。`,
  };
}

// 发送消息到Telegram
async function sendMessage(chatId: number, text: string) {
  try {
    const chunks = splitMessage(text, 4096); // Telegram消息长度限制

    for (const chunk of chunks) {
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: chunk,
        parse_mode: 'Markdown',
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// 分割长消息
function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  const lines = text.split('\n');

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 <= maxLength) {
      currentChunk += (currentChunk ? '\n' : '') + line;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = line;

      // 如果单行超过限制，则按字符分割
      if (currentChunk.length > maxLength) {
        const lineChunks = currentChunk.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [];
        if (lineChunks.length > 0) {
          currentChunk = lineChunks.pop()!;
          chunks.push(...lineChunks);
        }
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// 模拟认证用户
function authenticateUser(userId: number) {
  authenticatedUsers.add(userId);
  console.log(`User ${userId} authenticated`);
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});