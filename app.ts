import express, {type Express} from 'express';
import { apiRouter } from './routes';

const app: Express = express();

app.use('/', apiRouter);

app.listen(3000);


