const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
let d;

fs.readFile('js/users.json', (err, data) => {
    if (err) throw err;
    let player = JSON.parse(data);



    console.log(player);
    d = data;
});


console.log('This is after the read call');


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(d);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
