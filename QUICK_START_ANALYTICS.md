# Quick Start: Real-Time Analytics

Get the Metrix dashboard running locally in 60 seconds.

## 1. Install & Build
```bash
cd /home/web3joker/Documents/n
npm install          # Install all dependencies
npm run build        # Build backend + frontend
```

## 2. Start the Server
```bash
npm start            # Runs: node dist/server.js
```

Expected output:
```
Server listening on http://localhost:3000
```

## 3. Open Dashboard
Visit `http://localhost:3000` in your browser. You'll see:
- **Real-time TVL chart** (updates every 5 seconds via WebSocket)
- **Latest TVL value** with timestamp
- **24-hour historical data** visualized

## Development Mode (Hot Reload)

Terminal 1 – Backend:
```bash
npm run dev           # Runs ts-node-dev (auto-restarts on changes)
```

Terminal 2 – Frontend:
```bash
npm run dev:web       # Runs Vite dev server on port 5173
```

Then visit `http://localhost:5173` (Vite proxy handles `/graphql` and `/socket.io`).

## Test the APIs

### GraphQL Query
```bash
curl -X POST http://localhost:3000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query { metrics(protocolId: \"llamaflow\", hours: 24) { protocol_id tvl timestamp } }"
  }'
```

### WebSocket Event (Browser Console)
```javascript
const socket = io('http://localhost:3000');
socket.on('tvlUpdate', (data) => {
  console.log('TVL:', data.tvl.toLocaleString(), 'at', new Date(data.timestamp).toLocaleTimeString());
});
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## What's Happening Under the Hood

1. **Server startup** (`src/server.ts`):
   - Initializes Express app
   - Starts Apollo GraphQL server at `/graphql`
   - Creates Socket.io WebSocket server
   - Seeds 24-hour historical metrics data
   - Broadcasts new TVL data every 5 seconds

2. **Frontend** (`web/src/App.tsx`):
   - Loads 24-hour metrics via GraphQL on mount
   - Connects to Socket.io
   - Renders Chart.js line graph
   - Updates chart in real-time when `tvlUpdate` event arrives

3. **Metrics Service** (`src/services/metrics.ts`):
   - Maintains in-memory circular buffer (max 1000 records)
   - Simulates realistic TVL changes using sine waves + noise
   - Returns queries by protocol and time range

---

## Common Issues

### "Cannot find module 'graphql-tag'"
```bash
npm install --save graphql-tag
```

### "Port 3000 already in use"
```bash
# Use a different port
PORT=4000 npm start

# Or kill the process on 3000
lsof -ti:3000 | xargs kill -9
```

### "Socket.io connection fails"
- Ensure backend is running on `http://localhost:3000`
- Check browser DevTools > Network > WebSocket connection status
- In Vite dev mode, WebSocket proxy is configured in `vite.config.ts`

### Chart shows no data
- Open browser console (F12) and check for GraphQL errors
- Verify the server seeded metrics: `curl http://localhost:3000/graphql`

---

## Next Steps

1. **Customize metrics**: Edit `src/services/metrics.ts` to use real DeFi data
2. **Add more charts**: Create new components in `web/src/components/`
3. **Deploy**: Run `npm run docker:build && npm run docker:run`
4. **Database**: Replace in-memory store with SQLite or PostgreSQL
5. **Multi-chain**: Add Stacks chain metrics and queries

---

## File Structure
```
.
├── src/                    # Backend
│   ├── server.ts          # Express + Apollo + Socket.io bootstrap
│   ├── index.ts           # App config, middleware
│   ├── graphql/           # GraphQL schema & resolvers
│   └── services/          # Business logic (metrics)
├── web/                    # Frontend
│   ├── index.html         # HTML entry
│   ├── src/
│   │   ├── App.tsx        # Main component
│   │   ├── components/    # Reusable React components
│   │   ├── hooks/         # Custom hooks (useSocket)
│   │   └── services/      # API clients (graphql service)
│   └── package.json       # Frontend deps
├── dist/                   # Build output (generated)
│   ├── server.js          # Compiled Node.js app
│   └── web/               # Compiled frontend (served as static)
├── package.json           # Root package manifest
├── tsconfig.json          # TypeScript config
└── vite.config.ts         # Vite bundler config
```

---

**Ready to run?** Execute:
```bash
npm install && npm run build && npm start
```

Then visit `http://localhost:3000` and watch the TVL update in real-time! 🚀

