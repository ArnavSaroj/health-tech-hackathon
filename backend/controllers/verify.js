import updateBlockchainResult from "./contractBackend.js";

const verifyDay = async (req, res) => {
  try {
    const { user, isSuccess } = req.body;

    if (!user) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing 'user' address in body" });
    }

    const result = await updateBlockchainResult(user, isSuccess);

    return res.json({
      ok: true,
      ...result, // e.g., txHash, blockNumber, etc.
    });
  } catch (err) {
    console.error("verifyDay error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
};

export default verifyDay;
