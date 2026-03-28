import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user, data.shop || null);
      toast.success(`Welcome back, ${data.user.firstName}!`);
      navigate(data.user.role === 'owner' ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column' }}>
      {/* Top bar */}
      <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--border)', background:'#fff' }}>
        <Link to="/" className="serif" style={{ fontSize:'1.3rem', color:'var(--brown-dark)', fontWeight:700 }}>🪵 FurniHub</Link>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem' }}>
        <div style={{ width:'100%', maxWidth:440 }}>
          {/* Card */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
            {/* Header */}
            <div style={{ background:'linear-gradient(135deg, var(--brown-darkest), var(--brown-mid))', padding:'2rem', textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'.5rem' }}>🪵</div>
              <h1 className="serif" style={{ color:'#f5e6d3', fontSize:'1.6rem', fontWeight:700 }}>Welcome Back</h1>
              <p style={{ color:'var(--gold)', fontSize:'.82rem', marginTop:'.25rem' }}>Sign in to your FurniHub account</p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" required value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop:'.5rem', justifyContent:'center' }}>
                {loading ? '⏳ Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div style={{ textAlign:'center', padding:'0 1.75rem 1.75rem', fontSize:'.85rem', color:'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'var(--brown-mid)', fontWeight:700 }}>Create one →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
