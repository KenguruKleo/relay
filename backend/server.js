import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {schema} from '../data/schema';
const logger = require('./utils/logger');

/** start worker */
export default function start() {
  let requests = 0;

  const APP_PORT = 5000;

  /** receive requests count from cluster */
  process.on('message', message => {
    if (message.cmd === 'updateOfRequestTotal') {
      requests = message.requests;
    }
  });

  const app = express();

  /** middleware to count request - send to cluster */
  app.use((req, res, next) => {
    logger.info(`total requests count: ${requests + 1}`);
    if (process.send) {
      process.send({
        cmd: 'incrementRequestTotal',
      });
    } else {
      requests += 1;
    }
    next();
  });

  app.use('/public', express.static(path.resolve(__dirname, 'public')));

  app.use('/graphql', graphQLHTTP({
    schema: schema,
    pretty: true,
    graphiql: true,
  }));

  app.use((req, res) => {
    res
      .status(404)
      .end('Not Found');
  });

  app.listen(APP_PORT, () => {
    logger.info(`App is now running on http://localhost:${APP_PORT}, in process: ${process.pid}`);
  });
}

if (require.main === module) {
  start();
}
