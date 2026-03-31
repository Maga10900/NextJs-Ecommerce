"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

const allOrders = [
  { id: '#ORD-2024-8812', date: 'May 14, 2024', status: 'Shipped',     total: '$1,240.00', items: 3 },
  { id: '#ORD-2024-8795', date: 'May 12, 2024', status: 'Processing',  total: '$450.25',   items: 1 },
  { id: '#ORD-2024-8750', date: 'May 10, 2024', status: 'Delivered',   total: '$2,100.00', items: 5 },
  { id: '#ORD-2024-8621', date: 'May 08, 2024', status: 'Shipped',     total: '$89.99',    items: 1 },
  { id: '#ORD-2024-8500', date: 'May 01, 2024', status: 'Delivered',   total: '$670.00',   items: 2 },
  { id: '#ORD-2024-8420', date: 'Apr 27, 2024', status: 'Delivered',   total: '$3,400.00', items: 4 },
  { id: '#ORD-2024-8105', date: 'Apr 19, 2024', status: 'Cancelled',   total: '$120.50',   items: 2 },
];

const statusStyles: Record<string, string> = {
  Shipped:    'bg-[#9BF1CD] text-[#0B5141]',
  Processing: 'bg-[#FFE5CA] text-[#A16207]',
  Delivered:  'bg-[#D1FAE5] text-[#065F46]',
  Cancelled:  'bg-[#FEE2E2] text-[#B91C1C]',
};
const dotStyles: Record<string, string> = {
  Shipped: 'bg-[#0B5141]', Processing: 'bg-[#A16207]', Delivered: 'bg-[#065F46]', Cancelled: 'bg-[#B91C1C]',
};

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/'); return; }
    fetch('https://api.escuelajs.co/api/v1/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setUser(d); setLoading(false); })
      .catch(() => { setUser({ name: "Welcome User", email: "user@example.com" }); setLoading(false); });
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#E4FAF2]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5141]"></div>
    </div>
  );

  const filters = ['All', 'Shipped', 'Processing', 'Delivered', 'Cancelled'];
  const filtered = filter === 'All' ? allOrders : allOrders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen flex bg-[#E4FAF2] text-[#093A3E] font-sans">
      <DashboardSidebar user={user} />

      <main className="flex-grow p-6 lg:p-10 pt-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-[#093A3E]">My Orders</h1>
            <p className="text-sm text-[#618D80] mt-1">Track and manage all your purchases</p>
          </div>
          <div className="text-sm font-semibold text-[#0B5141] bg-white px-4 py-2 rounded-full shadow-sm">
            {allOrders.length} Total Orders
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
          {[
            { label: 'Total Orders', value: allOrders.length, color: 'bg-[#A2F0D6]', textColor: 'text-[#0B5141]' },
            { label: 'Delivered', value: allOrders.filter(o => o.status === 'Delivered').length, color: 'bg-[#D1FAE5]', textColor: 'text-[#065F46]' },
            { label: 'In Transit', value: allOrders.filter(o => o.status === 'Shipped').length, color: 'bg-[#9BF1CD]', textColor: 'text-[#0B5141]' },
            { label: 'Processing', value: allOrders.filter(o => o.status === 'Processing').length, color: 'bg-[#FFE5CA]', textColor: 'text-[#A16207]' },
          ].map(card => (
            <div key={card.label} className={`${card.color} rounded-2xl p-5 flex flex-col items-center justify-center text-center hover-lift`}>
              <span className={`text-3xl font-extrabold ${card.textColor}`}>{card.value}</span>
              <span className="text-xs font-bold text-[#093A3E]/70 mt-1 uppercase tracking-wider">{card.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 animate-fade-in-up delay-200">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f ? 'bg-[#0B5141] text-white shadow-lg' : 'bg-white text-[#618D80] hover:bg-[#0B5141]/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-fade-in-up delay-300">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E4FAF2]">
                <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Order ID</th>
                <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Date</th>
                <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Items</th>
                <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold">Status</th>
                <th className="py-4 text-[10px] uppercase tracking-widest text-[#618D80] font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold divide-y divide-[#f4fcf9]">
              {filtered.map((order, i) => (
                <tr key={i} className="hover:bg-[#f8fefb] transition-colors group">
                  <td className="py-4 text-[#093A3E] font-bold">{order.id}</td>
                  <td className="py-4 text-[#618D80]">{order.date}</td>
                  <td className="py-4 text-[#618D80]">{order.items} {order.items === 1 ? 'item' : 'items'}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center space-x-1.5 ${statusStyles[order.status]} px-3 py-1 rounded-full text-xs font-bold`}>
                      <span className={`w-1.5 h-1.5 ${dotStyles[order.status]} rounded-full`}></span>
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="py-4 text-[#0B5141] text-right font-bold">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#618D80]">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <p className="font-semibold">No orders found</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
