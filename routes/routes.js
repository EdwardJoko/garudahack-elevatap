// routes
const express = require("express");
const router = express.Router();
const businessLegaltyRoute = require('./businessLegaltyRoute/businessLegaltyRoute')

// path
const path = require("path");

// welcome page
router.get("/", (req, res) => {
	res.render("signin");
});

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.use('/formBusiness', businessLegaltyRoute)

// auth middleware
const getCookies = require(path.join(__dirname, "middleware", "getCookies"));
const checkAuth = require(path.join(__dirname, "middleware", "checkAuthJwt"));
const authMiddleware = [getCookies, checkAuth];

// prevent get favicon.ico
router.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  return next();
});

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
