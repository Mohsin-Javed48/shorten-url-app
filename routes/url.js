const express = require("express");
const { restrictToLoggedInUser } = require("../middlewares/auth");

const {
  handleGenerteNewShortUrl,
  handleRedirectUrl,
} = require("../controllers/url");
const URL = require("../models/url");
const router = express.Router();

// Allow anonymous URL creation
router.post("/", handleGenerteNewShortUrl);

router.get("/:shortId", handleRedirectUrl);

module.exports = router;
