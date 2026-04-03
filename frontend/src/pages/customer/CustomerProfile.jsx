import { useEffect, useState } from 'react'
import { customerAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function CustomerProfile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({})
  const [saving, setSaving]   = useState(false)

  const load = () => customerAPI.getProfile().then(r=>{ setProfile(r.data); setForm({ fullName:r.data.fullName, phone:r.data.phone, address:r.data.address, password:'' }) }).finally(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { fullName:form.fullName, phone:form.phone, address:form.address }
      if (form.password) payload.password = form.password
      await customerAPI.updateProfile(payload)
      toast.success('Profile updated!'); setEditing(false); load()
    } catch(err){ toast.error(err.response?.data?.error||'Update failed') }
    finally{ setSaving(false) }
  }

  if(loading) return <div style={{display:'flex',justifyContent:'center',paddingTop:80}}><div className="spinner dark"/></div>

  return (
    <div className="fade-in" style={{maxWidth:680}}>
      <div className="page-header">
        <div><h1 className="page-title">My Profile</h1><p className="page-subtitle">Manage your personal information</p></div>
        {!editing && <button className="btn btn-primary" onClick={()=>setEditing(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Profile
        </button>}
      </div>

      {/* Avatar + name */}
      <div className="card" style={{padding:28,marginBottom:20,display:'flex',alignItems:'center',gap:22}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--navy)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.8rem',flexShrink:0}}>
          {profile?.fullName?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 style={{fontWeight:800,fontSize:'1.3rem'}}>{profile?.fullName}</h2>
          <p style={{color:'var(--text-3)',fontSize:'.875rem',marginTop:3}}>{profile?.email}</p>
          <span className={`badge ${profile?.isActive?'badge-green':'badge-red'}`} style={{marginTop:8}}>
            {profile?.isActive?'Active':'Inactive'}
          </span>
        </div>
      </div>

      {/* Info / Edit form */}
      <div className="card" style={{padding:28}}>
        {!editing ? (
          <div>
            <h3 style={{fontWeight:700,fontSize:'1rem',marginBottom:20}}>Personal Information</h3>
            {[['Full Name',profile?.fullName],['Email Address',profile?.email],['Phone Number',profile?.phone],['Address',profile?.address],['Member Since',new Date(profile?.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})]].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'13px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{color:'var(--text-3)',fontSize:'.875rem',fontWeight:500,minWidth:140}}>{k}</span>
                <span style={{fontWeight:600,fontSize:'.875rem',textAlign:'right'}}>{v||'—'}</span>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>
            <h3 style={{fontWeight:700,fontSize:'1rem',marginBottom:4}}>Edit Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" value={profile?.email} disabled style={{opacity:.6,cursor:'not-allowed'}}/>
              <span style={{fontSize:'.75rem',color:'var(--text-3)'}}>Email cannot be changed. Contact admin if needed.</span>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required pattern="[0-9]{10}"/>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} required/>
            </div>
            <div className="form-group">
              <label className="form-label">New Password <span style={{color:'var(--text-3)',fontWeight:400,textTransform:'none'}}>(leave blank to keep current)</span></label>
              <input className="form-input" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} minLength={6} placeholder="Min 6 characters"/>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:4}}>
              <button type="button" className="btn btn-outline" onClick={()=>setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?<><span className="spinner"/>Saving…</>:'Save Changes'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
