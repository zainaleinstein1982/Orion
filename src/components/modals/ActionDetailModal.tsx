import React, { useState } from 'react';
import { AgenticAction, LanguageMode } from '../../types/orion';
import { X, Send, CheckCircle } from 'lucide-react';

interface ActionDetailModalProps {
  action: AgenticAction | null;
  onClose: () => void;
  langMode: LanguageMode;
}

export default function ActionDetailModal({
  action,
  onClose,
  langMode
}: ActionDetailModalProps) {
  if (!action) return null;

  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  const handleSimulateExecution = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecuted(true);
      setTimeout(() => {
        setExecuted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {action.action_id}
            </span>
            <h3 className="text-sm font-bold text-slate-100">
              {action.type} {isEn ? 'Preview' : isId ? 'Pratinjau' : 'Preview / Pratinjau'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300 overflow-y-auto max-h-[70vh]">
          {action.type === 'TICKET_CREATE' && (
            <div className="bg-[#111827] rounded-xl border border-[#2a3a52] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2a3a52] pb-2">
                <span className="font-bold text-cyan-400">
                  {isEn ? 'JIRA ISSUE PREVIEW' : 'PRATINJAU TIKET JIRA'}
                </span>
                <span className="font-mono text-slate-400">Project: {action.target_project || 'MKT'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  {isEn ? 'Summary' : 'Ringkasan'}
                </span>
                <div className="font-semibold text-slate-100 mt-0.5">
                  {isEn ? action.summary_en : action.summary_id}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    {isEn ? 'Assignee' : 'Penanggung Jawab'}
                  </span>
                  <div className="text-slate-200 mt-0.5">
                    {action.assignee || (isEn ? 'Unassigned' : 'Belum Ditugaskan')}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    {isEn ? 'Priority' : 'Prioritas'}
                  </span>
                  <div className="text-rose-400 font-bold mt-0.5">{action.priority || 'P1'}</div>
                </div>
              </div>
            </div>
          )}

          {action.type === 'SLACK_NOTIFY' && (
            <div className="bg-[#111827] rounded-xl border border-[#2a3a52] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2a3a52] pb-2">
                <span className="font-bold text-amber-400">
                  {isEn ? 'SLACK WEBHOOK PAYLOAD' : 'PAYLOAD WEBHOOK SLACK'}
                </span>
                <span className="font-mono text-slate-400">Channel: {action.target || '#project-alpha'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  {isEn ? 'Message Content' : 'Isi Pesan'}
                </span>
                <div className="text-slate-200 mt-1 leading-relaxed">
                  {isEn ? action.summary_en || action.summary_id : action.summary_id}
                </div>
              </div>
            </div>
          )}

          {/* JSON raw */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              {isEn ? 'Raw Dispatch Payload:' : 'Payload Eksekusi JSON:'}
            </span>
            <pre className="p-3 rounded-lg bg-[#0a0e1a] border border-[#2a3a52] font-mono text-[11px] text-cyan-300 overflow-x-auto">
              {JSON.stringify(action, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a3a52] bg-[#111827] flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {isEn ? 'Confidence:' : 'Keyakinan:'}{' '}
            <span className="text-emerald-400 font-bold">{Math.round(action.confidence_score * 100)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#253349] text-slate-300 text-xs font-semibold"
            >
              {isEn ? 'Close' : 'Tutup'}
            </button>
            <button
              onClick={handleSimulateExecution}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              {isExecuting ? (
                <span>{isEn ? 'Dispatching...' : 'Mengeksekusi...'}</span>
              ) : executed ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Success!' : 'Berhasil!'}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Execute Trigger' : 'Jalankan Aksi'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
