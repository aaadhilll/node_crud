require('dotenv').config({ path: `${process.cwd()}/.env` });

const express = require('express');
const catchAsync = require('./utils/catchAsync');
const authRouter = require('./router/authRoute');
const prodjectRouter = require('./router/projectRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const { stack } = require('sequelize/lib/utils');

const app = express();

app.use(express.json());





// all routes will be here //

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', prodjectRouter);

const PORT = process.env.APP_PORT || 4000;

app.use('*', catchAsync(async (req, res, next) => {
 
   throw new AppError(`cant find ${req.originalUrl} on this server`, 404);
 
}));

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log('server is running');
}


)