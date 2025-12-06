import React, { useState } from 'react';
// 1. Import your specific workout components
import VideoChallengeSquat from './VideoChallengeSquat'; // Ensure file exists
import VideoChallengePushup from './VideoChallengePushup'; // Ensure file exists
import './StakeFit.css'; 

const StakeFit = () => {
  // --- STATE ---
  const [gameMode, setGameMode] = useState('setup'); // 'setup' or 'active'
  const [config, setConfig] = useState({
    workoutType: 'squat', // Default
    duration: 30,
    targetReps: 15,
    stakePerRep: 0.01 
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const totalStake = (config.targetReps * config.stakePerRep).toFixed(4);

  const handleStart = (e) => {
    e.preventDefault();
    setGameMode('active');
  };

  return (
    <div className="stakefit-page">
      
      {/* Header */}
      <header className="dash-header">
        <div className="brand">
          <img src="./logo.png" alt="Logo" className="brand-logo" />
          <div className="brand-info">
            <h1 className="brand-title">Fit-In-Healix</h1>
            <p className="brand-subtitle">Stake. Sweat. Earn.</p>
          </div>
        </div>
      </header>

      <div className="stakefit-container">
        
        {/* VIEW 1: SETUP FORM */}
        {gameMode === 'setup' && (
          <div className="setup-card">
            <h1 className="setup-title">Configure Challenge</h1>
            <p className="setup-subtitle">Select your arena.</p>

            <form className="setup-form" onSubmit={handleStart}>
              
              {/* Workout Selection */}
              <div className="form-group">
                <label>Select Workout</label>
                <select 
                  name="workoutType" 
                  value={config.workoutType} 
                  onChange={handleChange}
                  className="stake-input"
                >
                  <option value="squat">Squats</option>
                  <option value="pushup">Pushups</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (Seconds)</label>
                  <select 
                    name="duration" 
                    value={config.duration} 
                    onChange={handleChange}
                    className="stake-input"
                  >
                    <option value="15">15 Sec</option>
                    <option value="30">30 Sec</option>
                    <option value="45">45 Sec</option>
                    <option value="60">60 Sec</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Reps</label>
                  <input 
                    type="number" 
                    name="targetReps" 
                    value={config.targetReps} 
                    onChange={handleChange}
                    min="1"
                    className="stake-input" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Stake per Rep (ETH)</label>
                <input 
                  type="number" 
                  name="stakePerRep" 
                  value={config.stakePerRep} 
                  onChange={handleChange}
                  step="0.001"
                  min="0"
                  className="stake-input" 
                />
              </div>

              <div className="stake-summary">
                <div className="summary-row">
                  <span>Total Pot:</span>
                  <span className="summary-value">{totalStake} ETH</span>
                </div>
              </div>

              <button type="submit" className="stake-btn-primary">
                Initialize Camera &rarr;
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: ACTIVE CHALLENGE */}
        {gameMode === 'active' && (
          <div className="challenge-wrapper">
            <button 
              className="back-btn" 
              onClick={() => setGameMode('setup')}
            >
              &larr; Back to Settings
            </button>
            
            {/* CONDITIONAL RENDERING LOGIC */}
            {config.workoutType === 'squat' ? (
              
              <VideoChallengeSquat 
                duration={parseInt(config.duration)}
                targetReps={parseInt(config.targetReps)}
                stakeAmount={totalStake}
              />

            ) : (
              
              <VideoChallengePushup 
                duration={parseInt(config.duration)}
                targetReps={parseInt(config.targetReps)}
                stakeAmount={totalStake}
              />
              
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default StakeFit;