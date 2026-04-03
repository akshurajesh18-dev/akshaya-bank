import { useEffect, useState } from 'react'
import { customerAPI } from '../../services/api'

const TYPE_BADGE = { DEPOSIT:'badge-green', WITHDRAWAL:'badge-red', TRANSFER_IN:'badge-blue', TRANSFER_OUT:'badge-yellow' }
const TYPE_SIGN  = t => t==='DEPOSIT'||t==='TRANSFER_IN' ? '+' : '-'
const TYPE_COLOR = t => t==='DEPOSIT'||t==='TRANSFER_IN' ? 'var(--emerald)' : 'var(--red)'

export default function CustomerTransactions() {
  const [txns, setTxns]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')

  useEffect(()=>{ customerAPI.getTransactions().then(r=>setTxns(r.data)).finally(()=>setLoading(false)) },[])

  const filtered = txns.filter(t=>{
    const matchType = filter==='ALL' || t.type===filter
    const matchSearch = t.accountNumber?.includes(search) || t.description?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totals = { credit:0, debit:0 }
  txns.forEach(t=>{
    if(t.type==='DEPOSIT'||t.type==='TRANSFER_IN') totals.credit+=Number(t.amount)
    else totals.debit+=Number(t.amount)
  })

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Transactions</h1><p className="page-subtitle">Your complete transaction history</p></div>
      </div>

      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:22}}>
        {[
          {label:'Total Transactions',value:txns.length,color:'var(--navy)',bg:'rgba(11,31,58,.06)'},
          {label:'Total Credits',value:'₹'+totals.credit.toLocaleString('en-IN',{minimumFractionDigits:2}),color:'var(--emerald)',bg:'rgba(26,122,74,.08)'},
          {label:'Total Debits',value:'₹'+totals.debit.toLocaleString('en-IN',{minimumFractionDigits:2}),color:'var(--red)',bg:'rgba(192,57,43,.08)'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:'16px 20px',borderLeft:`4px solid ${s.color}`}}>
            <div style={{fontSize:'.75rem',color:'var(--text-3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>{s.label}</div>
            <div style={{fontWeight:800,fontSize:'1.35rem',color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <input className="form-input" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:240}}/>
        {['ALL','DEPOSIT','WITHDRAWAL','TRANSFER_IN','TRANSFER_OUT'].map(v=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:'7px 14px',borderRadius:20,border:`1.5px solid ${filter===v?'var(--navy)':'var(--border)'}`,background:filter===v?'var(--navy)':'var(--surface)',color:filter===v?'#fff':'var(--text)',cursor:'pointer',fontFamily:'var(--font)',fontWeight:600,fontSize:'.78rem',transition:'all .15s'}}>
            {v.replace('_',' ')}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Account</th><th>Description</th><th>Reference</th></tr></thead>
            <tbody>
              {loading&&<tr><td colSpan={7} style={{textAlign:'center',padding:40}}><div className="spinner dark" style={{margin:'0 auto'}}/></td></tr>}
              {!loading&&filtered.map(t=>(
                <tr key={t.id}>
                  <td style={{fontSize:'.78rem',color:'var(--text-3)',whiteSpace:'nowrap'}}>{new Date(t.createdAt).toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${TYPE_BADGE[t.type]||'badge-gray'}`}>{t.type?.replace('_',' ')}</span></td>
                  <td style={{fontWeight:700,color:TYPE_COLOR(t.type)}}>{TYPE_SIGN(t.type)}₹{Number(t.amount).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                  <td>₹{Number(t.balanceAfter).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                  <td style={{fontFamily:'monospace',fontSize:'.82rem'}}>{t.accountNumber}</td>
                  <td style={{color:'var(--text-2)',fontSize:'.82rem'}}>{t.description||'—'}</td>
                  <td style={{fontFamily:'monospace',fontSize:'.75rem',color:'var(--text-3)'}}>{t.referenceAccountNumber||'—'}</td>
                </tr>
              ))}
              {!loading&&filtered.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-3)'}}>No transactions found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
