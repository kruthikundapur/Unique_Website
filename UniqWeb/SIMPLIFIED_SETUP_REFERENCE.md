## Simplified Setup Reference

Use this as a lightweight reference if you’re bootstrapping from scratch.

### Minimal `package.json`
```json
{
  "name": "social-impact-hub",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"tsx server/index.ts\" \"vite\"",
    "build": "vite build"
  }
}
```

### `.env`
```
OPENAI_API_KEY=your_openai_api_key_here
```

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:5000' }
  }
})
```

### `tailwind.config.ts`
```ts
export default {
  content: ["./client/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: []
}
```


