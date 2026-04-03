import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const nav = [
  { to:'/customer',             label:'Dashboard',    icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to:'/customer/accounts',    label:'My Accounts',  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { to:'/customer/transfer',    label:'Fund Transfer', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { to:'/customer/transactions', label:'Transactions', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { to:'/customer/profile',     label:'My Profile',   icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const doLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <aside style={{
        width:collapsed?72:240, flexShrink:0, background:'linear-gradient(160deg,#0B1F3A 0%,#1A3A5C 100%)',
        display:'flex', flexDirection:'column', transition:'width .25s ease',
        position:'sticky', top:0, height:'100vh', overflow:'hidden'
      }}>
        <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38,height:38,borderRadius:10,background:'rgba(26,122,74,.3)',border:'1px solid rgba(26,122,74,.5)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22a060" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          {!collapsed && <div>
            <div style={{ color:'#fff',fontWeight:700,fontSize:'.95rem',fontFamily:'DM Serif Display,serif' }}>Akshaya Bank</div>
            <div style={{ color:'rgba(255,255,255,.35)',fontSize:'.68rem',marginTop:1 }}>Customer Portal</div>
          </div>}
        </div>

        <nav style={{ flex:1,padding:'16px 12px',display:'flex',flexDirection:'column',gap:4 }}>
          {nav.map(item=>(
            <NavLink key={item.to} to={item.to} end={item.to==='/customer'}
              style={({isActive})=>({
                display:'flex',alignItems:'center',gap:12,padding:'10px 12px',
                borderRadius:10,color:isActive?'#fff':'rgba(255,255,255,.5)',
                background:isActive?'rgba(26,122,74,.25)':'transparent',
                borderLeft:isActive?'3px solid #1A7A4A':'3px solid transparent',
                transition:'all .2s',fontWeight:600,fontSize:'.875rem',
                whiteSpace:'nowrap',overflow:'hidden',textDecoration:'none'
              })}>
              <span style={{flexShrink:0}}>{item.icon}</span>
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'12px',borderTop:'1px solid rgba(255,255,255,.08)' }}>
          <button onClick={()=>setCollapsed(v=>!v)}
            style={{ width:'100%',padding:'9px 12px',background:'rgba(255,255,255,.06)',border:'none',borderRadius:10,color:'rgba(255,255,255,.5)',cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontSize:'.8rem',fontFamily:'var(--font)',marginBottom:8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed?<path d="M9 18l6-6-6-6"/>:<path d="M15 18l-6-6 6-6"/>}
            </svg>
            {!collapsed&&'Collapse'}
          </button>
          <button onClick={doLogout}
            style={{ width:'100%',padding:'9px 12px',background:'rgba(192,57,43,.15)',border:'1px solid rgba(192,57,43,.25)',borderRadius:10,color:'#e88',cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontSize:'.8rem',fontFamily:'var(--font)',fontWeight:600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!collapsed&&'Logout'}
          </button>
        </div>
      </aside>

      <div style={{ flex:1,display:'flex',flexDirection:'column',minWidth:0 }}>
        <header style={{ background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100 }}>
          <div style={{ fontSize:'.85rem',color:'var(--text-3)' }}>
            Hello, <strong style={{color:'var(--text)'}}>{user?.fullName}</strong> 👋
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:'50%',background:'var(--emerald)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem' }}>
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div style={{ lineHeight:1.2 }}>
              <div style={{ fontSize:'.85rem',fontWeight:600 }}>{user?.fullName}</div>
              <div style={{ fontSize:'.72rem',color:'var(--text-3)' }}>Customer</div>
            </div>
          </div>
        </header>
        <main style={{ flex:1,padding:'28px',overflowY:'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
