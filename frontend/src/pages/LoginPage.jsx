import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handle = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      toast.success(`Welcome, ${data.fullName}!`)
      navigate(data.role === 'ADMIN' ? '/admin' : '/customer')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      background:'linear-gradient(135deg, #0B1F3A 0%, #132c52 50%, #0B1F3A 100%)',
      position:'relative', overflow:'hidden'
    }}>
      {/* Decorative circles */}
      {[...Array(5)].map((_,i) => (
        <div key={i} style={{
          position:'absolute', borderRadius:'50%',
          background:'rgba(201,151,43,.07)',
          width: [400,250,180,320,150][i],
          height:[400,250,180,320,150][i],
          top: ['10%','-5%','60%','40%','80%'][i],
          left:['-8%','70%','5%','60%','40%'][i],
          pointerEvents:'none'
        }}/>
      ))}

      <div style={{ margin:'auto', width:'100%', maxWidth:440, padding:'0 16px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div className="fade-in" style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{
            width:72, height:72, borderRadius:20, background:'rgba(201,151,43,.15)',
            border:'1.5px solid rgba(201,151,43,.3)', display:'flex',
            alignItems:'center', justifyContent:'center', margin:'0 auto 16px',
            backdropFilter:'blur(8px)'
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L3 12v3h30v-3L18 3z" fill="#C9972B"/>
              <rect x="5" y="15" width="4" height="14" rx="1" fill="#C9972B" opacity=".7"/>
              <rect x="11" y="15" width="4" height="14" rx="1" fill="#C9972B" opacity=".7"/>
              <rect x="17" y="15" width="4" height="14" rx="1" fill="#C9972B" opacity=".7"/>
              <rect x="23" y="15" width="4" height="14" rx="1" fill="#C9972B" opacity=".7"/>
              <rect x="3" y="29" width="30" height="3" rx="1.5" fill="#C9972B"/>
            </svg>
          </div>
          <h1 style={{ fontFamily:'DM Serif Display, serif', fontSize:'2rem', color:'#fff', letterSpacing:'.01em' }}>
            Akshaya Bank
          </h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'.875rem', marginTop:6 }}>
            Secure · Trusted · Always Available
          </p>
        </div>

        {/* Card */}
        <div className="fade-in" style={{
          background:'rgba(255,255,255,.06)', backdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,.12)', borderRadius:20,
          padding:'36px 36px 40px', boxShadow:'0 24px 64px rgba(0,0,0,.4)'
        }} style={{animationDelay:'.1s'}}>
          <h2 style={{ color:'#fff', fontSize:'1.2rem', fontWeight:700, marginBottom:6 }}>Sign in to your account</h2>
          <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.8rem', marginBottom:28 }}>Enter your registered email and password</p>

          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="form-group">
              <label className="form-label" style={{ color:'rgba(255,255,255,.6)' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:.5 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input className="form-input" type="email" placeholder="you@email.com" value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  style={{ paddingLeft:40, background:'rgba(255,255,255,.08)', borderColor:'rgba(255,255,255,.15)', color:'#fff', width:'100%' }}
                  required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color:'rgba(255,255,255,.6)' }}>Password</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:.5 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  style={{ paddingLeft:40, paddingRight:44, background:'rgba(255,255,255,.08)', borderColor:'rgba(255,255,255,.15)', color:'#fff', width:'100%' }}
                  required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.5)', padding:4 }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button className="btn btn-gold btn-lg" type="submit" disabled={loading}
              style={{ marginTop:4, justifyContent:'center', fontSize:'1rem', letterSpacing:'.02em' }}>
              {loading ? <><span className="spinner"/>&nbsp;Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, color:'rgba(255,255,255,.35)', fontSize:'.78rem' }}>
            Don't have an account? Contact your bank administrator.
          </p>
        </div>

        <p style={{ textAlign:'center', marginTop:24, color:'rgba(255,255,255,.25)', fontSize:'.75rem' }}>
          © 2024 Akshaya Bank · All rights reserved
        </p>
      </div>
    </div>
  )
}
