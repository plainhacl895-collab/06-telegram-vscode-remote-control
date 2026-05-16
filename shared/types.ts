// shared/types.ts
export interface TelegramMessage {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text: string;
  };
}

export interface CommandRequest {
  userId: number;
  command: string;
  args?: string[];
  timestamp: number;
}

export interface CommandResponse {
  success: boolean;
  message: string;
  output?: string;
  error?: string;
}

export interface VSCodeTask {
  id: string;
  name: string;
  description: string;
  type: 'run' | 'debug' | 'build' | 'test';
}

export interface FileOperation {
  operation: 'read' | 'write' | 'create' | 'delete' | 'list';
  path: string;
  content?: string;
}