#!/bin/bash

echo "🚀 Piano Player - Test Build Local"
echo "=================================="

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

# Java
echo "☕ Java version:"
java -version 2>&1 | head -1

# Node.js
echo "🟢 Node.js version:"
node --version

# Ionic CLI
echo "📱 Ionic CLI version:"
ionic --version 2>/dev/null || echo "❌ Ionic CLI non installé (npm install -g @ionic/cli)"

# Android SDK
echo "🤖 Android SDK:"
echo "ANDROID_HOME: $ANDROID_HOME"
echo "ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"

echo ""
echo "🔨 Début du build..."

# 1. Install dependencies
echo "📦 Installation des dépendances..."
npm ci

# 2. Build web
echo "🌐 Build web..."
npm run build

# 3. Check if android platform exists
if [ ! -d "android" ]; then
    echo "📱 Ajout de la plateforme Android..."
    ionic capacitor add android
fi

# 4. Sync capacitor
echo "🔄 Synchronisation Capacitor..."
npm run android:sync

# 5. Build Android
echo "📱 Build Android APK..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug

# 6. Results
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build réussi !"
    echo "📦 APK généré: android/app/build/outputs/apk/debug/app-debug.apk"
    ls -la android/app/build/outputs/apk/debug/
else
    echo ""
    echo "❌ Build échoué"
    echo "🔍 Vérifiez les logs ci-dessus pour plus de détails"
    exit 1
fi