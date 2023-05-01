const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({
    path: './config2.env'
});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB,
    {
        useNewUrlParser: true,
        newCreateIndex: true,

        useFindAndModify: true
    }).then(() => console.log("DB Connection successful"));


const port = process.env.PORT || 8080;
const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Server is listening on port ${port}`);
});

process.on('unhandleRejection', err => {
    console.log('UNHANDLER REJECTION 🔥🔥! Shutting down');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})

process.on('uncaughtException', err => {
    console.log('UNCAUGHT REJECTION 🔥🔥! Shutting down');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})