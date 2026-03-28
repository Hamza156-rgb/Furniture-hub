import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ICONS = ['🛋️','🛏️','🍽️','🪑','🌿','📦','🧸','🖥️','🛁','🏡'];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'', city:'', address:'', password:'', confirmPassword:'',
    shopName:'', shopNumber:'', shopLocation:'', shopCity:'', shopAddress:'', shopTimings:'', tagline:'',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const payload = { ...form, role };
      const { data } = await registerUser(payload);
      login(data.token, data.user, data.shop || null);
      toast.success(`Account created! Welcome, ${data.user.firstName}!`);
      navigate(role === 'owner' ? '/dashboard' : '/');
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) toast.error(errs[0].msg);
      else toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)' }}>
      <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--border)', background:'#fff', position:'sticky', top:0, zIndex:10 }}>
        <Link to="/" className="serif" style={{ fontSize:'1.3rem', color:'var(--brown-dark)', fontWeight:700 }}>🪵 FurniHub</Link>
      </div>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'2rem 1rem 3rem' }}>
        <div style={{ width:'100%', maxWidth:560 }}>
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
            {/* Header */}
            <div style={{ background:'linear-gradient(135deg, var(--brown-darkest), var(--brown-mid))', padding:'1.75rem', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:'.4rem' }}>🪵</div>
              <h1 className="serif" style={{ color:'#f5e6d3', fontSize:'1.5rem', fontWeight:700 }}>Create Account</h1>
              <p style={{ color:'var(--gold)', fontSize:'.8rem', marginTop:'.2rem' }}>Join Pakistan's furniture marketplace</p>
            </div>

            {/* Role toggle */}
            <div style={{ display:'flex', margin:'1.25rem', background:'var(--cream-mid)', borderRadius:30, padding:'.25rem' }}>
              {[['user','👤 I am a Buyer'], ['owner','🏪 I own a Shop']].map(([r, label]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex:1, padding:'.6rem', border:'none', borderRadius:30,
                  background: role === r ? 'var(--brown-dark)' : 'transparent',
                  color: role === r ? '#f5e6d3' : 'var(--text-muted)',
                  fontWeight: role === r ? 700 : 500, fontSize:'.85rem', cursor:'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ padding:'0 1.25rem 1.75rem', display:'flex', flexDirection:'column', gap:'.85rem' }}>
              {/* ── Personal info ── */}
              <SectionTitle>Personal Information</SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                <Field label="First Name" required value={form.firstName} onChange={v => set('firstName', v)} />
                <Field label="Last Name"  required value={form.lastName}  onChange={v => set('lastName', v)} />
              </div>
              <Field label="Email Address" type="email" required value={form.email} onChange={v => set('email', v)} />
              <Field label="Phone Number"  required value={form.phone}  onChange={v => set('phone', v)} placeholder="+92-300-0000000" />
              <Field label="City"          required value={form.city}   onChange={v => set('city', v)} />
              <Field label="Address"       required value={form.address} onChange={v => set('address', v)} />

              {/* ── Shop info (owner only) ── */}
              {role === 'owner' && (
                <>
                  <div className="divider" />
                  <SectionTitle>Shop Information</SectionTitle>
                  <Field label="Shop Name"           required value={form.shopName}     onChange={v => set('shopName', v)} />
                  <Field label="Shop Phone Number"   required value={form.shopNumber}   onChange={v => set('shopNumber', v)} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                    <Field label="Shop City"     required value={form.shopCity}     onChange={v => set('shopCity', v)} />
                    <Field label="Shop Location / Area" required value={form.shopLocation} onChange={v => set('shopLocation', v)} />
                  </div>
                  <Field label="Shop Address" required value={form.shopAddress} onChange={v => set('shopAddress', v)} />
                  <Field label="Shop Timings" required value={form.shopTimings} onChange={v => set('shopTimings', v)} placeholder="e.g. 10:00 AM – 9:00 PM" />
                  <Field label="Shop Tagline (optional)" value={form.tagline} onChange={v => set('tagline', v)} placeholder="e.g. Quality Furniture Since 1990" />
                  <div style={{ background:'var(--cream-mid)', borderRadius:'var(--radius-sm)', padding:'.75rem', fontSize:'.8rem', color:'var(--text-muted)' }}>
                    📷 You can upload your shop logo after registration from the Dashboard → Shop Profile
                  </div>
                </>
              )}

              {/* ── Password ── */}
              <div className="divider" />
              <SectionTitle>Set Password</SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                <Field label="Password"         type="password" required value={form.password}        onChange={v => set('password', v)} placeholder="Min. 6 characters" />
                <Field label="Confirm Password" type="password" required value={form.confirmPassword} onChange={v => set('confirmPassword', v)} />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop:'.75rem', justifyContent:'center' }}>
                {loading ? '⏳ Creating Account...' : `Create ${role === 'owner' ? 'Shop Owner' : 'User'} Account →`}
              </button>
            </form>

            <div style={{ textAlign:'center', padding:'0 1.25rem 1.5rem', fontSize:'.85rem', color:'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'var(--brown-mid)', fontWeight:700 }}>Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontWeight:700, color:'var(--text-mid)', fontSize:'.85rem', textTransform:'uppercase', letterSpacing:'.06em' }}>{children}</div>;
}

function Field({ label, type='text', required, value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <div style={{ position:'relative' }}>
        <input 
          className="form-input" 
          type={isPassword && showPassword ? 'text' : type} 
          required={required} 
          value={value} 
          placeholder={placeholder || ''} 
          onChange={e => onChange(e.target.value)}
          style={isPassword ? { paddingRight:'2.5rem' } : {}}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position:'absolute',
              right:'0.75rem',
              top:'50%',
              transform:'translateY(-50%)',
              border:'none',
              background:'none',
              cursor:'pointer',
              color:'var(--text-muted)',
              padding:'0.25rem'
            }}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
