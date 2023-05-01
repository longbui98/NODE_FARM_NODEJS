const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./router/tourRoutes');
const userRouter = require('./router/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControler');

const app = express();

//1) Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}
app.use(express.json());
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