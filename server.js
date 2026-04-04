const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY || "";
const PI_API_BASE = "https://api.minepi.com/v2";

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

/**
 * 테스트 모드:
 * PI_API_KEY가 없으면 일단 빠르게 success 반환
 * 실제 승인/완료를 하려면 Railway Variables에 PI_API_KEY를 넣어야 함
 */
app.post("/approve", async (req, res) => {
  try {
    const { paymentId, accessToken } = req.body || {};

    console.log("approve request:", req.body);

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "paymentId is required"
      });
    }

    // 테스트 fallback
    if (!PI_API_KEY) {
      return res.status(200).json({
        success: true,
        mode: "mock"
      });
    }

    const response = await fetch(`${PI_API_BASE}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
        ...(accessToken ? { "X-User-Access-Token": accessToken } : {})
      },
      body: JSON.stringify({})
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("approve failed:", data);
      return res.status(response.status).json({
        success: false,
        message: data.error || data.message || "approve failed",
        details: data
      });
    }

    console.log("approve success:", data);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("approve error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "approve failed"
    });
  }
});

app.post("/complete", async (req, res) => {
  try {
    const { paymentId, txid, accessToken } = req.body || {};

    console.log("complete request:", req.body);

    if (!paymentId || !txid) {
      return res.status(400).json({
        success: false,
        message: "paymentId and txid are required"
      });
    }

    // 테스트 fallback
    if (!PI_API_KEY) {
      return res.status(200).json({
        success: true,
        mode: "mock"
      });
    }

    const response = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
        ...(accessToken ? { "X-User-Access-Token": accessToken } : {})
      },
      body: JSON.stringify({ txid })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("complete failed:", data);
      return res.status(response.status).json({
        success: false,
        message: data.error || data.message || "complete failed",
        details: data
      });
    }

    console.log("complete success:", data);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("complete error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "complete failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
