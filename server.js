const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("server running");
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    ok: true,
    service: "thumbtherapy-server",
    timestamp: new Date().toISOString()
  });
});

app.post("/approve", (req, res) => {
  console.log("approve:", req.body);

  return res.status(200).json({
    success: true
  });
});

app.post("/complete", (req, res) => {
  console.log("complete:", req.body);

  return res.status(200).json({
    success: true
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
