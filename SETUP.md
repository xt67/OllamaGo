# OllamaGo Setup Guide

Complete setup instructions for OllamaGo - Your Personal AI Companion on Android

## 📱 For End Users (Just Want to Use the App)

### Quick Install

1. **Download APK**
   - Visit [Releases](https://github.com/xt67/OllamaGo/releases/latest)
   - Download `app-release.apk`

2. **Install on Android**
   - Enable "Install from Unknown Sources" in Settings → Security
   - Open the downloaded APK
   - Tap "Install"

3. **Setup Ollama on Your PC**
   - Download Ollama from [ollama.ai](https://ollama.ai)
   - Install and run: `ollama serve`
   - Pull a model: `ollama pull llama2`

4. **Connect from Phone**
   - Find your PC's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Open OllamaGo → Connection Settings
   - Enter IP address and port 11434
   - Test connection and start chatting!

---

## 💻 For Developers (Want to Build/Modify)

### Prerequisites

**Required Software:**
- Node.js v16+ ([Download](https://nodejs.org))
- JDK 17 ([Eclipse Adoptium](https://adoptium.net/))
- Android Studio & SDK ([Download](https://developer.android.com/studio))
- Git

**Verify Installations:**
```bash
node --version    # Should be v16+
npm --version
java --version    # Should be 17
```

### Development Setup

**1. Clone Repository:**
```bash
git clone https://github.com/xt67/OllamaGo.git
cd OllamaGo
```

**2. Install Dependencies:**
```bash
npm install
```

**3. Start Development Server:**
```bash
npm start
# or
npx expo start
```

**4. Run on Android Device/Emulator:**
```bash
npm run android
# or
npx expo run:android
```

### Building Production APK

**1. Set Environment Variables:**

Windows (PowerShell):
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
```

Linux/macOS:
```bash
export JAVA_HOME="/path/to/jdk-17"
```

**2. Build APK:**
```bash
cd android
./gradlew assembleRelease
```

**3. Find APK:**
```
android/app/build/outputs/apk/release/app-release.apk
```

### Project Structure

```
OllamaGo/
├── android/                          # Android native code
│   ├── app/
│   │   ├── build.gradle             # Android build config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml  # App manifest with permissions
│   │       └── res/xml/
│   │           └── network_security_config.xml  # HTTP cleartext config
│   └── build.gradle                 # Root build config
├── src/
│   ├── App.tsx                      # Main app with navigation stack
│   ├── screens/
│   │   ├── SimpleChatScreen.tsx     # Main chat UI with persistent memory
│   │   ├── ConnectionScreen.tsx     # Ollama server configuration
│   │   ├── HomeScreen.tsx          # Welcome/landing screen
│   │   └── SettingsScreen.tsx      # App settings
│   └── services/
│       ├── OllamaService.ts        # Ollama API client
│       └── StorageService.ts       # AsyncStorage wrapper
├── app.json                         # Expo/RN configuration
├── package.json                     # NPM dependencies
├── tsconfig.json                    # TypeScript config
└── README.md                        # Documentation
```

---

## 🔧 Ollama Server Configuration

### Installation

**Windows:**
```bash
# Download from ollama.ai and run installer
# Ollama will be available at localhost:11434
```

**macOS:**
```bash
brew install ollama
ollama serve
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
```

### Pull AI Models

```bash
# Popular models
ollama pull llama2        # Meta's Llama 2 (7B)
ollama pull llama3        # Meta's Llama 3 (8B)
ollama pull mistral       # Mistral 7B
ollama pull mixtral       # Mixtral 8x7B
ollama pull codellama     # Code-specialized model

# Verify installation
ollama list
```

### Network Configuration for Mobile Access

**Windows:**

1. **Configure Firewall:**
   - Open Windows Defender Firewall
   - Click "Advanced settings"
   - Add inbound rule for `Ollama.exe`
   - Allow connections on port 11434

2. **Find your IP:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your Wi-Fi adapter (e.g., 192.168.1.100)

3. **Verify Ollama is accessible:**
   ```cmd
   curl http://localhost:11434/api/tags
   ```

**macOS/Linux:**

1. **Set Ollama host:**
   ```bash
   export OLLAMA_HOST=0.0.0.0:11434
   ollama serve
   ```

2. **Find your IP:**
   ```bash
   ifconfig | grep "inet "   # macOS
   ip addr show              # Linux
   ```

3. **Test from phone browser:**
   ```
   http://YOUR_PC_IP:11434/api/tags
   ```
   Should return JSON with your models.

### Testing Connection

**From Phone Browser:**
```
http://192.168.1.100:11434/api/tags
```

**Expected Response:**
```json
{
  "models": [
    {
      "name": "llama2:latest",
      "modified_at": "...",
      "size": 3826793677,
      "digest": "..."
    }
  ]
}
```

If you see this, your Ollama server is ready!

---

## 📱 Using OllamaGo

### First Launch

1. **Open OllamaGo**
2. Tap **"Connection Settings"** or **≡ → Settings**
3. Enter your connection details:
   - **Server URL**: Your PC's IP (e.g., `192.168.1.100`)
   - **Port**: `11434`
   - **Use HTTPS**: Unchecked (for local network)
4. Tap **"Test Connection"**
5. If successful, start chatting!

### Using Persistent Memory

**The AI remembers you across all chats:**

1. **Tell the AI about yourself:**
   ```
   You: My name is Rayan and I'm a developer
   AI: Nice to meet you, Rayan!
   ```

2. **Start a new chat** (Menu → New Chat)

3. **Ask about previous info:**
   ```
   You: What's my name?
   AI: Your name is Rayan!
   
   You: What do I do?
   AI: You're a developer!
   ```

The memory persists even after:
- ✅ Starting new chats
- ✅ Closing the app
- ✅ Restarting your phone

### Managing Memory

- **View what AI knows**: It's included in every response context
- **Clear memory**: Settings → "Clear Memory"
- **Memory auto-management**: Keeps last 2000 characters automatically

### Chat Features

- **New Chat**: Menu (≡) → "New Chat"
- **Chat History**: Previous chats shown in sidebar
- **Clear All Chats**: Deletes all chat sessions
- **Change Model**: View available models in sidebar

---

## 🔍 Troubleshooting

### Connection Issues

**❌ "Network request failed"**

✅ **Solutions:**
1. Verify both devices on same Wi-Fi
2. Check IP address:
   ```bash
   # On PC
   ipconfig          # Windows
   ifconfig          # Mac/Linux
   ```
3. Test Ollama is running:
   ```bash
   ollama list       # Should show models
   ```
4. Test from phone browser:
   ```
   http://YOUR_PC_IP:11434/api/tags
   ```

**❌ "Connection timeout"**

✅ **Solutions:**
1. **Windows Firewall:**
   - Allow Ollama.exe through firewall
   - Allow inbound on port 11434

2. **Verify Ollama serving:**
   ```bash
   ollama serve
   ```

3. **Check with curl:**
   ```bash
   curl http://YOUR_IP:11434/api/tags
   ```

**❌ "Model not found"**

✅ **Solutions:**
1. Pull the model:
   ```bash
   ollama pull llama2
   ```
2. List available models:
   ```bash
   ollama list
   ```
3. Restart Ollama service

### App Issues

**❌ Send button not working**
- Type a message first
- Ensure connected to server
- Check connection in settings

**❌ Memory not saving**
- Memory saves after each AI response
- Check Android storage permissions
- Try "Clear Memory" then start fresh

**❌ App crashes on startup**
- Uninstall and reinstall APK
- Clear app data in Android settings
- Download latest version from releases

### Build Issues (Developers)

**❌ "No Java compiler found"**

✅ **Solution:**
```bash
# Set JAVA_HOME
export JAVA_HOME="/path/to/jdk-17"  # Linux/Mac
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"  # Windows
```

**❌ Gradle build fails**

✅ **Solutions:**
1. Clean gradle cache:
   ```bash
   cd android
   ./gradlew clean
   ```

2. Delete build folders:
   ```bash
   rm -rf android/app/build
   rm -rf android/build
   ```

3. Rebuild:
   ```bash
   ./gradlew assembleRelease
   ```

**❌ Metro bundler cache issues**

✅ **Solution:**
```bash
npx react-native start --reset-cache
```

---

## 📚 Additional Resources

- **Ollama Documentation**: https://github.com/ollama/ollama
- **React Native Docs**: https://reactnative.dev
- **Expo Documentation**: https://docs.expo.dev
- **Report Issues**: https://github.com/xt67/OllamaGo/issues

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Ollama
ollama serve                    # Start Ollama server
ollama pull llama2             # Download model
ollama list                    # List installed models
ollama run llama2              # Test model

# Development
npm start                      # Start Metro bundler
npm run android               # Run on Android
npx expo start                # Alternative start command

# Building
cd android
./gradlew assembleRelease     # Build APK
```

### Default Ports

- Ollama: `11434`
- Metro: `8081`

### Important Paths

- APK Output: `android/app/build/outputs/apk/release/app-release.apk`
- Network Config: `android/app/src/main/res/xml/network_security_config.xml`
- Android Manifest: `android/app/src/main/AndroidManifest.xml`

---

## 💖 Support the Project

If OllamaGo has been helpful to you, consider supporting its development:

<a href="https://www.buymeacoffee.com/xt67" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

Your support helps:
- ✨ Add new features (iOS support, voice input, etc.)
- 🐛 Fix bugs faster
- 📱 Maintain and improve the app
- 📚 Create better documentation

---

**Need help? Open an issue: https://github.com/xt67/OllamaGo/issues**

**Metro bundler won't start:**
```bash
npx react-native start --reset-cache
```

**iOS build fails:**
```bash
cd ios && pod install && cd ..
npx react-native run-ios --clean
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Common Fixes

1. **Clear watchman cache:**
   ```bash
   watchman watch-del-all
   ```

2. **Reset React Native cache:**
   ```bash
   npx react-native start --reset-cache
   ```

3. **Clean builds:**
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   
   # iOS
   cd ios && xcodebuild clean && cd ..
   ```

## Production Deployment

### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS App Store
1. Open `ios/OllamaGo.xcworkspace` in Xcode
2. Select "Any iOS Device"
3. Product → Archive
4. Follow App Store Connect process

## Security Notes

- **Local Network**: Generally safe for home/office networks
- **Public Networks**: Use HTTPS and API keys
- **Production**: Always use HTTPS and authentication
- **API Keys**: Store securely using device keychain

## Next Steps

1. **Test the connection** between your mobile device and Ollama server
2. **Try different AI models** to find your preference
3. **Explore settings** to customize the experience
4. **Report issues** or contribute improvements

Happy coding with OllamaGo! 🚀