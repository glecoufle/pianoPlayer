# Bundle Optimization Guide

## Overview

This guide explains how to optimize your Piano Player app's bundle using Vite's `manualChunks` configuration.

## Why Manual Chunking?

- **Better Caching**: Separate vendor code from app code so vendor chunks don't change when you update app code
- **Parallel Loading**: Browser can download multiple chunks simultaneously
- **Reduced Bundle Size**: Remove unused code more effectively
- **Faster Updates**: Only changed chunks need to be re-downloaded

## Current Configuration

### Basic Manual Chunks (`vite.config.ts`)

```typescript
manualChunks: {
  // Vendor chunks - separate large third-party libraries
  'vue-vendor': ['vue', 'vue-router'],
  'ionic-vendor': ['@ionic/vue', '@ionic/vue-router', 'ionicons'],
  'capacitor-vendor': [
    '@capacitor/core',
    '@capacitor/app',
    '@capacitor/haptics',
    '@capacitor/keyboard',
    '@capacitor/status-bar'
  ],

  // App-specific chunks
  'audio-services': ['./src/services/AudioService'],
  'components': [
    './src/components/PianoComponent',
    './src/components/PartitionComponent'
  ],
  'data-utils': [
    './src/data/allNotes',
    './src/types/AnimatedNote',
    './src/types/Note',
    './src/types/LedgerLine'
  ]
}
```

### Advanced Function-Based Chunking (`vite.config.advanced.ts`)

For more dynamic control, use a function that analyzes each module:

```typescript
const manualChunks = (id: string) => {
  if (id.includes("node_modules")) {
    if (id.includes("vue")) return "vue-vendor";
    if (id.includes("@ionic")) return "ionic-vendor";
    if (id.includes("@capacitor")) return "capacitor-vendor";
    return "vendor";
  }

  if (id.includes("/src/services/")) return "services";
  if (id.includes("/src/components/")) return "components";
  // ... more rules
};
```

## Chunk Strategy for Piano Player

### 1. **Vendor Chunks**

- `vue-vendor`: Vue.js core and router
- `ionic-vendor`: Ionic UI components
- `capacitor-vendor`: Mobile platform APIs
- `audio-vendor`: Audio processing libraries

### 2. **App Chunks**

- `services`: AudioService and other services
- `components`: PianoComponent, PartitionComponent
- `views`: Page components (HomePage, PlayerPage, SettingsPage)
- `data-types`: Note data, types, and interfaces

### 3. **Asset Optimization**

- Images: `images/[name].[hash][extname]`
- Fonts: `fonts/[name].[hash][extname]`
- Styles: `styles/[name].[hash][extname]`

## Performance Benefits

### Before Chunking

```
main.js         - 2.5MB (everything bundled together)
main.css        - 150KB
```

### After Chunking

```
vue-vendor.js      - 150KB (rarely changes)
ionic-vendor.js    - 300KB (rarely changes)
capacitor-vendor.js- 100KB (rarely changes)
services.js        > 50KB  (changes with audio updates)
components.js      > 200KB (changes with UI updates)
views.js          > 150KB (changes with page updates)
main.js           > 100KB (app initialization)
main.css          > 150KB
```

## Usage Instructions

### Option 1: Use Basic Configuration

Replace your current `vite.config.ts` with the provided configuration.

### Option 2: Use Advanced Configuration

Rename your current config and use the advanced version:

```bash
mv vite.config.ts vite.config.basic.ts
mv vite.config.advanced.ts vite.config.ts
```

## Testing Bundle Analysis

To analyze your chunks and see their sizes:

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Build with analysis
npm run build

# View the analysis report
open dist/stats.html
```

Add this to your vite config for analysis:

```typescript
import { visualizer } from "rollup-plugin-visualizer";

plugins: [
  vue(),
  legacy(),
  visualizer({
    filename: "dist/stats.html",
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
];
```

## Mobile-Specific Optimizations

### 1. **Preload Critical Chunks**

```html
<link rel="modulepreload" href="/vue-vendor.js" />
<link rel="modulepreload" href="/ionic-vendor.js" />
```

### 2. **Lazy Load Non-Critical**

```typescript
// In your router
const SettingsPage = () => import("@/views/SettingsPage.vue");
```

### 3. **Service Worker Caching**

Configure your service worker to cache vendor chunks aggressively:

```javascript
// Cache vendor chunks for 1 year
workbox.routing.registerRoute(
  /vue-vendor|ionic-vendor|capacitor-vendor/,
  new workbox.strategies.CacheFirst({
    cacheName: "vendor-cache",
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}?v=1.0.0`;
        },
      },
    ],
  })
);
```

## Monitoring Bundle Size

Add this script to your `package.json`:

```json
{
  "scripts": {
    "build:analyze": "npm run build && npx vite-bundle-analyzer dist"
  }
}
```

## Best Practices

1. **Keep vendor chunks stable** - Don't include app code in vendor chunks
2. **Size chunks appropriately** - Aim for 100-300KB per chunk
3. **Group related modules** - Put related components/services together
4. **Monitor chunk dependencies** - Avoid circular dependencies between chunks
5. **Test on mobile devices** - Verify loading performance on actual devices

## Common Issues

### Chunk Dependencies

If you see warnings about chunk dependencies, ensure your manual chunks don't create circular references.

### Over-chunking

Too many small chunks can hurt performance. Aim for 5-10 chunks total.

### Under-chunking

Very large chunks (>500KB) may cause loading delays on slow connections.

## Verification

After implementing chunking:

1. Run `npm run build`
2. Check the `dist` folder for generated chunks
3. Verify chunk sizes are reasonable
4. Test loading performance on mobile devices
5. Monitor bundle size in CI/CD pipeline
