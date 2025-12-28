import express, { Express } from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

// Load environment variables
dotenv.config();

// Import routes
// Routes will be added later if needed

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist/web'));

// Basic rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Simple JWT auth middleware (optional)
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }
  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'llamaflow-secret');
    (req as any).user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LlamaFlow API',
      version: '1.0.0',
      description: 'Multi-chain DeFi protocol metrics & analytics platform',
      contact: {
        name: 'LlamaFlow Team',
        url: 'https://github.com/cryptonique0/llamaflow'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Protocol: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            symbol: { type: 'string' },
            market_cap: { type: 'number' },
            current_price: { type: 'number' },
            price_change_24h: { type: 'number' },
            total_volume: { type: 'number' },
            image: { type: 'string' }
          }
        },
        Metric: {
          type: 'object',
          properties: {
            protocol_id: { type: 'string' },
            tvl: { type: 'number' },
            volume_24h: { type: 'number' },
            fees_24h: { type: 'number' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

// Health check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', name: 'LlamaFlow', timestamp: new Date().toISOString() });
});

// API Routes
// Minimal REST placeholders; GraphQL provides data access
app.get('/api/metrics/latest', (_req, res) => {
  res.json({ message: 'Use GraphQL latestMetric query' });
});
app.get('/api/metrics/history', (_req, res) => {
  res.json({ message: 'Use GraphQL metrics query' });
});

// Protected sample route
app.get('/api/protected', authMiddleware, (_req, res) => {
  res.json({ ok: true, message: 'You accessed a protected route' });
});

// Apollo GraphQL server
const apolloServer = new ApolloServer({ typeDefs, resolvers });
// Start Apollo and attach /graphql endpoint
apolloServer.start().then(() => {
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.authorization || '' }),
    })
  );
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile('dist/web/index.html', { root: process.cwd() });
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

export default app;
export { apolloServer };
