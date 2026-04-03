import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data)
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  // Users
  getUsers:      ()       => api.get('/admin/users'),
  getUser:       (id)     => api.get(`/admin/users/${id}`),
  createUser:    (data)   => api.post('/admin/users', data),
  updateUser:    (id, d)  => api.put(`/admin/users/${id}`, d),
  deleteUser:    (id)     => api.delete(`/admin/users/${id}`),
  // Accounts
  getAccounts:   ()       => api.get('/admin/accounts'),
  getAccount:    (accNo)  => api.get(`/admin/accounts/${accNo}`),
  createAccount: (data)   => api.post('/admin/accounts', data),
  updateAccount: (id, d)  => api.put(`/admin/accounts/${id}`, d),
  getUserAccounts:(userId)=> api.get(`/admin/accounts/user/${userId}`),
  // Transactions
  getTransactions:()      => api.get('/admin/transactions'),
  getUserTx:    (userId)  => api.get(`/admin/transactions/user/${userId}`),
  getAccountTx: (accNo)   => api.get(`/admin/transactions/account/${accNo}`),
  adminDeposit: (data)    => api.post('/admin/transactions/deposit', data),
}

// ── Customer ──────────────────────────────────────────────────────────────────
export const customerAPI = {
  getProfile:     ()      => api.get('/customer/profile'),
  updateProfile:  (data)  => api.put('/customer/profile', data),
  getAccounts:    ()      => api.get('/customer/accounts'),
  getAccount:     (accNo) => api.get(`/customer/accounts/${accNo}`),
  deposit:        (data)  => api.post('/customer/deposit', data),
  withdraw:       (data)  => api.post('/customer/withdraw', data),
  transfer:       (data)  => api.post('/customer/transfer', data),
  getTransactions:()      => api.get('/customer/transactions'),
  getAccountTx:   (accNo) => api.get(`/customer/transactions/${accNo}`),
  getMiniStatement:(accNo)=> api.get(`/customer/mini-statement/${accNo}`),
}
