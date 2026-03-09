const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // wrap express with http

const io = new Server(server, {
  cors: {
    origin: "*", // update this to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

const candidates = require("./routes/candidates");
const users = require("./routes/users");
const votes = require("./routes/votes");
const elections = require("./routes/elections");
const { verifyApiKey, verifyToken } = require("./middleware/auth");

app.use(cors());
app.use(express.json());

// Attach io to every request so routes can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/users", users);
app.use("/candidates", verifyApiKey, verifyToken, candidates);
app.use("/votes", verifyApiKey, verifyToken, votes);
app.use("/elections", verifyApiKey, verifyToken, elections);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join a specific election room
  socket.on("join_election", (election_id) => {
    socket.join(`election_${election_id}`);
    console.log(`Socket ${socket.id} joined election_${election_id}`);
  });

  // Leave election room
  socket.on("leave_election", (election_id) => {
    socket.leave(`election_${election_id}`);
    console.log(`Socket ${socket.id} left election_${election_id}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Use server.listen instead of app.listen
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
