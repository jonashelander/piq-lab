import express from 'express';
import cors from 'cors';
import configRouter from './routes/config';
import logsRouter from './routes/logs';
import integrationRouter from './routes/integration';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

app.use('/api/config', configRouter);
app.use('/api/logs', logsRouter);
app.use(integrationRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
