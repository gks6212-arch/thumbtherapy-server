const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Thumb Therapy Pi payment server is running.");
});

app.post("/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ ok: false, message: "paymentId is required" });
    }

    console.log("[APPROVE]", paymentId);

    return res.json({
      ok: true,
      paymentId,
      message: "Payment approved by server"
    });
  } catch (error) {
    console.error("APPROVE ERROR", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "approve failed"
    });
  }
});

app.post("/complete", async (req, res) => {
  try {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
      return res.status(400).json({ ok: false, message: "paymentId and txid are required" });
    }

    console.log("[COMPLETE]", paymentId, txid);

    return res.json({
      ok: true,
      paymentId,
      txid,
      message: "Payment completed by server"
    });
  } catch (error) {
    console.error("COMPLETE ERROR", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "complete failed"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
