"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import { cleanImageUrl } from '@/lib/images';

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pwError, setPwError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
  });
  const [pwForm, setPwForm] = useState({
    current: '',
    newPw: '',
    confirm: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/'); return; }
    fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        setUser(d);
        // Platzi API wraps avatar in ["..."] — strip brackets
        const rawAvatar = d.avatar || '';
        const cleanAvatar = rawAvatar.replace(/[\[\]"]/g, '').trim();
        setForm({ name: d.name || '', email: d.email || '', avatar: cleanAvatar, bio: '' });
        setAvatarPreview(cleanAvatar);
        setLoading(false);
      })
      .catch(() => {
        const mock = { id: 0, name: 'Welcome User', email: 'user@example.com', avatar: '', role: 'customer' };
        setUser(mock);
        setForm({ name: mock.name, email: mock.email, avatar: '', bio: '' });
        setLoading(false);
      });
  }, [router]);

  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'avatar') setAvatarPreview(value);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !user?.id) return;
    setSaving(true);
    setSaveStatus('idle');

    try {
      const body: any = { name: form.name, email: form.email, avatar: form.avatar };

      // Only include password if the user filled it out
      if (pwForm.newPw) {
        if (pwForm.newPw !== pwForm.confirm) {
          setPwError("Passwords don't match");
          setSaving(false);
          return;
        }
        body.password = pwForm.newPw;
        setPwError('');
      }

      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setUser(updated);
      setAvatarPreview(updated.avatar || '');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getAvatarSrc = (url: string, name: string) => {
    return cleanImageUrl(url, `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0B5141&color=fff&size=112`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#E4FAF2]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5141]"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#E4FAF2] text-[#093A3E] font-sans">
      <DashboardSidebar user={{ ...user, avatar: avatarPreview, name: form.name }} />

      <main className="flex-grow p-6 lg:p-10 pt-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-[#093A3E]">My Profile</h1>
            <p className="text-sm text-[#618D80] mt-1">Manage your personal information and account settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center space-x-2 ${
              saveStatus === 'success'
                ? 'bg-[#10B981] text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#0B5141] text-white hover:bg-[#084033] hover-lift'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            <span>
              {saving ? 'Saving...' : saveStatus === 'success' ? '✓ Saved!' : saveStatus === 'error' ? '✗ Failed' : 'Save Changes'}
            </span>
          </button>
        </header>

        <div className="max-w-3xl space-y-6">

          {/* Avatar Card */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-fade-in-up delay-100">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Avatar Image */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#E4FAF2] shadow-xl bg-[#A2F0D6]">
                  <img
                    src={getAvatarSrc(avatarPreview, form.name)}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAvatarSrc('', form.name);
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowAvatarInput(v => !v)}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-[#0B5141] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#084033] transition-colors"
                  title="Change avatar URL"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              {/* Avatar Info */}
              <div className="flex-grow w-full">
                <h2 className="text-xl font-bold text-[#093A3E] mb-0.5">{form.name || user?.name || 'User'}</h2>
                <p className="text-sm text-[#618D80] mb-3">{form.email || user?.email}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#9BF1CD] text-[#0B5141] text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {user?.role || 'Member'}
                  </span>
                  <span className="bg-[#EAE2FB] text-[#7C3AED] text-xs font-bold px-3 py-1 rounded-full">
                    2,840 Points
                  </span>
                </div>

                {/* Avatar URL input */}
                {showAvatarInput && (
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Avatar URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.avatar}
                        onChange={e => handleFormChange('avatar', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="flex-grow bg-[#F0FDF8] text-[#093A3E] px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all placeholder-[#a0c4b7]"
                      />
                      <button
                        onClick={() => setShowAvatarInput(false)}
                        className="px-4 py-2 rounded-xl bg-[#0B5141] text-white text-xs font-bold hover:bg-[#084033] transition-colors"
                      >Apply</button>
                    </div>
                    <p className="text-[10px] text-[#618D80] mt-1.5 ml-1">Paste a direct image URL to update your avatar</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Personal Info Form */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-fade-in-up delay-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#A2F0D6] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0B5141]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#093A3E]">Personal Information</h2>
                <p className="text-xs text-[#618D80]">This data is saved to your account via the API</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleFormChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#F0FDF8] text-[#093A3E] px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all placeholder-[#a0c4b7]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#F0FDF8] text-[#093A3E] px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all placeholder-[#a0c4b7]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Role</label>
                <div className="bg-[#F0FDF8] text-[#618D80] px-4 py-3 rounded-xl text-sm font-medium capitalize border border-[#E4FAF2]">
                  {user?.role || 'customer'}
                  <span className="text-xs ml-2 text-[#a0c4b7]">(read-only)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Member ID</label>
                <div className="bg-[#F0FDF8] text-[#618D80] px-4 py-3 rounded-xl text-sm font-medium border border-[#E4FAF2]">
                  #{user?.id || '—'}
                  <span className="text-xs ml-2 text-[#a0c4b7]">(read-only)</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={e => handleFormChange('avatar', e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full bg-[#F0FDF8] text-[#093A3E] px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all placeholder-[#a0c4b7]"
                />
              </div>
            </div>
          </section>

          {/* Change Password */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-fade-in-up delay-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FFE5CA] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#093A3E]">Change Password</h2>
                <p className="text-xs text-[#618D80]">Leave blank to keep current password</p>
              </div>
            </div>

            {pwError && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                {pwError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={pwForm.newPw}
                  onChange={e => setPwForm(prev => ({ ...prev, newPw: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-[#F0FDF8] text-[#093A3E] px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all placeholder-[#a0c4b7]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#618D80] uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className={`w-full bg-[#F0FDF8] text-[#093A3E] px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all placeholder-[#a0c4b7] ${
                    pwForm.confirm && pwForm.newPw !== pwForm.confirm
                      ? 'ring-2 ring-red-300 focus:ring-red-400'
                      : 'focus:ring-[#A7EBD5]'
                  }`}
                />
                {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                  <p className="text-xs text-red-500 mt-1.5 ml-1">Passwords do not match</p>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
