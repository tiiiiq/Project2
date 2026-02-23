'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import DashboardCard from '@/components/DashboardCard';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';

const dashboardCards = [
    { id: 3, text: "الأفكار المرسلة", href: "/sent-ideas" },
    { id: 2, text: "لا يوجد مشروع حاليا" },
    { id: 1, text: "لا توجد مهام حاليا" },
];

import { useState } from 'react';

export default function SupervisorDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden" dir="rtl">
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="لوحة تحكم المشرف" onMenuClick={() => setIsSidebarOpen(true)} />

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
