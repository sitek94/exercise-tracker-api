import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import exerciseRoutes from './routes/exercise';
import config from './config';
import errorHandler from './middleware/error-handler';
import logger from './utils/logger';

const app = express();

// Express configuration
app.set('port', config.port || 5000);
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info(`✅ MongoDB connected`);
  })
  .catch((err) => {
    logger.info(`❌ MongoDB failed to connect`, err.message);
  });

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
