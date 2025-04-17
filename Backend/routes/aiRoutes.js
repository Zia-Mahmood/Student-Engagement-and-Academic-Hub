const express = require("express");
const axios   = require("axios");
const router  = express.Router();

router.post("/overview", async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post("http://localhost:8000/search", { query });
    return res.json(response.data);
  } catch (err) {
    console.error("AI service error:", err.message);
    return res.status(500).json({ error: "AI service unavailable" });
  }
});

module.exports = router;
