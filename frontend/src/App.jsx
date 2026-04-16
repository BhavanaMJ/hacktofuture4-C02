import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import Callback from './pages/Callback'
import UserDashboard from './user_side/UserDashboard'
import SecurityDashboard from './security_side/SecurityDashboard'
import Alerts from './security_side/Alerts'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/security" element={<SecurityDashboard />} />
      <Route path="/alerts" element={<Alerts />} />
    </Routes>
  )
}

export default App
