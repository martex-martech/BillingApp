import express from 'express';
import cors from 'cors';
import otpRoutes from './src/routes/otpRoute';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', otpRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});