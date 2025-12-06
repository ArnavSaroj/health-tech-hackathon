import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabaseBackend } from "./config/supabase.js";
import mainRoutes from './routes/mainRoutes.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const time = new Date();

const checkSupabase = async (req, res) => {
  try {
    const { data, error } = await supabaseBackend.auth.getSession();
    console.log(`database connected at ${time}`);
  } catch (error) {
    console.log(error.message);
  }
};

app.use("/api", mainRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await checkSupabase();
  console.log(`Server running on port ${PORT}`);
});
