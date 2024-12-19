import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

var allUsers = [];

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["polling"],
});

io.on("connection", (socket) => {
  console.log(
    `user connected with socket Id: ${socket.id}`
  );

  socket.on("user-join", (username) => {
    // check if user exist then update user
    const userExist = allUsers.find((user) => user.username === username);
    if (userExist) {
      allUsers.map((user) => {
        if (user.username === username) {
          user.id = socket.id;
        }
      });
    } else {
      allUsers.push({ username, id: socket.id });
    }

    // inform others that new user is joined
    socket.broadcast.emit("all-users", allUsers);
    socket.emit("all-users", allUsers);
  });
  socket.on("call-status", ({ from, to, status }) => {
    const id = allUsers.find((user) => user.username === to.username)?.id;
    io.to(id).emit("call-status", { from, to, status });
  });

  socket.on("offer", ({ from, to, offer }) => {
    socket.to(to.id).emit("offer", { from, to, offer });
  });

  socket.on("answer", ({ from, to, answer }) => {
    socket.to(from.id).emit("answer", { from, to, answer });
  });
  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });

  socket.on("end-call", ({ from, to }) => {
    const id = allUsers.find((user) => user.username === to.username)?.id;
    io.to(id).emit("end-call", { from, to });
  });

  socket.on("call-ended", ({ from, to }) => {
    const fromId = allUsers.find((user) => user.username === from.username)?.id;
    const toId = allUsers.find((user) => user.username === to.username)?.id;
    io.to(fromId).emit("call-ended", caller);
    io.to(toId).emit("call-ended", caller);
  });

  socket.on("disconnect", () => {
    // remove user from allUsers list
   allUsers = allUsers.filter((user) => user.id !== socket.id);
    socket.broadcast.emit("all-users", allUsers); 
  });
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});

export default server;
