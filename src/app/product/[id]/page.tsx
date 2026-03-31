"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCart, addToCart as cartAdd } from '@/lib/cart';
import Navbar from '@/components/Navbar';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Cart state
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Fetch product
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImage(data.images?.[0]?.replace(/[\[\]"]/g, '') || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch related products
    fetch(`https://api.escuelajs.co/api/v1/products/${id}/related`)
      .then(res => {
        if (!res.ok) throw new Error('Related endpoint not found');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setRelatedProducts(data);
      })
      .catch(err => {
        // Fallback to exactly what the user asked, but if it fails, fallback to generic products to keep UI intact
        console.warn("Using fallback products due to related endpoint error:", err);
        fetch('https://api.escuelajs.co/api/v1/products?limit=4&offset=10')
          .then(r => r.json())
          .then(d => setRelatedProducts(d));
      });

    // Load Cart
    setCartItems(getCart());
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const updated = cartAdd(product);
    setCartItems(updated);
    alert('Added to cart successfully!');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EAFCF4] flex items-center justify-center text-[#0B5141] font-bold text-xl">Loading Artifact...</div>;
  }

  if (!product || product.name === 'EntityNotFoundError') {
    return <div className="min-h-screen bg-[#EAFCF4] flex items-center justify-center text-[#0B5141] font-bold text-xl">Product not found.</div>;
  }

  // Pre-process images
  const images = (product.images || []).map((img: string) => img.replace(/[\[\]"]/g, ''));

  return (
    <div className="min-h-screen bg-[#EAFCF4] text-[#093A3E] font-sans flex flex-col pt-0 pb-0">
      
      <Navbar />

      <main className="flex-grow px-6 lg:px-12 py-10 max-w-screen-2xl mx-auto w-full">
        
        {/* TOP SECTION: Gallery & Details */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
          
          {/* Gallery: Thumbnails + Main Image */}
          <div className="w-full lg:w-3/5 flex gap-4 lg:gap-6 h-[400px] lg:h-[650px]">
            {/* Thumbnails */}
            <div className="flex flex-col gap-4 w-20 lg:w-24 shrink-0 overflow-y-auto hidden-scrollbar">
              {[0, 1, 2, 3].map((idx) => {
                const imgUrl = images[idx % images.length] || 'https://via.placeholder.com/300';
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-full aspect-square rounded-2xl bg-[#F9F6F0] overflow-hidden border-2 transition-all ${activeImage === imgUrl ? 'border-[#0B5141] shadow-md scale-105' : 'border-transparent hover:border-[#0B5141]/30'}`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover rounded-xl" alt="Thumbnail" />
                  </button>
                );
              })}
            </div>
            
            {/* Main Featured Image */}
            <div className="flex-grow relative bg-gradient-to-br from-[#51765C] to-[#3a5843] rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-2xl">
              <span className="absolute top-6 left-6 bg-[#0B5141] text-[#A7EBD5] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-10 border border-[#A7EBD5]/20">
                Limited Edition
              </span>
              <img 
                src={activeImage} 
                alt={product.title} 
                className="max-w-[70%] max-h-[80%] object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
                onError={(e) => (e.target as HTMLImageElement).src='https://via.placeholder.com/800'}
              />
            </div>
          </div>
          
          {/* Product Details right column */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            <span className="text-[#0B5141] text-[10px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center">
              <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Editor's Choice
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#093A3E] leading-tight tracking-tight mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-6 mb-8">
              <span className="text-2xl font-extrabold text-[#0B5141]">${product.price.toFixed(2)}</span>
              <div className="flex items-center text-[#0B5141] text-sm font-bold bg-[#B9EBD7]/40 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                4.9 <span className="text-[#618D80] font-medium ml-1">(12 reviews)</span>
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#618D80] uppercase tracking-widest block mb-3">Color</span>
              <div className="flex flex-wrap gap-2">
                <button className="border-2 border-[#0B5141] text-[#0B5141] bg-[#B9EBD7] px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm">Sage Onyx</button>
                <button className="border border-[#bdf0de] text-[#618D80] bg-transparent hover:border-[#0B5141] hover:text-[#0B5141] px-4 py-2 rounded-full text-xs font-bold transition-all">Arctic Frost</button>
                <button className="border border-[#bdf0de] text-[#618D80] bg-transparent hover:border-[#0B5141] hover:text-[#0B5141] px-4 py-2 rounded-full text-xs font-bold transition-all">Sandisk</button>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-bold text-[#618D80] uppercase tracking-widest block">Case Size</span>
                <span className="text-[10px] font-bold text-[#0B5141] hover:underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="border border-[#bdf0de] text-[#618D80] bg-[#DDF7EC] hover:border-[#0B5141] hover:text-[#0B5141] px-6 py-2 rounded-full text-xs font-bold transition-all">38mm</button>
                <button className="border-2 border-[#0B5141] text-[#0B5141] bg-[#B9EBD7] px-6 py-2 rounded-full text-xs font-bold transition-all shadow-sm">42mm</button>
                <button className="border border-[#bdf0de] text-[#618D80] bg-[#DDF7EC] hover:border-[#0B5141] hover:text-[#0B5141] px-6 py-2 rounded-full text-xs font-bold transition-all">44mm</button>
              </div>
            </div>

            <p className="text-[#0B5141] text-xs font-bold flex items-center mb-5">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> IN STOCK & READY TO SHIP
            </p>

            <div className="flex space-x-3 mb-6">
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-[#0B5141] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg hover:bg-[#084033] hover-lift transition-all"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Add to Cart
              </button>
              <button className="w-14 h-14 bg-[#E0D8FB] text-[#2c2d43] rounded-2xl flex items-center justify-center hover:bg-[#D1C6F8] transition-colors shrink-0 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            
            <div className="flex space-x-6 text-[10px] font-bold text-[#618D80] border-t border-[#0B5141]/10 pt-6">
              <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg> Free Global Shipping</span>
              <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> 2 Year Warranty</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Curation & Technicals */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24 border-t border-[#0B5141]/10 pt-16">
          <div className="w-full lg:w-3/5">
            <h2 className="text-2xl font-bold text-[#093A3E] mb-6">Curation & Narrative</h2>
            <div className="text-[#618D80] text-sm leading-relaxed mb-8 space-y-4">
              <p>The {product.title} is more than a timepiece; it is a statement of intentionality. Developed in collaboration with master horologists, this series celebrates the intersection of classical mechanics and contemporary minimalism.</p>
              <p>{product.description} Forged from a single block of aerospace-grade titanium and finished via physical vapor deposition (PVD) coating for its signature matte onyx sheen. The watch features a sapphire crystal lens that is virtually unscratchable.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#D2FAEF] p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-[#0B5141] mb-2 text-sm">Craftsmanship</h4>
                <p className="text-[#618D80] text-xs leading-relaxed">Every component is hand-polished and assembled in our Zurich workshop, maintaining an ethical heritage of artisanship.</p>
              </div>
              <div className="bg-[#D2FAEF] p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-[#0B5141] mb-2 text-sm">Sustainability</h4>
                <p className="text-[#618D80] text-xs leading-relaxed">Our titanium is sourced from upcycled materials, and secondary packaging is 100% plastic-free utilizing organic molded materials.</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/5">
            <div className="bg-[#DDF7EC] p-8 rounded-[2rem] shadow-sm h-full">
              <h3 className="font-bold text-[#0B5141] mb-6 text-lg">Technical Specifications</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-[#B9EBD7] pb-3">
                  <span className="text-[#618D80]">Movement</span>
                  <span className="font-bold text-[#093A3E] text-right">Automatic Cal. 400</span>
                </div>
                <div className="flex justify-between border-b border-[#B9EBD7] pb-3">
                  <span className="text-[#618D80]">Material</span>
                  <span className="font-bold text-[#093A3E] text-right">Titanium G5</span>
                </div>
                <div className="flex justify-between border-b border-[#B9EBD7] pb-3">
                  <span className="text-[#618D80]">Water Resistance</span>
                  <span className="font-bold text-[#093A3E] text-right">10 ATM / 100m</span>
                </div>
                <div className="flex justify-between border-b border-[#B9EBD7] pb-3">
                  <span className="text-[#618D80]">Crystal</span>
                  <span className="font-bold text-[#093A3E] text-right">Sapphire AR-Coated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#618D80]">Strap</span>
                  <span className="font-bold text-[#093A3E] text-right">Full-Grain Italian Calfskin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-8 border-b border-[#0B5141]/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#093A3E] mb-2 tracking-tight">Community Voices</h2>
              <p className="text-[#618D80] text-sm">Join the collectors who have already embraced the edition.</p>
            </div>
            <button className="bg-[#B9EBD7] text-[#0B5141] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#a7ebd5] transition-colors hidden sm:block shadow-sm">
              Write a Review
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAFCF4]">
              <div className="flex text-green-500 mb-2 fill-current">
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <p className="text-[#618D80] text-xs font-medium leading-relaxed italic mb-6">"The attention to detail is staggering. The matte finish doesn't just look great, it feels incredibly premium on the wrist."</p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#A7EBD5] flex items-center justify-center text-[#0B5141] font-bold text-xs mr-3">JD</div>
                <div>
                  <h4 className="font-bold text-[#093A3E] text-xs">Julian O.</h4>
                  <span className="text-[10px] text-[#618D80]">Verified Customer</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAFCF4]">
              <div className="flex text-green-500 mb-2 fill-current">
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <p className="text-[#618D80] text-xs font-medium leading-relaxed italic mb-6">"A masterpiece of minimalism. My only slight critique is the clasp breaking-in period, but after a week, it fits like a glove."</p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFD3B6] flex items-center justify-center text-[#d97d39] font-bold text-xs mr-3">SK</div>
                <div>
                  <h4 className="font-bold text-[#093A3E] text-xs">Sarah K.</h4>
                  <span className="text-[10px] text-[#618D80]">Verified Customer</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAFCF4]">
              <div className="flex text-green-500 mb-2 fill-current">
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg className="w-4 h-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <p className="text-[#618D80] text-xs font-medium leading-relaxed italic mb-6">"Shipping was exceptionally fast, and the unboxing experience felt like opening a piece of modern art. Highly recommended."</p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#E0D8FB] flex items-center justify-center text-[#2c2d43] font-bold text-xs mr-3">MW</div>
                <div>
                  <h4 className="font-bold text-[#093A3E] text-xs">Marcus W.</h4>
                  <span className="text-[10px] text-[#618D80]">Verified Customer</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#093A3E] mb-2 tracking-tight">Complete the Collection</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel: any, i: number) => (
              <Link href={`/product/${rel.id}`} key={rel.id || i} className="group cursor-pointer block">
                <div className="bg-[#F9F6F0] rounded-3xl aspect-[4/5] overflow-hidden mb-4 relative flex items-center justify-center">
                  <img 
                    src={rel.images?.[0]?.replace(/[\[\]"]/g, '') || 'https://via.placeholder.com/300'} 
                    alt={rel.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl" 
                    onError={(e) => (e.target as HTMLImageElement).src='https://via.placeholder.com/300'}
                  />
                </div>
                <h4 className="font-bold text-[#093A3E] text-sm line-clamp-1">{rel.title}</h4>
                <span className="text-[#0B5141] font-bold text-xs">${rel.price}</span>
              </Link>
            ))}
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="bg-[#DDF7EC] mt-16 px-6 lg:px-12 pt-16 pb-8 border-t border-[#0B5141]/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between lg:space-x-16">
          <div className="mb-12 lg:mb-0 w-full lg:w-1/3">
            <h3 className="text-xl font-bold tracking-tight text-[#0B5141] mb-6">The Digital Curator</h3>
            <p className="text-xs text-[#618D80] leading-relaxed max-w-sm">
              Creating fine lines in digital and physical environments. Bridging the gap universally elegant, high-performance designs.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-2/3">
            <div>
              <h4 className="font-bold text-[10px] text-[#0B5141] tracking-widest uppercase mb-6">Explore</h4>
              <ul className="space-y-4 text-xs font-semibold text-[#618D80]">
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Sustainability</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Our Factories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[10px] text-[#0B5141] tracking-widest uppercase mb-6">Service</h4>
              <ul className="space-y-4 text-xs font-semibold text-[#618D80]">
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Shipping & Returns</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[10px] text-[#0B5141] tracking-widest uppercase mb-6">Newsletter</h4>
              <p className="text-xs font-medium text-[#618D80] mb-4">Join the circle for free updates and early access.</p>
              <div className="flex bg-white rounded-full p-1 border border-[#B9EBD7]">
                <input type="email" placeholder="Your email..." className="flex-grow bg-transparent text-xs px-3 focus:outline-none" />
                <button className="bg-[#0B5141] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#084033] transition-colors">Join</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#0B5141]/10 flex justify-center text-[10px] text-[#618D80] font-medium">
          <p>© 2024 The Digital Curator. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
}
