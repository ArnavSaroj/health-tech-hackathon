import React from 'react'
import { useState } from 'react'


import './App.css'
import { Routes, Route} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import StakeFit from './components/StakeFit'
import VideoChallengeSquat from './components/VideoChallengeSquat'

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/stakefit" element={<StakeFit/>}/>
      <Route path="/videochallengesquat" element={<VideoChallengeSquat/>}/>
    </Routes>
  )
}

export default App
