import * as vscode from 'vscode';
import * as cp from 'child_process';
import WebSocket from 'ws';

const WS_URL = 'ws://localhost:3001';

let ws: WebSocket | null = null;
let hasConversation = false;
let isProcessing = false;
let reconnectTimer: NodeJS.Timeout | null = null;
let statusBar: vscode.StatusBarItem;

interface QueuedMessage {
  chatId: number;
  text: string;
}

const messageQueue: QueuedMessage[] = [];

export function activate(context: vscode.ExtensionContext) {
  // 状态栏
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(radio-tower) 连接中...';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // 注册命令
  context.subscriptions.push(
    vscode.commands.registerCommand('telegram-remote.authenticate', () => authenticate(context)),
    vscode.commands.registerCommand('telegram-remote.reconnect', () => connectWebSocket()),
    vscode.commands.registerCommand('telegram-remote.disconnect', () => disconnect()),
  );

  // 启动连接
  connectWebSocket();

  console.log('Telegram Claude Code Remote 已激活');
}

function connectWebSocket() {
  if (ws?.readyState === WebSocket.OPEN) return;

  statusBar.text = '$(sync~spin) 连接 Bot 服务器...';

  try {
    ws = new WebSocket(WS_URL);
  } catch (e) {
    console.error('创建 WebSocket 失败:', e);
    scheduleReconnect();
    return;
  }

  ws.on('open', () => {
    const workspace = vscode.workspace.workspaceFolders?.[0]?.name || '未知';
    statusBar.text = `$(radio-tower) Claude Code 就绪 (${workspace})`;
    console.log('已连接到 Bot 服务器');

    ws!.send(JSON.stringify({ type: 'ready', workspace }));

    // 处理积压消息
    processQueue();
  });

  ws.on('message', (data: WebSocket.Data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'command') {
        messageQueue.push({ chatId: msg.chatId, text: msg.message });
        processQueue();
      } else if (msg.type === 'reset') {
        hasConversation = false;
        console.log('对话已重置');
      }
    } catch (e) {
      console.error('解析消息失败:', e);
    }
  });

  ws.on('close', () => {
    statusBar.text = '$(circle-slash) 已断开';
    scheduleReconnect();
  });

  ws.on('error', (err) => {
    console.error('WebSocket 错误:', err.message);
    ws?.close();
  });
}

function scheduleReconnect() {
  if (reconnectTimer) return;

  statusBar.text = '$(sync~spin) 5秒后重连...';
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectWebSocket();
  }, 5000);
}

function disconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  ws?.close();
  ws = null;
  statusBar.text = '$(circle-slash) 已断开';
  vscode.window.showInformationMessage('已断开与 Bot 服务器的连接');
}

// ========== 消息队列处理 ==========

async function processQueue() {
  if (isProcessing || messageQueue.length === 0) return;
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  isProcessing = true;
  const { chatId, text } = messageQueue.shift()!;

  statusBar.text = '$(loading~spin) Claude Code 处理中...';

  try {
    const result = await runClaudeCode(text);

    ws.send(JSON.stringify({
      type: 'response',
      chatId,
      text: result,
    }));
  } catch (error: any) {
    ws.send(JSON.stringify({
      type: 'response',
      chatId,
      text: `❌ ${error.message || error}`,
    }));
  }

  const workspace = vscode.workspace.workspaceFolders?.[0]?.name || '';
  statusBar.text = `$(radio-tower) Claude Code 就绪 (${workspace})`;

  isProcessing = false;
  // 处理下一条
  processQueue();
}

// ========== Claude Code 执行 ==========

function runClaudeCode(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();

    const args: string[] = [];
    if (hasConversation) {
      args.push('--continue');
    }
    args.push('-p', prompt);

    console.log(`执行: claude ${args.join(' ')}`);

    const proc = cp.spawn('claude', args, {
      cwd: workspaceRoot,
      env: { ...process.env },
      timeout: 600_000, // 10 分钟超时
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('close', (code: number | null) => {
      if (code === 0) {
        hasConversation = true;
        const output = stdout.trim();
        resolve(output || '✅ 完成（无输出）');
      } else {
        // 保留上下文，让用户可以选择 /new 重置
        resolve(`⚠️ Claude Code 退出码 ${code}\n\n${stderr || stdout}`.trim());
      }
    });

    proc.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ENOENT') {
        reject(new Error('找不到 claude 命令。请确保已安装 Claude Code CLI。'));
      } else {
        reject(new Error(`无法启动 Claude Code: ${err.message}`));
      }
    });
  });
}

// ========== 认证 ==========

async function authenticate(context: vscode.ExtensionContext) {
  const authCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  context.globalState.update('telegramAuthCode', authCode);
  context.globalState.update('telegramAuthExpiry', Date.now() + 5 * 60 * 1000);

  const action = await vscode.window.showInformationMessage(
    `认证码: ${authCode}\n\n请在 Telegram 中发送此码完成认证。(5分钟内有效)`,
    '复制到剪贴板',
    '关闭'
  );

  if (action === '复制到剪贴板') {
    await vscode.env.clipboard.writeText(authCode);
  }
}

export function deactivate() {
  disconnect();
  console.log('Telegram Claude Code Remote 已停用');
}
