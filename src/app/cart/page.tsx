"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCart, saveCart } from '@/lib/cart';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const updateQty = (id: number, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    });
    setCartItems(newCart);
    saveCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    saveCart(newCart);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;


  return (
    <div className="min-h-screen bg-[#EAFCF4] text-[#093A3E] font-sans flex flex-col">
      
      <Navbar />

      <main className="flex-grow px-6 lg:px-16 py-10 lg:py-16 max-w-7xl mx-auto w-full">
        
        {/* Progress Tracker Bar */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-16 relative">
          {/* Background line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-[#bdf0de] z-0"></div>
          
          {/* Step 1: Cart (Ticked) */}
          <div className="relative z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#0B5141] text-white flex items-center justify-center shadow-lg border-[3px] border-[#EAFCF4] ring-2 ring-[#0B5141]/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[#0B5141] font-bold mt-3 text-sm tracking-wide">Cart</span>
          </div>

          {/* Step 2: Shipping (Unticked)
          <div className="relative z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#0B5141] text-white flex items-center justify-center shadow-md border-[3px] border-[#EAFCF4]">
              <span className="font-bold text-sm">2</span>
            </div>
            <span className="text-[#0B5141] font-semibold mt-3 text-sm">Shipping</span>
          </div> */}

          {/* Step 3: Payment (Unticked) */}
          <div className="relative z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#0B5141] text-white flex items-center justify-center shadow-md border-[3px] border-[#EAFCF4]">
              <span className="font-bold text-sm">2</span>
            </div>
            <span className="text-[#0B5141] font-semibold mt-3 text-sm">Payment</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#093A3E] mb-2 tracking-tight">Shopping Cart ({cartItems.length} items)</h1>
          <p className="text-[#618D80] text-sm font-medium">Review your selections before proceeding to checkout.</p>
        </div>

        {/* Cart Contents & Summary Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Items */}
          <div className="w-full lg:w-2/3 flex flex-col space-y-6">
            
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] p-5 shadow-sm flex items-center hover:shadow-md transition-shadow">
                
                {/* Product Image Box */}
                <div className="w-28 h-28 lg:w-36 lg:h-36 shrink-0 bg-[#F9F6F0] rounded-2xl overflow-hidden flex items-center justify-center mr-6">
                  <img src={item.img} alt={item.name} className="object-cover w-full h-full mix-blend-multiply" />
                </div>
                
                {/* Details */}
                <div className="flex-grow flex flex-col justify-between h-full py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#093A3E] text-lg lg:text-xl mb-1">{item.name}</h3>
                      <p className="text-xs text-[#618D80] font-medium">Auto-generated item</p>
                    </div>
                    <span className="font-extrabold text-[#0B5141] text-lg">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-between items-center mt-6">
                    {/* Quantity Pill */}
                    <div className="bg-[#D2FAEF] rounded-full flex items-center px-4 py-1.5 space-x-6">
                      <button onClick={() => updateQty(item.id, -1)} className="text-[#0B5141] hover:text-[#084033] font-bold text-lg leading-none transition-colors">&minus;</button>
                      <span className="text-[#0B5141] font-bold text-sm leading-none">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-[#0B5141] hover:text-[#084033] font-bold text-lg leading-none transition-colors">&#43;</button>
                    </div>
                    
                    {/* Delete Icon */}
                    <button onClick={() => removeItem(item.id)} className="text-[#E57373] hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Link href="/home" className="inline-flex items-center text-[#0B5141] font-bold text-sm hover:underline group">
                <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#C2F5E2] rounded-[2rem] p-8 lg:p-10 shadow-sm sticky top-28">
              <h2 className="text-2xl font-bold text-[#093A3E] mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[#618D80] font-medium">Subtotal</span>
                  <span className="font-bold text-[#093A3E]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#618D80] font-medium">Shipping Estimate</span>
                  <span className="font-bold text-[#0B5141]">{subtotal > 0 ? 'Free' : '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#618D80] font-medium">Tax</span>
                  <span className="font-bold text-[#093A3E]">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-[#A7EBD5] mb-8">
                <p className="text-[10px] font-bold text-[#618D80] uppercase tracking-widest mb-1">Total Amount</p>
                <div className="text-4xl font-extrabold text-[#093A3E]">${total.toFixed(2)}</div>
              </div>
              
              <Link href="/payment" className="w-full bg-[#0B5141] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#084033] hover-lift transition-all mb-4 flex justify-center items-center">
                Proceed to Checkout
              </Link>
              
              <div className="flex justify-center items-center text-[#618D80] text-xs font-medium mb-10">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Secure encrypted payment</span>
              </div>
              
              <div className="mb-2">
                <p className="text-[10px] font-bold text-[#618D80] uppercase tracking-widest mb-3">Promo Code</p>
                <div className="flex space-x-3">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-grow bg-[#A7EBD5]/60 text-[#0B5141] placeholder-[#618D80]/60 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B5141] transition-all"
                  />
                  <button className="bg-[#A7EBD5] text-[#0B5141] font-bold text-sm px-5 py-3 rounded-xl hover:bg-[#97dfc9] transition-colors shrink-0">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Cards below summary */}
            <div className="flex space-x-4 mt-6">
              <div className="flex-1 bg-[#D2FAEF] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <svg className="w-6 h-6 text-[#0B5141] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <span className="text-[10px] font-bold text-[#0B5141]">Fast Delivery</span>
              </div>
              <div className="flex-1 bg-[#D2FAEF] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <svg className="w-6 h-6 text-[#0B5141] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="text-[10px] font-bold text-[#0B5141]">2 Year Warranty</span>
              </div>
            </div>
            
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-[#618D80] uppercase tracking-wider">
          <p className="text-[#093A3E] text-xs tracking-tight mb-4 sm:mb-0 capitalize">The Digital Curator</p>
          <div className="flex space-x-6 sm:space-x-10 mb-4 sm:mb-0">
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Shipping Info</Link>
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Contact Us</Link>
          </div>
          <p>© 2024 The Digital Curator. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
}
