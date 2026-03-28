import 'dotenv/config';
import express from 'express';
import { login } from './controllers/auth.controller';
import taskRouter from './routes/task.routes';

const PORT = process.env.PORT || 8005;

const app = express();

app.use(express.json());
app.post('/api/auth/login', login);
app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
