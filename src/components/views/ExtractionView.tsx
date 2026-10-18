import React, { useState } from 'react';
import { OrionAnalysisResult, CategoryType, LanguageMode } from '../../types/orion';
import { Search, Filter, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExtractionViewProps {
  result: OrionAnalysisResult;
  langMode: LanguageMode;
}

export default function ExtractionView({ result, langMode }: ExtractionViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: string[] = ['ALL', 'Keputusan', 'Action Item', 'Risiko', 'Open Question', 'Noise'];

  const filteredItems = result.extraction_items.filter(item => {
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.item + ' ' + (item.item_en || '') + ' ' + item.owner).toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

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

  const getConfidenceFill = (score: number) => {
    if (score >= 0.9) return 'bg-emerald-400';
    if (score >= 0.75) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Template A Detailed */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Template A — Extraction Table (Detailed)
              </h3>
              <span className="text-[11px] text-slate-400">
                Extracted business signals and filtered background noise
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items, owners..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#1a2235] border border-[#2a3a52] text-xs text-slate-200 outline-none focus:border-cyan-500 w-44 md:w-56"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex bg-[#1a2235] p-0.5 rounded-lg border border-[#2a3a52] overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2a3a52] bg-[#1a2235]/60 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4 w-28">Kategori</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4 w-24">Owner</th>
                <th className="py-3 px-4 w-24">Deadline</th>
                <th className="py-3 px-4 w-20">Timestamp</th>
                <th className="py-3 px-4 w-24">Label</th>
                <th className="py-3 px-4 w-28">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a52]/40 text-slate-300">
              {filteredItems.map(row => (
                <tr
                  key={row.id}
                  className={`hover:bg-cyan-500/[0.03] transition-colors ${
                    row.filtered ? 'opacity-50 italic bg-[#111827]/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-slate-500">{row.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {row.category}
                    {row.filtered && (
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                        Filtered Noise
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    <div className="font-medium">
                      {langMode === 'en' && row.item_en ? row.item_en : row.item}
                    </div>
                    {langMode === 'bi' && row.item_en && (
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        EN: {row.item_en}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{row.owner}</td>
                  <td className="py-3 px-4 text-slate-400">{row.deadline}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400 text-[11px]">
                    {row.timestamp || '—'}
                  </td>
                  <td className="py-3 px-4">
                    {row.filtered ? (
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        FILTERED
                      </span>
                    ) : (
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getLabelTagClass(row.label)}`}>
                        {row.label}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.filtered ? (
                      <span className="text-[11px] text-slate-500 font-mono">N/A</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-mono text-[11px] text-cyan-300 font-semibold">
                          {row.confidence.toFixed(2)}
                        </div>
                        <div className="w-20 h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getConfidenceFill(row.confidence)}`}
                            style={{ width: `${Math.round(row.confidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reasoning Trace Card */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Internal Reasoning Trace & Guardrail Audit
          </h3>
        </div>

        <div className="p-5 space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="p-3.5 rounded-xl bg-[#1a2235] border border-[#2a3a52] flex items-start gap-3">
            <span className="text-cyan-400 font-bold shrink-0">Step 1 — Parsing:</span>
            <span>{result.reasoning_trace.step1_parsing}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#1a2235] border border-[#2a3a52] flex items-start gap-3">
            <span className="text-blue-400 font-bold shrink-0">Step 2 — RAG:</span>
            <span>{result.reasoning_trace.step2_rag}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#1a2235] border border-[#2a3a52] flex items-start gap-3">
            <span className="text-emerald-400 font-bold shrink-0">Step 3 — MoM:</span>
            <span>{result.reasoning_trace.step3_mom}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#1a2235] border border-[#2a3a52] flex items-start gap-3">
            <span className="text-purple-400 font-bold shrink-0">Step 4 — Agentic:</span>
            <span>{result.reasoning_trace.step4_agentic}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
