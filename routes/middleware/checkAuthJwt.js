const jwt = require("jsonwebtoken");

const checkAuthJwt = (req, res, next) => {
  try {
    const token = res.parsedCookies;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.redirect("/signin/expired");
  }
};

module.exports = checkAuthJwt;
