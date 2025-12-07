import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 8383;

// Middlewares
app.use(express.json());

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve everything in public/ including index.html
app.use(express.static(path.join(__dirname, '../public')));
 
app.use('/auth', authRoutes);
app.use('/todos',authMiddleware,todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
