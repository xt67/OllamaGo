export default {
  expo: {
    name: 'OllamaGo',
    slug: 'ollama-go',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#6366f1',
      resizeMode: 'contain'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ollamago.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#6366f1'
      },
      package: 'com.ollamago.app'
    },
    web: {
      bundler: 'metro',
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-splash-screen'
    ],
    extra: {
      eas: {
        projectId: '54d68065-2192-4b2a-820a-739381aa1c32'
      }
    }
  }
};