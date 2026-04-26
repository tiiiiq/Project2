'use client';

import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/DashboardCard';
import PageHeader from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { API_URL, getHeaders } from '@/config/api';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [dashboardCards, setDashboardCards] = useState([
    { id: 1, text: "لا توجد مهام حاليا" },
    { id: 2, text: "لا يوجد مشروع حاليا" },
    { id: 3, text: "ابدأ الآن وانشئ الفكرة", href: "/generate-ideas" },
  ]);

  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem('token');
      const projectId = localStorage.getItem('project_id');
      const userStr = localStorage.getItem('user');

      if (!token || !projectId || !userStr) return;

      const userObj = JSON.parse(userStr);

      try {
        // 1. Fetch Members to check if user is leader
        const membersRes = await fetch(`${API_URL}/api/projects/${projectId}/members`, {
          headers: getHeaders(token)
        });
        const membersData = await membersRes.json();
        if (membersRes.ok) {
          const me = membersData.data.members.find((m: any) => m.user_id === userObj.id);
          if (me && me.type === 'student leader') {
            setIsLeader(true);
          } else {
            setIsLeader(false);
          }
        }

        // 2. Fetch Idea Status
        const res = await fetch(`${API_URL}/api/projects/ideas/saved`, {
          headers: getHeaders(token)
        });
        const data = await res.json();

        let hasAcceptedIdea = false;
        if (res.ok) {
          const acceptedIdea = data.data.ideas.find((idea: any) => idea.is_accepted);
          if (acceptedIdea) {
            hasAcceptedIdea = true;
          }
        }

        // 3. Fetch Documents status if idea is accepted
        if (hasAcceptedIdea) {
          const docsRes = await fetch(`${API_URL}/api/documents`, {
            headers: getHeaders(token)
          });
          const docsData = await docsRes.json();
          if (docsRes.ok && docsData.data.documents) {
            const doc = docsData.data.documents;
            const allDocsFilled = doc.abstract && doc.objectives && doc.scope && doc.timeline && doc.risks;

            setDashboardCards(prev => prev.map(card =>
              card.id === 3
                ? {
                  ...card,
                  text: allDocsFilled ? "مستندات المشروع" : "انشأ ملفات المشروع",
                  href: allDocsFilled ? "/documents" : "/generate-docs"
                }
                : card
            ));
          } else {
            setDashboardCards(prev => prev.map(card =>
              card.id === 3
                ? { ...card, text: "انشأ ملفات المشروع", href: "/generate-docs" }
                : card
            ));
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchProjectData();
  }, []);

  // Filter cards: hide ID 3 if not leader
  const filteredCards = isLeader ? dashboardCards : dashboardCards.filter(c => c.id !== 3);

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="لوحة تحكم الفريق" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredCards.map((card) => (
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