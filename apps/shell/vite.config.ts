import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        auth: { type: 'module', name: 'auth', entry: 'http://localhost:3001/remoteEntry.js', entryGlobalName: 'auth', shareScope: 'default' },
        todo: { type: 'module', name: 'todo', entry: 'http://localhost:3002/remoteEntry.js', entryGlobalName: 'todo', shareScope: 'default' },
        navbar: { type: 'module', name: 'navbar', entry: 'http://localhost:3003/remoteEntry.js', entryGlobalName: 'navbar', shareScope: 'default' },
        shared: { type: 'module', name: 'shared', entry: 'http://localhost:3004/remoteEntry.js', entryGlobalName: 'shared', shareScope: 'default' },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router': { singleton: true },
        axios: { singleton: true },
        'react-hook-form': { singleton: true },
        zod: { singleton: true },
        '@tanstack/react-query': { singleton: true },
        i18next: { singleton: true },
        'react-i18next': { singleton: true },
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
