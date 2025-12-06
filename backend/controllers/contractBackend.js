import { ethers } from "ethers";

const CONTRACT_ABI = [
    "function verifyDay(address _user, bool _isValid) external"
];
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS.trim();



const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

export default async function updateBlockchainResult(userAddress, isSuccess) {
  try {
    console.log("Backend signer address:", wallet.address);
    console.log("Calling verifyDay for", userAddress, isSuccess);
  const network = await provider.getNetwork();
console.log("Network:", network);
const balance = await provider.getBalance(wallet.address);
console.log("Signer balance (ETH):", ethers.formatEther(balance));;

    const tx = await contract.verifyDay(userAddress, isSuccess);
    await tx.wait();

    return { ok: true, txHash: tx.hash };

  } catch (err) {
    console.error(err);
    return { ok: false, error: err };
  }
}
