import React, { useState } from 'react';
import { OrionAnalysisResult, LanguageMode } from '../../types/orion';
import {
  Check,
  Copy,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Sparkles,
  Send,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface OutputViewProps {
  result: OrionAnalysisResult;
  langMode: LanguageMode;
  onOpenActionDetail?: (action: any) => void;
}

export default function OutputView({ result, langMode, onOpenActionDetail }: OutputViewProps) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const handleCopyJson = () => {
    const payload = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(payload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleSimulateWebhook = () => {
    setIsSimulatingWebhook(true);
    setWebhookStatus(null);
    setTimeout(() => {
      setIsSimulatingWebhook(false);
      setWebhookStatus('Payload successfully dispatched to n8n webhook (HTTP 200 OK)');
      setTimeout(() => setWebhookStatus(null), 4000);
    }, 1200);
  };

  const getLabelTagClass = (label: string) => {
    switch (label) {
      case '[FAKTA]':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case '[INFERENSI]':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case '[ASUMSI]':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case '[KONFLIK]':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
    }
  };

  const getPriorityClass = (p: string) => {
    switch (p) {
      case 'P0':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      case 'P1':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
      case 'P2':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Step Processing Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1e293b] border border-emerald-500/40 rounded-xl p-4 relative shadow-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold absolute top-3.5 right-3.5">
            ✓
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            Step 1
          </div>
          <div className="text-xs font-bold text-slate-100 mb-0.5">Parsing & Extraction</div>
          <div className="text-[11px] text-slate-400">Noise filtering, signal extraction</div>
        </div>

        <div className="bg-[#1e293b] border border-emerald-500/40 rounded-xl p-4 relative shadow-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold absolute top-3.5 right-3.5">
            ✓
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            Step 2
          </div>
          <div className="text-xs font-bold text-slate-100 mb-0.5">Knowledge Graph & RAG</div>
          <div className="text-[11px] text-slate-400">Entity linking, consistency check</div>
        </div>

        <div className="bg-[#1e293b] border border-emerald-500/40 rounded-xl p-4 relative shadow-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold absolute top-3.5 right-3.5">
            ✓
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            Step 3
          </div>
          <div className="text-xs font-bold text-slate-100 mb-0.5">Bilingual MoM Generation</div>
          <div className="text-[11px] text-slate-400">Executive summary, decisions</div>
        </div>

        <div className="bg-[#1e293b] border border-cyan-500 rounded-xl p-4 relative shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold absolute top-3.5 right-3.5 animate-pulse">
            ⚡
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 mb-1">
            Step 4
          </div>
          <div className="text-xs font-bold text-cyan-200 mb-0.5">Agentic Trigger Strategy</div>
          <div className="text-[11px] text-slate-400">Workflow automation payload</div>
        </div>
      </div>

      {/* Template A — Extraction Table */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <h3 className="text-sm font-bold text-slate-100">Template A — Extraction Table</h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            [INPUT: {result.meeting.source_ref}]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2a3a52] bg-[#1a2235]/60 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4 w-28">Kategori</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4 w-28">Owner</th>
                <th className="py-3 px-4 w-28">Deadline</th>
                <th className="py-3 px-4 w-28">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a52]/40 text-slate-300">
              {result.extraction_items
                .filter(i => !i.filtered)
                .map((row, idx) => (
                  <tr key={row.id} className="hover:bg-cyan-500/[0.03] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{row.category}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-200">
                      {langMode === 'en' && row.item_en ? row.item_en : row.item}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{row.owner}</td>
                    <td className="py-3 px-4 text-slate-400">{row.deadline}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getLabelTagClass(row.label)}`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template B — Historical Context & Consistency */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🔗</span>
            <h3 className="text-sm font-bold text-slate-100">
              Template B — Historical Context & Consistency
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Cross-Reference Engine</span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs font-semibold text-cyan-400 mb-2">
              RAG Query Disarankan / Recommended RAG Queries:
            </div>
            <div className="font-mono text-xs text-slate-300 bg-[#1a2235] p-3.5 rounded-xl border border-[#2a3a52] space-y-1">
              {result.rag_queries.map((q, i) => (
                <div key={i} className="text-cyan-300/90">
                  → "{q}"
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {result.consistency_checks.map(chk => {
              const bg =
                chk.type === 'ok'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : chk.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : chk.type === 'danger'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300';
              return (
                <div
                  key={chk.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${bg}`}
                >
                  <span className="text-base shrink-0">{chk.icon}</span>
                  <div>
                    {langMode === 'en' ? chk.message_en : chk.message_id}
                    {langMode === 'bi' && (
                      <div className="mt-1 text-[11px] opacity-80 italic">
                        EN: {chk.message_en}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Template C — Bilingual Minutes of Meeting */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📝</span>
            <h3 className="text-sm font-bold text-slate-100">
              Template C — Bilingual Minutes of Meeting
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Formal MoM Artifact</span>
        </div>

        <div className="p-5 space-y-6">
          {/* Metadata pill container */}
          <div className="bg-[#1a2235] p-4 rounded-xl border border-[#2a3a52] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Topik / Topic:</span>
              <strong className="text-slate-100 font-semibold">{result.meeting.topic_id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tanggal / Date:</span>
              <strong className="text-slate-100 font-semibold">{result.meeting.date}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Peserta / Attendees:</span>
              <strong className="text-slate-100 font-semibold">
                {result.meeting.attendees.join(', ')}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Sumber / Source:</span>
              <strong className="text-cyan-400 font-mono">{result.meeting.source_ref}</strong>
            </div>
          </div>

          {/* Section 1: Ringkasan Eksekutif */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
              1. Ringkasan Eksekutif / Executive Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1a2235] border border-[#2a3a52]">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  🇮🇩 Bahasa Indonesia
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.executive_summary.id}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#1a2235] border border-[#2a3a52]">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  🇬🇧 English
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.executive_summary.en}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Keputusan Penting */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
              3. Keputusan Penting / Key Decisions
            </h4>
            <div className="overflow-x-auto border border-[#2a3a52] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1a2235] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#2a3a52]">
                    <th className="py-2.5 px-4 w-12">No</th>
                    <th className="py-2.5 px-4">Keputusan (ID)</th>
                    <th className="py-2.5 px-4">Decision (EN)</th>
                    <th className="py-2.5 px-4 w-32">Decided By</th>
                    <th className="py-2.5 px-4">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a3a52]/50 text-slate-300">
                  {result.decisions.map(d => (
                    <tr key={d.id} className="hover:bg-cyan-500/[0.02]">
                      <td className="py-2.5 px-4 font-mono text-slate-500">{d.id}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-200">{d.decision_id}</td>
                      <td className="py-2.5 px-4 text-slate-300">{d.decision_en}</td>
                      <td className="py-2.5 px-4 text-cyan-400">{d.decided_by}</td>
                      <td className="py-2.5 px-4 text-slate-400">{d.rationale_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Tindak Lanjut */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
              4. Tindak Lanjut / Action Items
            </h4>
            <div className="overflow-x-auto border border-[#2a3a52] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1a2235] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#2a3a52]">
                    <th className="py-2.5 px-4 w-12">No</th>
                    <th className="py-2.5 px-4">Aksi (ID)</th>
                    <th className="py-2.5 px-4">Action (EN)</th>
                    <th className="py-2.5 px-4 w-24">PIC</th>
                    <th className="py-2.5 px-4 w-28">Deadline</th>
                    <th className="py-2.5 px-4 w-24">Prioritas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a3a52]/50 text-slate-300">
                  {result.actions
                    .filter(a => a.type === 'TICKET_CREATE')
                    .map((a, i) => (
                      <tr key={a.action_id} className="hover:bg-cyan-500/[0.02]">
                        <td className="py-2.5 px-4 font-mono text-slate-500">{i + 1}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-200">{a.summary_id}</td>
                        <td className="py-2.5 px-4 text-slate-300">{a.summary_en}</td>
                        <td className="py-2.5 px-4 text-cyan-400">{a.assignee}</td>
                        <td className="py-2.5 px-4 text-slate-400">{a.deadline}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityClass(
                              a.priority || 'P1'
                            )}`}
                          >
                            {a.priority || 'P1'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Template E — Agentic Workflow JSON Payload */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🔧</span>
            <h3 className="text-sm font-bold text-slate-100">
              Template E — Agentic Workflow JSON Payload
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateWebhook}
              disabled={isSimulatingWebhook}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSimulatingWebhook ? 'Dispatching...' : 'Test Webhook'}</span>
            </button>
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg bg-[#1a2235] hover:bg-[#253349] text-slate-300 border border-[#2a3a52] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {webhookStatus && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{webhookStatus}</span>
          </div>
        )}

        <div className="p-5">
          <pre className="p-4 rounded-xl bg-[#0a0e1a] border border-[#2a3a52] text-xs font-mono text-cyan-300 overflow-x-auto max-h-96 leading-relaxed selection:bg-cyan-500/30">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>

      {/* Disclaimer */}
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
