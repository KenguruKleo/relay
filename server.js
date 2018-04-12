import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {schema} from './data/schema';

const APP_PORT = 5000;

const app = express();

app.use('/', express.static(path.resolve(__dirname, 'public')));

app.use('/graphql', graphQLHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
