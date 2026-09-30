import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

export default app;