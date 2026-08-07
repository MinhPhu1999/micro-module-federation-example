import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    federation({
      name: 'navbar',
      dts: command !== 'serve',
      filename: 'remoteEntry.js',
      exposes: {
        './Navbar': './src/components/Navbar.tsx',
      },
      remotes: {},

      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router': { singleton: true },
        i18next: { singleton: true },
        'react-i18next': { singleton: true },
        '@micro-fe/shared/': { singleton: true },
        '@micro-fe/shared': { singleton: true },
      },
      bundleAllCSS: true,
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router',
      'i18next',
      'react-i18next',
      '@module-federation/runtime',
      '@module-federation/runtime/helpers',
    ],
  },
  server: {
    port: 3003,
    proxy: { '/api': 'http://localhost:8080' },
  },
}))
