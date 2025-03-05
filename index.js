const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 9000;

const users = {};
const CHAT_ROOM_KEY = "12345"; // Change this to your desired key

// Handle socket.io connections
io.on("connection", (socket) => {
    socket.on("join-room", ({ name, key }) => {
        if (key !== CHAT_ROOM_KEY) {
            socket.emit("access-denied", "Invalid room key. Access denied.");
            return;
        }

        users[socket.id] = name;
        socket.broadcast.emit("message", { message: `${name} has joined the chat`, type: "connect" });
        socket.emit("access-granted");
    });

    socket.on("user-message", (message) => {
        const senderName = users[socket.id] || "Unknown";
        io.emit("message", { message: message, sender: senderName, senderId: socket.id });
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("message", { message: `${users[socket.id]} has left the chat`, type: "connect" });
            delete users[socket.id];
        }
    });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
