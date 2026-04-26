'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { label: 'الرئيسية', href: '/' },
    { label: 'تسجيل الدخول', href: '/login' },
    { label: 'تسجيل مشروع', href: '/register-project' },
  ];

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-white shadow-sm w-full z-50">
      <div className="flex gap-6 md:gap-10 font-bold text-sm text-[#475569]">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`pb-1 transition-all ${
                isActive
                  ? 'text-[#1e293b] border-b-[3px] border-[#3b4361]'
                  : 'hover:text-[#1e293b] text-[#475569]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="text-lg md:text-xl font-bold tracking-widest text-[#1e293b] uppercase" dir="ltr">
        AI SUPERVISOR
      </div>
    </nav>
  );
}
