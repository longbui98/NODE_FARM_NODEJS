const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();


setTimeout(() => {
    console.log("Timer1 finished");
}, 0);

fs.readFile("./test-file.txt", ()=>{
    console.log("I/O Finishes");
    console.log("------");

    setTimeout(() => console.log("Timer 2 finishes", 0));
    setTimeout(() => console.log("Timer 3 finishes"), 3000);
    setImmediate(() => console.log("Immedietaly 1 finishes"));

    process.nextTick(() => console.log("Process.nextTick"));
    
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>{
        console.log(Date.now() - start, "Password encrypted 1");
    })
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>{
        console.log(Date.now() - start, "Password encrypted 2");
    })
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>{
        console.log(Date.now() - start, "Password encrypted 3");
    })
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>{
        console.log(Date.now() - start, "Password encrypted 4");
    })
})


console.log("Hello World");