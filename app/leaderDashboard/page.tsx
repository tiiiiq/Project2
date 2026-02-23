'use client';

import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/DashboardCard';
import PageHeader from '@/components/PageHeader';
import { useState } from 'react';

const dashboardCards = [
  { id: 1, text: "لا توجد مهام حاليا" },
  { id: 2, text: "لا يوجد مشروع حاليا" },
  { id: 3, text: "ابدأ الآن وانشئ الفكرة", href: "/generate-ideas" },
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="لوحة تحكم الفريق" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {dashboardCards.map((card) => (
              <DashboardCard
                key={card.id}
                id={card.id}
                text={card.text}
                href={card.href}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}