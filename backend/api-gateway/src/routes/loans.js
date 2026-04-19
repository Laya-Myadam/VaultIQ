const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const URL = () => (process.env.AI_URL || "http://localhost:8080") + "/loans";

router.post("/monitor", async (req, res) => {
  try {
    const r = await axios.post(`${URL()}/monitor`, req.body, { timeout: 60000 });
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json({ error: e.response?.data?.detail || e.message });
  }
});

module.exports = router;
