"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { cleanImageUrl } from '@/lib/images';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminProfile, setAdminProfile] = useState<{ name: string; email: string; avatar: string } | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('current_user_id');
    if (userId) {
      fetch(`https://api.escuelajs.co/api/v1/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          setAdminProfile({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
          });
        })
        .catch(err => console.error('Failed to fetch admin profile:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user_id');
    router.push('/');
  };

  const sidebarLinks = [
    { href: '/admin/products', label: 'Products', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
    { href: '/admin/users', label: 'Users', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-[#E4FBF3] flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-transparent p-6 flex flex-col border-r border-[#0B5141]/5">
        <div className="mb-12 px-2">
          <h1 className="text-2xl font-bold text-[#093A3E] leading-none">Management</h1>
          <span className="text-[10px] font-bold text-[#618D80] uppercase tracking-widest mt-1 block">Admin Console</span>
        </div>

        <nav className="flex-grow space-y-3">
          {sidebarLinks.map((link) => {
            const active = pathname.includes(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  active 
                    ? 'bg-white text-[#0B5141] shadow-sm ring-1 ring-[#0B5141]/5' 
                    : 'text-[#618D80] hover:text-[#0B5141] hover:bg-white/40'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="mt-auto bg-[#B9EBD7] p-4 rounded-[1.5rem] flex items-center shadow-sm">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white">
            <img 
              src={cleanImageUrl(adminProfile?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile?.name || 'Admin')}`)}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#093A3E]">{adminProfile?.name || 'Admin'}</span>
            <span className="text-[10px] font-bold text-[#0B5141]/70 uppercase tracking-tighter">Super Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h2 className="text-xl font-bold text-[#093A3E]">Management</h2>
            <nav className="flex space-x-6 text-sm font-bold border-b border-transparent">
              <Link href="/admin/products" className={`pb-1 border-b-2 transition-all ${pathname === '/admin/products' ? 'border-[#0B5141] text-[#0B5141]' : 'border-transparent text-[#618D80] hover:text-[#0B5141]'}`}>Products</Link>
              <Link href="/admin/users" className={`pb-1 border-b-2 transition-all ${pathname === '/admin/users' ? 'border-[#0B5141] text-[#0B5141]' : 'border-transparent text-[#618D80] hover:text-[#0B5141]'}`}>Users</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-[#618D80] hover:text-[#0B5141] px-4 py-2 rounded-2xl font-bold hover:bg-white/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow p-8 overflow-y-auto hidden-scrollbar">
          {children}
        </main>

      </div>
    </div>
  );
}
