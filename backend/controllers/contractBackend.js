import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// Correct JSON import syntax for Node 22
import abi from "../StakeFit.json" with { type: "json" };

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS.trim();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

export default async function updateBlockchainResult(userAddress, isSuccess) {
  try {
    console.log("Calling verifyDay for", userAddress, isSuccess);

    const tx = await contract.verifyDay(userAddress, isSuccess);
    await tx.wait();

    return { ok: true, txHash: tx.hash };

  } catch (err) {
    console.error(err);
    return { ok: false, error: err.message };
  }
}
