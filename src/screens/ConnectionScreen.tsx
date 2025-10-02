import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConnectionScreenProps {
  navigation: any;
}

interface ConnectionConfig {
  serverUrl: string;
  port: string;
  useHttps: boolean;
  apiKey?: string;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({navigation}) => {
  const [config, setConfig] = useState<ConnectionConfig>({
    serverUrl: '',
    port: '11434',
    useHttps: false,
    apiKey: '',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadSavedConfig();
  }, []);

  const loadSavedConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('ollamaConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading saved config:', error);
    }
  };

  const saveConfig = async (newConfig: ConnectionConfig) => {
    try {
      await AsyncStorage.setItem('ollamaConfig', JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const testConnection = async () => {
    if (!config.serverUrl) {
      Alert.alert('Error', 'Please enter a server URL');
      return;
    }

    setIsConnecting(true);
    
    try {
      const protocol = config.useHttps ? 'https' : 'http';
      const url = `${protocol}://${config.serverUrl}:${config.port}/api/tags`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && {'Authorization': `Bearer ${config.apiKey}`}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        await saveConfig(config);
        Alert.alert(
          'Success!', 
          'Connection established successfully. You can now start chatting!',
          [
            {
              text: 'Start Chat',
              onPress: () => navigation.navigate('Chat'),
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Connection Failed',
        `Unable to connect to Ollama server. Please check your settings and try again.\n\nError: ${errorMessage}`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const updateConfig = (key: keyof ConnectionConfig, value: string | boolean) => {
    setConfig(prev => ({...prev, [key]: value}));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: insets.bottom + 20}}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}>
          
          <View style={styles.card}>
            <Text style={styles.title}>Connect to Ollama Server</Text>
            <Text style={styles.subtitle}>
              Enter your Ollama server details to establish a connection
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Server URL or IP Address</Text>
                <TextInput
                  value={config.serverUrl}
                  onChangeText={(text) => updateConfig('serverUrl', text)}
                  placeholder="e.g., 192.168.1.100 or localhost"
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Port</Text>
                <TextInput
                  value={config.port}
                  onChangeText={(text) => updateConfig('port', text)}
                  placeholder="11434"
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>API Key (Optional)</Text>
                <TextInput
                  value={config.apiKey}
                  onChangeText={(text) => updateConfig('apiKey', text)}
                  placeholder="Enter API key if required"
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Use HTTPS</Text>
                <Switch
                  value={config.useHttps}
                  onValueChange={(value) => updateConfig('useHttps', value)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, (!config.serverUrl || isConnecting) && styles.buttonDisabled]}
              onPress={testConnection}
              disabled={isConnecting || !config.serverUrl}>
              <Text style={styles.buttonText}>
                {isConnecting ? 'Testing Connection...' : 'Test Connection'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Setup Instructions</Text>
            <Text style={styles.helpText}>
              1. Start Ollama on your laptop: ollama serve{'\n'}
              2. Find your laptop's IP address:{'\n'}
                 • Windows: ipconfig | findstr IPv4{'\n'}
                 • Mac/Linux: ifconfig | grep inet{'\n'}
              3. Enter the IP (e.g., 192.168.1.100){'\n'}
              4. Default port is 11434{'\n'}
              5. For same device testing, use localhost
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoid: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default ConnectionScreen;