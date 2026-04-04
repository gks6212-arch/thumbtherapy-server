const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

app.get("/", (req, res) => {
  res.send("server running");
});

/* ===================== */
/* 승인 (approve) */
/* ===================== */
app.post("/approve", async (req, res) => {
  try {
    console.log("approve 요청:", req.body);

    const { paymentId } = req.body;

    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        }
      }
    );

    console.log("approve 성공:", result.data);

    res.json({ success: true });

  } catch (err) {
    console.error("approve 실패:", err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

/* ===================== */
/* 완료 (complete) */
/* ===================== */
app.post("/complete", async (req, res) => {
  try {
    console.log("complete 요청:", req.body);

    const { paymentId, txid } = req.body;

    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        }
      }
    );

    console.log("complete 성공:", result.data);

    res.json({ success: true });

  } catch (err) {
    console.error("complete 실패:", err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running:", PORT));
