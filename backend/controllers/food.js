import { supabaseBackend } from "../config/supabase.js";

const now = new Date();
const todayStartUTC = new Date(
  Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0
  )
);

const utcNow = new Date().toISOString();

export const getFood = async (req, res) => {
  try {
    const { user_id } = req.params();

    const { data, error } = await supabaseBackend
      .from("food_entries")
      .select()
      .eq("id", user_id);

    if (error) {
      return res.status(500).json({message:error.message});
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getTodayFood = async (req, res) => {
  try {
    const { user_id } = req.body();

    const { data, error } = await supabaseBackend
      .from("food_entries")
      .select("*")
      .eq("id", user_id)
      .gte("created_at", todayStartUTC.toISOString());

    if (error) {
      return res.status(500).json({message:error.message});
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const addFood = async (req, res) => {
  try {
    const { user_id, food_name, size, calories } = req.body();

    if (!user_id || !food_name || !size || !calories) {
      return res.status(500).json({ message: "missing fields" });
    }

    const { data, error } = await supabaseBackend
      .from("food_entry")
      .insert({
        id: user_id,
        size: size,
        calories: calories,
        created_at: utcNow,
      });
    if (error) {
      return res.status(500).json(error.message);
    }
    return res.status(201).json({ message: "insertion successfull" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// TODO get all food ,get only together,calories wrapper
// NOTE calories reaminign
