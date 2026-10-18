import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  TableProperties,
  GitBranch,
  Zap,
  Database,
  Sliders,
  X
} from 'lucide-react';
import { LanguageMode } from '../types/orion';

export type ViewType =
  | 'dashboard'
  | 'input'
  | 'output'
  | 'extraction'
  | 'decision'
  | 'actions'
  | 'knowledge'
  | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  langMode: LanguageMode;
}

export default function Sidebar({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  langMode
}: SidebarProps) {
  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  const navSections = [
    {
      title: isEn ? 'MAIN' : isId ? 'UTAMA' : 'MAIN / UTAMA',
      items: [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'input' as ViewType,
          label: isEn ? 'New Analysis' : isId ? 'Analisis Baru' : 'New Analysis / Analisis Baru',
          icon: PlusCircle,
          badge: '+'
        },
        {
          id: 'output' as ViewType,
          label: isEn ? 'Output' : isId ? 'Hasil Output' : 'Output / Hasil',
          icon: FileText
        }
      ]
    },
    {
      title: isEn ? 'ANALYSIS' : isId ? 'ANALISIS' : 'ANALYSIS / ANALISIS',
      items: [
        {
          id: 'extraction' as ViewType,
          label: isEn ? 'Extraction' : isId ? 'Tabel Ekstraksi' : 'Extraction / Ekstraksi',
          icon: TableProperties
        },
        {
          id: 'decision' as ViewType,
          label: isEn ? 'Decision Matrix' : isId ? 'Matriks Keputusan' : 'Decision Matrix / Keputusan',
          icon: GitBranch
        },
        {
          id: 'actions' as ViewType,
          label: isEn ? 'Action Plan' : isId ? 'Rencana Aksi' : 'Action Plan / Aksi',
          icon: Zap
        }
      ]
    },
    {
      title: isEn ? 'SYSTEM' : isId ? 'SISTEM' : 'SYSTEM / SISTEM',
      items: [
        {
          id: 'knowledge' as ViewType,
          label: isEn ? 'Knowledge Base' : isId ? 'Basis Pengetahuan' : 'Knowledge Base / Basis Data',
          icon: Database
        },
        {
          id: 'settings' as ViewType,
          label: isEn ? 'Settings' : isId ? 'Pengaturan' : 'Settings / Pengaturan',
          icon: Sliders
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#111827] border-r border-[#2a3a52] flex flex-col z-40 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 42 42" fill="none" className="w-full h-full">
                <circle cx="21" cy="21" r="18" stroke="url(#logoGrad)" strokeWidth="1.5" opacity="0.6" />
                <circle cx="21" cy="12" r="3" fill="#06b6d4" />
                <circle cx="12" cy="27" r="3" fill="#3b82f6" />
                <circle cx="30" cy="27" r="3" fill="#8b5cf6" />
                <line x1="21" y1="12" x2="12" y2="27" stroke="#06b6d4" strokeWidth="1" opacity="0.7" />
                <line x1="21" y1="12" x2="30" y2="27" stroke="#3b82f6" strokeWidth="1" opacity="0.7" />
                <line x1="12" y1="27" x2="30" y2="27" stroke="#8b5cf6" strokeWidth="1" opacity="0.7" />
                <circle cx="21" cy="21" r="2.5" fill="#06b6d4" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="42" y2="42">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ORION
              </h1>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                v1.0 Enterprise
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navSections.map(sec => (
            <div key={sec.title}>
              <div className="text-[10px] uppercase font-bold tracking-[2px] text-slate-400 px-3 mb-2">
                {sec.title}
              </div>
              <div className="space-y-1">
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative group text-left ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'text-slate-300 hover:bg-[#253349] hover:text-white border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#06b6d4]" />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-cyan-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a3a52] bg-[#0d1320]/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot shrink-0" />
              <span className="font-medium text-slate-300">
                {isEn ? 'System Operational' : isId ? 'Sistem Beroperasi' : 'System Operational'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">ID-JKT</span>
          </div>
        </div>
      </aside>
    </>
  );
}
