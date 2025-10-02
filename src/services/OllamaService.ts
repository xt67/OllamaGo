interface ConnectionConfig {
  serverUrl: string;
  port: string;
  useHttps: boolean;
  apiKey?: string;
}

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

interface ChatMessage {
  model: string;
  prompt: string;
  stream?: boolean;
  context?: number[];
}

interface ChatResponse {
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

class OllamaService {
  private config: ConnectionConfig | null = null;

  setConfig(config: ConnectionConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    if (!this.config) {
      throw new Error('Configuration not set');
    }
    
    const protocol = this.config.useHttps ? 'https' : 'http';
    return `${protocol}://${this.config.serverUrl}:${this.config.port}`;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config?.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.getBaseUrl()}/api/tags`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const url = `${this.getBaseUrl()}/api/tags`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      throw error;
    }
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      const url = `${this.getBaseUrl()}/api/generate`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async pullModel(modelName: string): Promise<void> {
    try {
      const url = `${this.getBaseUrl()}/api/pull`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name: modelName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to pull model:', error);
      throw error;
    }
  }

  async getModelInfo(modelName: string): Promise<any> {
    try {
      const url = `${this.getBaseUrl()}/api/show`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name: modelName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get model info:', error);
      throw error;
    }
  }
}

export const ollamaService = new OllamaService();
export type { ConnectionConfig, OllamaModel, ChatMessage, ChatResponse };