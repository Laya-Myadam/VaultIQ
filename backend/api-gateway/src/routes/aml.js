const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const URL = () => (process.env.AI_URL || "http://localhost:8080") + "/aml";

router.post("/analyze-narrative", async (req, res) => {
  try {
    const r = await axios.post(`${URL()}/analyze-narrative`, req.body, { timeout: 45000 });
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json({ error: e.response?.data?.detail || e.message });
  }
});

router.post("/screen-customer", async (req, res) => {
  try {
    const r = await axios.post(`${URL()}/screen-customer`, req.body, { timeout: 45000 });
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json({ error: e.response?.data?.detail || e.message });
  }
});

module.exports = router;
