import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

// Safely get the environment variable in the process
const env = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`⚠️  Missing: process.env['${name}']  ⚠️`);
  }

  return value;
};

const isProd = env('NODE_ENV') === 'production';

// All your secrets, keys go here
const config = {
  /**
   * Your favorite port
   */
  port: +env('PORT'),

  /**
   * Is the app running in production mode?
   */
  isProd,

  /**
   * If not production - development mode
   */
  isDev: !isProd,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * That long string from MongoDB
   */
  mongoUri: env(`MONGO_URI_${isProd ? 'PROD' : 'DEV'}`),

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
};

export default config;
