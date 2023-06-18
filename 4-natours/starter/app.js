const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./router/tourRoutes');
const userRouter = require('./router/userRoutes');
const reviewRouter = require('./router/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControler');


const app = express();

//1) GLOBAL MIDDLEWARE

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

//Data sanitialization againts NoSQL
app.use(mongoSanitize());
//Data sanitialization againts XSS
app.use(xss());

//Use for get static file
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    console.log("Hello world from Middleware 😁");
    next();
});

app.use((req, res, next) => {
    res.requestTime = new Date().toISOString();
    next();
})

//2) Route handler

//Traditional way
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

//3. Using chain way - ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: "Fail",
    //     message: `Can't find ${req.originalUrl} on this server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

//4) Server
module.exports = app;

