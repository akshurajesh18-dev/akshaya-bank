import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState([])
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState({ userId:'', accountType:'SAVINGS', initialDeposit:'0' })
  const [editForm, setEditForm] = useState({ status:'ACTIVE', accountType:'SAVINGS' })
  const [saving, setSaving]     = useState(false)
  const [search, setSearch]     = useState('')

  const load = () => Promise.all([adminAPI.getAccounts(), adminAPI.getUsers()])
    .then(([a,u])=>{ setAccounts(a.data); setUsers(u.data) }).finally(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const customers = users.filter(u=>u.role==='CUSTOMER'&&u.isActive)

  const handleCreate = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await adminAPI.createAccount({ userId:Number(form.userId), accountType:form.accountType, initialDeposit:Number(form.initialDeposit) })
      toast.success('Account created!'); setModal(null); load()
    } catch(err){ toast.error(err.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleEdit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await adminAPI.updateAccount(selected.id, editForm)
      toast.success('Account updated!'); setModal(null); load()
    } catch(err){ toast.error(err.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const statusColor = s => ({ ACTIVE:'badge-green', INACTIVE:'badge-gray', FROZEN:'badge-blue', CLOSED:'badge-red' }[s]||'badge-gray')
  const filtered = accounts.filter(a =>
    a.accountNumber.includes(search) ||
    a.userFullName?.toLowerCase().includes(search.toLowerCase()) ||
    a.accountType.includes(search.toUpperCase())
  )

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Accounts</h1><p className="page-subtitle">Create and manage bank accounts</p></div>
        <button className="btn btn-primary" onClick={()=>setModal('create')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Open Account
        </button>
      </div>

      <div className="card" style={{marginBottom:20,padding:'14px 18px'}}>
        <input className="form-input" placeholder="Search by account no, customer name or type…" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:380}}/>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Account No</th><th>Customer</th><th>Type</th><th>Balance</th><th>Status</th><th>Opened</th><th>Actions</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{textAlign:'center',padding:40}}><div className="spinner dark" style={{margin:'0 auto'}}/></td></tr>}
              {!loading && filtered.map(a=>(
                <tr key={a.id}>
                  <td style={{fontFamily:'monospace',fontWeight:700,letterSpacing:'.05em'}}>{a.accountNumber}</td>
                  <td>
                    <div style={{fontWeight:600}}>{a.userFullName}</div>
                    <div style={{fontSize:'.75rem',color:'var(--text-3)'}}>{a.userEmail}</div>
                  </td>
                  <td><span className="badge badge-blue">{a.accountType.replace('_',' ')}</span></td>
                  <td style={{fontWeight:700,color:'var(--emerald)'}}>₹{Number(a.balance).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                  <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                  <td style={{fontSize:'.8rem',color:'var(--text-3)'}}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={()=>{setSelected(a);setEditForm({status:a.status,accountType:a.accountType});setModal('edit')}}>Edit</button>
                  </td>
                </tr>
              ))}
              {!loading&&filtered.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-3)'}}>No accounts found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create */}
      {modal==='create'&&(
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Open New Account</span><button className="modal-close" onClick={()=>setModal(null)}>✕</button></div>
            <div className="modal-body">
              <form onSubmit={handleCreate} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div className="form-group">
                  <label className="form-label">Customer</label>
                  <select className="form-select" value={form.userId} onChange={e=>setForm(f=>({...f,userId:e.target.value}))} required>
                    <option value="">— Select Customer —</option>
                    {customers.map(u=><option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <select className="form-select" value={form.accountType} onChange={e=>setForm(f=>({...f,accountType:e.target.value}))}>
                    <option value="SAVINGS">Savings</option>
                    <option value="CURRENT">Current</option>
                    <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Deposit (₹)</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={form.initialDeposit} onChange={e=>setForm(f=>({...f,initialDeposit:e.target.value}))} required/>
                </div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?<><span className="spinner"/>Opening…</>:'Open Account'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit */}
      {modal==='edit'&&selected&&(
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Edit Account</span><button className="modal-close" onClick={()=>setModal(null)}>✕</button></div>
            <div className="modal-body">
              <div style={{background:'var(--bg)',borderRadius:10,padding:'12px 16px',marginBottom:20}}>
                <div style={{fontFamily:'monospace',fontWeight:700,fontSize:'1.1rem'}}>{selected.accountNumber}</div>
                <div style={{color:'var(--text-3)',fontSize:'.8rem',marginTop:2}}>{selected.userFullName}</div>
              </div>
              <form onSubmit={handleEdit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <select className="form-select" value={editForm.accountType} onChange={e=>setEditForm(f=>({...f,accountType:e.target.value}))}>
                    <option value="SAVINGS">Savings</option>
                    <option value="CURRENT">Current</option>
                    <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="FROZEN">Frozen</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?<><span className="spinner"/>Saving…</>:'Save Changes'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
