const getCookies = (req, res, next) => {
  try {
    // if there's no cookie
    if (!req.headers.cookie) {
      const message = "Your session has expired.";
      return res.render("welcome", { message });
    }
    // if the cookie exists
    else {
      const parsedCookies = req.headers.cookie.split("=")[1];
      res.parsedCookies = parsedCookies;
      next();
    }
  } catch (err) {
    console.error(err);
    const message = "Your session has expired.";
    return res.render("welcome", { message });
  }
};

module.exports = getCookies;
