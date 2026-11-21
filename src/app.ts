import cors from 'cors';
import express from 'express';

import authRouter from './routes/auth.routes.js';

export const app = express();

// Oculta información innecesaria de Express
app.disable('x-powered-by');

// Permitir peticiones desde el frontend
app.use(
  cors({
    origin: true,
  })
);

// Permitir JSON
app.use(
  express.json({
    limit: '1mb',
  })
);

// ==========================================
// RUTA PARA COMPROBAR EL SERVIDOR
// ==========================================

app.get('/api/v1/health', (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API de Combystile funcionando.',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// AUTENTICACIÓN
// ==========================================

app.use(
  '/api/v1/auth',
  authRouter
);

// ==========================================
// RUTA NO ENCONTRADA
// ==========================================

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada.',
  });
});