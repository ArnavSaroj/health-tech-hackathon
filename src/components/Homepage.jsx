// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./homepage.css";
// // Uncomment and fix the path if you add the logo file to your project
// // import logo from "../assets/logo.png";

// const Homepage = () => {
//   const navigate = useNavigate();

//   const scrollToAuth = () => {
//     const el = document.getElementById("auth-section");
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleExploreDemo = () => {
//     // Optional: direct access to dashboard (you can remove if you don't want this)
//     navigate("/dashboard");
//   };

//   return (
//     <div className="home-shell">
//       {/* Decorative background */}
//       <div className="home-bg-orb home-bg-orb-1" />
//       <div className="home-bg-orb home-bg-orb-2" />
//       <div className="home-bg-grid" />

//       {/* HERO SECTION */}
//       <section className="home-hero" id="top">
//         <header className="home-header">
//           <div className="home-brand">
//             <div className="home-logo-orb">
//               {/* If you add an actual logo, drop an <img> inside here */}
//               {/* <img src={logo} alt="Fit-In-Healix logo" /> */}
//             </div>
//             <span className="home-brand-name">Fit-In-Healix</span>
//           </div>

//           <nav className="home-nav">
//             <Link to="/login" className="home-nav-link">
//               Login
//             </Link>
//             <Link to="/register" className="home-nav-cta">
//               Join Now
//             </Link>
//           </nav>
//         </header>

//         <div className="home-hero-content">
//           <div className="home-hero-text">
//             <p className="home-badge">Fitness • Accountability • Fun</p>

//             <h1 className="home-title">
//               <span className="home-title-main">Stake</span>{" "}
//               <span className="home-title-main">Sweat</span>{" "}
//               <span className="home-title-main">Grow</span>
//             </h1>

//             <p className="home-subtitle">
//               Lock in your fitness goals, track every workout, and grow with a
//               community that keeps you accountable — all from the phone in your
//               hand.
//             </p>

//             <div className="home-hero-actions">
//               <button className="home-primary-btn" onClick={scrollToAuth}>
//                 Get Started
//               </button>

//               <button
//                 type="button"
//                 className="home-ghost-btn"
//                 onClick={handleExploreDemo}
//               >
//                 Explore Dashboard Demo
//               </button>
//             </div>

//             <div className="home-hero-meta">
//               <span>⚡ Stake your commitment</span>
//               <span>📱 Log workouts on the go</span>
//               <span>📈 Watch your progress grow</span>
//             </div>
//           </div>

//           {/* Workout + mobile visual */}
//           <div className="home-hero-visual" aria-hidden="true">
//             <div className="home-hero-ring" />
//             <div className="home-hero-runner" />
//             <div className="home-phone-card">
//               <div className="home-phone-screen">
//                 <div className="home-phone-header">Today&apos;s Session</div>
//                 <div className="home-phone-chip-row">
//                   <span className="chip">🏃‍♂️ 5K Run</span>
//                   <span className="chip">💪 Push</span>
//                 </div>
//                 <div className="home-phone-metrics">
//                   <div>
//                     <span className="metric-label">Calories</span>
//                     <span className="metric-value">420</span>
//                   </div>
//                   <div>
//                     <span className="metric-label">Streak</span>
//                     <span className="metric-value">7 days</span>
//                   </div>
//                 </div>
//                 <div className="home-phone-cta">Log Workout</div>
//               </div>
//             </div>
//             <div className="home-hero-avatars">
//               <div className="avatar-badge">👟</div>
//               <div className="avatar-badge">📱</div>
//               <div className="avatar-badge">🏋️</div>
//             </div>
//           </div>
//         </div>

//         {/* Scroll indicator */}
//         <button className="scroll-indicator" onClick={scrollToAuth}>
//           Scroll to join
//           <span className="scroll-arrow">↓</span>
//         </button>
//       </section>

//       {/* AUTH SECTION */}
//       <section className="home-auth-section" id="auth-section">
//         <div className="home-auth-inner">
//           <div className="home-auth-intro">
//             <h2>Ready to commit?</h2>
//             <p>
//               Create an account or log in to access your personalized dashboard,
//               stake challenges, food ledger, and workout history.
//             </p>
//           </div>

//           <div className="home-auth-grid">
//             <div className="home-auth-card">
//               <h3>New here?</h3>
//               <p>
//                 Build your fitness identity, set stakes, and start tracking your
//                 workouts in minutes.
//               </p>
//               <ul className="home-auth-list">
//                 <li>✅ Create goals with real stakes</li>
//                 <li>✅ Log workouts right from your phone</li>
//                 <li>✅ Track food, calories & progress</li>
//               </ul>
//               <Link to="/register" className="home-auth-btn primary">
//                 Register &rarr;
//               </Link>
//             </div>

//             <div className="home-auth-card">
//               <h3>Already a member?</h3>
//               <p>
//                 Jump back into your dashboard and pick up where you left off —
//                 your streak is waiting.
//               </p>
//               <ul className="home-auth-list">
//                 <li>🔥 Continue your streaks</li>
//                 <li>📊 View dashboard insights</li>
//                 <li>🥗 Update your food ledger</li>
//               </ul>
//               <Link to="/login" className="home-auth-btn outline">
//                 Login &rarr;
//               </Link>
//             </div>
//           </div>

//           <p className="home-auth-footnote">
//             After you login or register, you&apos;ll be taken straight to your{" "}
//             <strong>/dashboard</strong> to start staking, sweating and growing.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Homepage;







// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./homepage.css";

// const Homepage = () => {
//   const navigate = useNavigate();

//   const scrollToAuth = () => {
//     const el = document.getElementById("auth-section");
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleExploreDemo = () => {
//     navigate("/dashboard");
//   };

//   // I customized the ticker to match your Fitness theme
//   // instead of random stock symbols.
//   const tickerData = [
//     { symbol: "CALORIES", val: "-450", dir: "down" }, // Burning calories = Red/Down (good context)
//     { symbol: "STREAK", val: "+7 DAYS", dir: "up" },
//     { symbol: "STEPS", val: "+10,420", dir: "up" },
//     { symbol: "SLEEP", val: "+8.2 HRS", dir: "up" },
//     { symbol: "WEIGHT", val: "-0.5 KG", dir: "down" },
//     { symbol: "WATER", val: "+3.0 L", dir: "up" },
//   ];

//   return (
//     <div className="stock-theme-shell">
//       {/* NAVBAR */}
//       <nav className="stock-nav">
//         <div className="nav-left">
//           {/* Your Brand Name */}
//           <h1 className="nav-brand">Fit-In-Healix</h1>
//         </div>
        
//         {/* These buttons are purely decorative based on the image style, 
//             but you can link them if you have pages */}
//         <div className="nav-center">
//           <button className="nav-pill-btn" onClick={scrollToAuth}>Start</button>
//           <button className="nav-pill-btn">Features</button>
//         </div>

//         <div className="nav-right">
//           <Link to="/login" className="nav-blue-btn">
//             VERIFIER ACCESS (LOGIN)
//           </Link>
//         </div>
//       </nav>

//       {/* TICKER TAPE BAR */}
//       <div className="ticker-bar">
//         <div className="ticker-track">
//           {[...tickerData, ...tickerData].map((item, index) => (
//             <div key={index} className="ticker-item">
//               <span className="ticker-symbol">{item.symbol}</span>
//               <span className={`ticker-val ${item.dir}`}>
//                 {item.val}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* HERO SECTION */}
//       <section className="stock-hero" id="top">
//         <div className="hero-content">
//           <p className="hero-badge">Fitness • Accountability • Fun</p>
          
//           {/* Your "Stake Sweat Grow" text styled like "Stake on Performance" */}
//           <h1 className="hero-title">
//             <span className="text-red">STAKE</span> YOUR CLAIM.
//             <br />
//             SWEAT & <span className="text-green">GROW.</span>
//           </h1>

//           <p className="hero-subtitle">
//             Lock in your fitness goals, track every workout, and grow with a
//             community that keeps you accountable — all from the phone in your
//             hand.
//           </p>

//           <div className="hero-actions">
//             <button className="wallet-btn" onClick={scrollToAuth}>
//                GET STARTED
//             </button>

//             <button className="ghost-btn" onClick={handleExploreDemo}>
//               EXPLORE DEMO
//             </button>
//           </div>

//           <div className="hero-meta-row">
//             <span>⚡ Stake commitment</span>
//             <span>📱 Log on the go</span>
//             <span>📈 Watch progress</span>
//           </div>
//         </div>
//       </section>

//       {/* AUTH SECTION - Re-styled to match the "Stock" theme (Boxy, Borders) */}
//       <section className="stock-auth-section" id="auth-section">
//         <div className="stock-auth-header">
//           <h2>READY TO COMMIT?</h2>
//           <p>Create an account to access your personalized dashboard.</p>
//         </div>

//         <div className="stock-auth-grid">
//           {/* New User Card */}
//           <div className="stock-card">
//             <div className="card-header">
//                 <h3>NEW HERE?</h3>
//             </div>
//             <div className="card-body">
//                 <p>Build your fitness identity and set stakes.</p>
//                 <ul className="stock-list">
//                     <li>✅ Create goals with real stakes</li>
//                     <li>✅ Log workouts from phone</li>
//                     <li>✅ Track food & calories</li>
//                 </ul>
//                 <Link to="/register" className="card-btn primary">
//                     REGISTER &rarr;
//                 </Link>
//             </div>
//           </div>

//           {/* Existing Member Card */}
//           <div className="stock-card">
//             <div className="card-header">
//                 <h3>ALREADY A MEMBER?</h3>
//             </div>
//             <div className="card-body">
//                 <p>Jump back into your dashboard.</p>
//                 <ul className="stock-list">
//                     <li>🔥 Continue your streaks</li>
//                     <li>📊 View dashboard insights</li>
//                     <li>🥗 Update food ledger</li>
//                 </ul>
//                 <Link to="/login" className="card-btn outline">
//                     LOGIN &rarr;
//                 </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Homepage;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./homepage2.css";
// Adjust this path to where you saved your logo image
 

const Homepage = () => {
  const navigate = useNavigate();

  const scrollToAuth = () => {
    const el = document.getElementById("auth-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreDemo = () => {
    navigate("/dashboard");
  };

  // Ticker data styled for dark mode context
  const tickerData = [
    { symbol: "CALORIES", val: "-450", dir: "down" },
    { symbol: "STREAK", val: "+7 DAYS", dir: "up" },
    { symbol: "STEPS", val: "+10,420", dir: "up" },
    { symbol: "SLEEP", val: "+8.2 HRS", dir: "up" },
    { symbol: "WEIGHT", val: "-0.5 KG", dir: "down" },
    { symbol: "WATER", val: "+3.0 L", dir: "up" },
  ];

  return (
    <div className="stock-theme-shell">
      {/* NAVBAR */}
      <nav className="stock-nav">
        <div className="nav-left">
          <div className="nav-brand-container">
            {/* Logo added here
            <img src='../logo' alt="Fit-In-Healix Logo" className="nav-logo" /> */}
            <h1 className="nav-brand">Fit-In-Healix</h1>
          </div>
        </div>
        
        <div className="nav-center">
          <button className="nav-pill-btn" onClick={scrollToAuth}>Start</button>
          <button className="nav-pill-btn">Features</button>
        </div>

        <div className="nav-right">
          <Link to="/login" className="nav-blue-btn">
            Login
          </Link>
        </div>
      </nav>

      {/* TICKER TAPE BAR */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...tickerData, ...tickerData].map((item, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-symbol">{item.symbol}</span>
              <span className={`ticker-val ${item.dir}`}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="stock-hero" id="top">
        <div className="hero-content">
          <p className="hero-badge">Fitness • Accountability • Fun</p>
          
          <h1 className="hero-title">
            <span className="text-accent-blue">STAKE</span> YOUR CLAIM.
            <br />
            SWEAT & <span className="text-accent-green">GROW.</span>
          </h1>

          <p className="hero-subtitle">
            Lock in your fitness goals, track every workout, and grow with a
            community that keeps you accountable — all from the phone in your
            hand.
          </p>

          <div className="hero-actions">
            <button className="wallet-btn" onClick={scrollToAuth}>
               GET STARTED
            </button>

            <button className="ghost-btn" onClick={handleExploreDemo}>
              EXPLORE DEMO
            </button>
          </div>

          <div className="hero-meta-row">
            <span>⚡ Stake commitment</span>
            <span>📱 Log on the go</span>
            <span>📈 Watch progress</span>
          </div>
        </div>
      </section>

      {/* AUTH SECTION */}
      <section className="stock-auth-section" id="auth-section">
        <div className="stock-auth-header">
          <h2>READY TO COMMIT?</h2>
          <p>Create an account to access your personalized dashboard.</p>
        </div>

        <div className="stock-auth-grid">
          {/* New User Card */}
          <div className="stock-card">
            <div className="card-header">
                <h3>NEW HERE?</h3>
            </div>
            <div className="card-body">
                <p>Build your fitness identity and set stakes.</p>
                <ul className="stock-list">
                    <li>✅ Create goals with real stakes</li>
                    <li>✅ Log workouts from phone</li>
                    <li>✅ Track food & calories</li>
                </ul>
                <Link to="/register" className="card-btn primary">
                    REGISTER &rarr;
                </Link>
            </div>
          </div>

          {/* Existing Member Card */}
          <div className="stock-card">
            <div className="card-header">
                <h3>ALREADY A MEMBER?</h3>
            </div>
            <div className="card-body">
                <p>Jump back into your dashboard.</p>
                <ul className="stock-list">
                    <li>🔥 Continue your streaks</li>
                    <li>📊 View dashboard insights</li>
                    <li>🥗 Update food ledger</li>
                </ul>
                <Link to="/login" className="card-btn outline">
                    LOGIN &rarr;
                </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;