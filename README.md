# OllamaGo 🚀

> **Your Personal AI Companion on Android - Chat with Ollama Models Anywhere!**

OllamaGo is a powerful React Native mobile application that brings the power of Ollama AI models to your Android device. Connect to your local Ollama server and enjoy natural conversations with state-of-the-art language models, complete with persistent memory that remembers you across all chats!

[![Latest Release](https://img.shields.io/github/v/release/xt67/OllamaGo)](https://github.com/xt67/OllamaGo/releases/latest)
[![License](https://img.shields.io/github/license/xt67/OllamaGo)](LICENSE)

## ✨ Key Features

### 🧠 **Persistent Memory System**
- **Remembers You Forever**: Tell the AI your name, preferences, or any information once, and it remembers across all chats!
- **Survives App Restarts**: Your conversation history and learned information persist even after closing the app
- **Smart Context Management**: Automatically manages memory (keeps last 2000 characters) to maintain performance
- **Clear Memory Option**: Reset what the AI knows about you anytime from the sidebar

### 💬 **Advanced Chat Interface**
- Beautiful, modern chat UI with message history
- Real-time message streaming
- Save and load multiple chat sessions
- Clear chat history with one tap
- Typing indicators and loading states

### � **Flexible Connection**
- Connect to any Ollama server on your local network
- HTTP/HTTPS support with cleartext traffic enabled for local servers
- Connection validation and detailed error diagnostics
- Test connection before starting to chat

### 🤖 **Multi-Model Support**
- Auto-detects available models on your Ollama server
- Switch between different AI models (llama2, mistral, mixtral, etc.)
- View model list and current active model

### ⚙️ **Smart Configuration**
- Easy server setup with IP address and port configuration
- Persistent connection settings
- Network troubleshooting built-in
- Works seamlessly on local Wi-Fi networks

### 🎨 **Modern UI/UX**
- Clean, intuitive interface
- Sidebar navigation with hamburger menu
- Dark theme optimized for OLED screens
- Responsive design for all Android devices
- Smooth animations and transitions

## � Quick Start

### Download & Install

1. **Download** the latest APK from [Releases](https://github.com/xt67/OllamaGo/releases/latest)
2. **Enable** "Install from Unknown Sources" in your Android settings
3. **Install** the APK on your device
4. **Launch** OllamaGo and configure your Ollama server connection

### First-Time Setup

1. **Start Ollama on your PC:**
   ```bash
   ollama serve
   ```

2. **Find your PC's IP address:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

3. **In OllamaGo:**
   - Tap "Connection Settings"
   - Enter your PC's IP address (e.g., `192.168.1.100`)
   - Enter port: `11434`
   - Keep HTTP selected (not HTTPS)
   - Tap "Test Connection"
   - Start chatting!

## 🧪 Try the Memory Feature

**First Chat:**
```
You: My name is Rayan and I love programming
AI: Nice to meet you, Rayan! It's great that you love programming!
```

**Start a NEW chat:**
```
You: What is my name?
AI: Your name is Rayan!
You: What do I love?
AI: You love programming!
```

✨ **The AI remembers everything across all chats!**

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- React Native development environment
- Android Studio and Android SDK
- Ollama server running on your PC/laptop

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xt67/OllamaGo.git
   cd OllamaGo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Metro bundler:**
   ```bash
   npm start
   ```

4. **Run on Android:**
   ```bash
   npm run android
   ```

### Building APK

1. **Set JAVA_HOME:**
   ```bash
   export JAVA_HOME="/path/to/jdk-17"  # Linux/Mac
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"  # Windows
   ```

2. **Build release APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find APK at:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## 🔧 Ollama Server Configuration

### Basic Setup

1. **Install Ollama on your PC:**
   ```bash
   # Visit https://ollama.ai and download for your OS
   # Or use package managers:
   
   # Windows: Download installer from ollama.ai
   # macOS:
   brew install ollama
   
   # Linux:
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama server:**
   ```bash
   ollama serve
   ```

3. **Pull AI models:**
   ```bash
   ollama pull llama2        # Meta's Llama 2
   ollama pull mistral       # Mistral AI
   ollama pull mixtral       # Mixtral 8x7B
   ollama pull llama3        # Meta's Llama 3
   ```

4. **Verify models:**
   ```bash
   ollama list
   ```

### Network Configuration

**For Windows:**

1. **Allow Ollama through Firewall:**
   - Open Windows Firewall
   - Add inbound rule for Ollama.exe
   - Allow port 11434

2. **Find your IP:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your Wi-Fi adapter

**For macOS/Linux:**

1. **Configure Ollama to accept external connections:**
   ```bash
   export OLLAMA_HOST=0.0.0.0:11434
   ollama serve
   ```

2. **Find your IP:**
   ```bash
   ifconfig | grep "inet "
   # or
   ip addr show
   ```

### Verify Connection

Test from your phone's browser:
```
http://YOUR_PC_IP:11434/api/tags
```

You should see a JSON response with your models.

## 📖 Usage Guide

### Connecting to Ollama

1. Open **OllamaGo** on your Android device
2. Navigate to **Connection Settings** (from home or sidebar)
3. Enter your connection details:
   - **Server URL**: Your PC's IP address (e.g., `192.168.1.100`)
   - **Port**: `11434` (default)
   - **Use HTTPS**: Leave unchecked for local network
4. Tap **Test Connection**
5. If successful, start chatting!

### Using Persistent Memory

The AI remembers information across all chats:

1. **Tell the AI about yourself:**
   ```
   You: My name is Rayan and I'm a software developer
   AI: Nice to meet you, Rayan! How can I help you with software development?
   ```

2. **Start a new chat** (Menu → New Chat)

3. **The AI still remembers:**
   ```
   You: What's my name?
   AI: Your name is Rayan!
   
   You: What do I do?
   AI: You're a software developer!
   ```

### Managing Chats

- **New Chat**: Click menu (≡) → "New Chat"
- **View History**: All previous chats appear in the sidebar
- **Clear History**: Click "Clear All" to delete all chat sessions
- **Clear Memory**: Settings → "Clear Memory" to reset what AI knows about you

### Changing Models

1. Pull multiple models on your PC:
   ```bash
   ollama pull llama2
   ollama pull mistral
   ollama pull mixtral
   ```

2. In the app, the active model is auto-detected
3. View available models: Sidebar → "Change Model"

## 🔍 Troubleshooting

### Connection Issues

**"Network request failed"**
- ✅ Verify both devices are on the same Wi-Fi network
- ✅ Check your PC's IP address hasn't changed
- ✅ Make sure Ollama is running: `ollama list`
- ✅ Test in browser: `http://YOUR_IP:11434/api/tags`

**"Connection timeout"**
- ✅ Check Windows Firewall settings
- ✅ Verify port 11434 is open
- ✅ Try temporarily disabling firewall to test

**"Model not found"**
- ✅ Verify model exists: `ollama list`
- ✅ Pull the model: `ollama pull modelname`
- ✅ Restart Ollama server

### App Issues

**Send button not working**
- Make sure you've typed a message
- Check that you're connected to Ollama server
- Restart the app if needed

**Memory not persisting**
- Memory is saved automatically after each exchange
- Check storage permissions in Android settings

## 📂 Project Structure

```
OllamaGo/
├── android/                 # Android native code
│   ├── app/
│   │   ├── build.gradle    # Android build config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/
│   │           └── xml/
│   │               └── network_security_config.xml
├── src/
│   ├── App.tsx             # Main app with navigation
│   ├── screens/
│   │   ├── SimpleChatScreen.tsx     # Main chat UI with memory
│   │   ├── ConnectionScreen.tsx     # Server setup
│   │   ├── HomeScreen.tsx          # Welcome screen
│   │   └── SettingsScreen.tsx      # App settings
│   └── services/
│       ├── OllamaService.ts        # Ollama API client
│       └── StorageService.ts       # AsyncStorage wrapper
├── app.json                # Expo/React Native config
├── package.json            # Dependencies
└── README.md              # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - For the amazing local AI platform
- [React Native](https://reactnative.dev) - For the mobile framework
- [Expo](https://expo.dev) - For simplifying React Native development

## 📧 Support

If you encounter any issues or have questions:
- Open an [Issue](https://github.com/xt67/OllamaGo/issues)
- Check the [Releases](https://github.com/xt67/OllamaGo/releases) for the latest version

## 🗺️ Roadmap

- [ ] iOS support
- [ ] Voice input/output
- [ ] Image generation support
- [ ] Custom system prompts
- [ ] Export chat history
- [ ] Dark/Light theme toggle
- [ ] Multiple server profiles

---

**Made with ❤️ for the Ollama community**

Download the latest version: [Releases](https://github.com/xt67/OllamaGo/releases/latest)
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