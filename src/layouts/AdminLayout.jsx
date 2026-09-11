import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopbar } from '../components/admin/AdminTopbar';
import assets from '../assets';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex text-slate-800 font-serif w-full max-w-full overflow-x-hidden"
      style={{ backgroundImage: `url(${assets.paperBg})` }}
    >
      
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full lg:pl-64 transition-all">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Spacer to prevent content overlap under fixed topbar (h-20 = 80px) */}
        <div className="h-20 shrink-0 w-full" aria-hidden="true" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
