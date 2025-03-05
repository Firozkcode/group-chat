const http = require("http");
const express = require("express");
const path = require('path');
// const serverless = require('serverless-http');

const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 9000;


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
