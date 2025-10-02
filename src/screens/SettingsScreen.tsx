import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Title,
  List,
  Switch,
  Button,
  Card,
  Divider,
  Paragraph,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  navigation: any;
}

interface AppSettings {
  notifications: boolean;
  autoConnect: boolean;
  darkTheme: boolean;
  saveHistory: boolean;
  maxHistoryItems: number;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoConnect: false,
    darkTheme: false,
    saveHistory: true,
    maxHistoryItems: 100,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: boolean | number) => {
    const newSettings = {...settings, [key]: value};
    saveSettings(newSettings);
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all saved connections, chat history, and settings. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared');
              // Reset settings to defaults
              setSettings({
                notifications: true,
                autoConnect: false,
                darkTheme: false,
                saveHistory: true,
                maxHistoryItems: 100,
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const exportSettings = async () => {
    try {
      const allData = {
        settings,
        ollamaConfig: await AsyncStorage.getItem('ollamaConfig'),
      };
      
      // In a real app, you would implement proper export functionality
      Alert.alert(
        'Export Settings',
        `Settings exported:\n${JSON.stringify(allData, null, 2)}`,
        [
          {text: 'OK'},
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export settings');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          
          <Card style={styles.section}>
            <Card.Content>
              <Title style={styles.sectionTitle}>General Settings</Title>
              
              <List.Item
                title="Enable Notifications"
                description="Receive notifications for new messages"
                left={(props) => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={settings.notifications}
                    onValueChange={(value) => updateSetting('notifications', value)}
                  />
                )}
              />

              <List.Item
                title="Auto Connect"
                description="Automatically connect to saved server on startup"
                left={(props) => <List.Icon {...props} icon="connection" />}
                right={() => (
                  <Switch
                    value={settings.autoConnect}
                    onValueChange={(value) => updateSetting('autoConnect', value)}
                  />
                )}
              />

              <List.Item
                title="Dark Theme"
                description="Use dark color scheme"
                left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={settings.darkTheme}
                    onValueChange={(value) => updateSetting('darkTheme', value)}
                  />
                )}
              />
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Chat Settings</Title>
              
              <List.Item
                title="Save Chat History"
                description="Keep conversation history across sessions"
                left={(props) => <List.Icon {...props} icon="history" />}
                right={() => (
                  <Switch
                    value={settings.saveHistory}
                    onValueChange={(value) => updateSetting('saveHistory', value)}
                  />
                )}
              />

              <List.Item
                title="Connection Settings"
                description="Manage Ollama server connection"
                left={(props) => <List.Icon {...props} icon="server" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate('Connection')}
              />
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Data Management</Title>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={exportSettings}
                  style={styles.button}
                  icon="export">
                  Export Settings
                </Button>

                <Button
                  mode="contained"
                  onPress={clearAllData}
                  style={[styles.button, styles.dangerButton]}
                  buttonColor="#ef4444"
                  icon="delete-forever">
                  Clear All Data
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Title style={styles.sectionTitle}>About OllamaGo</Title>
              <Paragraph style={styles.aboutText}>
                OllamaGo v1.0.0{'\n'}
                Your ultimate solution for seamless remote access to the powerful Ollama platform.
                {'\n\n'}
                Designed for busy professionals who need to stay connected and productive on the go.
              </Paragraph>
              
              <Divider style={styles.divider} />
              
              <List.Item
                title="Help & Support"
                description="Get help using OllamaGo"
                left={(props) => <List.Icon {...props} icon="help-circle" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {
                  Alert.alert(
                    'Help & Support',
                    'For support, please visit our documentation or contact our support team.'
                  );
                }}
              />

              <List.Item
                title="Privacy Policy"
                description="Learn about how we protect your data"
                left={(props) => <List.Icon {...props} icon="shield-check" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {
                  Alert.alert(
                    'Privacy Policy',
                    'OllamaGo respects your privacy. All data is stored locally on your device and communications are direct to your Ollama server.'
                  );
                }}
              />
            </Card.Content>
          </Card>

        </View>
      </ScrollView>
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
  },
  section: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
  },
  dangerButton: {
    borderColor: '#ef4444',
  },
  aboutText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
});

export default SettingsScreen;