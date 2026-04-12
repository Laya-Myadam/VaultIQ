const express = require("express");
const axios = require("axios");
const router = express.Router();

const CREDIT_URL = "http://localhost:8002";

router.post("/evaluate", async (req, res) => {
  try {
    const response = await axios.post(`${CREDIT_URL}/evaluate`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Credit service unavailable", detail: err.message });
  }
});

router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${CREDIT_URL}/health`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Credit service unavailable" });
  }
});

module.exports = router;