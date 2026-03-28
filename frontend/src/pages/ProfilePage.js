import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../utils/api';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
    city:      user?.city      || '',
    address:   user?.address   || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setPw = (k, v) => setPwForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      await loadUser();
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setChangingPw(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setChangingPw(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop:'2.5rem', paddingBottom:'3rem', maxWidth:640 }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom:'1.5rem' }}>← Back</button>
        <h1 className="serif" style={{ fontSize:'1.75rem', fontWeight:700, marginBottom:'1.5rem' }}>My Profile</h1>

        {/* User info */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.75rem', marginBottom:'1.5rem' }}>
          <h3 style={{ fontWeight:700, marginBottom:'1.25rem', color:'var(--text-main)' }}>Personal Information</h3>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
              <Field label="First Name" value={form.firstName} onChange={v => set('firstName', v)} />
              <Field label="Last Name"  value={form.lastName}  onChange={v => set('lastName', v)} />
            </div>
            <Field label="Phone Number" value={form.phone}   onChange={v => set('phone', v)} />
            <Field label="City"         value={form.city}    onChange={v => set('city', v)} />
            <Field label="Address"      value={form.address} onChange={v => set('address', v)} />
            <div style={{ background:'var(--cream-mid)', borderRadius:'var(--radius-sm)', padding:'.75rem', fontSize:'.82rem', color:'var(--text-muted)' }}>
              📧 Email: <strong>{user?.email}</strong> (cannot be changed)
              &nbsp;·&nbsp; 🎭 Role: <strong style={{ textTransform:'capitalize' }}>{user?.role}</strong>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.75rem' }}>
          <h3 style={{ fontWeight:700, marginBottom:'1.25rem', color:'var(--text-main)' }}>Change Password</h3>
          <form onSubmit={handlePwChange} style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
            <Field label="Current Password" type="password" value={pwForm.currentPassword} onChange={v => setPw('currentPassword', v)} />
            <Field label="New Password"     type="password" value={pwForm.newPassword}     onChange={v => setPw('newPassword', v)} placeholder="Min. 6 characters" />
            <Field label="Confirm New Password" type="password" value={pwForm.confirmPassword} onChange={v => setPw('confirmPassword', v)} />
            <button type="submit" className="btn btn-outline" disabled={changingPw}>
              {changingPw ? '⏳ Changing...' : '🔐 Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type='text', value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />
    </div>
  );
}
