import Navbar from '@/components/Navbar';
import { Lightbulb, ClipboardList, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[550px] w-full flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/s3.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#2b3252]/60 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-4xl text-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-[1.4] mb-10 drop-shadow-lg">
            منصة سعودية ذكية تولّد أفكار مشاريع تخرج حسب بيانات الطلاب، تحلل المخاطر، توزع المهام بذكاء، باستخدام الذكاء الاصطناعي.
          </h1>
          <button className="bg-[#e2e8f0] text-[#1e293b] px-12 py-3 font-bold text-lg hover:bg-white transition-colors shadow-md">
            ابدأ الآن
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white shadow-sm z-10 -mt-1 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#1b254b] flex items-center justify-center text-white mb-6 shadow-md">
                <Lightbulb size={40} strokeWidth={1.5} />
              </div>
              <p className="text-[#334155] font-semibold text-lg max-w-[200px]">
                اقتراح أفكار ابتكارية لتنمية فكرة المشروع
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#1b254b] flex items-center justify-center text-white mb-6 shadow-md">
                <ClipboardList size={40} strokeWidth={1.5} />
              </div>
              <p className="text-[#334155] font-semibold text-lg max-w-[200px]">
                توليد مهام المشروع وتوزيعها
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#1b254b] flex items-center justify-center text-white mb-6 shadow-md">
                <Lightbulb size={40} strokeWidth={1.5} />
              </div>
              <p className="text-[#334155] font-semibold text-lg max-w-[200px]">
                اقتراح مصادر تعليمية للمشروع
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="flex flex-col md:flex-row min-h-[450px]">
        {/* Right side (Text block, rendered first in RTL) */}
        <div className="md:w-1/2 bg-[#1b254b] text-white p-12 lg:p-24 relative overflow-hidden flex flex-col justify-center">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('/images/s2.jpg')" }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-[28px] font-bold mb-8 text-white leading-tight">منصة توجيه مشاريع التخرج الذكية</h2>
            <div className="space-y-6 text-gray-200 text-sm md:text-base leading-relaxed font-medium">
              <p>
                تعمل المنصة الذكية في توليد أفكار لمشاريع تخرج الطلاب باستخدام الذكاء الاصطناعي بناءً على معلوماتهم، وإنشاء ملفات المشروع الأساسية مثل الملخص والجدول الزمني والأهداف ونطاق المشروع.
              </p>
              <p>
                كما يتم إجراء تحليل للمخاطر المحتملة للفكرة المختارة، وتوليد موارد تعليمية للمساهمة في تنفيذها باستخدام الذكاء الاصطناعي.
              </p>
              <p>
                وأخيراً، يتم توليد مهام مستخلصة من المشروع وتوزيعها على الطلاب وفقاً لمعايير مثل مهاراتهم وتخصصاتهم واهتماماتهم.
              </p>
            </div>
          </div>
        </div>

        {/* Left side (Image block, rendered second in RTL) */}
        <div className="md:w-1/2 relative min-h-[350px] md:min-h-full">
          <img
            src="/images/s1.jpg"
            alt="Saudi man in office"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Feedback Section */}
      <section className="flex flex-col md:flex-row min-h-[450px]">
        {/* Right side (Form block, rendered first in RTL) */}
        <div className="md:w-1/2 bg-[#30385c] text-white p-12 lg:p-24 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto md:mx-0">
            <h3 className="text-[17px] font-semibold text-white mb-10 leading-relaxed text-right">
              أرسل لنا تقييمك للمنصة مع إضافة ملاحظاتك عليها إن تكرمت
            </h3>

            <div className="mb-10">
              <input
                type="text"
                placeholder="اكتب ملاحظة"
                className="w-full px-5 py-4 text-gray-800 bg-white shadow-inner focus:outline-none placeholder-gray-500 font-medium text-right text-sm"
              />
            </div>

            {/* Stars row */}
            <div className="flex gap-4 mb-10 justify-end" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 ${star === 1 ? 'text-teal-400' : 'text-gray-400'} cursor-pointer hover:text-teal-300 transition-colors`}
                  strokeWidth={1.5}
                />
              ))}
            </div>

            <div className="flex justify-start">
              <button className="bg-[#5c6e9e] hover:bg-[#4b5b84] transition-colors py-[10px] px-16 text-white font-bold text-lg shadow-md rounded-[2px]">
                حفظ
              </button>
            </div>
          </div>
        </div>

        {/* Left side (Image block, rendered second in RTL) */}
        <div className="md:w-1/2 relative min-h-[350px] md:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Students collaborating"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
