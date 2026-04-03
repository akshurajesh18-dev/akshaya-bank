import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage        from './pages/LoginPage'
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminUsers       from './pages/admin/AdminUsers'
import AdminAccounts    from './pages/admin/AdminAccounts'
import AdminTransactions from './pages/admin/AdminTransactions'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerAccounts  from './pages/customer/CustomerAccounts'
import CustomerTransfer  from './pages/customer/CustomerTransfer'
import CustomerTransactions from './pages/customer/CustomerTransactions'
import CustomerProfile   from './pages/customer/CustomerProfile'
import AdminLayout       from './components/admin/AdminLayout'
import CustomerLayout    from './components/customer/CustomerLayout'

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div className="spinner dark"/></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', borderRadius: '10px' }
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute role="ADMIN"><AdminLayout /></PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={
            <PrivateRoute role="CUSTOMER"><CustomerLayout /></PrivateRoute>
          }>
            <Route index element={<CustomerDashboard />} />
            <Route path="accounts" element={<CustomerAccounts />} />
            <Route path="transfer" element={<CustomerTransfer />} />
            <Route path="transactions" element={<CustomerTransactions />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
