import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

const API_BASE_URL = "http://localhost:5000"; // change if your backend URL is different

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBMICategory = (bmi) => {
    if (!bmi && bmi !== 0) return "";
    const value = parseFloat(bmi);
    if (value < 18.5) return "Underweight";
    if (value < 25) return "Normal";
    if (value < 30) return "Overweight";
    return "Obese";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ⬇️ This should be your Supabase auth user id (UUID) stored after login
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/showProfile/${userId}`);
        // backend returns: { message: "...", profile: data }
        setProfile(res.data.profile);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load profile. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-page-container">
        <div className="profile-card">
          <p style={{ textAlign: "center" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-container">
        <div className="profile-card">
          <p style={{ textAlign: "center", color: "#ff6b6b" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const bmi = profile.bmi;              // from DB
  const bmiCategory = getBMICategory(bmi);
  const points = profile.points ?? 0;   // Stake points from DB

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {/* Banner */}
        <div className="profile-banner"></div>

        {/* Avatar */}
        <div className="profile-avatar-wrapper">
          <img
            src="/profile_placeholder.jpg"   // make sure this file exists in public/
            alt="User Avatar"
            className="profile-avatar-img"
          />
        </div>

        <div className="profile-content">
          {/* Main Identity */}
          <h1 className="profile-name">
            {profile.full_name || "User"}
          </h1>
          <p className="profile-tagline">Fitness Enthusiast</p>

          {/* Health Metrics Grid */}
          <div className="profile-stats-grid">
            <div className="stat-box">
              <span className="stat-label">Age</span>
              <span className="stat-value">
                {profile.age ? `${profile.age} Years` : "—"}
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Gender</span>
              <span className="stat-value">
                {profile.gender || "—"}
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Height</span>
              <span className="stat-value">
                {profile.height ? `${profile.height} cm` : "—"}
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Current Weight</span>
              <span className="stat-value">
                {profile.weight ? `${profile.weight} kg` : "—"}
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">BMI</span>
              <span className={`stat-value ${bmi ? "bmi-good" : ""}`}>
                {bmi ? `${bmi.toFixed(1)} (${bmiCategory})` : "—"}
              </span>
            </div>
          </div>

          {/* Points / Stake Section */}
          <div className="gamification-section">
            <div className="game-stat">
              <span className="game-label">Stake Points</span>
              <span className="game-value">{points}</span>
            </div>
          </div>

          {/* <button className="profile-edit-btn">
            Edit Profile
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
