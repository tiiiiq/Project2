'use client';

import Sidebar from '@/components/Sidebar';
import ProjectForm from '@/components/project/ProjectForm';
import PageHeader from '@/components/PageHeader';
import { useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="بيانات المشروع" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">بيانات المشروع</h1>
              <p className="text-gray-600 mt-2">يرجى إكمال بيانات المشروع لتقديمه للمراجعة</p>
            </div>
            <ProjectForm />
          </div>
        </main>
      </div>
    </div>
  );
}