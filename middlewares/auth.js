const { getUser } = require("../service/auth");

async function restrictToLoggedInUser(req, res, next) {
  const userUid = req.cookies.uid;
  console.log("User UID:", userUid);

  if (!userUid) {
    // Check if this is an API request (expects JSON) or page request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Authentication required" });
    }
    return res.redirect("/login");
  }

  const user = getUser(userUid);
  console.log("User found:", user);

  if (!user) {
    // Check if this is an API request (expects JSON) or page request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Invalid session" });
    }
    return res.redirect("/login");
  }

  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedInUser,
};
