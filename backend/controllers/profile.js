import { supabaseBackend } from "../config/supabase.js";

const utcNow = new Date().toISOString();

// export const addProfile = async (req, res) => {
//   try {
//     const { user_id, fullname, age, height, weight, gender } = req.body;

//     if (!user_id || !fullname || !age || !height || !weight || !gender) {
//       return res.status(500).json({ error: "req.body missing" });
//     }

//     const { data, error } = await supabaseBackend.from("profiles").insert({
//       id: user_id,
//       full_name:fullname,
//       age: age,
//       gender: gender,
//       created_at: utcNow,
//       height: height,
//       weight: weight,
//     });

//     if (error) {
//       return res.status(500).json({ error: error.message});
//       }
      


//     return res.status(201).json({ message: "insertion successful" });
//   } catch (error) {
//     return res.status(500).json(error.message);
//   }
// };
export const addProfile = async (req, res) => {
  try {
    console.log("addProfile body:", req.body);

    const { user_id, fullname, age, height, weight, gender } = req.body;

    if (!user_id || !fullname || !age || !height || !weight || !gender) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }

    const utcNow = new Date().toISOString(); // ✅ define utcNow

    const { data, error } = await supabaseBackend
      .from("profiles")
      .insert({
        id: user_id,
        full_name: fullname,      // ✅ matches your column
        age: Number(age),         // (optional) cast to number
        gender,
        created_at: utcNow,
        height: Number(height),
        weight: Number(weight),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res
      .status(201)
      .json({ ok: true, message: "insertion successful", profile: data });
  } catch (error) {
    console.error("addProfile exception:", error);
    return res
      .status(500)
      .json({ ok: false, error: error.message || "Internal server error" });
  }
};
export const checkProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseBackend
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.json({ ok: true, profile: data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
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
