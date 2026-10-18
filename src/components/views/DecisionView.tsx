import React, { useState } from 'react';
import { OrionAnalysisResult, DecisionOption, LanguageMode } from '../../types/orion';
import { GitBranch, CheckCircle, Sliders, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';

interface DecisionViewProps {
  result: OrionAnalysisResult;
  langMode: LanguageMode;
}

export default function DecisionView({ result, langMode }: DecisionViewProps) {
  const [options, setOptions] = useState<DecisionOption[]>(result.decision_matrix.options);
  const [impactWeight, setImpactWeight] = useState(40);
  const [riskWeight, setRiskWeight] = useState(35);
  const [effortWeight, setEffortWeight] = useState(25);
  const [humanConfirmed, setHumanConfirmed] = useState(false);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 4) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    if (score === 3) return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
  };

  const getEffortClass = (effort: string) => {
    switch (effort) {
      case 'Low':
        return 'text-emerald-400';
      case 'Med':
        return 'text-amber-400';
      default:
        return 'text-rose-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Konteks Strategis / Decision Context
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            {langMode === 'en'
              ? result.decision_matrix.context_en
              : result.decision_matrix.context_id}
          </h3>
        </div>

        <div className="bg-[#1a2235] px-4 py-2 rounded-xl border border-[#2a3a52] shrink-0 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            Deadline Keputusan:
          </span>
          <span className="text-cyan-400 font-mono font-semibold">
            {result.decision_matrix.deadline}
          </span>
        </div>
      </div>

      {/* Decision Matrix Table */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Template D — Multi-Criteria Decision Matrix
            </h3>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">Weighted Multi-Attribute Scoring</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2a3a52] bg-[#1a2235]/60 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-4 w-14">Opsi</th>
                <th className="py-3 px-4">Deskripsi / Description</th>
                <th className="py-3 px-4 w-44">Dampak Bisnis</th>
                <th className="py-3 px-4 w-44">Risiko</th>
                <th className="py-3 px-4 w-20">Effort</th>
                <th className="py-3 px-4 w-44">Data Pendukung</th>
                <th className="py-3 px-4 w-20 text-center">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a52]/40 text-slate-300">
              {options.map(opt => (
                <tr
                  key={opt.id}
                  className={`transition-colors ${
                    opt.is_recommended
                      ? 'bg-cyan-500/[0.08] border-l-4 border-l-cyan-400'
                      : 'hover:bg-cyan-500/[0.02]'
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#1a2235] border border-[#2a3a52] inline-flex items-center justify-center font-mono text-cyan-400">
                      {opt.key}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    <div>{langMode === 'en' ? opt.description_en : opt.description_id}</div>
                    {opt.is_recommended && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-cyan-400 font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Recommended
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {langMode === 'en' ? opt.business_impact_en : opt.business_impact_id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {langMode === 'en' ? opt.risk_en : opt.risk_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={getEffortClass(opt.effort)}>{opt.effort}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {langMode === 'en' ? opt.data_backing_en : opt.data_backing_id}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${getScoreBadgeClass(
                        opt.score
                      )}`}
                    >
                      {opt.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation and Prerequisite Card */}
      <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Rekomendasi Algoritmik / Recommended Resolution</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
            Selected: Option {result.decision_matrix.recommendation.key}
          </span>
        </div>

        <div className="text-sm font-medium text-slate-200">
          {langMode === 'en'
            ? result.decision_matrix.recommendation.text_en
            : result.decision_matrix.recommendation.text_id}
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-[#2a3a52] text-xs text-slate-300 space-y-1.5 font-mono">
          <div className="text-amber-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>PRASYARAT / PREREQUISITE:</span>
          </div>
          <div>
            {langMode === 'en'
              ? result.decision_matrix.recommendation.prerequisites_en
              : result.decision_matrix.recommendation.prerequisites_id}
          </div>
        </div>

        {/* Human Confirmation Gate */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">REQUIRES_HUMAN_CONFIRMATION:</span>
            <span className="text-amber-400 font-mono font-bold">true</span>
          </div>

          <button
            onClick={() => setHumanConfirmed(!humanConfirmed)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              humanConfirmed
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{humanConfirmed ? 'Confirmed by Stakeholder ✓' : 'Confirm & Authorize Matrix'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
