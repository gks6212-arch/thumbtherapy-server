const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("server running");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    keyExists: !!process.env.PI_API_KEY,
    time: new Date().toISOString()
  });
});

/* =========================
   승인 (approve)
========================= */
app.post("/approve", async (req, res) => {
  try {
    console.log("approve 요청:", req.body);

    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId 없음"
      });
    }

    if (!PI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "PI_API_KEY 없음"
      });
    }

    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        },
        timeout: 10000
      }
    );

    console.log("approve 성공:", result.data);

    return res.json({
      success: true,
      data: result.data
    });
  } catch (err) {
    console.error("approve 실패:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

/* =========================
   완료 (complete)
========================= */
app.post("/complete", async (req, res) => {
  try {
    console.log("complete 요청:", req.body);

    const { paymentId, txid } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId 없음"
      });
    }

    if (!txid) {
      return res.status(400).json({
        success: false,
        error: "txid 없음"
      });
    }

    if (!PI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "PI_API_KEY 없음"
      });
    }

    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        },
        timeout: 10000
      }
    );

    console.log("complete 성공:", result.data);

    return res.json({
      success: true,
      data: result.data
    });
  } catch (err) {
    console.error("complete 실패:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
