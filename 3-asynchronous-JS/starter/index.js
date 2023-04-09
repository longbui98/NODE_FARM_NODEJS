const { rejects } = require("assert");
const fs = require("fs");
const { resolve } = require("path");
const superagent = require("superagent");

const readFilePro = file => {
    return new Promise((resolve, rejects) => {
        fs.readFile(file, (err, data) => {
            if (err) rejects(err);
            resolve(data);
        })
    })
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, rejects) => {
        fs.writeFile(file, data, err => {
            if (err) rejects(err);
            resolve("Writed successfully");
        })
    })
}

const getDogPig = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const allPro = await Promise.all([res1Pro, res2Pro, res3Pro]);

        const res = allPro.map(value => value.body.message);

        await writeFilePro("dog-img.txt", res.join("\n"));
        console.log("File is already being saved")
    } catch (err) {
        console.log("Error while getting data: " + err.message);
    }
    return "2: READY 🐶";
};

(async () => {
    try {
        console.log("1: Will get dog pics");

        const x = await getDogPig();
        console.log(x);

        console.log("3: Done getting dog pics");
    } catch (err) {
        console.log("ERROR 🌋");
    }
})();

/*
getDogPig() 
    .then(x => {
        console.log(x);
        console.log("3: Done getting dog pics");
    }).catch(err => {
        console.log("Error while getting data: " + err.message);   
    });
*/
/*
readFilePro(`${__dirname}/dog.txt`)
    .then(data => {
        console.log(`Breed: ${data}`);
        return superagent
            .get(`https://dog.ceo/api/breed/${data}/images/random`)
    })
    .then(res =>{
        console.log(res.body);
        return writeFilePro("dog-img.txt", res.body.message);
    })
    .then(() => console.log("File is already being saved"))
    .catch(err =>{
        console.log("Error while getting data: " + err.message);   
    });
*/