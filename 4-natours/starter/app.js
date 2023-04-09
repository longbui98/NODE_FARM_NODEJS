const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./router/tourRoutes');
const userRouter = require('./router/userRoutes');
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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//Traditional way
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

//3) Using chain way - ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4) Server
module.exports = app;