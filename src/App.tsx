import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Screens
import SimpleChatScreen from './screens/SimpleChatScreen';
import SimpleSettingsScreen from './screens/SimpleSettingsScreen';
import ConnectionScreen from './screens/ConnectionScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Chat"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Chat"
            component={SimpleChatScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Connection"
            component={ConnectionScreen}
            options={{title: 'Connection'}}
          />
          <Stack.Screen
            name="Settings"
            component={SimpleSettingsScreen}
            options={{
              title: 'Settings',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'OllamaGo'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;