# OllamaGo Setup Instructions

## Quick Start Guide

### 1. Prerequisites Installation

**Install Node.js (Required)**
- Download and install Node.js v16+ from [nodejs.org](https://nodejs.org)
- Verify installation: `node --version` and `npm --version`

**Install React Native CLI**
```bash
npm install -g react-native-cli
```

**For iOS Development (macOS only):**
- Install Xcode from Mac App Store
- Install Xcode Command Line Tools: `xcode-select --install`
- Install CocoaPods: `sudo gem install cocoapods`

**For Android Development:**
- Install Android Studio from [developer.android.com](https://developer.android.com/studio)
- Install Android SDK (API level 31+)
- Set ANDROID_HOME environment variable
- Add Android tools to PATH

### 2. Project Setup

**1. Open the project folder in VS Code:**
```bash
# Navigate to the OllamaGo directory
cd OllamaGo
```

**2. Install dependencies:**
```bash
npm install
```

**3. For iOS (macOS only):**
```bash
cd ios
pod install
cd ..
```

**4. Start Metro bundler:**
```bash
npm start
```

**5. Run on device/simulator:**

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

### 3. Ollama Server Setup

**Install Ollama on your laptop/desktop:**

1. Visit [https://ollama.ai](https://ollama.ai)
2. Download Ollama for your operating system
3. Install and launch Ollama

**Pull AI models:**
```bash
# Install popular models
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

**Configure for network access:**

By default, Ollama only accepts local connections. To connect from mobile devices:

**Option 1: Environment Variable (Recommended)**
```bash
# Windows (PowerShell)
$env:OLLAMA_HOST = "0.0.0.0:11434"

# macOS/Linux
export OLLAMA_HOST=0.0.0.0:11434
```

**Option 2: Command Line**
```bash
ollama serve --host 0.0.0.0:11434
```

### 4. Network Configuration

**Find your computer's IP address:**

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)

**macOS:**
```bash
ifconfig | grep "inet "
```

**Linux:**
```bash
ip addr show
```

**Configure firewall:**
- Ensure port 11434 is open in your firewall
- Allow incoming connections for Ollama

### 5. Mobile App Configuration

1. **Launch OllamaGo** on your mobile device
2. **Tap "Connect to Ollama"**
3. **Enter connection details:**
   - Server URL: Your computer's IP address
   - Port: 11434
   - HTTPS: Usually disabled for local networks
   - API Key: Leave empty unless configured

Example:
```
Server URL: 192.168.1.100
Port: 11434
HTTPS: No
API Key: (empty)
```

4. **Test the connection**
5. **Start chatting!**

## Development Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android

# Run linting
npm run lint

# Build Android APK
npm run build:android

# Build iOS (requires Xcode)
npm run build:ios

# Clear Metro cache
npx react-native start --reset-cache
```

## Troubleshooting

### Connection Issues

**"Connection Failed" Error:**
1. Verify Ollama is running: `ollama list`
2. Check IP address is correct
3. Ensure both devices are on same network
4. Verify firewall settings
5. Try `localhost` if testing on same device

**"No Models Available":**
1. Pull models: `ollama pull llama2`
2. Restart Ollama service
3. Check available models: `ollama list`

### Build Issues

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