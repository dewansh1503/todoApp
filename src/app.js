import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use(userRouter);

app.use(todoRouter);

app.use(errorHandler);
export { app };
