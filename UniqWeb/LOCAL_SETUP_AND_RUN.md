## Local Setup & Run

Follow these steps to run Social Impact Hub on your machine.

### Requirements
- Node.js 18+

### Install
```bash
npm install
```

### Configure your OpenAI key
Create a `.env` file in the project root with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Start the app
```bash
npm run dev
```
Open `http://localhost:5000`.

### Scripts
- `npm run dev`: Start the server (serves client and API)
- `npm run build`: Build client and server

### Troubleshooting
- Port in use? Stop the other process or change the port.
- Type errors? Run `npx tsc --noEmit`.
- OpenAI issues? Re-check the API key and account credits.


