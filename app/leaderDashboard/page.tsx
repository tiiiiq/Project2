// app/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/DashboardCard';

const dashboardCards = [
  { id: 1, text: "لا توجد مهام حاليا" },
  { id: 2, text: "لا يوجد مشروع حاليا" },
  { id: 3, text: "ابدأ الآن وانشئ الفكرة" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
  
      <Sidebar />
      
 
      <div className=" m-8">


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardCards.map((card) => (
            <DashboardCard key={card.id} id={card.id} text={card.text} />
          ))}
        </div>
      </div>
    </div>
  );
}