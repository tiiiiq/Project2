// components/DashboardCard.tsx
'use client';

import { FolderKanban, ClipboardList, Lightbulb } from 'lucide-react';

interface DashboardCardProps {
  id: number;
  text: string;
}

const icons = {
  1: ClipboardList,
  2: FolderKanban,
  3: Lightbulb,
};

const DashboardCard = ({ id, text }: DashboardCardProps) => {
  const Icon = icons[id as keyof typeof icons];

  return (
    <div className="bg-[#9BB1D9] rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-300 group">
   
      <div className="w-20 h-20 bg-[#9BB1D9] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{text}</h3>


    </div>
  );
};

export default DashboardCard;