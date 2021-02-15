import app from './app';

/**
 * Start Express server
 */
const server = app.listen(app.get('port'), () => {
  const port = app.get('port');
  const env = app.get('env');

  console.log(`✅ App is running at http://localhost:${port} in ${env} mode`);
  console.log('   Press CTRL-C to stop\n');
});

export default server;
