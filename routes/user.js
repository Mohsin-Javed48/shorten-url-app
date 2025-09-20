const express = require("express");
const { handleCreateUser, handleLoginUser } = require("../controllers/user");
const router = express.Router();

// Signup route
router.post("/signup", handleCreateUser);

// Login route
router.post("/login", handleLoginUser);

module.exports = router;
