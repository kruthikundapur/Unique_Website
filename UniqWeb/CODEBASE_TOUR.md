## Codebase Tour

High-level map of the project to help you navigate quickly.

### Root files
```
project/
├── package.json
├── .env                 # create this locally
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── OVERVIEW_AND_FEATURES.md
```

### Frontend (`client`)
```
client/
├── index.html
└── src/
    ├── main.tsx         # React entry point
    ├── App.tsx          # App shell and routing
    ├── index.css        # Global styles
    ├── components/
    │   ├── 3d/          # 3D scene, avatars, effects, particles
    │   └── ui/          # UI components (chat, voice, settings, progress)
    ├── hooks/           # Reusable hooks
    ├── lib/             # Client services (AI, voice, query, stores)
    └── pages/           # App pages (e.g., not-found)
```

### Backend (`server`)
```
server/
├── index.ts             # Server startup
├── routes.ts            # API endpoints
├── storage.ts           # Storage helpers
├── vite.ts              # Dev tooling
└── services/
    ├── aiService.ts     # OpenAI integration
    └── voiceService.ts  # Voice processing
```

### Shared
```
shared/
└── schema.ts            # Shared types
```

### Entry points to explore first
- `client/src/App.tsx`
- `client/src/components/3d/`
- `server/`


