# OllamaGo - Mobile Chat Interface for Ollama

OllamaGo is a React Native mobile application that allows you to connect to your Ollama server from your iPhone and Android devices with a beautiful chat interface.

## Features

🚀 **Cross-Platform**: Works on both iOS and Android
💬 **Chat Interface**: Beautiful, intuitive chat UI powered by React Native Gifted Chat  
🔒 **Secure Connections**: Support for HTTPS and API key authentication
🤖 **Multiple Models**: Switch between different AI models on your Ollama server
⚙️ **Easy Setup**: Simple connection configuration with validation
💾 **Data Management**: Local storage for settings and connection details
🎨 **Modern UI**: Clean, professional design with Material Design components

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- React Native CLI
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio and SDK
- Ollama server running on your laptop/desktop

## Installation

1. **Clone and setup the project:**
   ```bash
   cd OllamaGo
   npm install
   ```

2. **iOS Setup (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Start the Metro bundler:**
   ```bash
   npm start
   ```

4. **Run on your device:**

   For iOS:
   ```bash
   npm run ios
   ```

   For Android:
   ```bash
   npm run android
   ```

## Ollama Server Setup

1. **Install Ollama on your laptop:**
   - Visit [https://ollama.ai](https://ollama.ai) and download Ollama
   - Install and run Ollama
   - Pull some models: `ollama pull llama2` or `ollama pull mistral`

2. **Configure network access:**
   - By default, Ollama only accepts local connections
   - To allow mobile device connections, you need to configure Ollama to accept external connections
   - Set the `OLLAMA_HOST` environment variable: `export OLLAMA_HOST=0.0.0.0:11434`
   - Restart Ollama server

3. **Find your laptop's IP address:**
   - **Windows**: Run `ipconfig` in Command Prompt
   - **macOS/Linux**: Run `ifconfig` or `ip addr show`
   - Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)

## Connecting from Mobile

1. **Open OllamaGo** on your mobile device
2. **Tap "Connect to Ollama"** from the home screen
3. **Enter your connection details:**
   - **Server URL**: Your laptop's IP address (e.g., 192.168.1.100)
   - **Port**: 11434 (default Ollama port)
   - **HTTPS**: Enable if your Ollama server uses HTTPS
   - **API Key**: Enter if your server requires authentication
4. **Tap "Test Connection"** to verify the setup
5. **Start chatting** once connected successfully!

## Configuration Examples

### Basic Local Network Setup
```
Server URL: 192.168.1.100
Port: 11434
HTTPS: Disabled
API Key: (leave empty)
```

### Secure Remote Setup
```
Server URL: your-domain.com
Port: 443
HTTPS: Enabled
API Key: your-secret-key
```

## Development

### Project Structure
```
OllamaGo/
├── src/
│   ├── App.tsx              # Main app component with navigation
│   └── screens/
│       ├── HomeScreen.tsx   # Welcome screen with app info
│       ├── ConnectionScreen.tsx  # Server connection setup
│       ├── ChatScreen.tsx   # Main chat interface
│       └── SettingsScreen.tsx    # App settings and preferences
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
└── package.json            # Dependencies and scripts
```

### Key Dependencies
- **React Native**: Core framework
- **React Navigation**: Screen navigation
- **React Native Paper**: Material Design components
- **React Native Gifted Chat**: Chat UI components
- **AsyncStorage**: Local data persistence

### Building for Production

**Android:**
```bash
npm run build:android
```

**iOS:**
```bash
npm run build:ios
```

## Troubleshooting

### Common Connection Issues

1. **"Connection Failed" Error:**
   - Verify Ollama is running on your laptop
   - Check that your laptop's firewall allows port 11434
   - Ensure both devices are on the same network
   - Try using `localhost` if testing on the same device

2. **"No Models Available":**
   - Pull models on your Ollama server: `ollama pull llama2`
   - Restart the Ollama service
   - Check server logs for errors

3. **Chat Not Responding:**
   - Verify the selected model is available
   - Check network connectivity
   - Try switching to a different model

### Development Issues

1. **Metro bundler won't start:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build fails:**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build fails:**
   - Check Android SDK is properly installed
   - Verify ANDROID_HOME environment variable
   - Clean and rebuild: `cd android && ./gradlew clean && cd ..`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## Security Considerations

- Always use HTTPS for remote connections
- Store API keys securely using device keychain
- Validate all server inputs
- Use proper network timeout configurations
- Implement proper error handling for network failures

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section above
- Review Ollama documentation
- File an issue on GitHub

---

**Stay connected, collaborate effortlessly, and conquer your tasks on the go with OllamaGo!** 🚀