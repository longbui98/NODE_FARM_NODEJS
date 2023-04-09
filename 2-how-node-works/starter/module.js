const Calculator = require("./test-module-1");

//module.expors
const calc1 = new Calculator();
console.log("Exports module: ", calc1.add(2, 3));

//exports
const {add, multiple, divide, mod} = require("./test-module-2");
console.log("Exports: ", add(2, 3));

//caching
require("./test-module-3")();