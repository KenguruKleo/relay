import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {schema} from './data/schema';

/** start worker */
export default function start() {
  let requests = 0;

  const APP_PORT = 5000;

  process.on('message', message => {
    if (message.cmd === 'updateOfRequestTotal') {
      requests = message.requests;
    }
  });

  const app = express();

  app.use('/public', express.static(path.resolve(__dirname, 'public')));
  app.use('/', (req, res) => {
    res.end(`I'm worker running in process: ${process.pid}, requests: ${requests}`);
    if (process.send) {
      process.send({
        cmd: 'incrementRequestTotal',
      });
    }
  });

  app.use('/graphql', graphQLHTTP({
    schema: schema,
    pretty: true,
    graphiql: true,
  }));

  app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}, in process: ${process.pid}`);
  });
}
