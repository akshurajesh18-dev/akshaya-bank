import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AdminDashboard() {
  const [users, setUsers]   = useState([])
  const [accounts, setAccounts] = useState([])
  const [txns, setTxns]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.getUsers(), adminAPI.getAccounts(), adminAPI.getTransactions()])
      .then(([u, a, t]) => { setUsers(u.data); setAccounts(a.data); setTxns(t.data) })
      .finally(() => setLoading(false))
  }, [])

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0)
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length
  const activeCustomers = users.filter(u => u.isActive && u.role === 'CUSTOMER').length

  // Chart data: last 7 days transaction count
  const chartData = (() => {
    const days = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-IN', { month:'short', day:'numeric' })
      days[key] = 0
    }
    txns.forEach(t => {
      const key = new Date(t.createdAt).toLocaleDateString('en-IN', { month:'short', day:'numeric' })
      if (days[key] !== undefined) days[key]++
    })
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  })()

  const stats = [
    { label:'Total Customers', value: activeCustomers, color:'#0B1F3A', bg:'rgba(11,31,58,.08)',
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label:'Total Accounts',  value: accounts.length, color:'#1A7A4A', bg:'rgba(26,122,74,.1)',
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A7A4A" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { label:'Active Accounts', value: activeAccounts,  color:'#2980B9', bg:'rgba(41,128,185,.1)',
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2980B9" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label:'Total Transactions', value: txns.length, color:'#C9972B', bg:'rgba(201,151,43,.1)',
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9972B" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  ]

  if (loading) return <div style={{display:'flex',justifyContent:'center',paddingTop:80}}><div className="spinner dark"/></div>

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Bank overview and recent activity</p>
        </div>
        <div style={{ background:'var(--navy)', color:'#fff', padding:'8px 18px', borderRadius:10, fontSize:'.8rem', fontWeight:600 }}>
          Total Funds: ₹{totalBalance.toLocaleString('en-IN', {minimumFractionDigits:2})}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background:s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value" style={{ color:s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:28 }}>
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'1rem' }}>Transactions — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false}/>
              <XAxis dataKey="date" tick={{ fontSize:11, fill:'#8896A7' }} axisLine={false} tickLine={false}/>
              <YAxis allowDecimals={false} tick={{ fontSize:11, fill:'#8896A7' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid #DDE3EC', fontSize:12 }}/>
              <Bar dataKey="count" fill="#0B1F3A" radius={[6,6,0,0]} name="Transactions"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontWeight:700, marginBottom:16, fontSize:'1rem' }}>Account Types</h3>
          {['SAVINGS','CURRENT','FIXED_DEPOSIT'].map(type => {
            const count = accounts.filter(a=>a.accountType===type).length
            const pct = accounts.length ? Math.round(count/accounts.length*100) : 0
            return (
              <div key={type} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8rem', fontWeight:600, marginBottom:5, color:'var(--text-2)' }}>
                  <span>{type.replace('_',' ')}</span><span>{count}</span>
                </div>
                <div style={{ height:8, background:'var(--bg)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:'var(--navy)', borderRadius:4, transition:'width .6s ease' }}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem' }}>Recent Transactions</h3>
          <span style={{ fontSize:'.8rem', color:'var(--text-3)' }}>Latest 8</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Txn ID</th><th>Account</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {txns.slice(0,8).map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily:'monospace', fontSize:'.78rem', color:'var(--text-3)' }}>{t.transactionId?.slice(-12)}</td>
                  <td style={{ fontWeight:600 }}>{t.accountNumber}</td>
                  <td><TypeBadge type={t.type}/></td>
                  <td style={{ fontWeight:700, color: t.type==='DEPOSIT'||t.type==='TRANSFER_IN' ? 'var(--emerald)' : 'var(--red)' }}>
                    {t.type==='DEPOSIT'||t.type==='TRANSFER_IN'?'+':'-'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </td>
                  <td><span className={`badge badge-${t.status==='SUCCESS'?'green':t.status==='FAILED'?'red':'yellow'}`}>{t.status}</span></td>
                  <td style={{ fontSize:'.8rem', color:'var(--text-3)' }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {txns.length===0 && <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-3)', padding:32 }}>No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TypeBadge({ type }) {
  const map = { DEPOSIT:'badge-green', WITHDRAWAL:'badge-red', TRANSFER_IN:'badge-blue', TRANSFER_OUT:'badge-yellow' }
  return <span className={`badge ${map[type]||'badge-gray'}`}>{type?.replace('_',' ')}</span>
}
