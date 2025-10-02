import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatScreenProps {
  navigation: any;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ConnectionConfig {
  serverUrl: string;
  port: string;
  useHttps: boolean;
  apiKey?: string;
}

const SimpleChatScreen: React.FC<ChatScreenProps> = ({navigation}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig | null>(null);
  const [availableModel, setAvailableModel] = useState<string>('mistral:latest');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadConfig();
    initializeChat();
  }, []);

  useEffect(() => {
    if (connectionConfig) {
      detectAvailableModel();
    }
  }, [connectionConfig]);

  const loadConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('ollamaConfig');
      if (savedConfig) {
        setConnectionConfig(JSON.parse(savedConfig));
      } else {
        Alert.alert(
          'No Connection',
          'Please set up your Ollama connection first.',
          [
            {
              text: 'Setup Connection',
              onPress: () => navigation.navigate('Connection'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const detectAvailableModel = async () => {
    if (!connectionConfig) return;
    
    try {
      const protocol = connectionConfig.useHttps ? 'https' : 'http';
      const url = `${protocol}://${connectionConfig.serverUrl}:${connectionConfig.port}/api/tags`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(connectionConfig.apiKey && {'Authorization': `Bearer ${connectionConfig.apiKey}`}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          // Prefer mistral, then any other model
          const mistralModel = data.models.find((model: any) => 
            model.name.toLowerCase().includes('mistral')
          );
          
          if (mistralModel) {
            setAvailableModel(mistralModel.name);
          } else {
            // Use the first available model if no mistral found
            setAvailableModel(data.models[0].name);
          }
        }
      }
    } catch (error) {
      console.log('Could not detect models, using default:', error);
      // Keep default model if detection fails
    }
  };

  const initializeChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your Ollama assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !connectionConfig || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const protocol = connectionConfig.useHttps ? 'https' : 'http';
      const url = `${protocol}://${connectionConfig.serverUrl}:${connectionConfig.port}/api/generate`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(connectionConfig.apiKey && {'Authorization': `Bearer ${connectionConfig.apiKey}`}),
        },
        body: JSON.stringify({
          model: availableModel, // Auto-detected model
          prompt: userMessage.text,
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          text: data.response || 'Sorry, I couldn\'t generate a response.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      let errorText = 'Failed to connect to Ollama server';
      if (error instanceof Error) {
        errorText = error.message;
        // Add helpful hints for common errors
        if (error.message.includes('404')) {
          errorText += '\n\nTip: Make sure the model exists. Available models can be checked with "ollama list"';
        } else if (error.message.includes('Failed to fetch')) {
          errorText += '\n\nTip: Check your IP address and make sure Ollama is running with "ollama serve"';
        }
      }
      
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        text: `Error: ${errorText}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* Model indicator */}
        <View style={styles.modelIndicator}>
          <Text style={styles.modelText}>🤖 Model: {availableModel}</Text>
        </View>
        
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={[styles.messagesContent, {paddingBottom: insets.bottom + 20}]}>
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={styles.loadingMessage}>
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, {paddingBottom: insets.bottom}]}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoid: {
    flex: 1,
  },
  modelIndicator: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modelText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366f1',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingText: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimpleChatScreen;