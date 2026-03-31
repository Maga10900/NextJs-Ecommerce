"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cleanImageUrl } from '@/lib/images';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    images: ['https://placeimg.com/640/480/any']
  });
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const limit = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Categories
  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // Fetch Products
  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * limit;
    let url = `https://api.escuelajs.co/api/v1/products?limit=${limit}&offset=${offset}`;
    if (selectedCategory) {
      url += `&categoryId=${selectedCategory}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [page, selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset page to 1 on category change
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.category?.id || '',
      images: product.images || ['https://placeimg.com/640/480/any']
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      categoryId: '',
      images: ['https://placeimg.com/640/480/any']
    });
    setIsModalOpen(true);
  };

  const confirmDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        setErrorMessage('Failed to delete product. It may have already been removed.');
      }
    } catch (error) {
      console.error('Error deleting product', error);
      setErrorMessage('A network error occurred while trying to delete the product.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const url = editingProduct 
        ? `https://api.escuelajs.co/api/v1/products/${editingProduct.id}`
        : `https://api.escuelajs.co/api/v1/products/`;
        
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          categoryId: Number(formData.categoryId)
        })
      });
      
      const savedProduct = await res.json();
      
      if (editingProduct) {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      } else {
        setProducts([savedProduct, ...products]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save product. Please check your connection and try again.');
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5141]"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      
      {/* Page Title & Actions */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#093A3E] mb-2">Product Catalog</h1>
          <p className="text-[#618D80] text-sm font-medium">Manage your storefront items and stock levels.</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <select 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="appearance-none bg-[#E0D8FB] text-[#2c2d43] pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-sm hover:bg-[#D1C6F8] transition-colors focus:outline-none cursor-pointer h-full"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg className="w-4 h-4 absolute right-3 top-3 text-[#2c2d43] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <button onClick={openAddModal} className="bg-[#0B5141] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-lg hover:bg-[#084033] hover-lift transition-all">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} p-6 rounded-[2rem] shadow-sm flex flex-col justify-between h-32 hover-lift transition-all`}>
            <span className="text-[10px] font-bold text-[#0B5141]/60 uppercase tracking-widest">{stat.label}</span>
            <span className={`text-3xl font-extrabold ${stat.textColor || 'text-[#093A3E]'}`}>{stat.value}</span>
          </div>
        ))}
      </div> */}

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-[#0B5141]/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-[#618D80] uppercase tracking-[0.2em] border-b border-[#0B5141]/10 pb-4">
                <th className="pb-6 pl-4">Product</th>
                {/* <th className="pb-6">Stock Status</th> */}
                <th className="pb-6">Price</th>
                <th className="pb-6 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B5141]/5">
              {products.map((p, i) => {
                const isLowStock = i === 1 || i === 4; // Mocking some low stock for visual variety
                return (
                  <tr key={p.id} className="group hover:bg-[#F0FDF8]/50 transition-colors">
                    <td className="py-5 pl-4 flex items-center">
                      <div className="w-14 h-14 bg-[#F9F6F0] rounded-2xl overflow-hidden mr-4 shadow-inner flex items-center justify-center">
                        <img 
                          src={cleanImageUrl(p.images?.[0])} 
                          alt={p.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#093A3E] mb-0.5">{p.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-[#618D80] uppercase tracking-wider">{p.category?.name || 'Accessories'}</span>
                          <span className="text-[10px] text-[#618D80]/60">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    {/* <td className="py-5">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold mr-3 ${isLowStock ? 'bg-[#FFD3B6] text-[#d97d39]' : 'bg-[#B9EBD7] text-[#0B5141]'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${isLowStock ? 'bg-[#d97d39]' : 'bg-[#0B5141]'}`}></span>
                          {isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                        <span className={`text-xs font-bold ${isLowStock ? 'text-[#d97d39]' : 'text-[#618D80]'}`}>
                          {isLowStock ? '5 units' : '248 units'}
                        </span>
                      </div>
                    </td> */}
                    <td className="py-5">
                      <span className="font-extrabold text-[#093A3E] text-sm">${p.price.toFixed(2)}</span>
                    </td>
                    <td className="py-5 text-right pr-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-[#0B5141] hover:bg-[#B9EBD7] rounded-xl transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 text-[#FF6B6B] hover:bg-red-50 rounded-xl transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 py-6 border-t border-[#0B5141]/5 flex justify-between items-center text-[10px] font-bold text-[#618D80] uppercase tracking-widest">
          <span>Page {page}</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`w-8 h-8 rounded-xl bg-white border border-[#0B5141]/10 flex items-center justify-center transition-all ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F0FDF8]'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <button className="w-8 h-8 rounded-xl bg-[#0B5141] text-white flex items-center justify-center shadow-md">{page}</button>
            
            <button 
              onClick={() => setPage(page + 1)}
              disabled={products.length < limit}
              className={`w-8 h-8 rounded-xl bg-white border border-[#0B5141]/10 flex items-center justify-center transition-all ${products.length < limit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F0FDF8]'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B5141]/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#0B5141]/10">
              <h2 className="text-xl font-bold text-[#093A3E]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#618D80] hover:text-[#093A3E] transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto hidden-scrollbar space-y-6 flex-grow">
              
              {/* Product Imagery - 4 Upload Sections */}
              <div>
                <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">Product Imagery</label>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const image = formData.images[idx];
                    const isMain = idx === 0;

                    if (image && !image.includes('any')) {
                      return (
                        <div key={idx} onClick={() => fileInputRef.current?.click()} className={`relative bg-[#E4FBF3] rounded-2xl overflow-hidden cursor-pointer group shadow-sm ${isMain ? 'aspect-[4/3] lg:col-span-2 lg:row-span-2' : 'aspect-square'}`}>
                           <img src={cleanImageUrl(image)} alt={`Product Image ${idx + 1}`} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                           <div className="absolute inset-0 bg-[#0B5141]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                             <span className="text-white text-xs font-bold">Replace</span>
                           </div>
                        </div>
                      );
                    }

                    return (
                      <div key={idx} onClick={() => fileInputRef.current?.click()} className={`bg-[#E4FBF3] border-2 border-dashed border-[#A0D8C8] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#D5F7E8] transition-colors ${isMain ? 'aspect-[4/3] lg:col-span-2 lg:row-span-2' : 'aspect-square'}`}>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0B5141] shadow-sm mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        {isMain ? (
                          <>
                            <span className="text-xs font-bold text-[#093A3E]">Drag & drop image here</span>
                            <span className="text-[10px] font-medium text-[#618D80] mt-1">or click to browse from files (Max 5MB)</span>
                          </>
                        ) : (
                           <span className="text-[10px] font-bold text-[#093A3E]">Add image {idx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Premium Leather Tote" 
                  className="w-full bg-[#A5E1D1] text-[#093A3E] placeholder-[#618D80] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5141]/30 transition-shadow" 
                />
              </div>

              {/* Category & Base Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <select 
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full bg-[#A5E1D1] text-[#093A3E] appearance-none rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5141]/30 transition-shadow"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 absolute right-4 top-3.5 text-[#093A3E] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">Base Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-[#093A3E] font-semibold text-sm">$</span>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00" 
                      className="w-full bg-[#A5E1D1] text-[#093A3E] placeholder-[#618D80] rounded-xl pl-8 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5141]/30 transition-shadow" 
                    />
                  </div>
                </div>
              </div>

              {/* Inventory Count & SKU (Mocked, Platzi doesn't have these) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">Inventory Count</label>
                  <input type="number" placeholder="0" className="w-full bg-[#A5E1D1] text-[#093A3E] placeholder-[#618D80] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5141]/30 transition-shadow" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">SKU Reference</label>
                  <input type="text" placeholder="ABC-123" className="w-full bg-[#A5E1D1] text-[#093A3E] placeholder-[#618D80] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5141]/30 transition-shadow" />
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-[10px] font-bold text-[#618D80] uppercase tracking-wider mb-2">Product Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the item details, materials, and features..." 
                  className="w-full bg-[#A5E1D1] text-[#093A3E] placeholder-[#618D80] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5141]/30 transition-shadow resize-none"
                ></textarea>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-[#0B5141]/10 bg-white flex justify-end items-center space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-sm font-bold text-[#0B5141] hover:text-[#093A3E] px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProduct}
                className="bg-[#5D5FEF] text-white text-sm font-bold px-8 py-3 rounded-xl shadow-[0_4px_15px_rgba(93,95,239,0.3)] hover:bg-[#4F51E5] hover-lift transition-all"
              >
                {editingProduct ? 'Update Product' : 'Save Product'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B5141]/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#093A3E] mb-2">Delete Product</h3>
            <p className="text-sm font-medium text-[#618D80] mb-6">Are you sure you want to remove this product? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-3 text-sm font-bold text-[#0B5141] bg-[#F0FDF8] rounded-xl hover:bg-[#B9EBD7] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDeleteProduct(deleteConfirmId)} 
                className="flex-1 py-3 text-sm font-bold text-white bg-[#FF6B6B] rounded-xl hover:bg-red-500 shadow-md transition-colors hover-lift"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B5141]/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#093A3E] mb-2">Notice</h3>
            <p className="text-sm font-medium text-[#618D80] mb-6">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="w-full py-3 text-sm font-bold text-white bg-[#0B5141] rounded-xl hover:bg-[#084033] shadow-md transition-colors hover-lift"
            >
              Okay, Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
