import { useEffect, useState } from 'react'
import { customerAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CustomerDashboard() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [txns, setTxns]         = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(()=>{
    Promise.all([customerAPI.getAccounts(), customerAPI.getTransactions()])
      .then(([a,t])=>{ setAccounts(a.data); setTxns(t.data) })
      .finally(()=>setLoading(false))
  },[])

  const totalBalance = accounts.reduce((s,a)=>s+Number(a.balance),0)
  const activeAccounts = accounts.filter(a=>a.status==='ACTIVE')

  if(loading) return <div style={{display:'flex',justifyContent:'center',paddingTop:80}}><div className="spinner dark"/></div>

  return (
    <div className="fade-in">
      {/* Welcome banner */}
      <div style={{
        background:'linear-gradient(135deg,var(--navy) 0%,#1A3A5C 100%)',
        borderRadius:18, padding:'28px 32px', marginBottom:24,
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16
      }}>
        <div>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:'.85rem',marginBottom:6}}>Good day,</p>
          <h2 style={{fontFamily:'DM Serif Display,serif',color:'#fff',fontSize:'1.8rem'}}>{user?.fullName}</h2>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:'.8rem',marginTop:4}}>{user?.email}</p>
        </div>
        <div style={{textAlign:'right'}}>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:'.8rem',marginBottom:4}}>Total Balance</p>
          <p style={{color:'#C9972B',fontWeight:800,fontSize:'2rem',fontFamily:'DM Serif Display,serif'}}>
            ₹{totalBalance.toLocaleString('en-IN',{minimumFractionDigits:2})}
          </p>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:'.75rem',marginTop:2}}>{activeAccounts.length} active account{activeAccounts.length!==1?'s':''}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24}}>
        {[
          {label:'Deposit',    color:'var(--emerald)', bg:'rgba(26,122,74,.1)', icon:'↓', to:'/customer/accounts'},
          {label:'Withdraw',   color:'var(--red)',     bg:'rgba(192,57,43,.1)', icon:'↑', to:'/customer/accounts'},
          {label:'Transfer',   color:'var(--navy)',    bg:'rgba(11,31,58,.08)', icon:'⇄', to:'/customer/transfer'},
          {label:'History',    color:'var(--sky)',     bg:'rgba(41,128,185,.1)',icon:'≡', to:'/customer/transactions'},
        ].map(a=>(
          <button key={a.label} onClick={()=>navigate(a.to)}
            style={{background:a.bg,border:`1.5px solid ${a.color}22`,borderRadius:14,padding:'18px 12px',cursor:'pointer',textAlign:'center',transition:'all .2s',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.1)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
            <span style={{fontSize:'1.5rem',color:a.color}}>{a.icon}</span>
            <span style={{fontWeight:700,fontSize:'.85rem',color:a.color,fontFamily:'var(--font)'}}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Accounts */}
      <div style={{marginBottom:24}}>
        <div className="page-header" style={{marginBottom:14}}>
          <h2 style={{fontWeight:700,fontSize:'1.1rem'}}>My Accounts</h2>
          <button className="btn btn-outline btn-sm" onClick={()=>navigate('/customer/accounts')}>View All</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
          {accounts.slice(0,3).map(a=>(
            <div key={a.id} className="card" style={{padding:20,background:'linear-gradient(135deg,var(--navy),#1d3a5e)',border:'none',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',right:-20,top:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,.04)'}}/>
              <div style={{position:'absolute',right:20,bottom:-30,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,.03)'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
                <span className="badge badge-blue" style={{background:'rgba(255,255,255,.15)',color:'rgba(255,255,255,.8)'}}>{a.accountType.replace('_',' ')}</span>
                <span className={`badge ${a.status==='ACTIVE'?'badge-green':'badge-red'}`} style={{fontSize:'.7rem'}}>{a.status}</span>
              </div>
              <p style={{color:'rgba(255,255,255,.5)',fontSize:'.75rem',marginBottom:4}}>Account Number</p>
              <p style={{color:'#fff',fontFamily:'monospace',fontWeight:700,fontSize:'1rem',letterSpacing:'.1em'}}>{a.accountNumber}</p>
              <p style={{color:'rgba(255,255,255,.5)',fontSize:'.75rem',margin:'16px 0 4px'}}>Available Balance</p>
              <p style={{color:'#C9972B',fontWeight:800,fontSize:'1.4rem'}}>₹{Number(a.balance).toLocaleString('en-IN',{minimumFractionDigits:2})}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{padding:'18px 22px 14px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{fontWeight:700,fontSize:'1rem'}}>Recent Transactions</h3>
          <button className="btn btn-outline btn-sm" onClick={()=>navigate('/customer/transactions')}>View All</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th><th>Date</th></tr></thead>
            <tbody>
              {txns.slice(0,6).map(t=>(
                <tr key={t.id}>
                  <td><TypeBadge type={t.type}/></td>
                  <td style={{fontWeight:700,color:t.type==='DEPOSIT'||t.type==='TRANSFER_IN'?'var(--emerald)':'var(--red)'}}>
                    {t.type==='DEPOSIT'||t.type==='TRANSFER_IN'?'+':'-'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </td>
                  <td>₹{Number(t.balanceAfter).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                  <td style={{color:'var(--text-3)',fontSize:'.82rem'}}>{t.description||'—'}</td>
                  <td style={{fontSize:'.8rem',color:'var(--text-3)'}}>{new Date(t.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {txns.length===0&&<tr><td colSpan={5} style={{textAlign:'center',padding:32,color:'var(--text-3)'}}>No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TypeBadge({type}) {
  const map={DEPOSIT:'badge-green',WITHDRAWAL:'badge-red',TRANSFER_IN:'badge-blue',TRANSFER_OUT:'badge-yellow'}
  return <span className={`badge ${map[type]||'badge-gray'}`}>{type?.replace('_',' ')}</span>
}
