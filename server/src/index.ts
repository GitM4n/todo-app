import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import authRouter from './routes/auth.routes';
import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';

const PORT = process.env.PORT || 8005;
const frontendAppUrl = process.env.FRONTEND_APP_URL;

if (!frontendAppUrl) throw new Error('FRONTEND_APP_URL is not defined');

const app = express();

app.use(cors({ origin: frontendAppUrl }));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, userRouter);
app.use('/api/tasks', authMiddleware, taskRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
