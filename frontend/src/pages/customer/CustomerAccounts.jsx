import { useEffect, useState } from 'react'
import { customerAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function CustomerAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // {type:'deposit'|'withdraw', account}
  const [form, setForm]         = useState({ amount:'', description:'' })
  const [saving, setSaving]     = useState(false)

  const load = () => customerAPI.getAccounts().then(r=>setAccounts(r.data)).finally(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const open = (type, account) => { setModal({type, account}); setForm({amount:'',description:''}) }
  const close = () => setModal(null)

  const handle = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { accountNumber: modal.account.accountNumber, amount: Number(form.amount), description: form.description }
      if (modal.type === 'deposit')  await customerAPI.deposit(payload)
      if (modal.type === 'withdraw') await customerAPI.withdraw(payload)
      toast.success(`${modal.type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`)
      close(); load()
    } catch(err) { toast.error(err.response?.data?.error || 'Transaction failed') }
    finally { setSaving(false) }
  }

  const isDeposit = modal?.type === 'deposit'

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">My Accounts</h1><p className="page-subtitle">Deposit and withdraw from your accounts</p></div>
      </div>

      {loading && <div style={{display:'flex',justifyContent:'center',paddingTop:60}}><div className="spinner dark"/></div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:18}}>
        {accounts.map(a=>(
          <div key={a.id} className="card" style={{overflow:'hidden'}}>
            {/* Card top */}
            <div style={{background:'linear-gradient(135deg,var(--navy),#1d3a5e)',padding:'22px 22px 20px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',right:-15,top:-15,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,.05)'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{color:'rgba(255,255,255,.6)',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>{a.accountType.replace('_',' ')}</span>
                <span className={`badge ${a.status==='ACTIVE'?'badge-green':'badge-red'}`}>{a.status}</span>
              </div>
              <p style={{color:'rgba(255,255,255,.5)',fontSize:'.72rem',marginBottom:2}}>Account Number</p>
              <p style={{color:'#fff',fontFamily:'monospace',fontWeight:700,fontSize:'1.05rem',letterSpacing:'.08em'}}>{a.accountNumber}</p>
              <p style={{color:'rgba(255,255,255,.5)',fontSize:'.72rem',margin:'14px 0 3px'}}>Balance</p>
              <p style={{color:'#C9972B',fontWeight:800,fontSize:'1.6rem'}}>₹{Number(a.balance).toLocaleString('en-IN',{minimumFractionDigits:2})}</p>
            </div>
            {/* Actions */}
            <div style={{padding:'16px 22px',display:'flex',gap:10}}>
              {a.status==='ACTIVE' ? <>
                <button className="btn btn-emerald" style={{flex:1,justifyContent:'center'}} onClick={()=>open('deposit',a)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                  Deposit
                </button>
                <button className="btn btn-danger" style={{flex:1,justifyContent:'center'}} onClick={()=>open('withdraw',a)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                  Withdraw
                </button>
              </> : <p style={{color:'var(--text-3)',fontSize:'.85rem',textAlign:'center',width:'100%',padding:'8px 0'}}>Account is {a.status.toLowerCase()} — contact admin</p>}
            </div>
            <div style={{padding:'0 22px 18px',fontSize:'.75rem',color:'var(--text-3)'}}>
              Opened: {new Date(a.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
            </div>
          </div>
        ))}
        {!loading && accounts.length===0 && (
          <div className="empty" style={{gridColumn:'1/-1'}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <h3>No accounts yet</h3>
            <p>Contact your administrator to open an account.</p>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{color:isDeposit?'var(--emerald)':'var(--red)'}}>
                {isDeposit ? '↑ Deposit Money' : '↓ Withdraw Money'}
              </span>
              <button className="modal-close" onClick={close}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{background:'var(--bg)',borderRadius:10,padding:'12px 16px',marginBottom:20}}>
                <div style={{fontSize:'.75rem',color:'var(--text-3)',marginBottom:2}}>Account</div>
                <div style={{fontFamily:'monospace',fontWeight:700}}>{modal.account.accountNumber}</div>
                <div style={{color:'var(--emerald)',fontWeight:700,marginTop:4}}>Balance: ₹{Number(modal.account.balance).toLocaleString('en-IN',{minimumFractionDigits:2})}</div>
              </div>
              <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="form-input" type="number" min="1" step="0.01" value={form.amount}
                    onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                    max={!isDeposit ? modal.account.balance : undefined}
                    placeholder="Enter amount" required/>
                  {!isDeposit && <span style={{fontSize:'.75rem',color:'var(--text-3)'}}>Max: ₹{Number(modal.account.balance).toLocaleString('en-IN')}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <input className="form-input" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Bill payment"/>
                </div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
                  <button type="submit" disabled={saving} className={`btn ${isDeposit?'btn-emerald':'btn-danger'}`}>
                    {saving?<><span className="spinner"/>Processing…</>:isDeposit?'Deposit':'Withdraw'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
