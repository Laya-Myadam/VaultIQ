const express = require("express");
const axios = require("axios");
const router = express.Router();

const COMPLIANCE_URL = "http://localhost:8003";

router.post("/query", async (req, res) => {
  try {
    const response = await axios.post(`${COMPLIANCE_URL}/query`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Compliance service unavailable", detail: err.message });
  }
});

router.post("/check-transaction", async (req, res) => {
  try {
    const response = await axios.post(`${COMPLIANCE_URL}/check-transaction`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Compliance service unavailable", detail: err.message });
  }
});

router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${COMPLIANCE_URL}/health`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Compliance service unavailable" });
  }
});

module.exports = router;