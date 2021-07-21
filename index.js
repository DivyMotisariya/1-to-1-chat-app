const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 3000;
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  res.render("index.html");
});

let users = [];

io.on("connection", (socket) => {
  socket.on("newUser", (data) => {
    socket.username = data;
    users.push({ id: socket.id, name: data });
    io.emit("newUser", users);
  });

  socket.on("sendMsg", (data) => {
    io.to(data.id).emit("sendMsg", {
      username: socket.username,
      curMsg: data.curMsg,
    });
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit("newUser", users);
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);