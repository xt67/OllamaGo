import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Screens
import HomeScreen from './screens/HomeScreen';
import SimpleChatScreen from './screens/SimpleChatScreen';
import SimpleSettingsScreen from './screens/SimpleSettingsScreen';
import ConnectionScreen from './screens/ConnectionScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'OllamaGo'}}
          />
          <Stack.Screen
            name="Connection"
            component={ConnectionScreen}
            options={{title: 'Connect to Ollama'}}
          />
          <Stack.Screen
            name="Chat"
            component={SimpleChatScreen}
            options={{title: 'Chat with Ollama'}}
          />
          <Stack.Screen
            name="Settings"
            component={SimpleSettingsScreen}
            options={{title: 'Settings'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;