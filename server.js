const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("server running");
});

app.post("/approve", async (req, res) => {
  try {
    console.log("approve:", req.body);
    res.json({ success: true });
  } catch (error) {
    console.error("approve error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "approve failed"
    });
  }
});

app.post("/complete", async (req, res) => {
  try {
    console.log("complete:", req.body);
    res.json({ success: true });
  } catch (error) {
    console.error("complete error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "complete failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
