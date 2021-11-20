const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectMongoDB = require(path.join(__dirname, "database", "connectMongoDb"));

// initiate express
const app = express();

// get variable from environment
dotenv.config();

// connect to the database
connectMongoDB();

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

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
