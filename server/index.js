const io = require("socket.io")(3000, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

io.on('connection', (socket) => {
    console.log('someone connected! ' + socket.id);
    socket.on("user", (msg) => {
        console.log(msg)
    })
    socket.on("send-message", (msg) => {
        socket.broadcast.emit('receive-message', msg)
        console.log(msg)
    })
  });