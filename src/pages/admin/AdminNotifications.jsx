import React from 'react';
import { Bell } from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminNotifications = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Notifications" 
        subtitle="Manage and view system alerts and notifications."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <EmptyState 
          icon={Bell}
          title="No new notifications"
          description="You're all caught up! Check back later for new alerts and updates."
        />
      </div>
    </div>
  );
};
