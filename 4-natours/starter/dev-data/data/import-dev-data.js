const fs = require("fs");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require("../../model/tourModel");

dotenv.config({
    path: './config2.env'
});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB,
    {
        useNewUrlParser: true,
        newCreateIndex: true,

        useFindAndModify: true
    }).then(() => console.log("Connection successful"));

//Read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//Import Data into DB
const importedData = async () => {
    try {
        await Tour.create(tours)
        console.log("Data successully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

console.log(process.argv);

//DELETE ALL DATA FROM COLLECTION
const deletedData = async () => {
    try {
        await Tour.deleteMany()
        console.log("Data successully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importedData();
} else if (process.argv[2] === '--delete') {
    deletedData();
}

