const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerteNewShortUrl(req, res) {
  try {
    const shortId = nanoid(8);
    if (!req.body || !req.body.url) {
      return res.status(400).json({ error: "url is required" });
    }

    const urlData = {
      shortId: shortId,
      redirectURL: req.body.url,
      visitHistory: [],
    };

    // Add user ID if logged in
    if (req.user) {
      urlData.createdBy = req.user._id;
    }

    await URL.create(urlData);

    return res.json({ id: shortId });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleRedirectUrl(req, res) {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerteNewShortUrl,
  handleRedirectUrl,
};
