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
         }
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
