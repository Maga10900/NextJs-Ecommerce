"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    weeklyDigest: true,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    twoFactor: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/'); return; }
    fetch('https://api.escuelajs.co/api/v1/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setUser(d); setLoading(false); })
      .catch(() => { setUser({ name: "Welcome User", email: "user@example.com" }); setLoading(false); });
  }, [router]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#E4FAF2]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5141]"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#E4FAF2] text-[#093A3E] font-sans">
      <DashboardSidebar user={user} />

      <main className="flex-grow p-6 lg:p-10 pt-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-[#093A3E]">Settings</h1>
            <p className="text-sm text-[#618D80] mt-1">Manage your account preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              saved ? 'bg-[#10B981] text-white' : 'bg-[#0B5141] text-white hover:bg-[#084033] hover-lift'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </header>

        <div className="space-y-6 max-w-3xl">

          {/* Notifications */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-fade-in-up delay-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#A2F0D6] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0B5141]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <h2 className="text-lg font-bold text-[#093A3E]">Notifications</h2>
            </div>
            <div className="space-y-5">
              {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
                const labels: Record<keyof typeof notifications, { title: string; desc: string }> = {
                  orderUpdates: { title: 'Order Updates', desc: 'Get notified when your order status changes' },
                  promotions:   { title: 'Promotions & Deals', desc: 'Receive exclusive member offers and discounts' },
                  newArrivals:  { title: 'New Arrivals', desc: 'Be first to know when new curations land' },
                  weeklyDigest: { title: 'Weekly Digest', desc: 'A curated weekly roundup of trending items' },
                };
                return (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#093A3E] text-sm">{labels[key].title}</p>
                      <p className="text-xs text-[#618D80] mt-0.5">{labels[key].desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${val ? 'bg-[#0B5141]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${val ? 'left-7' : 'left-1'}`}></span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-fade-in-up delay-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EAE2FB] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-[#093A3E]">Privacy & Security</h2>
            </div>
            <div className="space-y-5">
              {(Object.entries(privacy) as [keyof typeof privacy, boolean][]).map(([key, val]) => {
                const labels: Record<keyof typeof privacy, { title: string; desc: string }> = {
                  showProfile: { title: 'Public Profile', desc: 'Allow other members to view your curation list' },
                  twoFactor:   { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account' },
                };
                return (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#093A3E] text-sm">{labels[key].title}</p>
                      <p className="text-xs text-[#618D80] mt-0.5">{labels[key].desc}</p>
                    </div>
                    <button
                      onClick={() => setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${val ? 'bg-[#0B5141]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${val ? 'left-7' : 'left-1'}`}></span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-red-100 animate-fade-in-up delay-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#B91C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
            </div>
            <p className="text-sm text-[#618D80] mb-5">These actions are irreversible. Please proceed with caution.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#FEE2E2] text-[#B91C1C] hover:bg-red-200 transition-colors">
                Delete All Data
              </button>
              <button className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#FEE2E2] text-[#B91C1C] hover:bg-red-200 transition-colors">
                Close Account
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
