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
      <View style={styles.content}>
        {/* Minimal clean home screen */}
      </View>

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
    flex: 1,
    padding: 16,
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