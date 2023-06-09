const { error } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require("./module.js/replaceTemplate")
///////
//FILES
//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

//Write to the file
// const textOut = `This is what we know about the avocado: ${textIn} on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt', textOut);
// console.log("file has been written");
//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data)=>{
//     if(err) console.log("File has error 🥵🤬");
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("File has been written 😎")
//             })
//         })
//     })
// })
// console.log("Reading!!!")
///////
//SERVER

const tempOverview = fs.readFileSync("./templates/template_overview.html", 'utf-8');
const tempCard = fs.readFileSync("./templates/template_card.html", 'utf-8');
const tempProduct = fs.readFileSync("./templates/template_product.html", 'utf-8');

const data = fs.readFileSync("./dev-data/data.json", 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res)=>{
    //const pathName = req.url;
    const {query, pathname} = url.parse(req.url, true);
    //OVERVIEW PAGE
    if(pathname === "/" || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map((value) => replaceTemplate(tempCard, value)).join("");

        const output = tempOverview.replace(/{%PRODUCTS_CARD%}/g, cardsHtml);

        res.end(output);
    //PRODUCT
    }else if(pathname === "/product"){
        res.writeHead(200, {"Content-type": "text/html"});

        const product = dataObj[query.id];

        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    //API
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data);
    //NOT FOUND
    }else{
        res.writeHead(404, {
            'Content-type': "text/html",
            "my-own-header": "hello-world"
        })
        res.end("<h1>Page Not Found</h1>")
    }
})

server.listen(8000, '127.0.0.1', () =>{
    console.log("Listening to requests on port 8000");
})
