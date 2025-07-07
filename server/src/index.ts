import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/api', AuthRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});