// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./auth.css";

// const Register = () => {
//   const navigate = useNavigate();
  
//   const [fullname, setFullname] = useState("");
//   const [email, setEmail] = useState("");      // not used by /addProfile, but kept for UI
//   const [password, setPassword] = useState(""); // same here

//   const [age, setAge] = useState("");
//   const [height, setHeight] = useState("");
//   const [weight, setWeight] = useState("");
//   const [gender, setGender] = useState("");
//   const [error, setError] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // TODO: get this from your auth system (e.g. Supabase user.id after sign-up)
//       const user_id = "TEMP_USER_ID_REPLACE_ME";

//       const res = await axios.post("/addProfile", {
//         user_id,
//         fullname,
//         age: Number(age),
//         height: Number(height),
//         weight: Number(weight),
//         gender,
//       });

//       console.log("Profile created:", res.data);

//       // After profile creation, go to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.error || "Something went wrong while registering."
//       );
//     }
//   };

//   return (
//     <div className="auth-shell">
//       <div className="auth-bg-orb orb-1" />
//       <div className="auth-bg-orb orb-2" />
//       <div className="auth-grid" />

//       <div className="auth-card glass-card">
//         <h1 className="auth-title">Create Account</h1>
//         <p className="auth-subtitle">Stake. Sweat. Grow.</p>

//         <form className="auth-form" onSubmit={handleRegister}>
//           <div className="auth-field">
//             <label>Full Name</label>
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               value={fullname}
//               onChange={(e) => setFullname(e.target.value)}
//               required
//             />
//           </div>

//           <div className="auth-field">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="auth-field">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Create a secure password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div className="auth-field">
//             <label>Age</label>
//             <input
//               type="number"
//               placeholder="Your age"
//               value={age}
//               onChange={(e) => setAge(e.target.value)}
//               required
//             />
//           </div>

//           <div className="auth-field">
//             <label>Height (cm)</label>
//             <input
//               type="number"
//               placeholder="Your height"
//               value={height}
//               onChange={(e) => setHeight(e.target.value)}
//               required
//             />
//           </div>

//           <div className="auth-field">
//             <label>Weight (kg)</label>
//             <input
//               type="number"
//               placeholder="Your weight"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//               required
//             />
//           </div>

//           <div className="auth-field">
//             <label>Gender</label>
//             <select
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//               required
//             >
//               <option value="">Select gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {error && <p className="auth-error">{error}</p>}

//           <button className="auth-btn primary" type="submit">
//             Register →
//           </button>
//         </form>

//         <p className="auth-switch">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Profile fields
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId]=useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  // Load user on page load
useEffect(() => {
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      navigate("/login");
      return;
    }

    const supaUser = data.user;

    // Check if profile exists in backend
    const res = await fetch(`http://localhost:5000/api/checkProfile/${supaUser.id}`);
    const result = await res.json();

    if (result.profile) {
      // User already registered → go to dashboard
      navigate("/dashboard");
      return;
    }

    // Otherwise, allow user to register
    setUser(supaUser);
    setEmail(supaUser.email || "");
    setFullName(supaUser.user_metadata.full_name || "");
    setUserId(supaUser.id);
  };

  fetchUser();
}, []);


  // const handleRegister = async (e) => {
  //   e.preventDefault();

  //   if (!user) return;

  //   try {
  //     const res = await fetch("http://localhost:5000/api/addProfile", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user_id:userId,
  //         fullname,
  //         age,
  //         gender,
  //         height,
  //         weight,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!data.ok) {
  //       alert("Error creating profile");
  //       return;
  //     }

  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Profile creation error:", err);
  //   }
  // };
  const handleRegister = async (e) => {
  e.preventDefault();

  if (!user) return;

  try {
    const res = await fetch("http://localhost:5000/api/addProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        fullname,
        age,
        gender,
        height,
        weight,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      alert(data.error || "Error creating profile");
      return;
    }

    navigate("/dashboard");
  } catch (err) {
    console.error("Profile creation error:", err);
    alert("Something went wrong while creating profile");
  }
  navigate("/dashboard");
};


  if (!user) return <p>Loading...</p>;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">Complete Your Profile</h1>
        <p className="auth-subtitle">Stake. Sweat. Grow.</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email (from Google)</label>
            <input type="email" value={email} disabled />
          </div>

          <div className="auth-field">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="auth-field">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn primary" type="submit">
            Finish Registration →
          </button>
        </form>
      </div>
    </div>
  );
};



export default Register;
