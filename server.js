const express = require("express");
const app = express();

app.use(express.json());

// ✅ 루트 (이거 중요)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 승인
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;
  console.log("승인 요청:", paymentId);

  res.json({ success: true });
});

// 완료
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;
  console.log("완료 요청:", paymentId, txid);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("서버 실행:", PORT);
});
