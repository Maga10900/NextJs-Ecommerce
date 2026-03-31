"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/'); return; }

    fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => { if (!res.ok) throw new Error("Unauthorized"); return res.json(); })
    .then(data => { setUser(data); setLoading(false); })
    .catch(() => {
      setUser({ name: "Welcome User", email: "user@example.com", avatar: "" });
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E4FAF2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5141]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#E4FAF2] text-[#093A3E] font-sans">
      <DashboardSidebar user={user} />

      <main className="flex-grow p-6 lg:p-10 pt-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-[#093A3E]">Account Overview</h1>
          <div className="flex items-center space-x-5">
            <div className="relative hidden sm:block">
              <svg className="w-4 h-4 text-[#618D80] absolute left-4 top-[11px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search orders..." className="bg-white/60 focus:bg-white text-sm text-[#093A3E] placeholder-[#a0c4b7] rounded-full py-2.5 pl-10 pr-4 w-64 focus:outline-none ring-1 ring-[#c0e8d6] focus:ring-2 focus:ring-[#A7EBD5] transition-all"/>
            </div>
            <button className="text-[#0B5141] hover:text-[#084033] relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-[#E4FAF2]"></span>
            </button>
            <Link href="/cart" className="text-[#0B5141] hover:text-[#084033]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </Link>
          </div>
        </header>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up delay-100">
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-7 shadow-sm flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-[11px] font-bold text-[#618D80] uppercase tracking-widest mb-2">Total Spent</h4>
                <div className="text-3xl font-extrabold text-[#093A3E]">$12,482.50</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#A2F0D6] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#0B5141]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>
            <div>
              <div className="flex items-end space-x-1 mb-2 h-8">
                <div className="w-1.5 bg-[#8AEbc2] h-4 rounded-t-sm"></div>
                <div className="w-1.5 bg-[#8AEbc2] h-6 rounded-t-sm"></div>
                <div className="w-1.5 bg-[#0B5141] h-8 rounded-t-sm"></div>
                <div className="w-1.5 bg-[#8AEbc2] h-5 rounded-t-sm"></div>
                <div className="w-1.5 bg-[#8AEbc2] h-7 rounded-t-sm"></div>
              </div>
              <p className="text-[10px] font-bold text-[#10B981]">+12% from last month</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-7 shadow-sm flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[11px] font-bold text-[#618D80] uppercase tracking-widest mb-2">Active Orders</h4>
                <div className="text-3xl font-extrabold text-[#093A3E]">04</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FFE5CA] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-[11px] font-bold text-[#093A3E]">Delivery Progress</p>
                <span className="text-[11px] font-bold text-[#093A3E]">75%</span>
              </div>
              <div className="w-full bg-[#E4FAF2] rounded-full h-1.5">
                <div className="bg-[#0B5141] h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-7 shadow-sm flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[11px] font-bold text-[#618D80] uppercase tracking-widest mb-2">Reward Points</h4>
                <div className="text-3xl font-extrabold text-[#093A3E]">2,840</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#EAE2FB] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#7C3AED]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#A2F0D6] border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-[#FFE5CA] border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-[#EAE2FB] border-2 border-white"></div>
              </div>
              <p className="text-[11px] font-medium text-[#618D80]">Next tier: Platinum</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-8 overflow-hidden animate-fade-in-up delay-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-bold text-[#093A3E] mb-1">Recent Orders</h2>
              <p className="text-sm text-[#618D80]">Manage and track your latest acquisitions</p>
            </div>
            <Link href="/profile" className="bg-[#0B5141] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center shadow-lg hover:bg-[#084033] hover-lift transition-all shrink-0">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              View All History
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E4FAF2]">
                  <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Order ID</th>
                  <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Date</th>
                  <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Status</th>
                  <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold">
                {[
                  { id: '#ORD-2024-8812', date: 'May 14, 2024', status: 'Shipped', total: '$1,240.00', color: 'bg-[#9BF1CD] text-[#0B5141]', dot: 'bg-[#0B5141]' },
                  { id: '#ORD-2024-8795', date: 'May 12, 2024', status: 'Processing', total: '$450.25', color: 'bg-[#FFE5CA] text-[#A16207]', dot: 'bg-[#A16207]' },
                  { id: '#ORD-2024-8750', date: 'May 10, 2024', status: 'Delivered', total: '$2,100.00', color: 'bg-[#9BF1CD] text-[#0B5141]', dot: 'bg-[#0B5141]' },
                  { id: '#ORD-2024-8621', date: 'May 08, 2024', status: 'Shipped', total: '$89.99', color: 'bg-[#9BF1CD] text-[#0B5141]', dot: 'bg-[#0B5141]' },
                ].map((order, i) => (
                  <tr key={i} className={i > 0 ? 'border-t border-[#f4fcf9]' : ''}>
                    <td className="py-5 text-[#093A3E]">{order.id}</td>
                    <td className="py-5 text-[#618D80]">{order.date}</td>
                    <td className="py-5">
                      <span className={`inline-flex items-center space-x-1.5 ${order.color} px-3 py-1 rounded-full text-xs font-bold`}>
                        <span className={`w-1.5 h-1.5 ${order.dot} rounded-full`}></span>
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-5 text-[#0B5141] text-right font-bold">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summer Banner */}
        <section className="relative w-full rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between animate-fade-in-up delay-300" style={{ background: 'linear-gradient(90deg, #9AF2CA 0%, #FDE4D1 100%)' }}>
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#093A3E] mb-3">The Summer Collection is here.</h2>
            <p className="text-[#0B5141] font-medium text-sm md:text-base opacity-90">Curated especially for your premium membership status.</p>
          </div>
          <Link href="/home" className="relative z-10 bg-[#093A3E] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover-lift transition-all shrink-0">
            Explore Now
          </Link>
        </section>
      </main>
    </div>
  );
}
