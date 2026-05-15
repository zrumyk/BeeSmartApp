import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AuthRedirectFallback from '../components/auth/AuthRedirectFallback'
import RoleHomeRedirect from '../components/auth/RoleHomeRedirect'
import AdminLayout from '../components/layout/AdminLayout'
import ShellLayout from '../components/layout/ShellLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminHivesPage from '../pages/admin/AdminHivesPage'
import AdminTasksPage from '../pages/admin/AdminTasksPage'
import BeekeeperHomePage from '../pages/beekeeper/BeekeeperHomePage'
import BeekeeperHivePage from '../pages/beekeeper/BeekeeperHivePage'
import BeekeeperProfilePage from '../pages/beekeeper/BeekeeperProfilePage'
import BeekeeperScannerPage from '../pages/beekeeper/BeekeeperScannerPage'
import BeekeeperTasksPage from '../pages/beekeeper/BeekeeperTasksPage'
import LoginPage from '../pages/shared/LoginPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoleHomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={['beekeeper']} />}>
        <Route element={<ShellLayout />}>
          <Route path="/beekeeper" element={<BeekeeperHomePage />} />
          <Route path="/beekeeper/scanner" element={<BeekeeperScannerPage />} />
          <Route path="/beekeeper/hive/:qrCode" element={<BeekeeperHivePage />} />
          <Route path="/beekeeper/tasks" element={<BeekeeperTasksPage />} />
          <Route path="/beekeeper/profile" element={<BeekeeperProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/hives" element={<AdminHivesPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
        </Route>
      </Route>

      <Route path="*" element={<AuthRedirectFallback />} />
    </Routes>
  )
}

export default AppRouter
