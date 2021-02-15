import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import exerciseRoutes from './routes/exercise';
import { MONGO_URI, PORT } from './config';
import { errorHandler } from './middleware/error-handler';

const app = express();

// Express configuration
app.set('port', PORT || 5000);
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`✅ MongoDB connected...`))
  .catch((err) => console.log(`❌ MongoDB failed to connect, ${err.message}`));

// Homepage route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
  });
});

// Api
app.use('/api/exercise', exerciseRoutes);

// 404: Not Found
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

export default app;
