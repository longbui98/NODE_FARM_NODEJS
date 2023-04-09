const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    newCreateIndex: true,

    useFindAndModify: true
}).then(con => console.log("Connection successful"));

// const testTour = 
const port = process.env.PORT || 8080;
app.listen(port, '127.0.0.1', () => {
    console.log(`Server is listening on port ${port}`);
});