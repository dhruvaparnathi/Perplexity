import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import validationMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

app.use(validationMiddleware);

export default app;