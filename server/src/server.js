// server/src/server.js
import 'dotenv/config'; // حمّل .env
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import inquiryRoutes from './routes/inquiries.js';
import { ensureAdminSeed } from './utils/seedAdmin.js';

const app = express();

// ====== الأمن و CORS ======
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(helmet());

// ====== بارس JSON ======
app.use(express.json({ limit: '2mb' }));

// ====== ملفات الرفع ======
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ====== Health ======
app.get('/health', (_req, res) => res.json({ ok: true }));

// ====== Routes ======
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);

// ====== تشغيل ======
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ask_platform';

mongoose
  .connect(MONGO)
  .then(async () => {
    console.log('MongoDB connected');
    await ensureAdminSeed(); // إنشاء أدمن لو مش موجود
    app.listen(PORT, () => console.log('API on :' + PORT));
  })
  .catch((e) => {
    console.error('Mongo error', e);
    process.exit(1);
  });
