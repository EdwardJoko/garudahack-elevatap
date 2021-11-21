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

// home page
router.get("/", (req, res) => {
	const login = false;
	res.render("homepage", { login });
});

// login
router.get("/signin", (req, res) => {
	const message = "";
	const login = false;

	res.render("signin", { message, login });
});

router.post("/signin", async (req, res) => {
	try {
		const email = req.body.email.toLowerCase();
		const { password } = req.body;

		const user = await User.findOne({ email });

		// user is not exist
		if (!user) {
			res.redirect("/signin/auth-fail");
		}

		bcrypt.compare(password, user.password, (err, result) => {
			if (result) {
				const token = jwt.sign(
					{ email }, process.env.JWT_KEY, { expiresIn: "10h" }
				);

				res.cookie("Bearer", token, {
					maxAge: 36000000,
					sameSite: true,
					httpOnly: true,
					secure: true,
				});

				return res.redirect("/homepage");
			}

		});

	}	catch (err) {
		console.log(err);
		res.redirect("/signin/error");
	}
});

router.get("/signin/:status", (req, res) => {
	const status = req.params .status;
	const login = false;

	let message = "";
	if (status == "error") {
		message = "There's an error";
	}
	else if (status == "auth-fail") {
		message = "Authentication failed.";
	} else if (status == "expired") {
		message = "Please Sign In. Your session is expired.";
	}

	res.render("signin", { message, login });
});

// create account
router.get("/signup", (req, res) => {
	const message = "";
	const login = false;

	res.render("signup", { message, login });
});

router.post("/signup", async (req, res) => {
	try {
		const email = req.body.email.toLowerCase();
		const phoneNumber = req.body.phoneNumber.toString();
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
	const login = false;

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

	res.render("signup", { message, login });
});

// auth middleware
const getCookies = require(path.join(__dirname, "middleware", "getCookies"));
const checkAuth = require(path.join(__dirname, "middleware", "checkAuthJwt"));
const authMiddleware = [getCookies, checkAuth];

router.get("/homepage", authMiddleware, (req, res) => {
	const login = true;

	res.render("homepage", { login });
});

router.get("/businessLegality1", authMiddleware, (req, res) => {
	const login = true;
  res.render('businessLegality/businessLegality1', { login })
});

router.get("/businessLegality2", authMiddleware, (req, res) => {
	const login = true;
  res.render('businessLegality/businessLegality2', { login })
});

router.get("/businessLegality3", authMiddleware, (req, res) => {
	const login = true;
  res.render('businessLegality/businessLegality3', { login })
});

router.get("/businessLegality4", authMiddleware, (req, res) => {
	const login = true;
  res.render('businessLegality/businessLegalty4', { login })
});

router.get("/businessLegality5", authMiddleware, (req, res) => {
	const login = true;
  res.render('businessLegality/businessLegalty5', { login })
});

router.get("/mentor-consultation",authMiddleware, (req, res) => {
	const login = true;
	res.render("mentorConsultation/mentorConsultation1.ejs", { login })
});

router.get("/mentor-consultation/free",authMiddleware, (req, res) => {
	const login = true;
	res.render("mentorConsultation/mentorConsult2_free.ejs", { login })
});

router.get("/mentor-consultation/paid",authMiddleware, (req, res) => {
	const login = true;
	res.render("mentorConsultation/mentorConsult2_paid.ejs", { login })
});

router.get("/mentor-consultation/chat-room",authMiddleware, (req, res) => {
	const login = true;
	res.render("mentorConsultation/mentorConsult3.ejs", { login })
});

router.get("/signout", (req, res) => {
	res.clearCookie("Bearer", {
		sameSite: true,
		httpOnly: true,
		secure: true,
	});

	res.redirect("/");
});

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
