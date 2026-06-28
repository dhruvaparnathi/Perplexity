import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import cookieParser from 'cookie-parser';
import validationMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);


app.use(validationMiddleware);

export default app;