const express = require("express");
const axios = require("axios");
const router = express.Router();

const RISK_URL = process.env.RISK_URL || "http://localhost:8004";

router.post("/analyze", async (req, res) => {
  try {
    const response = await axios.post(`${RISK_URL}/analyze`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Risk service unavailable", detail: err.message });
  }
});

router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${RISK_URL}/health`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Risk service unavailable" });
  }
});

module.exports = router;