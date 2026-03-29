import 'dotenv/config';
import express from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import authRouter from './routes/auth.routes';
import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';

const PORT = process.env.PORT || 8005;

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
