import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ECG12Page from './pages/ECG12Page'
import HolterPage from './pages/HolterPage'
import ExercisePage from './pages/ExercisePage'
import CriticalValuePage from './pages/CriticalValuePage'
import RegionalECGPage from './pages/RegionalECGPage'
import StatisticsPage from './pages/StatisticsPage'
import SettingsPage from './pages/SettingsPage'
import HQPage from './pages/HQPage'
import TodoCenterPage from './pages/TodoCenterPage'
import DeviceManagementPage from './pages/DeviceManagementPage'
import UserRolePage from './pages/UserRolePage'
import QualityMetricsPage from './pages/QualityMetricsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/g008" replace />} />
          <Route path="g008" element={<HomePage />} />
          <Route path="g008/ecg12" element={<ECG12Page />} />
          <Route path="g008/holter" element={<HolterPage />} />
          <Route path="g008/exercise" element={<ExercisePage />} />
          <Route path="g008/critical-value" element={<CriticalValuePage />} />
          <Route path="g008/regional" element={<RegionalECGPage />} />
          <Route path="g008/statistics" element={<StatisticsPage />} />
          <Route path="g008/settings" element={<SettingsPage />} />
          <Route path="g008/hq" element={<HQPage />} />
          <Route path="g008/todo" element={<TodoCenterPage />} />
          <Route path="g008/devices" element={<DeviceManagementPage />} />
          <Route path="g008/users" element={<UserRolePage />} />
          <Route path="g008/quality" element={<QualityMetricsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
