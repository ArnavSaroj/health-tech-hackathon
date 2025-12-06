import express from "express";

const router = express.Router();

// GET /api/secure-ws-url?wallet=0x...
router.get("/secure-ws-url", (req, res) => {
  const { wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: "Missing wallet" });
  }

  const apiKey =
    process.env.SF_AI_ORACLE_KEY || "SF_AI_ORACLE_KEY_0987654321";

  const wsUrl = `ws://localhost:8001/ws/live_verify/${wallet}?api_key=${apiKey}`;

  return res.json({ wsUrl });
});

export default router;
