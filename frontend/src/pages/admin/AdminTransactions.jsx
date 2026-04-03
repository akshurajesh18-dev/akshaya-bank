import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const TYPE_BADGE = { DEPOSIT:'badge-green', WITHDRAWAL:'badge-red', TRANSFER_IN:'badge-blue', TRANSFER_OUT:'badge-yellow' }

export default function AdminTransactions() {
  const [txns, setTxns]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('ALL')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ accountNumber:'', amount:'', description:'' })
  const [saving, setSaving]   = useState(false)

  const load = () => adminAPI.getTransactions().then(r=>setTxns(r.data)).finally(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const handleDeposit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await adminAPI.adminDeposit({ accountNumber:form.accountNumber, amount:Number(form.amount), description:form.description||'Admin credit' })
      toast.success('Deposit successful!'); setModal(false); load()
      setForm({ accountNumber:'', amount:'', description:'' })
    } catch(err){ toast.error(err.response?.data?.error||'Failed') }
    finally{ setSaving(false) }
  }

  const filtered = txns.filter(t => {
    const matchSearch = t.accountNumber?.includes(search) || t.transactionId?.toLowerCase().includes(search.toLowerCase())
    const matchType   = filter==='ALL' || t.type===filter
    return matchSearch && matchType
  })

  const total = { DEPOSIT:0, WITHDRAWAL:0, TRANSFER_IN:0, TRANSFER_OUT:0 }
  txns.forEach(t=>{ if(total[t.type]!==undefined) total[t.type]++ })

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Transactions</h1><p className="page-subtitle">All bank transaction history</p></div>
        <button className="btn btn-emerald" onClick={()=>setModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Admin Deposit
        </button>
      </div>

      {/* Summary chips */}
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        {[['ALL','All',txns.length,'badge-gray'],['DEPOSIT','Deposits',total.DEPOSIT,'badge-green'],['WITHDRAWAL','Withdrawals',total.WITHDRAWAL,'badge-red'],['TRANSFER_IN','Transfers In',total.TRANSFER_IN,'badge-blue'],['TRANSFER_OUT','Transfers Out',total.TRANSFER_OUT,'badge-yellow']].map(([val,label,count,cls])=>(
          <button key={val} onClick={()=>setFilter(val)}
            style={{padding:'7px 16px',borderRadius:20,border:`2px solid ${filter===val?'var(--navy)':'var(--border)'}`,background:filter===val?'var(--navy)':'var(--surface)',color:filter===val?'#fff':'var(--text)',cursor:'pointer',fontFamily:'var(--font)',fontWeight:600,fontSize:'.8rem',display:'flex',alignItems:'center',gap:7,transition:'all .2s'}}>
            {label} <span className={`badge ${cls}`} style={{padding:'1px 7px'}}>{count}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{marginBottom:20,padding:'14px 18px'}}>
        <input className="form-input" placeholder="Search by account no or transaction ID…" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:380}}/>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Txn ID</th><th>Account No</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {loading&&<tr><td colSpan={8} style={{textAlign:'center',padding:40}}><div className="spinner dark" style={{margin:'0 auto'}}/></td></tr>}
              {!loading&&filtered.map(t=>(
                <tr key={t.id}>
                  <td style={{fontFamily:'monospace',fontSize:'.75rem',color:'var(--text-3)'}}>{t.transactionId?.slice(-14)}</td>
                  <td style={{fontWeight:700,fontFamily:'monospace'}}>{t.accountNumber}</td>
                  <td><span className={`badge ${TYPE_BADGE[t.type]||'badge-gray'}`}>{t.type?.replace('_',' ')}</span></td>
                  <td style={{fontWeight:700,color:t.type==='DEPOSIT'||t.type==='TRANSFER_IN'?'var(--emerald)':'var(--red)'}}>
                    {t.type==='DEPOSIT'||t.type==='TRANSFER_IN'?'+':'-'}₹{Number(t.amount).toLocaleString('en-IN',{minimumFractionDigits:2})}
                  </td>
                  <td>₹{Number(t.balanceAfter).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                  <td style={{fontSize:'.82rem',color:'var(--text-2)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.description||'—'}</td>
                  <td><span className={`badge ${t.status==='SUCCESS'?'badge-green':t.status==='FAILED'?'badge-red':'badge-yellow'}`}>{t.status}</span></td>
                  <td style={{fontSize:'.78rem',color:'var(--text-3)',whiteSpace:'nowrap'}}>{new Date(t.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {!loading&&filtered.length===0&&<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'var(--text-3)'}}>No transactions found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal&&(
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Admin Deposit</span><button className="modal-close" onClick={()=>setModal(false)}>✕</button></div>
            <div className="modal-body">
              <p style={{color:'var(--text-3)',fontSize:'.875rem',marginBottom:20}}>Credit money to any active account directly.</p>
              <form onSubmit={handleDeposit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div className="form-group"><label className="form-label">Account Number</label><input className="form-input" value={form.accountNumber} onChange={e=>setForm(f=>({...f,accountNumber:e.target.value}))} placeholder="12-digit account number" required/></div>
                <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" min="1" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} required/></div>
                <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Opening bonus"/></div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-emerald" disabled={saving}>{saving?<><span className="spinner"/>Processing…</>:'Deposit'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
