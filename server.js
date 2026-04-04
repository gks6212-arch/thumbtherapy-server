const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PI_API_KEY = process.env.PI_API_KEY;
const PI_API_BASE = process.env.PI_API_BASE || "https://api.minepi.com/v2";

if (!PI_API_KEY) {
  console.warn("PI_API_KEY is missing. Payment approve/complete will fail.");
}

async function piPost(path, body = null) {
  const res = await fetch(`${PI_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Key ${PI_API_KEY}`
    },
    body: body ? JSON.stringify(body) : null
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`Pi API ${res.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

app.get("/", (req, res) => {
  res.send("Thumb Therapy Pi payment server is running.");
});

app.post("/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        ok: false,
        message: "paymentId is required"
      });
    }

    const paymentDTO = await piPost(`/payments/${paymentId}/approve`);

    console.log("[APPROVE OK]", paymentId, paymentDTO);

    return res.json({
      ok: true,
      paymentId,
      paymentDTO
    });
  } catch (error) {
    console.error("[APPROVE ERROR]", error);
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
      return res.status(400).json({
        ok: false,
        message: "paymentId and txid are required"
      });
    }

    const paymentDTO = await piPost(`/payments/${paymentId}/complete`, {
      txid
    });

    console.log("[COMPLETE OK]", paymentId, txid, paymentDTO);

    return res.json({
      ok: true,
      paymentId,
      txid,
      paymentDTO
    });
  } catch (error) {
    console.error("[COMPLETE ERROR]", error);
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
