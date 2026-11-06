import express from 'express';
import cors from 'cors';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { authRouter } from './routes/auth.routes';
import { modulesRouter } from './routes/modules.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Global Tenant Context Middleware
app.use(tenantMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tenantContext: req.tenant,
    version: '1.0.0-enterprise'
  });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/modules', modulesRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Athenaeum Enterprise API] running on port ${PORT}`);
  });
}

export default app;
