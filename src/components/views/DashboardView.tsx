import React from 'react';
import { OrionAnalysisResult, LanguageMode } from '../../types/orion';
import { ViewType } from '../Sidebar';

interface DashboardViewProps {
  currentResult: OrionAnalysisResult;
  langMode: LanguageMode;
  onNavigate: (view: ViewType) => void;
  onLoadPreset: (presetId: string) => void;
}

export default function DashboardView({
  currentResult,
  langMode
}: DashboardViewProps) {
  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  // 4 items for Recent Activity
  const recentActivities = [
    {
      id: 1,
      dotColor: 'bg-emerald-400',
      title: isEn ? 'MoM published: Q4 Budget Review' : isId ? 'MoM diterbitkan: Review Anggaran Q4' : 'MoM published: Q4 Budget Review',
      time: isEn ? '2 min' : isId ? '2 mnt' : '2 min'
    },
    {
      id: 2,
      dotColor: 'bg-blue-400',
      title: isEn ? 'Jira ticket PROJ-456 created for Sari' : isId ? 'Tiket Jira PROJ-456 dibuat untuk Sari' : 'Jira ticket PROJ-456 created for Sari',
      time: isEn ? '5 min' : isId ? '5 mnt' : '5 min'
    },
    {
      id: 3,
      dotColor: 'bg-amber-400',
      title: isEn ? 'Approval request: Budget IDR 50M' : isId ? 'Permintaan persetujuan: Anggaran Rp 50 Juta' : 'Approval request: Budget IDR 50M',
      time: isEn ? '12 min' : isId ? '12 mnt' : '12 min'
    },
    {
      id: 4,
      dotColor: 'bg-cyan-400',
      title: isEn ? 'Slack notification → #project-alpha' : isId ? 'Notifikasi Slack → #project-alpha' : 'Slack notification → #project-alpha',
      time: isEn ? '1 hr' : isId ? '1 jam' : '1 hr'
    }
  ];

  // 4 items for Pending Actions
  const pendingActions = [
    {
      id: 1,
      dotColor: 'bg-rose-500',
      title: isEn ? 'P0: Impact analysis — Nov campaign (Sari)' : isId ? 'P0: Analisis dampak — Kampanye Nov (Sari)' : 'P0: Impact analysis — Nov campaign (Sari)',
      badge: 'P1',
      badgeBg: 'bg-[#332219] text-[#f97316] border-[#f97316]/40'
    },
    {
      id: 2,
      dotColor: 'bg-amber-400',
      title: isEn ? 'Approval: Budget cut confirmation (CFO)' : isId ? 'Persetujuan: Konfirmasi pemotongan anggaran (CFO)' : 'Approval: Budget cut confirmation (CFO)',
      badge: 'P1',
      badgeBg: 'bg-[#332219] text-[#f97316] border-[#f97316]/40'
    },
    {
      id: 3,
      dotColor: 'bg-blue-400',
      title: isEn ? 'Verify: Campaign team alignment' : isId ? 'Verifikasi: Penyelarasan tim kampanye' : 'Verify: Campaign team alignment',
      badge: 'P2',
      badgeBg: 'bg-[#2e2612] text-[#f59e0b] border-[#f59e0b]/40'
    },
    {
      id: 4,
      dotColor: 'bg-purple-400',
      title: isEn ? 'RAG Sync: Update Policies & SOP corpus' : isId ? 'Sinkronisasi RAG: Pembaruan korpus Kebijakan & SOP' : 'RAG Sync: Update Policies & SOP corpus',
      badge: 'P2',
      badgeBg: 'bg-[#2e2612] text-[#f59e0b] border-[#f59e0b]/40'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-start gap-4 md:gap-5">
      {/* 4 KPI Stat Cards Row (Uniform, compact, zero clipping) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 shrink-0">
        {/* Card 1 */}
        <div className="bg-[#1e293b] border border-[#2a3a52] rounded-xl p-3 sm:p-3.5 hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="w-7 h-7 rounded-md bg-cyan-500/15 flex items-center justify-center text-sm">
              📋
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
              +12%
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
            24
          </div>
          <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight">
            {isEn ? 'Meetings Processed' : isId ? 'Rapat Diproses' : 'Meetings Processed / Rapat Diproses'}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1e293b] border border-[#2a3a52] rounded-xl p-3 sm:p-3.5 hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="w-7 h-7 rounded-md bg-blue-500/15 flex items-center justify-center text-sm">
              ⚡
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
              +8%
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
            67
          </div>
          <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight">
            {isEn ? 'Action Items Created' : isId ? 'Aksi Tercipta' : 'Action Items Created / Aksi Tercipta'}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1e293b] border border-[#2a3a52] rounded-xl p-3 sm:p-3.5 hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="w-7 h-7 rounded-md bg-emerald-500/15 flex items-center justify-center text-sm">
              ✓
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono">
              +5%
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
            92%
          </div>
          <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight">
            {isEn ? 'Avg Confidence Score' : isId ? 'Skor Keyakinan Rata-rata' : 'Avg Confidence Score / Skor Keyakinan'}
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1e293b] border border-[#2a3a52] rounded-xl p-3 sm:p-3.5 hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="w-7 h-7 rounded-md bg-purple-500/15 flex items-center justify-center text-sm">
              🔗
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-mono">
              -2%
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
            156
          </div>
          <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight">
            {isEn ? 'RAG Queries Executed' : isId ? 'Kueri RAG Terdistribusi' : 'RAG Queries Executed / Kueri RAG'}
          </div>
        </div>
      </div>

      {/* Two Large Section Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Left Card: Recent Activity */}
        <div className="bg-[#1e293b] border border-[#2a3a52] rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a3a52] flex items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span>⚡</span>
              <span>
                {isEn ? 'Recent Activity' : isId ? 'Aktivitas Terbaru' : 'Recent Activity / Aktivitas Terbaru'}
              </span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col gap-2.5">
            {recentActivities.map(item => (
              <div
                key={item.id}
                className="h-11 flex items-center justify-between px-3.5 rounded-lg bg-[#1a2235] border border-[#2a3a52]/80 hover:border-cyan-500/40 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor} shrink-0`} />
                  <span className="text-slate-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.title}
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-mono shrink-0 ml-2">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Pending Actions */}
        <div className="bg-[#1e293b] border border-[#2a3a52] rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a3a52] flex items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span>🎯</span>
              <span>
                {isEn ? 'Pending Actions' : isId ? 'Aksi Tertunda' : 'Pending Actions / Aksi Tertunda'}
              </span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col gap-2.5">
            {pendingActions.map(action => (
              <div
                key={action.id}
                className="h-11 flex items-center justify-between px-3.5 rounded-lg bg-[#1a2235] border border-[#2a3a52]/80 hover:border-cyan-500/40 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${action.dotColor} shrink-0`} />
                  <span className="text-slate-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {action.title}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ml-2 ${action.badgeBg}`}
                >
                  {action.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
