const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const fraudRoutes = require("./routes/fraud");
const creditRoutes = require("./routes/credit");
const complianceRoutes = require("./routes/compliance");
const riskRoutes = require("./routes/risk");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/fraud", fraudRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/risk", riskRoutes);

const docsRoutes = require("./routes/docs");
app.use("/api/docs", docsRoutes);

app.get("/api/health", async (req, res) => {
  const axios = require("axios");
  const services = [
    { name: "fraud",      url: "http://localhost:8001/health" },
    { name: "credit",     url: "http://localhost:8002/health" },
    { name: "compliance", url: "http://localhost:8003/health" },
    { name: "risk",       url: "http://localhost:8004/health" },
  ];

  const results = await Promise.allSettled(
    services.map(s => axios.get(s.url).then(r => ({ name: s.name, status: "ok" })))
  );

  const statuses = results.map((r, i) => ({
    service: services[i].name,
    status: r.status === "fulfilled" ? "ok" : "down"
  }));

  res.json({ gateway: "ok", services: statuses });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));