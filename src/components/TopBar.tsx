import React, { useState } from 'react';
import { ViewType } from './Sidebar';
import { LanguageMode } from '../types/orion';
import { Bell, Download, Menu } from 'lucide-react';

interface TopBarProps {
  currentView: ViewType;
  langMode: LanguageMode;
  onSetLangMode: (lang: LanguageMode) => void;
  onOpenMobileSidebar: () => void;
  onOpenExportModal: () => void;
  onLoadPreset: (presetId: string) => void;
}

export default function TopBar({
  currentView,
  langMode,
  onSetLangMode,
  onOpenMobileSidebar,
  onOpenExportModal
}: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  const viewMetadata: Record<ViewType, { title: string; crumb: string }> = {
    dashboard: {
      title: 'Dashboard',
      crumb: isEn ? 'ORION / Dashboard' : isId ? 'ORION / Dashboard' : 'ORION / Dashboard'
    },
    input: {
      title: isEn ? 'New Analysis' : isId ? 'Analisis Baru' : 'New Analysis / Analisis Baru',
      crumb: isEn ? 'ORION / New Analysis' : isId ? 'ORION / Analisis Baru' : 'ORION / New Analysis'
    },
    output: {
      title: isEn ? 'Output' : isId ? 'Hasil Output' : 'Output / Hasil',
      crumb: isEn ? 'ORION / Output' : isId ? 'ORION / Hasil Output' : 'ORION / Output'
    },
    extraction: {
      title: isEn ? 'Extraction Table' : isId ? 'Tabel Ekstraksi' : 'Extraction / Ekstraksi',
      crumb: isEn ? 'ORION / Analysis / Extraction' : isId ? 'ORION / Analisis / Ekstraksi' : 'ORION / Analysis / Extraction'
    },
    decision: {
      title: isEn ? 'Decision Matrix' : isId ? 'Matriks Keputusan' : 'Decision Matrix / Keputusan',
      crumb: isEn ? 'ORION / Analysis / Decision Matrix' : isId ? 'ORION / Analisis / Matriks Keputusan' : 'ORION / Analysis / Decision Matrix'
    },
    actions: {
      title: isEn ? 'Action Plan' : isId ? 'Rencana Aksi' : 'Action Plan / Aksi',
      crumb: isEn ? 'ORION / Analysis / Action Plan' : isId ? 'ORION / Analisis / Rencana Aksi' : 'ORION / Analysis / Action Plan'
    },
    knowledge: {
      title: isEn ? 'Knowledge Base' : isId ? 'Basis Pengetahuan' : 'Knowledge Base / Basis Data',
      crumb: isEn ? 'ORION / System / Knowledge Base' : isId ? 'ORION / Sistem / Basis Pengetahuan' : 'ORION / System / Knowledge Base'
    },
    settings: {
      title: isEn ? 'Settings' : isId ? 'Pengaturan' : 'Settings / Pengaturan',
      crumb: isEn ? 'ORION / System / Settings' : isId ? 'ORION / Sistem / Pengaturan' : 'ORION / System / Settings'
    }
  };

  const meta = viewMetadata[currentView] || viewMetadata.dashboard;

  const sampleNotifications = [
    {
      id: 1,
      title: isEn ? 'MoM Published: Q4 Budget Review' : isId ? 'MoM Diterbitkan: Review Anggaran Q4' : 'MoM Published: Q4 Budget Review',
      time: isEn ? '2m ago' : isId ? '2 mnt lalu' : '2m ago'
    },
    {
      id: 2,
      title: isEn ? 'Jira Ticket ACT-001 created for Sari' : isId ? 'Tiket Jira ACT-001 dibuat untuk Sari' : 'Jira Ticket ACT-001 created for Sari',
      time: isEn ? '5m ago' : isId ? '5 mnt lalu' : '5m ago'
    },
    {
      id: 3,
      title: isEn ? 'Consistency Warning: Nov Launch Budget Gap' : isId ? 'Peringatan Konsistensi: Gap Anggaran Launching Nov' : 'Consistency Warning: Nov Launch Budget Gap',
      time: isEn ? '12m ago' : isId ? '12 mnt lalu' : '12m ago'
    }
  ];

  return (
    <header className="h-16 px-6 md:px-8 border-b border-[#2a3a52] bg-[#111827]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20 sticky top-0 w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {meta.title}
          </h2>
          <span className="text-xs text-slate-400 font-normal">
            {meta.crumb}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Language switch */}
        <div className="flex bg-[#1a2235] rounded-full p-1 border border-[#2a3a52]">
          <button
            onClick={() => onSetLangMode('id')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              langMode === 'id'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ID
          </button>
          <button
            onClick={() => onSetLangMode('en')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              langMode === 'en'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onSetLangMode('bi')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              langMode === 'bi'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BI
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full border border-[#2a3a52] bg-[#1a2235] text-slate-300 hover:text-cyan-400 hover:border-cyan-500 flex items-center justify-center transition-all relative"
            title={isEn ? 'Notifications' : isId ? 'Notifikasi' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1e293b] border border-[#2a3a52] rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#2a3a52] mb-2">
                <span className="text-xs font-semibold text-slate-200">
                  {isEn ? 'Alerts & Notifications' : isId ? 'Peringatan & Notifikasi' : 'Alerts & Notifications'}
                </span>
                <span className="text-[10px] text-cyan-400 cursor-pointer">
                  {isEn ? 'Mark all read' : isId ? 'Tandai sudah dibaca' : 'Mark all read'}
                </span>
              </div>
              <div className="space-y-2">
                {sampleNotifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-[#111827]/70 text-xs hover:bg-[#253349] transition-colors">
                    <div className="font-medium text-slate-200">{n.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="w-9 h-9 rounded-full border border-[#2a3a52] bg-[#1a2235] text-slate-300 hover:text-cyan-400 hover:border-cyan-500 flex items-center justify-center transition-all"
          title={isEn ? 'Export Analysis & Payload' : isId ? 'Ekspor Analisis & Payload' : 'Export Analysis & Payload'}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
