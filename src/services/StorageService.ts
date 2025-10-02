import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  notifications: boolean;
  autoConnect: boolean;
  darkTheme: boolean;
  saveHistory: boolean;
  maxHistoryItems: number;
}

export interface ConnectionConfig {
  serverUrl: string;
  port: string;
  useHttps: boolean;
  apiKey?: string;
}

class StorageService {
  private static readonly KEYS = {
    APP_SETTINGS: 'appSettings',
    OLLAMA_CONFIG: 'ollamaConfig',
    CHAT_HISTORY: 'chatHistory',
  };

  async getAppSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(StorageService.KEYS.APP_SETTINGS);
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }

    // Return default settings
    return {
      notifications: true,
      autoConnect: false,
      darkTheme: false,
      saveHistory: true,
      maxHistoryItems: 100,
    };
  }

  async saveAppSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        StorageService.KEYS.APP_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving app settings:', error);
      throw error;
    }
  }

  async getConnectionConfig(): Promise<ConnectionConfig | null> {
    try {
      const config = await AsyncStorage.getItem(StorageService.KEYS.OLLAMA_CONFIG);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('Error loading connection config:', error);
      return null;
    }
  }

  async saveConnectionConfig(config: ConnectionConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(
        StorageService.KEYS.OLLAMA_CONFIG,
        JSON.stringify(config)
      );
    } catch (error) {
      console.error('Error saving connection config:', error);
      throw error;
    }
  }

  async clearConnectionConfig(): Promise<void> {
    try {
      await AsyncStorage.removeItem(StorageService.KEYS.OLLAMA_CONFIG);
    } catch (error) {
      console.error('Error clearing connection config:', error);
      throw error;
    }
  }

  async saveChatHistory(history: any[]): Promise<void> {
    try {
      const settings = await this.getAppSettings();
      if (!settings.saveHistory) {
        return;
      }

      // Limit history to max items
      const limitedHistory = history.slice(0, settings.maxHistoryItems);
      
      await AsyncStorage.setItem(
        StorageService.KEYS.CHAT_HISTORY,
        JSON.stringify(limitedHistory)
      );
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  async getChatHistory(): Promise<any[]> {
    try {
      const settings = await this.getAppSettings();
      if (!settings.saveHistory) {
        return [];
      }

      const history = await AsyncStorage.getItem(StorageService.KEYS.CHAT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(StorageService.KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  async exportData(): Promise<Record<string, any>> {
    try {
      const [settings, config, history] = await Promise.all([
        this.getAppSettings(),
        this.getConnectionConfig(),
        this.getChatHistory(),
      ]);

      return {
        appSettings: settings,
        connectionConfig: config,
        chatHistory: history,
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();