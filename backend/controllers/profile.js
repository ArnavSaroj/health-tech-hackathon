import { supabaseBackend } from "../config/supabase.js";

const utcNow = new Date().toISOString();

export const addProfile = async (req, res) => {
  try {
    const { user_id, fullname, age, height, weight, gender } = req.body();

    if (!user_id || !fullname || !age || !height || !weight || !gender) {
      return res.status(500).json({ error: "req.body missing" });
    }

    const { data, error } = await supabaseBackend.from("profiles").insert({
      id: user_id,
      fullname,
      age: age,
      gender: gender,
      created_at: utcNow,
      height: height,
      weight: weight,
    });

    if (error) {
      return res.status(500).json({ error: error.message});
      }
      


    return res.status(201).json({ message: "insertion successful" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const showProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseBackend
      .from("profiles")
      .select("*")
          .eq("id", id);
      
      if (error) {
          return res.status(500).json({message:error.message})
      }
      
      
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const updatePoints = async (req, res) => {
  try {
    const { id, newPoints } = req.body;

    const { data, error } = await supabaseBackend
      .from("profiles")
      .insert({ points: updatePoints }).eq("id",id);

    if (error) {
      return res.status(500).json({ error: "error in supabase" });
    }

      return res.status(200).json({message:"updated succesfully"})
      
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
