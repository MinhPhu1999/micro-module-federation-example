import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'navbar',
      filename: 'remoteEntry.js',
      exposes: {
        './Navbar': './src/components/Navbar.tsx',
      },
      remotes: {
        shared: { type: 'module', name: 'shared', entry: 'http://localhost:3004/remoteEntry.js', entryGlobalName: 'shared', shareScope: 'default' },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router': { singleton: true },
        i18next: { singleton: true },
        'react-i18next': { singleton: true },
      },
      bundleAllCSS: true,
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3003,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
