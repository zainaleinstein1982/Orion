import React, { useState } from 'react';
import { OrionAnalysisResult, AgenticAction, LanguageMode } from '../../types/orion';
import {
  Zap,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Layers,
  Send,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface ActionPlanViewProps {
  result: OrionAnalysisResult;
  langMode: LanguageMode;
  onOpenActionDetail: (action: AgenticAction) => void;
}

export default function ActionPlanView({
  result,
  langMode,
  onOpenActionDetail
}: ActionPlanViewProps) {
  const [actionsState, setActionsState] = useState<AgenticAction[]>(result.actions);

  const toggleDispatch = (actionId: string) => {
    setActionsState(prev =>
      prev.map(a =>
        a.action_id === actionId
          ? { ...a, status: a.status === 'dispatched' ? 'pending' : 'dispatched' }
          : a
      )
    );
  };

  const getActionTypeClass = (type: string) => {
    switch (type) {
      case 'TICKET_CREATE':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'SLACK_NOTIFY':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'RAG_UPSERT':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
      case 'APPROVAL_REQUEST':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      case 'CALENDAR_INVITE':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      default:
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
    }
  };

  const getPriorityClass = (p?: string) => {
    switch (p) {
      case 'P0':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'P1':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'P2':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Agentic Action Plan & Execution Pipeline
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {actionsState.length} Actions Synthesized
          </span>
        </div>

        <div className="p-6">
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#2a3a52]">
            {actionsState.map(act => (
              <div
                key={act.action_id}
                className="relative p-5 rounded-xl bg-[#1a2235] border border-[#2a3a52] hover:border-cyan-500/50 transition-all shadow-md group"
              >
                {/* Bullet */}
                <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#111827] shadow-[0_0_8px_#06b6d4]" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getActionTypeClass(act.type)}`}>
                      {act.type}
                    </span>
                    {act.priority && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityClass(act.priority)}`}>
                        {act.priority}
                      </span>
                    )}
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {act.action_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenActionDetail(act)}
                      className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#253349] text-slate-300 border border-[#2a3a52] text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => toggleDispatch(act.action_id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        act.status === 'dispatched'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                      }`}
                    >
                      {act.status === 'dispatched' ? '✓ Dispatched' : 'Dispatch'}
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-100 mb-1">
                  {langMode === 'en' ? act.summary_en : act.summary_id}
                </div>

                {langMode === 'bi' && act.summary_en && (
                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    EN: {act.summary_en}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-[#2a3a52]/60 mt-3 font-mono">
                  {act.assignee && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      {act.assignee}
                    </span>
                  )}
                  {act.deadline && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {act.deadline}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Target: {act.target_system.toUpperCase()}{act.target_project ? ` (${act.target_project})` : ''}
                  </span>
                  <span className="text-emerald-400 font-semibold ml-auto">
                    Confidence: {Math.round(act.confidence_score * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-[#111827] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${Math.round(act.confidence_score * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <div className="space-y-1">
          <strong>DISCLAIMER:</strong>
          <div>
            Payload di atas bersifat rekomendasi. Eksekusi akhir dan persetujuan manusia tetap diperlukan untuk aksi berisiko tinggi.
          </div>
          <div className="italic text-[11px] opacity-80">
            The above payload is a recommendation. Final execution and human approval are still required for high-risk actions.
          </div>
        </div>
      </div>
    </div>
  );
}
