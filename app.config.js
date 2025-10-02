export default {
  name: 'OllamaGo',
  slug: 'ollama-go',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  splash: {
    backgroundColor: '#6366f1',
    resizeMode: 'contain'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ollamago'
  },
  android: {
    package: 'com.ollamago'
  },
  web: {
    bundler: 'metro'
  }
};