---
title: Telegram VSCode Remote Control
description: 通过 Telegram 机器人远程控制 VS Code 任务执行的系统。
tags: [telegram, vscode, remote-control]
---

# Telegram VSCode Remote Control

一个允许您通过Telegram机器人远程控制VS Code任务执行的系统。

## 功能特性

- 远程执行VS Code中的代码
- 支持多种编程语言
- 文件查看和管理
- 任务管理
- 安全的用户认证

## 架构概览

- **Bot Server**: 处理Telegram消息和认证
- **VS Code Extension**: 执行VS Code相关任务
- **共享类型定义**: 统一API接口和数据结构

## 安全特性

- JWT认证机制
- 命令白名单验证
- 用户权限管理
- 输入验证和清理

## 快速开始

请参阅 `docs/setup-guide.md` 以获取详细的安装和配置指南。
