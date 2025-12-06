import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");      // not used by /addProfile, but kept for UI
  const [password, setPassword] = useState(""); // same here

  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: get this from your auth system (e.g. Supabase user.id after sign-up)
      const user_id = "TEMP_USER_ID_REPLACE_ME";

      const res = await axios.post("/addProfile", {
        user_id,
        fullname,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender,
      });

      console.log("Profile created:", res.data);

      // After profile creation, go to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Something went wrong while registering."
      );
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />
      <div className="auth-grid" />

      <div className="auth-card glass-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Stake. Sweat. Grow.</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Age</label>
            <input
              type="number"
              placeholder="Your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Height (cm)</label>
            <input
              type="number"
              placeholder="Your height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Weight (kg)</label>
            <input
              type="number"
              placeholder="Your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
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
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn primary" type="submit">
            Register →
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
