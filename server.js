const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});
app.options("*", (req, res) => {
    res.sendStatus(200);
});
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
console.log("서버 실행:", PORT);
});
