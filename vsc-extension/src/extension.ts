// vsc-extension/src/extension.ts
import * as vscode from 'vscode';
// 移除axios导入，因为在VS Code扩展环境中可能有类型冲突
// import axios from 'axios';
import { FileOperation, VSCodeTask } from '../shared/types'; // 修改导入路径

let isAuthenticated = false;
let authToken: string | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('VS Code Telegram Remote Control extension is now active!');

	// 注册认证命令
	const authenticateCmd = vscode.commands.registerCommand('telegram-remote.authenticate', async () => {
		await authenticateUser(context);
	});

	// 注册执行任务命令
	const executeTaskCmd = vscode.commands.registerCommand('telegram-remote.executeTask', async () => {
		if (!isAuthenticated) {
			vscode.window.showErrorMessage('请先进行身份认证');
			return;
		}

		await executeTaskFromTelegram();
	});

	// 注册执行文件命令
	const executeFileCmd = vscode.commands.registerCommand('telegram-remote.executeFile', async (uri: vscode.Uri) => {
		if (!isAuthenticated) {
			vscode.window.showErrorMessage('请先进行身份认证');
			return;
		}

		if (uri) {
			await executeFile(uri.fsPath);
		} else {
			vscode.window.showErrorMessage('请选择要执行的文件');
		}
	});

	// 注册显示认证码命令
	const showAuthCodeCmd = vscode.commands.registerCommand('telegram-remote.showAuthCode', async () => {
		await showAuthenticationCode();
	});

	context.subscriptions.push(
		authenticateCmd,
		executeTaskCmd,
		executeFileCmd,
		showAuthCodeCmd
	);

	// 显示通知
	vscode.window.showInformationMessage('VS Code Telegram Remote Control 已激活');
}

async function authenticateUser(context: vscode.ExtensionContext) {
	try {
		// 生成一个临时认证码
		const authCode = Math.random().toString(36).substring(2, 10).toUpperCase();

		// 存储认证码到全局状态
		context.globalState.update('telegramRemoteAuthCode', authCode);
		context.globalState.update('telegramRemoteAuthExpiry', Date.now() + 5 * 60 * 1000); // 5分钟后过期

		// 显示认证码
		const result = await vscode.window.showInformationMessage(
			`认证码: ${authCode}\n请在Telegram机器人中输入此码完成认证。`,
			'复制到剪贴板',
			'关闭'
		);

		if (result === '复制到剪贴板') {
			vscode.env.clipboard.writeText(authCode);
		}

		// 设置认证状态
		isAuthenticated = true;
		vscode.window.showInformationMessage('认证成功！现在可以通过Telegram控制VS Code');
	} catch (error) {
		vscode.window.showErrorMessage(`认证失败: ${error}`);
	}
}

async function showAuthenticationCode() {
	if (!isAuthenticated) {
		vscode.window.showInformationMessage('请先通过命令面板执行 "Telegram Remote: Authenticate" 进行认证');
		return;
	}

	vscode.window.showInformationMessage('您已经通过认证，可以使用Telegram机器人远程控制VS Code');
}

async function executeTaskFromTelegram() {
	try {
		// 获取当前工作区的任务
		const tasks = await vscode.tasks.fetchTasks();
		const taskNames = tasks.map(t => t.name);

		if (taskNames.length === 0) {
			vscode.window.showWarningMessage('当前工作区没有可执行的任务');
			return;
		}

		const selectedTask = await vscode.window.showQuickPick(taskNames, {
			placeHolder: '选择要执行的任务'
		});

		if (selectedTask) {
			const taskToRun = tasks.find(t => t.name === selectedTask);
			if (taskToRun) {
				vscode.tasks.executeTask(taskToRun);
				vscode.window.showInformationMessage(`正在执行任务: ${selectedTask}`);
			}
		}
	} catch (error) {
		vscode.window.showErrorMessage(`执行任务失败: ${error}`);
	}
}

async function executeFile(filePath: string) {
	try {
		// 根据文件扩展名确定如何执行
		const ext = filePath.split('.').pop()?.toLowerCase();

		let command: string | undefined;
		switch (ext) {
			case 'js':
			case 'javascript':
				command = `node "${filePath}"`;
				break;
			case 'py':
			case 'python':
				command = `python "${filePath}"`;
				break;
			case 'ts':
			case 'typescript':
				command = `ts-node "${filePath}"`;
				break;
			case 'go':
				command = `go run "${filePath}"`;
				break;
			case 'java':
				// 编译并运行Java文件
				const className = filePath.split('/').pop()?.replace('.java', '') || '';
				command = `javac "${filePath}" && java -cp "${filePath.replace(className + '.java', '')}" ${className}`;
				break;
			default:
				vscode.window.showWarningMessage(`不支持的文件类型: ${ext}`);
				return;
		}

		if (command) {
			// 创建并运行终端来执行命令
			const terminal = vscode.window.createTerminal(`Run: ${filePath.split('/').pop()}`);
			terminal.show();
			terminal.sendText(command);

			vscode.window.showInformationMessage(`正在执行文件: ${filePath}`);
		}
	} catch (error) {
		vscode.window.showErrorMessage(`执行文件失败: ${error}`);
	}
}

// 读取文件内容
async function readFileContent(filePath: string): Promise<string> {
	try {
		const uri = vscode.Uri.file(filePath);
		const content = await vscode.workspace.fs.readFile(uri);
		return new TextDecoder().decode(content);
	} catch (error) {
		throw new Error(`无法读取文件: ${error}`);
	}
}

// 获取工作区文件列表
async function getFileList(): Promise<string[]> {
	try {
		if (vscode.workspace.workspaceFolders) {
			const files = await vscode.workspace.findFiles('**/*');
			return files.map(f => f.path);
		}
		return [];
	} catch (error) {
		throw new Error(`无法获取文件列表: ${error}`);
	}
}

// 获取任务列表
async function getTaskList(): Promise<VSCodeTask[]> {
	try {
		const tasks = await vscode.tasks.fetchTasks();
		return tasks.map((task, index) => ({
			id: task.definition.type || `task-${index}`,
			name: task.name,
			description: task.group?.id.toString() || '未分类任务',
			type: 'run'
		}));
	} catch (error) {
		throw new Error(`无法获取任务列表: ${error}`);
	}
}

export function deactivate() {
	console.log('VS Code Telegram Remote Control extension deactivated');
}