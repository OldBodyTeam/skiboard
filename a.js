const { Buffer } = require('buffer');
const decodedBytes = Buffer.from([]);
const code = decodedBytes.toString('hex');
const decimalValue = parseInt(code.slice(-4, -2), 16);
console.log(decimalValue);
