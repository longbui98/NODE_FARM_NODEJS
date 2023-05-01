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
app.listen(port, '127.0.0.1', () => {
    console.log(`Server is listening on port ${port}`);
});