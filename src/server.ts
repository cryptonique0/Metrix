import app from './index';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { simulateUpdate, seedInitialData, getLatestMetrics } from './services/metrics';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

const PORT = parseInt(process.env.PORT || '3000', 10);

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' }
});

// Apollo server mounted here to ensure it starts before listen
const apolloServer = new ApolloServer({ typeDefs, resolvers });

// Seed data and start simulation
seedInitialData();

// Broadcast TVL updates every 5 seconds
setInterval(() => {
  const latest = simulateUpdate();
  io.emit('tvlUpdate', latest);
}, 5000);

io.on('connection', (socket) => {
  const latest = getLatestMetrics('llamaflow');
  if (latest) socket.emit('tvlUpdate', latest);
});

async function start() {
  await apolloServer.start();
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.authorization || '' }),
    }),
  );

  httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
