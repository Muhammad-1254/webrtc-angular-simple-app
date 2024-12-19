import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const allUsers = [];

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
    `Someone connected to socket server and socket id is ${socket.id}`
  );

  socket.on("user-join", (username) => {
    console.log("join user: ", username);
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
    console.log("offer: ", { from, to, offer });
    socket.to(to.id).emit("offer", { from, to, offer });
  });

  socket.on("answer", ({ from, to, answer }) => {
    console.log("answer: ", { from, to, answer });
    socket.to(from.id).emit("answer", { from, to, answer });
  });
  socket.on("candidate", (candidate) => {
    console.log({ candidate });
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
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});

export default server;
