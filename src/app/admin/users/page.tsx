"use client";

import React, { useState, useEffect } from 'react';
import { cleanImageUrl } from '@/lib/images';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/users?limit=10')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDeleteUser = async () => {
    if (userToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${userToDelete}`,
        { method: 'DELETE' }
      );
      
      // Some APIs return 200 or 201 or 204 on delete. Either way we want ok.
      // E-commerce API fake might just return truthy res.ok
      if (!res.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user.id !== userToDelete));
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    } finally {
      setIsDeleting(false);
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
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#093A3E] mb-2">User Management</h1>
          <p className="text-[#618D80] text-sm font-medium">Overlook and manage registered storefront curators.</p>
        </div>
        <button className="bg-[#0B5141] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-lg hover:bg-[#084033] hover-lift transition-all">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Add Curator
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-[#0B5141]/5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-[#F0FDF8]/30 rounded-3xl p-6 border border-[#0B5141]/5 flex items-center group hover:bg-[#B9EBD7]/20 transition-all">
              <div className="w-16 h-16 rounded-2xl overflow-hidden mr-4 shadow-sm border-2 border-white">
                <img 
                  src={cleanImageUrl(user.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`)} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col flex-grow">
                <span className="text-base font-bold text-[#093A3E]">{user.name}</span>
                <span className="text-[10px] text-[#618D80] font-medium mb-2">{user.email}</span>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-[#B9EBD7] text-[#0B5141] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{user.role}</span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setUserToDelete(user.id)} className="p-1.5 text-[#FF6B6B] hover:bg-white rounded-lg transition-all"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setUserToDelete(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#093A3E] mb-2">Delete User</h3>
            <p className="text-[#618D80] mb-6 text-sm">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-sm font-bold text-[#618D80] hover:bg-gray-100 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-[#FF6B6B] hover:bg-[#E55A5A] rounded-xl transition-colors flex items-center shadow-lg shadow-red-500/30"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
