'use client';

import { Calendar, Users, Info, Hash } from 'lucide-react';
import React from 'react';

const ProjectViewSupervisor = () => {
    const projectData = {
        projectName: 'نظام إدارة مشاريع التخرج الذكي',
        projectId: '1125',
        description: 'مشروع يهدف إلى أتمتة وتحسين عملية مراجعة وتتبع مشاريع التخرج باستخدام تقنيات الذكاء الاصطناعي، مما يسهل التواصل بين الطلاب والمشرفين.',
        teamMembers: '4',
        startDate: '2024-10-01',
        endDate: '2025-05-15',
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8" dir="rtl">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* اسم المشروع */}
                    <div>
                        <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                            <span>اسم المشروع</span>
                            <Info className="w-4 h-4 text-gray-400" />
                        </label>
                        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-[#090832] font-bold text-lg">
                            {projectData.projectName}
                        </div>
                    </div>

                    {/* رقم المشروع */}
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
                        <div className="flex items-center gap-2">
                            <Hash className="w-5 h-5 text-blue-600" />
                            <span className="text-md font-medium text-blue-800">رقم المشروع</span>
                        </div>
                        <span className="text-2xl font-black text-blue-900">#{projectData.projectId}</span>
                    </div>

                    {/* الوصف */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                            <span>الوصف</span>
                            <Info className="w-4 h-4 text-gray-400" />
                        </label>
                        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 leading-relaxed min-h-[100px]">
                            {projectData.description}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* عدد أعضاء الفريق */}
                    <div>
                        <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                            <span>عدد أعضاء الفريق</span>
                            <Users className="w-4 h-4 text-gray-400" />
                        </label>
                        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3 text-[#090832] font-bold">
                            <Users className="w-5 h-5 text-[#585C9A]" />
                            {projectData.teamMembers} أعضاء
                        </div>
                    </div>

                    {/* تاريخ بدء المشروع */}
                    <div>
                        <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                            <span>تاريخ بدء المشروع</span>
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </label>
                        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3 text-[#090832] font-bold">
                            <Calendar className="w-5 h-5 text-[#585C9A]" />
                            {projectData.startDate}
                        </div>
                    </div>

                    {/* موعد تسليم المشروع */}
                    <div>
                        <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                            <span>موعد تسليم المشروع</span>
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </label>
                        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3 text-[#090832] font-bold">
                            <Calendar className="w-5 h-5 text-[#585C9A]" />
                            {projectData.endDate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectViewSupervisor;
