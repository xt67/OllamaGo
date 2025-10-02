import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {GiftedChat, IMessage, User, Send} from 'react-native-gifted-chat';
import {
  Appbar,
  FAB,
  Snackbar,
  Portal,
  Modal,
  List,
  Button,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';

interface ChatScreenProps {
  navigation: any;
}

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

interface ConnectionConfig {
  serverUrl: string;
  port: string;
  useHttps: boolean;
  apiKey?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({navigation}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig | null>(null);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadConfig();
    initializeChat();
  }, []);

  useEffect(() => {
    if (connectionConfig) {
      loadModels();
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

  const initializeChat = () => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! I\'m ready to help you. Please select a model and start chatting!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Ollama Assistant',
          avatar: 'https://via.placeholder.com/40/6366f1/ffffff?text=AI',
        },
      },
    ]);
  };

  const loadModels = async () => {
    if (!connectionConfig) return;

    try {
      const protocol = connectionConfig.useHttps ? 'https' : 'http';
      const url = `${protocol}://${connectionConfig.serverUrl}:${connectionConfig.port}/api/tags`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(connectionConfig.apiKey && {'Authorization': `Bearer ${connectionConfig.apiKey}`}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
        if (data.models && data.models.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0].name);
        }
      } else {
        showSnackbar('Failed to load models from server');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      showSnackbar('Error connecting to server');
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
    
    // Send message to Ollama
    if (newMessages.length > 0) {
      sendToOllama(newMessages[0].text);
    }
  }, [selectedModel, connectionConfig]);

  const sendToOllama = async (message: string) => {
    if (!connectionConfig || !selectedModel) {
      showSnackbar('Please select a model first');
      return;
    }

    setIsTyping(true);

    try {
      const protocol = connectionConfig.useHttps ? 'https' : 'http';
      const url = `${protocol}://${connectionConfig.serverUrl}:${connectionConfig.port}/api/generate`;
      
      const requestBody = {
        model: selectedModel,
        prompt: message,
        stream: false,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(connectionConfig.apiKey && {'Authorization': `Bearer ${connectionConfig.apiKey}`}),
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage: IMessage = {
          _id: uuidv4(),
          text: data.response || 'No response received',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: selectedModel,
            avatar: 'https://via.placeholder.com/40/6366f1/ffffff?text=AI',
          },
        };

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [aiMessage])
        );
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending to Ollama:', error);
      showSnackbar('Failed to send message to Ollama');
      
      const errorMessage: IMessage = {
        _id: uuidv4(),
        text: 'Sorry, I encountered an error. Please check your connection and try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'System',
          avatar: 'https://via.placeholder.com/40/ef4444/ffffff?text=!',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    } finally {
      setIsTyping(false);
    }
  };

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Button mode="contained" compact>
          Send
        </Button>
      </View>
    </Send>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={selectedModel || 'Select Model'} />
        <Appbar.Action
          icon="robot"
          onPress={() => setShowModelSelector(true)}
        />
        <Appbar.Action
          icon="refresh"
          onPress={loadModels}
        />
      </Appbar.Header>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: 'You',
        }}
        isTyping={isTyping}
        renderSend={renderSend}
        placeholder="Type a message..."
        alwaysShowSend
        scrollToBottom
        style={styles.chat}
      />

      <Portal>
        <Modal
          visible={showModelSelector}
          onDismiss={() => setShowModelSelector(false)}
          contentContainerStyle={styles.modal}>
          <List.Section>
            <List.Subheader>Select AI Model</List.Subheader>
            {models.map((model) => (
              <List.Item
                key={model.name}
                title={model.name}
                description={`Size: ${(model.size / 1024 / 1024 / 1024).toFixed(1)} GB`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={selectedModel === model.name ? 'check-circle' : 'circle-outline'}
                  />
                )}
                onPress={() => {
                  setSelectedModel(model.name);
                  setShowModelSelector(false);
                  showSnackbar(`Selected model: ${model.name}`);
                }}
              />
            ))}
          </List.Section>
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="delete"
        label="Clear Chat"
        onPress={() => {
          Alert.alert(
            'Clear Chat',
            'Are you sure you want to clear the conversation?',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Clear', onPress: initializeChat},
            ]
          );
        }}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chat: {
    backgroundColor: '#f8fafc',
  },
  sendButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
  },
});

export default ChatScreen;