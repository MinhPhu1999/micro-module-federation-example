import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'todo',
      filename: 'remoteEntry.js',
      exposes: {
        './TodoPage': './src/pages/TodoList.tsx',
      },
      remotes: {
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
      bundleAllCSS: true,
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3002,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
