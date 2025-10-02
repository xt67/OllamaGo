import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [hasConnection, setHasConnection] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<string>('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('ollamaConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setHasConnection(true);
        setConnectionInfo(`${config.serverUrl}:${config.port}`);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}>
        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <Text style={styles.title}>Welcome to OllamaGo!</Text>
            <Text style={styles.subtitle}>
              Your ultimate solution for seamless remote access to the powerful Ollama platform.
            </Text>
            <Text style={styles.description}>
              Connect to your Ollama server running on your laptop and chat with AI models 
              from anywhere using your mobile device.
            </Text>
          </View>

          {hasConnection && (
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Connection Status</Text>
              <View style={styles.statusRow}>
                <View style={styles.connectedChip}>
                  <Text style={styles.chipText}>✓ Connected to {connectionInfo}</Text>
                </View>
              </View>
              <Text style={styles.statusText}>
                Ready to chat! You can start chatting or update your connection settings.
              </Text>
            </View>
          )}

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Key Features</Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• Real-time chat interface</Text>
              <Text style={styles.feature}>• Connect to remote Ollama servers</Text>
              <Text style={styles.feature}>• Support for multiple AI models</Text>
              <Text style={styles.feature}>• Cross-platform (iOS & Android)</Text>
              <Text style={styles.feature}>• Secure connection management</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Connection')}>
              <Text style={styles.buttonText}>Connect to Ollama</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.outlineButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, {bottom: insets.bottom + 16}]}
        onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.fabText}>💬 Start Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  welcomeCard: {
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectedChip: {
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 14,
  },
  statusText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  featureList: {
    marginLeft: 8,
  },
  feature: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;