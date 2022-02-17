import { Server } from "socket.io";

const io = new Server(3000, { /* options */ });
console.log('server listening on port 3000');

io.on("connection", (socket) => {
  socket.on('data', (data) => {
    console.log(data);
    // ...
  });
});