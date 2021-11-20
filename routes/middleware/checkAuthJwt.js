const jwt = require("jsonwebtoken");

const checkAuthJwt = (req, res, next) => {
  try {
    const token = res.parsedCookies;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (err) {
    console.error(err);
    const message = "Your session has expired.";
    return res.render("welcome", { message });
  }
};

module.exports = checkAuthJwt;
