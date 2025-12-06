// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./auth.css";
// import { FaGoogle } from "react-icons/fa";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // TODO: Replace with real backend login API
//     // axios.post("/login", { email, password })
//     //   .then(res => navigate("/dashboard"))

//     navigate("/dashboard");
//   };

//   return (
//     <div className="auth-shell">
//       <div className="auth-bg-orb orb-1" />
//       <div className="auth-bg-orb orb-2" />
//       <div className="auth-grid" />

//       <div className="auth-card">
//         <h1 className="auth-title">Welcome Back</h1>
//         <p className="auth-subtitle">Stake. Sweat. Grow.</p>

//         <form className="auth-form" onSubmit={handleLogin}>
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
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button className="auth-btn primary" type="submit">
//             Login →
//           </button>
//           <button type="button" className="auth-btn primary"  >
//             Continue with Google <FaGoogle />
//           </button>
//         </form>

//         <p className="auth-switch">
//           New here? <Link to="/register">Create an account</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Email login error:", error);
      return;
    }

    navigate("/dashboard");
  };

  // Google OAuth login
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/register",
      },
    });

    if (error) {
      console.error("Google login error:", error);
      return;
    }

    // For OAuth, Supabase will redirect; you usually don't navigate manually here.
  };

  return (
    <div className="auth-shell">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />
      <div className="auth-grid" />

      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Stake. Sweat. Grow.</p>

        <form className="auth-form" onSubmit={handleEmailLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn primary" type="submit">
            Login →
          </button>

          <button
            type="button"
            className="auth-btn primary"
            onClick={handleGoogleLogin}
          >
            Continue with Google <FaGoogle />
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;