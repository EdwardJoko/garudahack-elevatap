// routes
const express = require("express");
const router = express.Router();

// path
const path = require("path");

// welcome page
router.use("/", (req, res) => {
	res.send("Halo Dwiki Giop Edo Sasa Hiya Hiya Hiya!");
});

// auth middleware
const getCookies = require(path.join(__dirname, "middleware", "getCookies"));
const checkAuth = require(path.join(__dirname, "middleware", "checkAuthJwt"));
const authMiddleware = [getCookies, checkAuth];

// error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 handler
router.use((req, res, next) => {
  console.log(req.url);
  res.status(404).send("Sorry can't find that!");
});

module.exports = router;
