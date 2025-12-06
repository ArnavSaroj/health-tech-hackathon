import updateBlockchainResult from "./contractBackend.js";

const verifyDay= async (req, res) => {
  const { user, isSuccess } = req.body;
  
  if (!user) {
    return res.status(400).json({ ok: false, error: "Missing 'user' address in body" });
  }

  const result = await updateBlockchainResult(user, isSuccess);

  res.json(result);
};
export default verifyDay;