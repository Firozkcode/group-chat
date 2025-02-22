const http = require("http");
const express = require("express");
const path = require('path');
const ServerlessHttp = require('serverless-http');
const app = express();

const { Server } = require("socket.io");

app.get('/.netlify/functions/api', (req, res)=> {
    return res.json({
        message: 'Hello from Express'
    })
})

const handler = ServerlessHttp(app);
const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 9000;

module.exports.handler = async(event, context) =>{
    const result = await handler(event, context);
    return result
}


//handle socket.io connection here
io.on('connection', (socket) => {
    // console.log("A new user has connected", socket.id)
    socket.on('user-message', message => {
        // console.log("A new user Meassage", message);
        io.emit('message', message);
    })
});

app.use(express.static(path.resolve("./public")));

app.get('/', (req, res) => {
    return res.sendFile("/public/index.html");
})

server.listen(PORT, () => console.log(`Server Started at Port: http://localhost:${PORT}`))
