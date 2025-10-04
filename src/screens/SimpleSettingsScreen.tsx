import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  navigation: any;
}

const SimpleSettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [currentModel, setCurrentModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentModel();
    fetchAvailableModels();
  }, []);

  const loadCurrentModel = async () => {
    try {
      const savedModel = await AsyncStorage.getItem('selectedModel');
      if (savedModel) {
        setCurrentModel(savedModel);
      }
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const configStr = await AsyncStorage.getItem('ollamaConfig');
      if (!configStr) {
        console.log('No connection config found');
        setLoading(false);
        return;
      }

      const config = JSON.parse(configStr);
      const url = `http://${config.serverUrl}:${config.port}/api/tags`;
      
      console.log('Fetching models from:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
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
        const data = await response.json();
        console.log('Models fetched:', data.models?.length || 0);
        if (data.models && data.models.length > 0) {
          const models = data.models.map((model: any) => model.name);
          setAvailableModels(models);
        }
      } else {
        console.error('Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Silently fail - user might not have configured connection yet
    } finally {
      setLoading(false);
    }
  };

  const changeModel = (modelName: string) => {
    Alert.alert(
      'Change Model',
      `Switch to ${modelName}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Change',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('selectedModel', modelName);
              setCurrentModel(modelName);
              Alert.alert('Success', `Model changed to ${modelName}. Please restart the chat.`);
            } catch (error) {
              Alert.alert('Error', 'Failed to change model');
            }
          }
        }
      ]
    );
  };

  const clearConnection = async () => {
    Alert.alert(
      'Clear Connection',
      'Are you sure you want to clear the saved connection settings?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('ollamaConfig');
              Alert.alert('Success', 'Connection settings cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear connection settings');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({title, description, onPress}: {
    title: string;
    description?: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: insets.bottom + 20, paddingTop: 0}}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Selection</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.loadingText}>Loading models...</Text>
              </View>
            ) : availableModels.length > 0 ? (
              <>
                <Text style={styles.currentModelText}>
                  Current: {currentModel || 'Auto-detected'}
                </Text>
                {availableModels.map((model) => (
                  <TouchableOpacity
                    key={model}
                    style={[
                      styles.modelItem,
                      currentModel === model && styles.modelItemActive
                    ]}
                    onPress={() => changeModel(model)}>
                    <View style={styles.modelContent}>
                      <Text style={[
                        styles.modelName,
                        currentModel === model && styles.modelNameActive
                      ]}>
                        {model}
                      </Text>
                      {currentModel === model && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>Active</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.settingArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text style={styles.noModelsText}>
                No models found. Please configure your connection first.
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connection</Text>
            <SettingItem
              title="Connection Settings"
              description="Manage your Ollama server connection"
              onPress={() => navigation.navigate('Connection')}
            />
            <SettingItem
              title="Clear Connection"
              description="Remove saved connection settings"
              onPress={clearConnection}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoCard}>
              <Text style={styles.appTitle}>OllamaGo</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                A mobile client for connecting to and chatting with Ollama AI models.
                Built with React Native and Expo.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionTitle}>How to use:</Text>
              <Text style={styles.instruction}>1. Start Ollama on your computer</Text>
              <Text style={styles.instruction}>2. Find your computer's IP address</Text>
              <Text style={styles.instruction}>3. Go to Connection Settings</Text>
              <Text style={styles.instruction}>4. Enter your IP and port (usually 11434)</Text>
              <Text style={styles.instruction}>5. Test the connection</Text>
              <Text style={styles.instruction}>6. Start chatting!</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  settingItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888888',
  },
  settingArrow: {
    fontSize: 20,
    color: '#666666',
  },
  loadingContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  loadingText: {
    color: '#888888',
    marginTop: 12,
    fontSize: 14,
  },
  currentModelText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 12,
    paddingLeft: 4,
  },
  modelItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  modelItemActive: {
    backgroundColor: '#2a2a2a',
    borderColor: '#4a9eff',
    borderWidth: 2,
  },
  modelContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelName: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  modelNameActive: {
    color: '#4a9eff',
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  noModelsText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  instructionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default SimpleSettingsScreen;