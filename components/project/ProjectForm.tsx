'use client';

import { useState } from 'react';
import { Calendar, Users, Info, Save, RefreshCw, Lightbulb } from 'lucide-react';
import PrimaryButton from '../buttons/PrimaryButton';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    teamMembers: '1',
    startDate: '',
    endDate: '',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

  };

  const selectIdea = (idea: typeof projectIdeas[0]) => {
    setFormData({
      ...formData,
      projectName: idea.title,
      description: idea.description
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Ideas Section */}



        <div className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اسم المشروع */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>اسم المشروع</span>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full p-3 border outline-0 border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
                
                required
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
              <span className="text-md font-medium text-gray-700">رقم المشروع</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">#1125</span>

              </div>
            </div>
       
          </div>


            {/* الوصف */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>الوصف</span>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
              
                required
              />
            </div>
          </div>

   
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* عدد أعضاء الفريق */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>عدد أعضاء الفريق</span>
                <Users className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <select
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* تاريخ بدء المشروع */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>تاريخ بدء المشروع</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* موعد تسليم المشروع */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>موعد تسليم المشروع</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>


        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-gray-200">
   

      <PrimaryButton 
            type="submit"     
            size="lg"
          >
            حفظ
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;