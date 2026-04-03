import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const emptyForm = { email:'', password:'', fullName:'', phone:'', address:'' }

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null) // null | 'create' | 'edit' | 'view'
  const [selected, setSelected] = useState(null)
  const [form, setForm]       = useState(emptyForm)
  const [saving, setSaving]   = useState(false)
  const [search, setSearch]   = useState('')

  const load = () => adminAPI.getUsers().then(r => setUsers(r.data)).finally(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const openCreate = () => { setForm(emptyForm); setModal('create') }
  const openEdit   = u  => { setSelected(u); setForm({ fullName:u.fullName, phone:u.phone, address:u.address, password:'', email:u.email, isActive:u.isActive }); setModal('edit') }
  const openView   = u  => { setSelected(u); setModal('view') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleCreate = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await adminAPI.createUser(form)
      toast.success('Customer created!'); closeModal(); load()
    } catch(err){ toast.error(err.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleEdit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await adminAPI.updateUser(selected.id, { fullName:form.fullName, phone:form.phone, address:form.address, isActive:form.isActive, password:form.password||undefined })
      toast.success('Updated!'); closeModal(); load()
    } catch(err){ toast.error(err.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleDeactivate = async id => {
    if (!confirm('Deactivate this customer?')) return
    await adminAPI.deleteUser(id)
    toast.success('Customer deactivated'); load()
  }

  const filtered = users.filter(u=>u.role==='CUSTOMER' && (
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  ))

  return (
    <div className="fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Customers</h1><p className="page-subtitle">Manage all bank customers</p></div>
        <button className="btn btn-primary" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Customer
        </button>
      </div>

      <div className="card" style={{ marginBottom:20, padding:'14px 18px' }}>
        <input className="form-input" placeholder="Search by name, email or phone…" value={search}
          onChange={e=>setSearch(e.target.value)} style={{ maxWidth:340 }}/>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{textAlign:'center',padding:40}}><div className="spinner dark" style={{margin:'0 auto'}}/></td></tr>}
              {!loading && filtered.map((u,i)=>(
                <tr key={u.id}>
                  <td style={{color:'var(--text-3)',fontSize:'.8rem'}}>{i+1}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:34,height:34,borderRadius:'50%',background:'var(--navy)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.85rem',flexShrink:0}}>{u.fullName[0]}</div>
                      <span style={{fontWeight:600}}>{u.fullName}</span>
                    </div>
                  </td>
                  <td style={{color:'var(--text-2)'}}>{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className={`badge ${u.isActive?'badge-green':'badge-red'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                  <td style={{fontSize:'.8rem',color:'var(--text-3)'}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>openView(u)}>View</button>
                      <button className="btn btn-primary btn-sm" onClick={()=>openEdit(u)}>Edit</button>
                      {u.isActive && <button className="btn btn-danger btn-sm" onClick={()=>handleDeactivate(u.id)}>Deactivate</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length===0 && <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-3)'}}>No customers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modal==='create' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">New Customer</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreate} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} required/></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
                  <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required minLength={6}/></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required pattern="[0-9]{10}"/></div>
                </div>
                <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} required/></div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:4}}>
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?<><span className="spinner"/>Saving…</>:'Create Customer'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modal==='edit' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Edit — {selected.fullName}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} required/></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required/></div>
                  <div className="form-group"><label className="form-label">New Password <span style={{color:'var(--text-3)',fontWeight:400}}>(leave blank to keep)</span></label><input className="form-input" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} minLength={6}/></div>
                  <div className="form-group"><label className="form-label">Status</label>
                    <select className="form-select" value={form.isActive?'true':'false'} onChange={e=>setForm(f=>({...f,isActive:e.target.value==='true'}))}>
                      <option value="true">Active</option><option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} required/></div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:4}}>
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?<><span className="spinner"/>Saving…</>:'Save Changes'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal==='view' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Customer Details</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,padding:'16px',background:'var(--bg)',borderRadius:12}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'var(--navy)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'1.4rem'}}>{selected.fullName[0]}</div>
                <div><div style={{fontWeight:700,fontSize:'1.1rem'}}>{selected.fullName}</div><div style={{color:'var(--text-3)',fontSize:'.85rem'}}>{selected.email}</div></div>
              </div>
              {[['Phone',selected.phone],['Address',selected.address],['Role',selected.role],['Status',selected.isActive?'Active':'Inactive'],['Joined',new Date(selected.createdAt).toLocaleDateString('en-IN')]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{color:'var(--text-3)',fontSize:'.875rem'}}>{k}</span>
                  <span style={{fontWeight:600,fontSize:'.875rem'}}>{v}</span>
                </div>
              ))}
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:20}} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
