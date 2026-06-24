---
title: Telegram VSCode Remote Control - AGENTS.md
description: 通过 Telegram 机器人远程控制 VS Code 任务执行的系统，包含 Bot Server、VS Code Extension 和共享类型定义。
tags: [telegram, vscode, remote-control, bot, extension, typescript]
---

# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is a Telegram VSCode Remote Control System that allows controlling VS Code tasks through a Telegram bot. The system consists of:
- **Bot Server**: Express.js server handling Telegram webhook requests
- **VS Code Extension**: Executes commands and tasks in VS Code environment
- **Shared Types**: Common type definitions for communication

## Architecture

The system has three main components:

### 1. Bot Server (`telegram-bot-vscode-control/telegram-vscode-remote-control/bot-server/`)
- Handles incoming Telegram messages via webhook at `/webhook`
- Implements authentication using a user ID whitelist
- Processes commands like `/run`, `/list`, `/file`, `/task`
- Communicates with VS Code extension via simulated API calls
- Written in TypeScript with Express.js

### 2. VS Code Extension (`telegram-bot-vscode-control/telegram-vscode-remote-control/vsc-extension/`)
- Provides commands for authentication and task execution
- Handles file execution for multiple languages (JS, Python, TypeScript, Go, Java)
- Implements task listing and execution functionality
- Creates terminals to run commands
- Activated by commands like "Telegram Remote: Authenticate"

### 3. Shared Types (`telegram-bot-vscode-control/telegram-vscode-remote-control/shared/`)
- Common TypeScript interfaces for message passing
- Defines structures for TelegramMessage, CommandRequest, CommandResponse, etc.

## Development Commands

### Building the Project
```bash
# Build bot server
cd telegram-bot-vscode-control/telegram-vscode-remote-control/bot-server
npm install
npm run build

# Build VS Code extension
cd ../vsc-extension
npm install
npm run compile
```

### Running the Server
```bash
# Start bot server (requires ngrok for external access)
cd telegram-bot-vscode-control/telegram-vscode-remote-control/bot-server
npm start
```

### Developing Locally
```bash
# Watch mode for bot server
npm run dev

# Watch mode for VS Code extension
npm run watch
```

## Configuration

The system uses these environment variables in `bot-server/.env`:
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `JWT_SECRET`: Secret for JWT authentication
- `PORT`: Port for the server (defaults to 3000)

## Deployment

1. Build both the bot server and VS Code extension
2. Start the bot server (`npm start`)
3. Use ngrok to expose the server publicly: `ngrok http 3000`
4. Configure Telegram webhook with the ngrok URL
5. Install the VS Code extension in your VS Code
6. Authenticate using the extension's "Telegram Remote: Authenticate" command

## Key Files

- `bot-server/src/server.ts` - Main server logic and command processing
- `vsc-extension/src/extension.ts` - VS Code extension implementation
- `shared/types.ts` - Shared type definitions
- Various batch and PowerShell scripts for deployment in the root directory

## Security Features

- Command whitelisting (only allowed commands processed)
- User authentication via VS Code extension
- Input validation and sanitization
- Temporary authentication codes

## Troubleshooting

- If the bot doesn't respond, verify the webhook is properly configured
- Check that the bot server is accessible from the internet
- Verify authentication has been completed in VS Code
- Ensure the required ports aren't blocked by firewall
