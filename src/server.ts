import app from './app';
import logger from './utils/logger';

/**
 * Start Express server
 */
const server = app
  .listen(app.get('port'), () => {
    const port = app.get('port');
    const env = app.get('env');

    logger.info(`✅ App is running at http://localhost:${port} in ${env} mode`);
    logger.info('   Press CTRL-C to stop');
  })
  .on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });

export default server;
