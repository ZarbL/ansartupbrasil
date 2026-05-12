import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { testConnection } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import startupRoutes from './routes/startup.routes';
import usuarioRoutes from './routes/usuario.routes';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

app.use(errorHandler);

async function bootstrap() {
  await testConnection();
  app.listen(Number(env.PORT), () => {
    console.log(`🚀 Servidor rodando na porta ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
