const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const { v4: uuidV4 } = require('uuid');

const rooms = {};

app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        if (rooms[roomId]) {
            rooms[roomId].push(socket.id);
        } 
        // lo anterior me puede llegar a servir, esto de abajo lo hace socket io por defecto
        // else {
        //     rooms[roomId] = [socket.id];
        // }
        // const otherUser = rooms[roomId].find(id => id !== socket.id);
        // if (otherUser) {
        //     socket.emit("other user", otherUser);
        //     socket.to(otherUser).emit("user joined", socket.id);
        // }
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        console.log('user connected');

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
})


server.listen(3000, () => console.log('server is running on port 3000'));