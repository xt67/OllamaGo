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
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack?: () => void;
  };
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-280));
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadConfig();
    initializeChat();
    loadChatHistory();
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
      // First check if user has selected a model
      const savedModel = await AsyncStorage.getItem('selectedModel');
      if (savedModel) {
        setAvailableModel(savedModel);
        console.log('Using user-selected model:', savedModel);
        return;
      }

      // If no saved model, auto-detect
      const protocol = connectionConfig.useHttps ? 'https' : 'http';
      const url = `${protocol}://${connectionConfig.serverUrl}:${connectionConfig.port}/api/tags`;
      
      console.log('Attempting to connect to:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(connectionConfig.apiKey && {'Authorization': `Bearer ${connectionConfig.apiKey}`}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('Models response:', data);
        if (data.models && data.models.length > 0) {
          // Use the first available model
          setAvailableModel(data.models[0].name);
          console.log('Using first available model:', data.models[0].name);
        }
      } else {
        console.log('Response not OK:', response.status, response.statusText);
        Alert.alert(
          'Connection Error',
          `Server responded with status ${response.status}. Please check your Ollama server.`
        );
      }
    } catch (error) {
      console.log('Could not detect models, using default:', error);
      // Provide helpful error message
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Connection timed out - check if Ollama is running and accessible');
          Alert.alert(
            'Connection Timeout',
            `Could not reach Ollama server at ${connectionConfig.serverUrl}:${connectionConfig.port}\n\n` +
            'Please check:\n' +
            '1. Your phone and PC are on the same Wi-Fi network\n' +
            '2. The IP address is correct\n' +
            '3. Ollama is running on your PC\n' +
            '4. Windows Firewall allows port 11434',
            [
              {text: 'Change Connection', onPress: () => navigation.navigate('Connection')},
              {text: 'OK', style: 'cancel'}
            ]
          );
        } else if (error.message.includes('Network request failed')) {
          console.log('Network error - check IP address and make sure Ollama allows external connections');
          Alert.alert(
            'Network Error',
            `Cannot connect to ${connectionConfig.serverUrl}:${connectionConfig.port}\n\n` +
            'Troubleshooting:\n' +
            '1. Verify your PC IP address (run "ipconfig" on PC)\n' +
            '2. Make sure both devices are on the same network\n' +
            '3. Test by opening http://${connectionConfig.serverUrl}:${connectionConfig.port}/api/tags in your phone browser\n' +
            '4. Check if Ollama is running: "ollama list" on PC',
            [
              {text: 'Change Connection', onPress: () => navigation.navigate('Connection')},
              {text: 'Retry', onPress: () => detectAvailableModel()},
              {text: 'Cancel', style: 'cancel'}
            ]
          );
        } else {
          Alert.alert(
            'Connection Error',
            `Error: ${error.message}\n\nServer: ${connectionConfig.serverUrl}:${connectionConfig.port}`,
            [
              {text: 'Change Connection', onPress: () => navigation.navigate('Connection')},
              {text: 'OK', style: 'cancel'}
            ]
          );
        }
      }
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

  const openSidebar = () => {
    setShowSidebar(true);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: -280,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowSidebar(false));
  };

  const handleChangeModel = async () => {
    closeSidebar();
    if (!connectionConfig) {
      Alert.alert('No Connection', 'Please set up your connection first.');
      return;
    }
    
    try {
      const protocol = connectionConfig.useHttps ? 'https' : 'http';
      const url = `${protocol}://${connectionConfig.serverUrl}:${connectionConfig.port}/api/tags`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map((model: any) => model.name) || [];
        
        if (models.length > 0) {
          Alert.alert(
            'Available Models',
            `Current: ${availableModel}\n\nAvailable models: ${models.join(', ')}`,
            [
              {text: 'OK', style: 'default'}
            ]
          );
        } else {
          Alert.alert('No Models', 'No models found on the server.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch available models.');
    }
  };

  const handleClearHistory = async () => {
    console.log('🔴 CLEAR HISTORY CLICKED');
    Alert.alert(
      'Clear All Chats',
      'Are you sure you want to clear all chat history?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            console.log('🔴 CLEARING ALL CHATS');
            await AsyncStorage.removeItem('allChats');
            setChatHistory([]);
            setMessages([]);
            setCurrentChatId('');
            closeSidebar();
            console.log('🔴 CHATS CLEARED');
          }
        }
      ]
    );
  };

  const loadChat = (chat: any) => {
    console.log('🔵 LOAD CHAT CLICKED:', chat.preview);
    setMessages(chat.messages || []);
    setCurrentChatId(chat.id);
    closeSidebar();
    console.log('🔵 CHAT LOADED');
  };

  const startNewChat = () => {
    console.log('🟢 NEW CHAT CLICKED');
    setMessages([]);
    setCurrentChatId('');
    closeSidebar();
    console.log('🟢 NEW CHAT STARTED');
  };

  const handleSettings = () => {
    console.log('🟡 SETTINGS CLICKED');
    console.log('🟡 Navigation object:', navigation);
    closeSidebar();
    navigation.navigate('Settings');
    console.log('🟡 NAVIGATED TO SETTINGS');
  };

  const sendMessage = async () => {
    console.log('🟣 SEND BUTTON CLICKED');
    console.log('🟣 Input text:', inputText);
    console.log('🟣 Is loading:', isLoading);
    console.log('🟣 Connection config:', connectionConfig);
    
    if (!inputText.trim() || !connectionConfig || isLoading) {
      console.log('🟣 SEND BLOCKED - Input empty or loading or no config');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    console.log('🟣 Sending message:', userMessage.text);
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

  const loadChatHistory = async () => {
    try {
      const savedChats = await AsyncStorage.getItem('allChats');
      if (savedChats) {
        setChatHistory(JSON.parse(savedChats));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveCurrentChat = async (messagesToSave: Message[]) => {
    try {
      if (messagesToSave.length <= 1) return;
      
      const firstUserMessage = messagesToSave.find(m => m.isUser);
      if (!firstUserMessage) return;
      
      const chatPreview = firstUserMessage.text.substring(0, 40) + (firstUserMessage.text.length > 40 ? '...' : '');
      const chatId = currentChatId || Date.now().toString();
      
      const newChat = {
        id: chatId,
        preview: chatPreview,
        timestamp: new Date().toLocaleString(),
        messages: messagesToSave
      };

      const savedChats = await AsyncStorage.getItem('allChats');
      const existingChats = savedChats ? JSON.parse(savedChats) : [];
      
      // Remove existing chat with same ID, then add updated one at front
      const filteredChats = existingChats.filter((chat: any) => chat.id !== chatId);
      const updatedChats = [newChat, ...filteredChats.slice(0, 9)];
      
      await AsyncStorage.setItem('allChats', JSON.stringify(updatedChats));
      setChatHistory(updatedChats);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  // Save current chat whenever messages change (with debounce)
  useEffect(() => {
    if (messages.length > 1) {
      const hasUserMessage = messages.some(msg => msg.isUser);
      if (hasUserMessage) {
        const timeoutId = setTimeout(() => {
          saveCurrentChat(messages);
        }, 2000); // Debounce saves by 2 seconds
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [messages]);

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
        {message.timestamp instanceof Date 
          ? message.timestamp.toLocaleTimeString() 
          : new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* App Title */}
      <Text style={styles.appTitle}>OllamaGO</Text>
      
      {/* Hamburger Menu Button */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={openSidebar}>
        <Text style={styles.menuButtonText}>≡</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={styles.loadingMessage}>
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#666666"
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

      {/* Sidebar */}
      <Modal
        visible={showSidebar}
        transparent={true}
        animationType="none"
        onRequestClose={closeSidebar}>
        <TouchableOpacity 
          style={styles.sidebarOverlay}
          activeOpacity={1}
          onPress={closeSidebar}>
          <Animated.View 
            style={[
              styles.sidebar,
              {
                transform: [{translateX: sidebarAnimation}]
              }
            ]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Chats</Text>
              <TouchableOpacity onPress={closeSidebar}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={startNewChat}>
              <Text style={styles.newChatText}>+ New Chat</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.chatList}>
              {chatHistory.map((chat) => (
                <TouchableOpacity 
                  key={chat.id}
                  style={styles.chatItem}
                  onPress={() => loadChat(chat)}>
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {chat.preview}
                  </Text>
                  <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                </TouchableOpacity>
              ))}
              {chatHistory.length === 0 && (
                <Text style={styles.noChatsText}>No previous chats</Text>
              )}
            </ScrollView>
            
            <View style={styles.sidebarFooter}>
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={handleSettings}>
                <Text style={styles.footerButtonText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.footerButton}
                onPress={handleClearHistory}>
                <Text style={styles.footerButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modelIndicator: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modelText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  messagesContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2b2b2b',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 11,
    color: '#666666',
    marginTop: 6,
    textAlign: 'right',
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  loadingText: {
    color: '#888888',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#2b2b2b',
  },
  sendButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#444444',
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  menuButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: 280,
    height: '100%',
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingBottom: 100, // Add padding to avoid overlap with navigation
    borderRightWidth: 1,
    borderRightColor: '#333333',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sidebarTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  newChatButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  newChatText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: '#262626',
  },
  chatPreview: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  chatTimestamp: {
    color: '#888888',
    fontSize: 12,
  },
  noChatsText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  sidebarFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: 20, // Extra padding at bottom
    marginBottom: 20, // Extra margin to ensure no overlap
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#2b2b2b',
  },
  footerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  sidebarItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sidebarItemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SimpleChatScreen;