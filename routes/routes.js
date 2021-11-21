// routes
const express = require("express");
const router = express.Router();

// path
const path = require("path");

// authentication
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// database
const User = require(path.join(__dirname, "..", "database", "user_model"));

// welcome page
router.get("/", (req, res) => {
	res.render("homepage");
});

router.get("/signin", (req, res) => {
	const message = "";

	res.render("signin", { message });
});

router.post("/signin", async (req, res) => {

	res.redirect("/signin");
});

router.get("/signup", (req, res) => {
	const message = "";

	res.render("signup", { message });
});

router.post("/signup", async (req, res) => {
	try {
		const email = req.body.email.toLowerCase();
		const { phoneNumber } = req.body;
		const { businessName } = req.body;
		const { password } = req.body;

		const user = await User.findOne({ email });

		// email already used
		if (user) {
			res.redirect("/signup/email-used");
		}
		else {
			const hashedPassword = await bcrypt.hash(password, 10);

			User.create({
				email,
				phoneNumber,
				businessName,
				password: hashedPassword,
			});

			res.redirect("/signup/success");
		}
	} catch (err) {
		console.log(err);
		res.redirect("/signup/error");
	}
});

router.get("/signup/:status", (req, res) => {
	const status = req.params.status;

	let message = "";
	if (status == "error") {
		message = "There's an error";
	}
	else if (status == "success") {
		message = "Success creating account.";
	}
	else if (status == "email-used") {
		message = "Email already used.";
	}

	res.render("signup", { message });
});

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
