const EventEmitter = require("events");
const http = require("http");

class Sale extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmitter = new Sale();

myEmitter.on("newSale", () =>{
    console.log("There was a new sale!");    
})


myEmitter.on("newSale", () =>{
    console.log("Costomer name: Jonas");
})


myEmitter.on("newSale", stock =>{
    console.log(`There are now ${stock} items left in stock`);
})

myEmitter.emit("newSale", 9);

//////////////////

const server = http.createServer();

server.on("request", (req, res) =>{
    console.log("Request received");
    res.end("Request received");
})


server.on("request", (req, res) =>{
    console.log("Request received😁");
})

server.on("close", () =>{
    console.log("Server closed");
})

server.listen(8000, "127.0.0.1", () =>{
    console.log("Waiting for request");
})