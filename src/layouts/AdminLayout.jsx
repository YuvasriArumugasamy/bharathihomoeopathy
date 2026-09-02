import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopbar } from '../components/admin/AdminTopbar';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex text-slate-800 font-sans w-full max-w-full overflow-x-hidden">
      
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
