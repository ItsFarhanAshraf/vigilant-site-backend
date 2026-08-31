import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';

export const Layout = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-start">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Dark Footer Banner matching the screenshot */}
      <footer className="bg-slate-950 text-slate-300 py-3.5 px-6 text-xs border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
        <div className="font-medium">
          <span className="text-amber-400 font-bold">{t('copyright')}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          ACAG CMIS v1.0 &bull; Govt of Punjab
        </div>
      </footer>
    </div>
  );
};
