import express from 'express';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import userRouter from './routes/auth.router.js';
import { generalLimiter } from './middlewares/ratelimit.middleware.js';
import taskRouter from './routes/tasks.router.js';
import adminRouter from './routes/admin.router.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(generalLimiter);

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/admin', adminRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
    console.log(`Task-manager-API is running on http://localhost:${PORT}`);

    await connectToDatabase();     
});

export default app;