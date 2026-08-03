import express, {type Express} from 'express';
import { apiRouter } from './src/routes';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(cookieParser());
app.use('/', apiRouter);

app.listen(3000, () => {
    console.log("Server is running");
});


