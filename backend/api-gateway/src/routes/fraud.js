const express = require("express");
const axios = require("axios");
const router = express.Router();

const FRAUD_URL = process.env.FRAUD_URL || "http://localhost:8001";


router.post("/analyze", async (req, res) => {
  try {
    const response = await axios.post(`${FRAUD_URL}/analyze`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Fraud service unavailable", detail: err.message });
  }
});

router.post("/batch", async (req, res) => {
  try {
    const response = await axios.post(`${FRAUD_URL}/batch`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Fraud service unavailable", detail: err.message });
  }
});

router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${FRAUD_URL}/health`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Fraud service unavailable" });
  }
});

module.exports = router;