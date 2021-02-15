import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, MONGO_URI_DEV, MONGO_URI_PROD } = process.env;

const isProduction = NODE_ENV === 'production';

export const PORT = process.env.PORT || 5000;

export const MONGO_URI = isProduction ? MONGO_URI_PROD : MONGO_URI_DEV;

if (!MONGO_URI) {
  console.log(
    chalk.red(`[MongoDB] Missing connection string for MongoDB in ${NODE_ENV}`),
  );

  process.exit(1);
}
