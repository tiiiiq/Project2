'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import DashboardCard from '@/components/DashboardCard';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import { useState, useEffect } from 'react';
import { API_URL, getHeaders } from '@/config/api';

const initialCards = [
    { id: 3, text: "الأفكار المرسلة", href: "/sent-ideas" },
    { id: 1, text: "توليد وتوزيع المهام", href: "/ai-tasks" },
];

export default function SupervisorDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cards, setCards] = useState(initialCards);

    useEffect(() => {
        const fetchDocsStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${API_URL}/api/supervisor/docs-status`, {
                    headers: getHeaders(token)
                });
                const data = await res.json();
                if (res.ok && data.data.is_complete) {
                    setCards(prev => {
                        // Avoid duplicates if already added
                        if (prev.some(c => c.id === 4)) return prev;
                        return [...prev, { id: 4, text: "مستندات المشروع", href: "/documents" }];
                    });
                }
            } catch (err) {
                console.error('Error fetching docs status:', err);
            }
        };

        fetchDocsStatus();
    }, []);

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden" dir="rtl">
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="لوحة تحكم المشرف" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {cards.map((card) => (
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
