"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, saveCart } from '@/lib/cart';
import { saveOrder } from '@/lib/orders';
import Navbar from '@/components/Navbar';

export default function PaymentPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    saveCard: false
  });
  const [errors, setErrors] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

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
  const total = subtotal; // For simplicity, matching the image where total == subtotal

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setFormData({ ...formData, cardNumber: formatted.substring(0, 19) });
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: null });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + ' / ' + val.substring(2, 4);
    }
    setFormData({ ...formData, expiryDate: val });
    if (errors.expiryDate) setErrors({ ...errors, expiryDate: null });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cvc: val.substring(0, 3) });
    if (errors.cvc) setErrors({ ...errors, cvc: null });
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 15) newErrors.cardNumber = "Valid card number required (15-16 digits)";
    
    const expParts = formData.expiryDate.split(' / ');
    if (expParts.length !== 2 || expParts[0].length !== 2 || expParts[1].length !== 2) {
      newErrors.expiryDate = "Format MM / YY";
    } else {
      const month = parseInt(expParts[0], 10);
      const year = parseInt(expParts[1], 10);
      const now = new Date();
      const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = "Card has expired";
      }
    }
    
    if (formData.cvc.length !== 3) newErrors.cvc = "CVC must be exactly 3 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      setTimeout(() => {
        const orderData = {
          items: cartItems,
          total: subtotal,
          customer: {
            name: formData.name,
            cardNumberLast4: formData.cardNumber.slice(-4),
          }
        };
        saveOrder(orderData);
        
        saveCart([]);
        setCartItems([]);
        
        setIsProcessing(false);
        setShowDialog(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAFCF4] text-[#093A3E] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 lg:px-16 py-10 lg:py-16 max-w-6xl mx-auto w-full">
        
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
            <div className="w-12 h-12 rounded-full bg-[#0B5141] text-white flex items-center justify-center shadow-lg border-[3px] border-[#EAFCF4] ring-2 ring-[#0B5141]/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[#0B5141] font-semibold mt-3 text-sm">Payment</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mt-10">
          
          {/* Left Column: Items */}
          <div className="w-full lg:w-[55%] flex flex-col space-y-6">
            <div className="flex justify-between items-end mb-2">
              <h1 className="text-4xl font-extrabold text-[#093A3E] tracking-tight">Shopping Bag</h1>
              <span className="text-[#618D80] font-medium">{cartItems.length} items</span>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] p-4 shadow-sm flex items-center">
                  {/* Product Image Box */}
                  <div className="w-24 h-24 lg:w-28 lg:h-28 shrink-0 bg-[#F9F6F0] rounded-2xl overflow-hidden flex items-center justify-center mr-6">
                    <img src={item.img} alt={item.name} className="object-cover w-full h-full mix-blend-multiply" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between h-full py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#093A3E] text-lg lg:text-xl leading-tight">{item.name}</h3>
                        <p className="text-xs text-[#618D80] font-medium mt-1">Arctic White / Wireless</p>
                      </div>
                      <span className="font-extrabold text-[#0B5141] text-lg">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex justify-between items-center mt-4">
                      {/* Quantity Pill */}
                      <div className="bg-[#D2FAEF] rounded-full flex items-center px-4 py-1.5 space-x-4">
                        <button onClick={() => updateQty(item.id, -1)} className="text-[#0B5141] hover:text-[#084033] font-bold text-lg leading-none transition-colors">&minus;</button>
                        <span className="text-[#0B5141] font-bold text-sm leading-none">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-[#0B5141] hover:text-[#084033] font-bold text-lg leading-none transition-colors">&#43;</button>
                      </div>
                      
                      {/* Delete */}
                      <button onClick={() => removeItem(item.id)} className="text-[#845E5E] hover:text-red-600 text-xs font-bold tracking-wide transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary inline in left column */}
            <div className="bg-[#C2F5E2]/80 mt-6 rounded-[2rem] p-8 shadow-sm">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-[#618D80] font-medium">Subtotal</span>
                <span className="font-bold text-[#093A3E]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-6 border-b border-[#A7EBD5] pb-6">
                <span className="text-[#618D80] font-medium">Shipping</span>
                <span className="font-medium text-[#093A3E]">Calculated at next step</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-extrabold text-[#093A3E]">Total</span>
                <span className="text-2xl font-extrabold text-[#0B5141]">${total.toFixed(2)}</span>
              </div>
            </div>

          </div>
          
          {/* Right Column: Payment Details Box */}
          <div className="w-full lg:w-[45%] flex flex-col items-center">
            <form onSubmit={handleSubmit} className="w-full bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-gray-50 flex flex-col">
              <h2 className="text-2xl font-bold text-[#093A3E] mb-8">Payment Details</h2>
              
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <div className={`bg-[#A7EBD5]/40 rounded-2xl px-5 py-3 border transition-colors ${errors.name ? 'border-red-400' : 'border-transparent focus-within:border-[#A7EBD5]'}`}>
                    <label className="text-[10px] font-bold text-[#0B5141]/70 tracking-widest uppercase block mb-1">
                      Cardholder Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="ALEXANDER CURATOR" 
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: null});
                      }}
                      className="w-full bg-transparent text-[#0B5141] placeholder-[#0B5141]/40 font-medium text-sm focus:outline-none"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{errors.name}</p>}
                </div>
                
                {/* Number */}
                <div>
                  <div className={`bg-[#A7EBD5]/40 rounded-2xl px-5 py-3 border transition-colors flex items-center justify-between ${errors.cardNumber ? 'border-red-400' : 'border-transparent focus-within:border-[#A7EBD5]'}`}>
                    <div className="flex-grow">
                      <label className="text-[10px] font-bold text-[#0B5141]/70 tracking-widest uppercase block mb-1">
                        Card Number
                      </label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-transparent text-[#0B5141] placeholder-[#0B5141]/40 font-medium text-sm focus:outline-none"
                      />
                    </div>
                    <div className="text-[#0B5141]/40 shrink-0 ml-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{errors.cardNumber}</p>}
                </div>

                {/* Expiry & CVC */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className={`bg-[#A7EBD5]/40 rounded-2xl px-5 py-3 border transition-colors ${errors.expiryDate ? 'border-red-400' : 'border-transparent focus-within:border-[#A7EBD5]'}`}>
                      <label className="text-[10px] font-bold text-[#0B5141]/70 tracking-widest uppercase block mb-1">
                        Expiry Date
                      </label>
                      <input 
                        type="text" 
                        placeholder="MM / YY" 
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        className="w-full bg-transparent text-[#0B5141] placeholder-[#0B5141]/40 font-medium text-sm focus:outline-none"
                      />
                    </div>
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{errors.expiryDate}</p>}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`bg-[#A7EBD5]/40 rounded-2xl px-5 py-3 border transition-colors ${errors.cvc ? 'border-red-400' : 'border-transparent focus-within:border-[#A7EBD5]'}`}>
                      <label className="text-[10px] font-bold text-[#0B5141]/70 tracking-widest uppercase block mb-1">
                        CVC
                      </label>
                      <input 
                        type="password" 
                        placeholder="• • •" 
                        value={formData.cvc}
                        onChange={handleCvcChange}
                        className="w-full bg-transparent text-[#0B5141] placeholder-[#0B5141]/40 font-medium text-sm focus:outline-none tracking-widest"
                      />
                    </div>
                    {errors.cvc && <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{errors.cvc}</p>}
                  </div>
                </div>
              </div>

              {/* Save Card Checkbox */}
              <label className="flex items-center mt-6 cursor-pointer group w-fit">
                <div className="relative flex items-center justify-center w-5 h-5 rounded bg-[#A7EBD5]/60 border border-transparent mr-3 group-hover:bg-[#A7EBD5]">
                  <input type="checkbox" checked={formData.saveCard} onChange={(e) => setFormData({...formData, saveCard: e.target.checked})} className="opacity-0 absolute w-full h-full cursor-pointer" />
                  <svg className="w-3 h-3 text-transparent group-[&:has(input:checked)]:text-[#0B5141]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[#0B5141]/80 text-sm font-medium">Save card for future purchases</span>
              </label>

              {/* Pay Button */}
              <button disabled={isProcessing} className="w-full bg-[#0B5141] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#084033] transition-all mt-8 flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed">
                {isProcessing ? 'Processing Payment...' : 'Proceed to Pay'}
                {!isProcessing && <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
              
              <div className="flex justify-center items-center text-[#618D80] text-xs font-bold tracking-widest mt-6 uppercase">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Secured Payment Processing</span>
              </div>
            </form>

            {/* Return Link */}
            <div className="mt-6">
              <Link href="/cart" className="text-[#0B5141] font-bold text-sm hover:underline flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Return to Shipping
              </Link>
            </div>
            
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-[#618D80] tracking-wider">
          <p className="text-[#093A3E] text-xs tracking-tight mb-4 sm:mb-0 capitalize">The Digital Curator</p>
          <div className="flex space-x-6 sm:space-x-10 mb-4 sm:mb-0 uppercase">
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Shipping Info</Link>
          </div>
          <p className="uppercase">© 2024 The Digital Curator. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Success Dialog Overlay */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#093A3E]/70 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#D2FAEF] rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#0B5141]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#093A3E] mb-3">Payment Successful!</h2>
            <p className="text-[#618D80] font-medium mb-8">Thank you for your purchase. We are preparing it for shipment.</p>
            <div className="w-full space-y-3">
              <button 
                onClick={() => router.push('/profile/orders')}
                className="w-full bg-[#0B5141] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#084033] transition-colors"
              >
                View My Orders
              </button>
              <button 
                onClick={() => router.push('/home')}
                className="w-full bg-white border-2 border-[#A7EBD5] text-[#0B5141] py-4 rounded-xl font-bold text-sm hover:bg-[#F4FDF9] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
