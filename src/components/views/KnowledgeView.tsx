import React, { useState } from 'react';
import { Database, Search, Link2, CheckCircle2, AlertCircle, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { LanguageMode } from '../../types/orion';

interface KnowledgeViewProps {
  langMode: LanguageMode;
}

export default function KnowledgeView({ langMode }: KnowledgeViewProps) {
  const [ragConnected, setRagConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('budget marketing Q3 actual vs plan');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const collections = [
    { name: 'meeting_minutes', docs: 24, updated: 'Oct 18, 2026', status: 'Active', badge: 'bg-emerald-500/15 text-emerald-400' },
    { name: 'project_documents', docs: 156, updated: 'Oct 17, 2026', status: 'Active', badge: 'bg-emerald-500/15 text-emerald-400' },
    { name: 'policies_sop', docs: 42, updated: 'Oct 10, 2026', status: 'Sync Needed', badge: 'bg-amber-500/15 text-amber-400' },
    { name: 'financial_records', docs: 0, updated: '—', status: 'Not Connected', badge: 'bg-rose-500/15 text-rose-400' }
  ];

  const handleTestSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        {
          id: 'DOC-MKT-2026-03',
          collection: 'meeting_minutes',
          similarity: 0.94,
          title: 'Minutes of Meeting — Q3 Marketing Review & Channel Performance',
          snippet: 'Realisasi budget marketing Q3 tercatat IDR 950 juta dengan ROI tertinggi berasal dari Google Search Ads dan referral program (CAC = IDR 42.000).'
        },
        {
          id: 'POL-FIN-2026-003',
          collection: 'policies_sop',
          similarity: 0.89,
          title: 'Kebijakan Pengendalian Beban Usaha Q4 2026',
          snippet: 'Seluruh divisi diarahkan melakukan efisiensi opex sebesar 15-20% untuk memitigasi perlambatan makroekonomi kuartal IV.'
        },
        {
          id: 'DOC-PRJ-CAMP-002',
          collection: 'project_documents',
          similarity: 0.81,
          title: 'Campaign Launching Plan November 2026',
          snippet: 'Target akuisisi 50.000 user baru dengan alokasi awal IDR 1.0 Miliar sebelum revisi penyesuaian budget.'
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* RAG Status Card */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2a3a52]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Enterprise Vector DB & Knowledge Graph</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ragConnected
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {ragConnected ? '[RAG_CONNECTED]' : '[RAG_UNAVAILABLE]'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Supports AnythingLLM, Dify, Qdrant, Pinecone, or PGVector for historical contextual grounding.
              </p>
            </div>
          </div>

          <button
            onClick={() => setRagConnected(!ragConnected)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              ragConnected
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>{ragConnected ? 'Disconnect Vector DB' : 'Connect Knowledge Base'}</span>
          </button>
        </div>

        {/* Live Vector Search Playground */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Semantic Similarity Retrieval Playground</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Model: text-embedding-004</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Enter search query..."
              className="flex-1 bg-[#1a2235] border border-[#2a3a52] rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleTestSearch}
              disabled={isSearching}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all"
            >
              {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Execute RAG Query</span>
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3 pt-2">
              {searchResults.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#1a2235] border border-[#2a3a52] hover:border-cyan-500/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-slate-200">{item.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#111827]">
                        {item.collection}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">
                      cosine: {item.similarity}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                    "{item.snippet}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Indexed Collections Table */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Indexed Collections & Corpus</h3>
          <span className="text-xs text-slate-400 font-mono">4 Target Stores</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2a3a52] bg-[#1a2235]/60 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a52]/40 text-slate-300">
              {collections.map(col => (
                <tr key={col.name} className="hover:bg-cyan-500/[0.02]">
                  <td className="py-3 px-4 font-mono font-semibold text-cyan-400">{col.name}</td>
                  <td className="py-3 px-4 text-slate-200">{col.docs}</td>
                  <td className="py-3 px-4 text-slate-400">{col.updated}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${col.badge}`}>
                      {col.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
