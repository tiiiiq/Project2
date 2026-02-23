'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import ProjectViewSupervisor from '@/components/project/ProjectViewSupervisor';
import { useState } from 'react';

export default function SupervisorProjectPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="بيانات المشروع" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-[#090832]">تفاصيل فريق المشروع</h1>
                            <p className="text-gray-500 mt-2">عرض بيانات المشروع والمواعيد النهائية</p>
                        </div>

                        <ProjectViewSupervisor />
                    </div>
                </main>
            </div>
        </div>
    );
}
