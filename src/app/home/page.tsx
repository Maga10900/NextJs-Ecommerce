"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { addToCart as cartAdd } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import { cleanImageUrl } from '@/lib/images';

export default function StorefrontPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    const productUrl = selectedCategory 
      ? `https://api.escuelajs.co/api/v1/products/?categoryId=${selectedCategory.id}`
      : 'https://api.escuelajs.co/api/v1/products?limit=8&offset=0';

    fetch(productUrl)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Failed to fetch products:", error));
  }, [selectedCategory]);

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/categories?limit=20')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Failed to fetch categories:", error));
  }, []);

  const handleAddToCart = (product: any) => {
    cartAdd(product);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF8] text-[#093A3E] font-sans pb-0">
      <Navbar />

      <main className="px-6 lg:px-12 py-6 space-y-24">
        
        {/* Hero Banner */}
        <section className="relative w-full rounded-[2.5rem] overflow-hidden h-[450px] lg:h-[550px] flex items-center justify-center shadow-2xl">
          {/* Custom smooth radiant gradient resembling the user attachment */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#80ED99] via-[#A8E6CF] to-[#FFD3B6] opacity-90 z-0"></div>
          {/* Wave-like visual illusion layers */}
          <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-tl from-transparent via-white/20 to-transparent rotate-12 blur-3xl z-0 pointer-events-none"></div>
          <div className="absolute bottom-[-30%] right-[-10%] w-[100%] h-[100%] bg-gradient-to-tr from-[#0B5141]/10 via-[#F3E1CB]/40 to-transparent -rotate-6 blur-2xl z-0 pointer-events-none"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center px-4">
            <span className="bg-[#E4FBF3] text-[#0B5141] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 shadow-sm">
              Collection 2024
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#093A3E] tracking-tight mb-8">
              The Future of Aesthetics
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-[#0B5141] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl hover:bg-[#084033] hover-lift transition-all">
                Explore Shop
              </button>
              <button className="bg-white/90 backdrop-blur-md text-[#0B5141] px-8 py-3.5 rounded-full text-sm font-bold shadow-md hover:bg-white hover-lift transition-all">
                View Lookbook
              </button>
            </div>
          </div>
        </section>

        {/* Browse by Department */}
        <section id="categories" className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#093A3E] mb-2 tracking-tight">Browse by Department</h2>
              <p className="text-[#618D80] text-sm lg:text-base">Carefully selected categories for every lifestyle.</p>
            </div>
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="hidden sm:flex items-center text-sm font-bold text-[#0B5141] hover:text-[#084033] hover:underline transition-colors pb-1 focus:outline-none"
            >
              {showAllCategories ? 'Show Less' : 'View All'} 
              <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${showAllCategories ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 transition-all duration-500 ease-in-out overflow-hidden ${showAllCategories ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-[160px] lg:max-h-[180px]'}`}>
            {(showAllCategories ? categories : categories.slice(0, 6)).map((cat: any, i: number) => (
              <div 
                key={cat.id || i} 
                onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                className={`flex flex-col items-center group cursor-pointer animate-fade-in-up transition-all ${selectedCategory?.id === cat.id ? 'scale-110' : ''}`} 
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 shadow-sm overflow-hidden border-4 ${selectedCategory?.id === cat.id ? 'border-[#0B5141] bg-[#0B5141]/10 ring-4 ring-[#0B5141]/20' : 'border-[#B9EBD7] bg-[#B9EBD7]'}`}>
                  <img 
                    src={cleanImageUrl(cat.image, 'https://via.placeholder.com/150')} 
                    alt={cat.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${selectedCategory?.id === cat.id ? 'scale-110' : ''}`} 
                    onError={(e) => (e.target as HTMLImageElement).src='https://via.placeholder.com/150'} 
                  />
                </div>
                <span className={`font-bold text-sm transition-colors ${selectedCategory?.id === cat.id ? 'text-[#0B5141]' : 'text-[#093A3E]'} text-center`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Curated Picks */}
        <section className="bg-[#DDF7EC] rounded-[2.5rem] p-8 lg:p-14 -mx-6 lg:-mx-12 shadow-inner min-h-[500px] transition-all duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#093A3E] mb-2 tracking-tight">
                  {selectedCategory ? `${selectedCategory.name} Collection` : 'Curated Picks'}
                </h2>
                <p className="text-[#618D80] text-sm lg:text-base">
                  {selectedCategory ? `Exploring the finest entries in ${selectedCategory.name.toLowerCase()}.` : 'Handpicked essentials for the modern digital nomad.'}
                </p>
              </div>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-white text-[#0B5141] text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all flex items-center"
                >
                  Clear Filter 
                  <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            
            {products.length === 0 ? (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#618D80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="font-bold text-[#093A3E]">No products found</h3>
                <p className="text-[#618D80] text-sm">We couldn't find any items in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 transition-all">
                {products.map((product: any, i: number) => (
                  <div key={product.id || i} className="bg-white rounded-3xl p-4 lg:p-5 shadow-lg flex flex-col hover-lift transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <Link href={`/product/${product.id || 1}`} className="block flex-grow">
                      <div className="bg-gray-100/50 rounded-2xl w-full aspect-square relative mb-5 overflow-hidden flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        {/* Render Real Image */}
                        <img 
                          src={cleanImageUrl(product.images?.[0])} 
                          alt={product.title} 
                          className="w-full h-full object-cover mix-blend-multiply transition-opacity" 
                        />
                        
                        {/* Floating Heart */}
                        <button 
                          onClick={(e) => e.preventDefault()}
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white text-gray-400 hover:text-[#0B5141] transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-start mb-2 px-1">
                        <h3 className="font-bold text-[#093A3E] text-base line-clamp-1" title={product.title}>{product.title}</h3>
                        <span className="font-bold text-[#0B5141] text-sm ml-2 mt-0.5">${product.price}</span>
                      </div>
                      <p className="text-xs text-[#618D80] line-clamp-2 min-h-[2rem] mb-5 px-1 leading-relaxed">
                        {product.description}
                      </p>
                    </Link>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#E0D8FB] text-[#2c2d43] font-bold text-sm py-3.5 rounded-xl hover:bg-[#D1C6F8] transition-colors mt-auto shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Join the Inner Circle */}
        <section className="relative w-full max-w-7xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#196350] to-[#50A78E] p-12 lg:px-20 lg:py-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#A7EBD5]/30 to-transparent blur-3xl rounded-full translate-x-1/2 scale-150 z-0"></div>
          
          <div className="relative z-10 w-full lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Join the Inner Circle</h2>
            <p className="text-[#B9EBD7] text-sm lg:text-base leading-relaxed">
              Weekly curations of the world's most beautiful objects, directly to your inbox. No spam, only inspiration.
            </p>
          </div>
          
          <div className="relative z-10 w-full md:w-2/3 lg:w-[45%] flex space-x-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <input 
              type="email" 
              placeholder="curator@example.com" 
              className="flex-grow bg-transparent text-white placeholder-white/60 px-4 focus:outline-none text-sm"
            />
            <button className="bg-[#E4FBF3] text-[#0B5141] px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-white hover:shadow-lg transition-all shrink-0">
              Subscribe Now
            </button>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="bg-[#DDF7EC] mt-12 px-6 lg:px-12 pt-16 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between lg:space-x-16">
          
          <div className="mb-12 lg:mb-0 w-full lg:w-1/3">
            <h3 className="text-xl font-bold tracking-tight text-[#0B5141] mb-6">The Digital Curator</h3>
            <p className="text-xs text-[#618D80] leading-relaxed max-w-sm">
              Elevating everyday essentials through meticulous curation and aesthetic excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-2/3">
            <div>
              <h4 className="font-bold text-xs text-[#0B5141] tracking-widest uppercase mb-6">Shop</h4>
              <ul className="space-y-4 text-xs font-semibold text-[#618D80]">
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">New Arrivals</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Best Sellers</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Gift Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-xs text-[#0B5141] tracking-widest uppercase mb-6">Company</h4>
              <ul className="space-y-4 text-xs font-semibold text-[#618D80]">
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Sustainability</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-xs text-[#0B5141] tracking-widest uppercase mb-6">Support</h4>
              <ul className="space-y-4 text-xs font-semibold text-[#618D80]">
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Shipping & Returns</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-[#0B5141] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#0B5141]/10 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#618D80] font-medium">
          <p>© 2024 The Digital Curator. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#0B5141] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
