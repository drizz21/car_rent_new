'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dan data admin
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Hapus cookie
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirect ke halaman login
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
    >
      <FaSignOutAlt className="w-4 h-4" />
      Logout
    </button>
  );
};

export default LogoutButton; 