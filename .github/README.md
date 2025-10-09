# Piano Player - CI/CD Documentation

This document explains the GitHub Actions CI/CD pipeline setup for the Piano Player application.

## 🔄 Workflows Overview

### 1. Build Android APK (`build-android.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests, Releases

- Builds the Vue.js application
- Sets up Android environment
- Compiles Android APK (debug and release)
- Uploads APK as artifacts
- Attaches APK to GitHub releases (for release events)

**Artifacts:**

- Debug APK: `piano-player-debug-{sha}.apk` (30 days retention)
- Release APK: `piano-player-release-{tag}.apk` (90 days retention)

### 2. Test & Lint (`test.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

- Runs ESLint for code quality
- Performs TypeScript type checking
- Executes unit tests with Vitest
- Runs E2E tests with Cypress
- Uploads test results and coverage

### 3. Code Quality (`code-quality.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

- Advanced ESLint reporting
- Test coverage analysis
- SonarCloud integration (optional)
- Codecov integration for coverage tracking

### 4. Deploy (`deploy.yml`)

**Triggers:** Push to `main`, GitHub Releases

- **Web Deployment:** Deploys to GitHub Pages on main branch
- **Android Store:** Builds signed APK and uploads to Google Play Store on releases

## 🔧 Setup Requirements

### 1. Repository Secrets

Add these secrets in your GitHub repository settings:

#### Android Signing (Required for Play Store)

```
ANDROID_KEYSTORE_BASE64     # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD   # Keystore password
ANDROID_KEY_ALIAS           # Key alias
ANDROID_KEY_PASSWORD        # Key password
```

#### Google Play Store (Optional)

```
GOOGLE_PLAY_SERVICE_ACCOUNT # Service account JSON for Play Console API
```

#### Code Quality (Optional)

```
SONAR_TOKEN                 # SonarCloud token
CODECOV_TOKEN              # Codecov token
```

### 2. Android Keystore Setup

Generate a keystore for signing your app:

```bash
keytool -genkey -v -keystore piano-player.jks -keyalg RSA -keysize 2048 -validity 10000 -alias piano-player
```

Convert to base64 for GitHub secrets:

```bash
base64 -i piano-player.jks | tr -d '\n'
```

### 3. Capacitor Configuration

Ensure your `capacitor.config.ts` is properly configured:

```typescript
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.glecoufle.pianoplayer",
  appName: "Piano Player",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
};

export default config;
```

## 📱 Build Process

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Test the app
npm run test:unit
npm run test:e2e
```

### Android Build

```bash
# Add Android platform (first time only)
ionic capacitor add android

# Sync changes
npm run android:sync

# Build APK
npm run android:build
```

## 🚀 Deployment Flow

### Development Workflow

1. **Feature Branch** → Create feature branch from `develop`
2. **Pull Request** → Opens PR to `develop` (triggers test workflows)
3. **Merge to Develop** → Merges trigger build workflows
4. **Release Preparation** → Merge `develop` to `main`
5. **GitHub Release** → Creates release tag (triggers deployment)

### Automatic Deployments

- **Web App:** Auto-deploys to GitHub Pages on `main` branch pushes
- **Android APK:** Available as GitHub Actions artifacts
- **Play Store:** Auto-uploads to internal track on releases (if configured)

## 📊 Monitoring & Quality

### Artifacts & Downloads

- Debug APKs are available for 30 days in Actions artifacts
- Release APKs are available for 90 days and attached to releases
- Test results and coverage reports are uploaded after each run

### Quality Gates

- All tests must pass for PR merges
- ESLint checks enforce code style
- TypeScript compilation must succeed
- Coverage reports track test effectiveness

## 🔄 Manual Triggers

You can manually trigger workflows:

1. Go to **Actions** tab in your repository
2. Select the desired workflow
3. Click **Run workflow**
4. Choose branch and run

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**

- Check Node.js version compatibility (using 18.x)
- Verify all dependencies are properly installed
- Ensure TypeScript compilation passes locally

**Android Build Issues:**

- Verify Android SDK setup in workflow
- Check Capacitor configuration
- Ensure all required plugins are installed

**Deployment Issues:**

- Verify GitHub Pages is enabled in repository settings
- Check that secrets are properly configured
- Ensure keystore and signing credentials are correct

### Debug Tips

- Check Actions logs for detailed error messages
- Test builds locally before pushing
- Verify all required secrets are set
- Check file paths and configuration
