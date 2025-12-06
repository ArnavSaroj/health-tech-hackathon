import updateBlockchainResult from "./contractBackend.js";

const verifyDay= async (req, res) => {
  const { user, isSuccess } = req.body;

  const result = await updateBlockchainResult(user, isSuccess);

  res.json(result);
};
export default verifyDay;