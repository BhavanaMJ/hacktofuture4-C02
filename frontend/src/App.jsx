import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import Callback from './pages/Callback'
import RecoveryPage from './pages/RecoveryPage'
import UserDashboard from './user_side/UserDashboard'
import UserTransfers from './user_side/UserTransfers'
import UserSettings from './user_side/UserSettings'
import SecurityDashboard from './security_side/SecurityDashboard'
import Alerts from './security_side/Alerts'
import SecuritySettings from './security_side/Settings'
import Users from './security_side/Users'
import Visual from './security_side/Visual'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/recovery" element={<RecoveryPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/user-transfers" element={<UserTransfers />} />
      <Route path="/user-settings" element={<UserSettings />} />
      <Route path="/security" element={<SecurityDashboard />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/security-settings" element={<SecuritySettings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/visual" element={<Visual />} />
    </Routes>
  )
}

export default App
