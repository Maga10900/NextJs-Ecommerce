"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCart } from '@/lib/cart';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCartCount(cart.reduce((acc: number, item: any) => acc + item.qty, 0));
    };
    
    updateCartCount();

    window.addEventListener('cart-updated', updateCartCount);
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, [pathname]);

  const handleCategoriesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/home') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/home#categories');
    }
  }; // re-read on every navigation so count stays fresh

  const navLinks = [
    { href: '/home',     label: 'Shop' },
    { href: '/about',    label: 'About' },
  ];

  const isActive = (href: string) =>
    href === '/home' ? pathname === '/home' : pathname.startsWith(href.split('#')[0]) && href !== '/home';

  return (
    <header className="flex items-center justify-between px-6 lg:px-12 py-5 bg-[#F0FDF8] sticky top-0 z-50 border-b border-[#0B5141]/5 backdrop-blur-md bg-[#F0FDF8]/95">
      <Link href="/home" className="text-xl font-bold tracking-tight text-[#0B5141] hover:opacity-80 transition-opacity">
        The Digital Curator
      </Link>

      <nav className="hidden lg:flex space-x-10 text-sm font-semibold">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`pb-1.5 transition-colors ${
              isActive(link.href)
                ? 'border-b-2 border-[#0B5141] text-[#0B5141]'
                : 'text-[#0B5141]/70 hover:text-[#0B5141]'
            }`}
          >
            {link.label}
          </Link>
        ))}
        {/* Categories — smooth-scroll on /home, navigate otherwise */}
        <a
          href="/home#categories"
          onClick={handleCategoriesClick}
          className={`pb-1.5 transition-colors cursor-pointer ${
            pathname === '/home'
              ? 'text-[#0B5141]/70 hover:text-[#0B5141]'
              : 'text-[#0B5141]/70 hover:text-[#0B5141]'
          }`}
        >
          Categories
        </a>

      </nav>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden lg:flex relative">
          <input
            type="text"
            placeholder="Search curation..."
            className="bg-[#D2FAEF] text-[#0B5141] placeholder-[#618D80] text-xs font-medium rounded-full pl-10 pr-4 py-2.5 w-56 focus:outline-none focus:ring-2 focus:ring-[#0B5141] transition-all"
          />
          <svg className="w-4 h-4 text-[#618D80] absolute left-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Wishlist */}
        <button className="text-[#0B5141] hover:text-[#084033] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Profile */}
        <Link href="/profile/me" className="text-[#0B5141] hover:text-[#084033] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative bg-[#0B5141] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center space-x-2 hover:bg-[#084033] hover-lift transition-all shadow-[0_4px_14px_0_rgba(11,81,65,0.39)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B6B] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md ring-2 ring-[#F0FDF8]">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
