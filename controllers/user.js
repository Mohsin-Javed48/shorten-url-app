const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

async function handleCreateUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: { name, email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleLoginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create session
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);

    // Return user data (excluding password)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleCreateUser,
  handleLoginUser,
};
