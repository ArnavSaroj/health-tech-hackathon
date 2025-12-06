// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./dashboard.css";
// import { Link, useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [bookings, setBookings] = useState([]);
//   const [user, setUser] = useState(null);
//   const [theme, setTheme] = useState("dark"); // "light" | "dark"

//   const handleLogout = () => {
//     // Uncomment when integrating auth:
//     // localStorage.removeItem("token");
//     // navigate("/");
//     console.log("Logout clicked");
//   };

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   // Add / remove theme class on <body>
//   useEffect(() => {
//     document.body.classList.remove("theme-dark", "theme-light");
//     document.body.classList.add(`theme-${theme}`);
//   }, [theme]);

//   // OPTIONAL: You can plug in your real API here
//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");
//   //   if (!token) return navigate("/");
//   //
//   //   const fetchData = async () => {
//   //     try {
//   //       const res = await axios.get("/api/food-today", {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       setBookings(res.data);
//   //     } catch (err) {
//   //       console.error(err);
//   //     }
//   //   };
//   //
//   //   fetchData();
//   // }, [navigate]);

//   // Scroll reveal animations using IntersectionObserver
//   useEffect(() => {
//     const revealEls = document.querySelectorAll(".reveal");
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("reveal-visible");
//           }
//         });
//       },
//       { threshold: 0.15 }
//     );

//     revealEls.forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className={`dashboard-shell theme-${theme}`}>
//       {/* Animated background blobs / grid */}
//       <div className="bg-orbit"></div>
//       <div className="bg-orbit bg-orbit-2"></div>
//       <div className="bg-grid"></div>

//       <header className="dash-header reveal">
//         <div className="brand">
//           <div className="brand-orb" />
//           <div>
//             <h1 className="brand-title">Fit-In-Healix</h1>
//             <p className="brand-subtitle">Stake. Sweat. Grow.</p>
//           </div>
//         </div>

//         <div className="header-actions">
//           <button
//             className="theme-toggle"
//             onClick={toggleTheme}
//             aria-label="Toggle light/dark mode"
//           >
//             <span className="theme-toggle-track">
//               <span className="theme-toggle-thumb">
//                 {theme === "dark" ? "🌙" : "☀️"}
//               </span>
//             </span>
//           </button>

//           <button className="logout-btn" onClick={handleLogout}>
//             <span className="logout-icon">⏻</span>
//             <span>Logout</span>
//           </button>
//         </div>
//       </header>

//       <div className="dashboard-layout">
//         {/* SIDEBAR */}
//         <aside className="sidebar reveal">
//           <div className="sidebar-glass" />
//           <nav className="nav">
//             <p className="nav-label">Navigation</p>
//             <ul>
//               <li className={activeTab === "dashboard" ? "active" : ""}>
//                 <button onClick={() => setActiveTab("dashboard")}>
//                   <span className="nav-icon">📊</span>
//                   <span>Dashboard</span>
//                 </button>
//               </li>
//               <li className={activeTab === "book" ? "active" : ""}>
//                 <Link to="/stakefit" onClick={() => setActiveTab("book")}>
//                   <span className="nav-icon">🏁</span>
//                   <span>Stake Fit</span>
//                 </Link>
//               </li>
//               <li className={activeTab === "edit" ? "active" : ""}>
//                 <Link to="/foodledger" onClick={() => setActiveTab("edit")}>
//                   <span className="nav-icon">🍱</span>
//                   <span>Food Ledger</span>
//                 </Link>
//               </li>
//               <li className={activeTab === "previous" ? "active" : ""}>
//                 <Link
//                   to="/previousworkout"
//                   onClick={() => setActiveTab("previous")}
//                 >
//                   <span className="nav-icon">🏋️‍♂️</span>
//                   <span>Previous Workouts</span>
//                 </Link>
//               </li>
//               <li className={activeTab === "profile" ? "active" : ""}>
//                 <Link to="/profile" onClick={() => setActiveTab("profile")}>
//                   <span className="nav-icon">👤</span>
//                   <span>Profile</span>
//                 </Link>
//               </li>
//             </ul>
//           </nav>

//           {/* Little doodle strip */}
//           <div className="sidebar-doodles">
//             <span>🥗</span>
//             <span>💪</span>
//             <span>🏃</span>
//             <span>🥤</span>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="dash-main">
//           {/* Hero row */}
//           <section className="hero reveal">
//             <div className="hero-card">
//               <div className="hero-floating-orb" />
//               <h2>Welcome back{user ? `, ${user.name}` : ""} 👋</h2>
//               <p>
//                 Track your workouts, food, and stakes with a futuristic HUD-style
//                 dashboard. Every rep and bite counts.
//               </p>
//               <div className="hero-actions">
//                 <Link to="/workout" className="primary-cta">
//                   Start Workout
//                 </Link>
//                 <Link to="/stakefit" className="secondary-cta">
//                   View Stakes
//                 </Link>
//               </div>
//             </div>

//             <div className="hero-stats-card">
//               <div className="hero-stat">
//                 <span className="hero-stat-label">Today&apos;s Burn</span>
//                 <span className="hero-stat-value">🔥 0 kcal</span>
//               </div>
//               <div className="hero-stat">
//                 <span className="hero-stat-label">Streak</span>
//                 <span className="hero-stat-value">⚡ 0 days</span>
//               </div>
//               <div className="hero-stat">
//                 <span className="hero-stat-label">Points</span>
//                 <span className="hero-stat-value">⭐ 0</span>
//               </div>
//             </div>
//           </section>

//           {/* 3D Cards row */}
//           <section className="stats-grid reveal">
//             <article className="stat-card card-3d">
//               <div className="card-inner">
//                 <h3>Stake Fit</h3>
//                 <p>Lock in your commitment and let the gains chase you.</p>
//                 <Link to="/stakefit" className="card-link">
//                   Open Stakes →
//                 </Link>
//               </div>
//             </article>

//             <article className="stat-card card-3d">
//               <div className="card-inner">
//                 <h3>Add Workout</h3>
//                 <p>Record today&apos;s grind — sets, reps, and sweat.</p>
//                 <Link to="/workout" className="card-link">
//                   Add Session →
//                 </Link>
//               </div>
//             </article>

//             <article className="stat-card card-3d">
//               <div className="card-inner">
//                 <h3>Points</h3>
//                 <p>Earn points as you stay consistent and crush your goals.</p>
//                 <span className="points-badge">Coming soon</span>
//               </div>
//             </article>
//           </section>

//           {/* Food table */}
//           <section className="bookings-section reveal">
//             <div className="section-header">
//               <h2>Food Entries Today</h2>
//               <p className="section-subtitle">
//                 Log your meals to keep calories aligned with your fitness goals.
//               </p>
//             </div>

//             <div className="table-wrapper glass-panel">
//               <table className="bookings-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Grams</th>
//                     <th>Calories</th>
//                     <th>Cumulative Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="empty-state">
//                         No food entries yet. Add your first meal in{" "}
//                         <Link to="/foodledger">Food Ledger</Link>.
//                       </td>
//                     </tr>
//                   ) : (
//                     bookings.map((row, idx) => (
//                       <tr key={idx} className="table-row-animated">
//                         <td>{row.name}</td>
//                         <td>{row.grams}</td>
//                         <td>{row.calories}</td>
//                         <td>{row.cumulativeCalories}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           {/* Extra doodle strip / footer */}
//           <section className="footer-doodles reveal">
//             <div className="doodle-cloud">
//               <span>🏋️ PR</span>
//               <span>🧘 Balance</span>
//               <span>🥑 Macros</span>
//               <span>🚰 Hydrate</span>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import "./dashboard2.css";
import { Link, useNavigate } from "react-router-dom";
// Use the same logo path as Homepage


const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  
  // Hardcoded theme to 'dark' as requested
  const theme = "dark"; 

  const handleLogout = () => {
    // localStorage.removeItem("token");
    // navigate("/");
    console.log("Logout clicked");
  };

  // Scroll reveal animations
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dashboard-shell">
      
      {/* HEADER */}
      <header className="dash-header reveal">
        <div className="brand">
          {/* <img src={logo} alt="Fit-In-Healix" className="brand-logo" /> */}
          <div className="brand-info">
            <h1 className="brand-title">Fit-In-Healix</h1>
            <p className="brand-subtitle">Terminal v1.0</p>
          </div>
        </div>

        <div className="header-actions">
           {/* Theme Toggle Removed - Dark Mode Only */}
          <button className="logout-btn" onClick={handleLogout}>
            <span>LOGOUT</span>
            <span>⏻</span>
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="sidebar reveal">
          <nav className="nav">
            <p className="nav-label">Main Menu</p>
            <ul>
              <li className={activeTab === "dashboard" ? "active" : ""}>
                <button onClick={() => setActiveTab("dashboard")}>
                  <span className="nav-icon">📊</span>
                  <span>Dashboard</span>
                </button>
              </li>
              <li className={activeTab === "book" ? "active" : ""}>
                <Link to="/stakefit" onClick={() => setActiveTab("book")}>
                  <span className="nav-icon">🏁</span>
                  <span>Stake Fit</span>
                </Link>
              </li>
              <li className={activeTab === "edit" ? "active" : ""}>
                <Link to="/foodledger" onClick={() => setActiveTab("edit")}>
                  <span className="nav-icon">🍱</span>
                  <span>Food Ledger</span>
                </Link>
              </li>
              <li className={activeTab === "previous" ? "active" : ""}>
                <Link
                  to="/previousworkout"
                  onClick={() => setActiveTab("previous")}
                >
                  <span className="nav-icon">🏋️‍♂️</span>
                  <span>Prev Workouts</span>
                </Link>
              </li>
              <li className={activeTab === "profile" ? "active" : ""}>
                <Link to="/profile" onClick={() => setActiveTab("profile")}>
                  <span className="nav-icon">👤</span>
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="sidebar-doodles">
             <span>STAKE</span> • <span>SWEAT</span> • <span>GROW</span>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="dash-main">
          
          {/* HERO / PORTFOLIO VALUE */}
          <section className="hero reveal">
            <div className="hero-card">
              <h2>Overview{user ? `, ${user.name}` : ""}</h2>
              <p>
                Market status: Open. Track your caloric deficit and workout consistency.
              </p>
              <div className="hero-actions">
                <Link to="/stakefit" className="primary-cta">
                  + New Workout
                </Link>
                <Link to="/stakefit" className="secondary-cta">
                  View Stakes
                </Link>
              </div>
            </div>

            <div className="hero-stats-card">
              <div className="hero-stat">
                <span className="hero-stat-label">Net Calories</span>
                <span className="hero-stat-value" style={{color: '#ef5350'}}>-450 kcal</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Current Streak</span>
                <span className="hero-stat-value">7 Days</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Total Points</span>
                <span className="hero-stat-value">1,250</span>
              </div>
            </div>
          </section>

          {/* QUICK ACTIONS / ASSET CARDS */}
          <section className="stats-grid reveal">
            <article className="terminal-card">
              <div className="card-inner">
                <h3>Stake Fit <span>↗</span></h3>
                <p>Lock in your commitment.</p>
                <Link to="/stakefit" className="card-link">
                  Manage Stakes
                </Link>
              </div>
            </article>

            <article className="terminal-card">
              <div className="card-inner">
                <h3>Daily Log <span>+</span></h3>
                <p>Record reps and sets.</p>
                <Link to="/workout" className="card-link">
                  Add Session
                </Link>
              </div>
            </article>

            <article className="terminal-card">
              <div className="card-inner">
                <h3>Analytics <span>📊</span></h3>
                <p>Performance visualizations.</p>
                <span className="points-badge">Coming soon</span>
              </div>
            </article>
          </section>

          {/* FOOD LEDGER / ORDER BOOK */}
          <section className="bookings-section reveal">
            <div className="section-header">
              <div>
                <h2>Food Ledger</h2>
                <p className="section-subtitle">Today's Caloric Transaction History</p>
              </div>
              <Link to="/foodledger" className="card-link">View Full Ledger</Link>
            </div>

            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Qty (g)</th>
                    <th>Energy (kcal)</th>
                    <th>Total Accum.</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No transactions logged today. 
                        <br/><br/>
                        <Link to="/foodledger">Log a Meal →</Link>
                      </td>
                    </tr>
                  ) : (
                    bookings.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.name}</td>
                        <td>{row.grams}</td>
                        <td>{row.calories}</td>
                        <td>{row.cumulativeCalories}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;