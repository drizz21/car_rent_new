// app/admin/layout.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FaHome,
  FaCar,
  FaMoneyBillWave,
  FaChartBar,
  FaImages,
  FaClipboardList,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaUser,
} from 'react-icons/fa';
import LogoutButton from './components/LogoutButton';
import AdminGuard from './components/AdminGuard';

const menu = [
  { name: 'Dashboard', href: '/admin', icon: <FaHome /> },
  { name: 'Katalog', href: '/admin/katalog', icon: <FaCar /> },
  { name: 'Laporan', href: '/admin/laporan', icon: <FaChartBar /> },
  { name: 'Pengeluaran', href: '/admin/Pengeluaran', icon: <FaMoneyBillWave/> },
  { name: 'Order', href: '/admin/order', icon: <FaClipboardList /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip layout untuk halaman login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`z-40 fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform lg:static lg:translate-x-0 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header logo */}
        <div className="flex items-center h-20 px-6 border-b border-gray-200">
          <Image src="/logo-rino.svg" alt="Logo" width={40} height={40} className="mr-3" />
          <div>
            <h1 className="text-lg font-bold text-[#1C3F94]">RINO</h1>
            <p className="text-xs text-gray-600">RENTAL MOBIL</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-2 text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4 space-y-2">
          {menu.map(({ name, href, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{icon}</span> {name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <Link
            href="/admin/pengaturan"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
          >
            <FaCog className="mr-3" /> Pengaturan
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white shadow-sm h-16 px-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 mr-4"
            >
              <FaBars />
            </button>
           
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      </div>
    </AdminGuard>
  );
}