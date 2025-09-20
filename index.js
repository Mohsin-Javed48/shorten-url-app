const express = require("express");
const path = require("path");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const { connectToMongoDB } = require("./config/config");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;

// Middleware
app.use(express.json());

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//cookie parser
app.use(cookieParser());

connectToMongoDB("mongodb://localhost:27017/shorten-url-app")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Routes
app.get("/", async (req, res) => {
  try {
    // Get user from session if logged in
    const userUid = req.cookies.uid;
    let urls = [];

    if (userUid) {
      const { getUser } = require("./service/auth");
      const user = getUser(userUid);
      if (user) {
        urls = await URL.find({ createdBy: user._id }).sort({ createdAt: -1 });
      }
    }

    res.render("home", { urls: urls || [] });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.render("home", { urls: [] });
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.use("/url", urlRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
