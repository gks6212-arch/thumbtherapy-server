import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    console.log("승인 요청:", paymentId);

    // 실제 Pi 서버 승인 (테스트용 구조)
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    console.log("완료:", paymentId, txid);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("서버 실행중 3000");
});
