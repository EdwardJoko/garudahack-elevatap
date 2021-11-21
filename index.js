const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectMongoDB = require(path.join(__dirname, "database", "connectMongoDb"));

// initiate express and socket
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// get variable from environment
dotenv.config();

// connect to the database
connectMongoDB();

// socket for chat
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// view engine
app.set("view engine", "ejs");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// serving static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require(path.join(__dirname, "routes", "routes")));

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
