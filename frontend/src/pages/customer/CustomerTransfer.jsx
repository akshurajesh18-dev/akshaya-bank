import { useEffect, useState } from 'react'
import { customerAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function CustomerTransfer() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ fromAccountNumber:'', toAccountNumber:'', amount:'', description:'' })
  const [saving, setSaving] = useState(false)
  const [receipt, setReceipt] = useState(null)

  useEffect(()=>{ customerAPI.getAccounts().then(r=>setAccounts(r.data)) },[])

  const selectedAccount = accounts.find(a=>a.accountNumber===form.fromAccountNumber)

  const handle = async e => {
    e.preventDefault()
    if (!form.fromAccountNumber) { toast.error('Please select a source account'); return }
    if (form.fromAccountNumber === form.toAccountNumber) { toast.error('Cannot transfer to the same account'); return }
    setSaving(true)
    try {
      const res = await customerAPI.transfer({
        fromAccountNumber: form.fromAccountNumber,
        toAccountNumber:   form.toAccountNumber,
        amount:            Number(form.amount),
        description:       form.description || 'Fund Transfer'
      })
      setReceipt(res.data)
      toast.success('Transfer successful!')
      setForm({ fromAccountNumber:'', toAccountNumber:'', amount:'', description:'' })
      customerAPI.getAccounts().then(r=>setAccounts(r.data))
    } catch(err) { toast.error(err.response?.data?.error || 'Transfer failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Fund Transfer</h1><p className="page-subtitle">Send money to another Akshaya Bank account</p></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>
        {/* Form */}
        <div className="card" style={{padding:28}}>
          <h3 style={{fontWeight:700,marginBottom:22,fontSize:'1rem'}}>Transfer Details</h3>
          <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:18}}>
            <div className="form-group">
              <label className="form-label">From Account</label>
              <select className="form-select" value={form.fromAccountNumber} onChange={e=>setForm(f=>({...f,fromAccountNumber:e.target.value}))} required>
                <option value="">— Select your account —</option>
                {accounts.filter(a=>a.status==='ACTIVE').map(a=>(
                  <option key={a.id} value={a.accountNumber}>
                    {a.accountNumber} — ₹{Number(a.balance).toLocaleString('en-IN')} ({a.accountType.replace('_',' ')})
                  </option>
                ))}
              </select>
              {selectedAccount && (
                <div style={{marginTop:8,background:'rgba(26,122,74,.08)',border:'1px solid rgba(26,122,74,.2)',borderRadius:8,padding:'8px 12px',fontSize:'.82rem'}}>
                  Available: <strong style={{color:'var(--emerald)'}}>₹{Number(selectedAccount.balance).toLocaleString('en-IN',{minimumFractionDigits:2})}</strong>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">To Account Number</label>
              <input className="form-input" value={form.toAccountNumber}
                onChange={e=>setForm(f=>({...f,toAccountNumber:e.target.value}))}
                placeholder="Enter 12-digit account number" required maxLength={12}/>
              <span style={{fontSize:'.75rem',color:'var(--text-3)'}}>Enter the recipient's Akshaya Bank account number</span>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input className="form-input" type="number" min="1" step="0.01"
                max={selectedAccount?.balance}
                value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                placeholder="0.00" required/>
            </div>

            <div className="form-group">
              <label className="form-label">Remark / Description</label>
              <input className="form-input" value={form.description}
                onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                placeholder="e.g. Rent, Groceries, Gift…"/>
            </div>

            {/* Summary */}
            {form.fromAccountNumber && form.toAccountNumber && form.amount && (
              <div style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:12,padding:'14px 16px'}}>
                <p style={{fontWeight:700,fontSize:'.85rem',marginBottom:10,color:'var(--text-2)'}}>Transfer Summary</p>
                {[['From',form.fromAccountNumber],['To',form.toAccountNumber],['Amount','₹'+Number(form.amount).toLocaleString('en-IN',{minimumFractionDigits:2})]].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem',padding:'5px 0',borderBottom:'1px dashed var(--border)'}}>
                    <span style={{color:'var(--text-3)'}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{justifyContent:'center',marginTop:4}} disabled={saving}>
              {saving
                ? <><span className="spinner"/>Processing Transfer…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>Transfer Now</>
              }
            </button>
          </form>
        </div>

        {/* Right panel */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Receipt */}
          {receipt && (
            <div className="card" style={{padding:24,borderLeft:'4px solid var(--emerald)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(26,122,74,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div><p style={{fontWeight:700,color:'var(--emerald)'}}>Transfer Successful</p><p style={{fontSize:'.78rem',color:'var(--text-3)'}}>Transaction ID: {receipt.transactionId}</p></div>
              </div>
              {[['To Account',receipt.referenceAccountNumber],['Amount','₹'+Number(receipt.amount).toLocaleString('en-IN',{minimumFractionDigits:2})],['Balance After','₹'+Number(receipt.balanceAfter).toLocaleString('en-IN',{minimumFractionDigits:2})],['Date',new Date(receipt.createdAt).toLocaleString('en-IN')]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',fontSize:'.85rem'}}>
                  <span style={{color:'var(--text-3)'}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="card" style={{padding:22}}>
            <h4 style={{fontWeight:700,marginBottom:14,fontSize:'.9rem'}}>ℹ Transfer Info</h4>
            {['Transfers are instant within Akshaya Bank.','Double-check the account number before transferring.','Ensure your account has sufficient balance.','All transactions are securely logged.'].map((tip,i)=>(
              <div key={i} style={{display:'flex',gap:10,marginBottom:10,fontSize:'.82rem',color:'var(--text-2)'}}>
                <span style={{color:'var(--gold)',flexShrink:0}}>•</span>{tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
