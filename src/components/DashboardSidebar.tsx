"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cleanImageUrl } from '@/lib/images';

interface Props {
  user: any;
}

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user_id');
    router.push('/');
  };

  const navItems = [
    {
      href: '/profile/orders',
      label: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      href: '/profile/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      href: '/profile/me',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between min-h-screen">
      <div className="p-8 pb-4">
        <Link href="/home" className="block text-xl font-bold tracking-tight text-[#093A3E] mb-10 hover:opacity-80 transition-opacity">
          The Digital Curator
        </Link>

        <div className="flex items-center space-x-4 mb-12">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#093A3E] shadow-sm shrink-0 border-2 border-white">
            <img
              src={cleanImageUrl(user?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0B5141&color=fff&size=64`)}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0B5141&color=fff&size=64`;
              }}
            />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-[#0B5141] text-sm truncate">
              {user?.name || 'Welcome back'}
            </h3>
            <p className="text-[#618D80] text-xs mt-0.5 truncate">Premium Member</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${
                  isActive
                    ? 'bg-white text-[#0B5141] shadow-[0_4px_15px_rgba(11,81,65,0.08)]'
                    : 'text-[#618D80] hover:text-[#0B5141] hover:bg-white/50'
                }`}
              >
                <span className={isActive ? 'text-[#0B5141]' : 'text-[#618D80]'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-8 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-[#618D80] hover:text-[#0B5141] px-5 py-3.5 w-full rounded-2xl font-bold hover:bg-white/50 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
