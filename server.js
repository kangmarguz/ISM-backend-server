import 'dotenv/config';
import express from 'express';
// == MIDDLEWARE ==
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//== ROUTE ==
import userRouter from './routes/userRouter.js';

const app = express();
const PORT = process.env.ISM_SERVER_PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', userRouter);

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
