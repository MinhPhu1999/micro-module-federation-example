# Phase 1: Scaffolding — Monorepo + Root Configs + App Scaffolds

> Master spec: `prompt-todo.md` (không sửa)
>
> Mục tiêu: Tạo toàn bộ cấu trúc thư mục, root configs, và scaffold cho 5 apps. Chưa implement logic.

---

## 1. Output Structure

```
micro-module-federation/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.json
├── .prettierrc
├── eslint.config.js
├── .gitignore
├── .env
├── .env.development
├── .env.production
│
├── apps/
│   ├── shared/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   ├── index.html
│   │   └── src/
│   │       ├── components/      (empty, phase 2)
│   │       ├── hooks/           (empty, phase 2)
│   │       ├── utils/           (empty, phase 2)
│   │       ├── services/        (empty, phase 2)
│   │       ├── api/             (empty, phase 2)
│   │       ├── constants/       (empty, phase 2)
│   │       ├── schemas/         (empty, phase 2)
│   │       ├── types/           (empty, phase 2)
│   │       ├── layouts/         (empty, phase 2)
│   │       ├── assets/          (empty, phase 2)
│   │       ├── App.tsx          (placeholder)
│   │       ├── main.tsx         (placeholder)
│   │       └── vite-env.d.ts
│   │
│   ├── auth/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   ├── index.html
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       ├── hooks/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── schemas/
│   │       ├── types/
│   │       ├── utils/
│   │       ├── layouts/
│   │       ├── App.tsx
│   │       ├── main.tsx
│   │       └── vite-env.d.ts
│   │
│   ├── todo/         (same structure as auth)
│   ├── navbar/       (same structure as auth, trừ pages/ + routes/; thêm assets/)
│   └── shell/        (same structure as auth)
```

---

## 2. Công nghệ cho Phase 1

| Tool | Version gợi ý |
|------|---------------|
| pnpm | >=9.0.0 |
| Node.js | >=20 |
| turbo | ^2.0.0 |
| React | ^19.0.0 |
| TypeScript | ^5.5.0 |
| Vite | ^6.0.0 |
| @module-federation/vite | ^1.20.0 |
| Tailwind CSS | ^3.4.0 |
| autoprefixer | ^10.4.0 |
| postcss | ^8.4.0 |
| eslint | ^9.0.0 |
| prettier | ^3.0.0 |
| vitest | ^3.0.0 |
| @testing-library/react | ^16.0.0 |
| @testing-library/jest-dom | ^6.0.0 |
| msw | ^2.0.0 |

---

## 3. Rules từ Master cần tuân thủ

### Từ mục Công nghệ (master:11-27)
- pnpm Workspace + Turborepo
- React 19 + TypeScript strict
- Vite + @module-federation/vite
- Tailwind CSS + PostCSS + autoprefixer
- ESLint + Prettier

### Từ mục Kiến trúc dự án (master:31-45)
- 5 apps: shell (host), auth, todo, navbar, shared (remote)
- Thư mục `apps/<tên>/`

### Từ mục Monorepo (master:866-945)
- `pnpm-workspace.yaml`: packages = `['apps/*']`
- `turbo.json`: pipeline build dependsOn ^build, dev cache false persistent true
- Root package.json: scripts = dev, build, preview, lint, format

### Từ mục Vite Configuration (master:928-1060)
- Mỗi app có vite.config.ts riêng
- Port mapping: shared=3004, auth=3001, todo=3002, navbar=3003, shell=3000
- Module Federation plugin với `name`, `filename: 'remoteEntry.js'`
- Proxy `/api` → `http://localhost:8080` cho standalone

### Từ mục TypeScript Configuration (master:1072-1133)
- Strict mode
- target ES2020, module ESNext, moduleResolution bundler
- Path alias `@/` → `./src/*`

### Từ mục Tailwind CSS (master:718-778)
- PostCSS config với tailwindcss + autoprefixer
- prefix riêng: `sh-` (shared), `auth-`, `todo-`, `navbar-`
- Shell không cần prefix
- Mỗi app có tailwind.config.js riêng

### Từ mục Coding Convention (master:769-830)
- File naming: PascalCase component files, camelCase hooks/utils
- Named export cho components

### Từ mục Cấu trúc của mỗi App (master:585-613)
- Cấu trúc src/ đầy đủ
- Các file: index.html, vite.config.ts, tsconfig.json, tsconfig.node.json, postcss.config.js, tailwind.config.js, .env

---

## 4. Spec chi tiết từng file

### Root Files

#### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
```

#### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "preview": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

#### Root `package.json`
```json
{
  "name": "micro-module-federation",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "preview": "turbo run preview",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "format": "prettier --write \"apps/**/*.{ts,tsx,json}\""
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0",
    "@eslint/js": "^9.0.0",
    "typescript-eslint": "^8.0.0",
    "eslint-plugin-react-hooks": "^5.0.0"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=20"
  }
}
```

#### Root `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist"]
}
```

#### `.prettierrc`
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

#### `eslint.config.js`
```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  { ignores: ['**/dist/**', '**/node_modules/**'] },
)
```

#### `.env`
```
VITE_API_URL=http://localhost:8080
```

#### `.env.development`
```
VITE_API_URL=http://localhost:8080
```

#### `.env.production`
```
VITE_API_URL=https://api.example.com
```

#### `.gitignore`
```
node_modules/
dist/
.env.local
*.tsbuildinfo
coverage/
.turbo/
```

---

### Mỗi App: `package.json`

Pattern (shared khác biệt nhẹ):

```json
{
  "name": "@micro-fe/shared",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "@module-federation/vite": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

Dependencies riêng cho từng app:

```json
// shared, auth, todo — thêm:
"dependencies": {
  "axios": "^1.7.0",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.9.0",
  "@tanstack/react-query": "^5.50.0"
},
"devDependencies": {
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "msw": "^2.0.0",
  "@vitejs/plugin-react": "^4.3.0",
  "jsdom": "^24.0.0"
}
```

```json
// navbar — thêm i18n cho standalone mode (dùng useTranslation)
"dependencies": {
  "i18next": "^24.0.0",
  "react-i18next": "^15.0.0"
},
"devDependencies": {
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jsdom": "^24.0.0"
}
```

```json
// shell — thêm:
"dependencies": {
  "@tanstack/react-query": "^5.50.0"
},
"devDependencies": {
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jsdom": "^24.0.0"
}
```

### Mỗi App: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### Mỗi App: `vite.config.ts`

Dạng tổng quát:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '<app-name>',
      filename: 'remoteEntry.js',
      exposes: {},  // phase sau
      shared: ['react', 'react-dom', 'react-router'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: <port>,  // shared:3004, auth:3001, todo:3002, navbar:3003, shell:3000
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
```

Shell không có `exposes` nhưng có `remotes`:

```ts
federation({
  name: 'shell',
  remotes: {
    auth: 'auth@http://localhost:3001/remoteEntry.js',
    todo: 'todo@http://localhost:3002/remoteEntry.js',
    navbar: 'navbar@http://localhost:3003/remoteEntry.js',
    shared: 'shared@http://localhost:3004/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router'],
})
```

### Mỗi App: `vitest.config.ts`

Remote apps / shell:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

### Mỗi App: `src/test/setup.ts`

```ts
import '@testing-library/jest-dom/vitest'
```

### Root `vitest.workspace.ts`

```ts
export default ['apps/*']
```

---

### Mỗi App: `postcss.config.js`
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Mỗi App: `tailwind.config.js`

Remote apps (shared, auth, todo, navbar) — có prefix:

```js
/** @type {import('tailwindcss').Config} */
export default {
  prefix: '<prefix>-',  // 'sh-', 'auth-', 'todo-', 'navbar-'
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
```

Shell (host) — không có prefix:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
```

### Mỗi App: `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Micro FE - <AppName></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Mỗi App: `src/vite-env.d.ts`
```ts
/// <reference types="vite/client" />
```

### Mỗi App: `src/main.tsx` (placeholder)
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Mỗi App: `src/App.tsx` (placeholder)
```tsx
function App() {
  return <div className="<prefix>-p-4 <prefix>-text-center"><h1><AppName></h1></div>
}
export default App
```

### Mỗi App: `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### App-specific: Shell `src/App.tsx`
Shell là host, cần routing + layout sẵn:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router'
import { Suspense } from 'react'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<div>Shell Root</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
export default App
```

---

## 5. Verify Checklist

### Root
- [ ] `pnpm install` chạy thành công, không lỗi dependency
- [ ] `pnpm dev` start được tất cả 5 apps qua turborepo
- [ ] Mỗi app chạy đúng port: shared:3004, auth:3001, todo:3002, navbar:3003, shell:3000
- [ ] `pnpm build` build thành công tất cả apps
- [ ] `pnpm lint` không lỗi ESLint
- [ ] ESLint config hoạt động, báo lỗi đúng rule

### Shared App
- [ ] Chạy standalone ở http://localhost:3004, hiển thị placeholder
- [ ] Tailwind prefix `sh-` hoạt động, class `sh-p-4 sh-text-center` có style
- [ ] Vite proxy `/api` → http://localhost:8080 hoạt động
- [ ] Module Federation remoteEntry.js accessible at http://localhost:3004/remoteEntry.js

### Auth App
- [ ] Chạy standalone ở http://localhost:3001
- [ ] Tailwind prefix `auth-` hoạt động
- [ ] Module Federation remoteEntry.js accessible

### Todo App
- [ ] Chạy standalone ở http://localhost:3002
- [ ] Tailwind prefix `todo-` hoạt động
- [ ] Module Federation remoteEntry.js accessible

### Navbar App
- [ ] Chạy standalone ở http://localhost:3003
- [ ] Tailwind prefix `navbar-` hoạt động
- [ ] Module Federation remoteEntry.js accessible

### Shell App
- [ ] Chạy standalone ở http://localhost:3000
- [ ] Tailwind KHÔNG có prefix
- [ ] Cấu hình remotes trỏ đúng URL

### Testing
- [ ] Vitest workspace file `vitest.workspace.ts` tồn tại
- [ ] Mỗi app có `vitest.config.ts` + `src/test/setup.ts`
- [ ] `pnpm test` chạy vitest qua turborepo
- [ ] `pnpm test --filter=shared` chạy test cho shared app

### Chung
- [ ] Tất cả apps có TypeScript strict mode, không lỗi compile
- [ ] Shell tailwind config KHÔNG có prefix, có darkMode class
- [ ] Remote apps tailwind config có prefix + primary color tokens + darkMode class
- [ ] Path alias `@/` resolve đúng
- [ ] Prettier format không thay đổi file sau khi chạy
- [ ] .gitignore không track node_modules, dist, .env.local
