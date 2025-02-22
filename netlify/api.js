const http = require("http");
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log("A new user has connected:", socket.id);
    
    socket.on('user-message', message => {
        io.emit('message', message);
    });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    return res.sendFile(path.resolve("./public/index.html"));
});

// Export Netlify function handler
module.exports.handler = serverless(app);
