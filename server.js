const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 기본 확인용
app.get("/", (req, res) => {
  res.status(200).send("server running");
});

// 상태 확인용
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "thumbtherapy-server",
    timestamp: new Date().toISOString()
  });
});

// Pi approve
app.post("/approve", (req, res) => {
  console.log("approve:", req.body);

  // 테스트 단계에서는 즉시 승인 응답
  return res.status(200).json({
    success: true
  });
});

// Pi complete
app.post("/complete", (req, res) => {
  console.log("complete:", req.body);

  // 테스트 단계에서는 즉시 완료 응답
  return res.status(200).json({
    success: true
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
