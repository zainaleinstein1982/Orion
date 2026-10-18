import React, { useState } from 'react';
import { OrionAnalysisResult, LanguageMode } from '../../types/orion';
import { X, Download, Copy, Check, FileCode, FileText } from 'lucide-react';

interface ExportModalProps {
  result: OrionAnalysisResult;
  onClose: () => void;
  langMode?: LanguageMode;
}

export default function ExportModal({ result, onClose, langMode = 'id' }: ExportModalProps) {
  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    return `# ${result.meeting.topic_id} / ${result.meeting.topic_en}
**Date:** ${result.meeting.date}
**Source:** ${result.meeting.source_ref}
**Attendees:** ${result.meeting.attendees.join(', ')}

---

## 1. Executive Summary / Ringkasan Eksekutif
**ID:** ${result.executive_summary.id}

**EN:** ${result.executive_summary.en}

---

## 2. Key Decisions / Keputusan Penting
${result.decisions
  .map(
    (d, i) =>
      `${i + 1}. **${d.decision_id}** (EN: ${d.decision_en})  \n   *Decided by:* ${
        d.decided_by
      } | *Rationale:* ${d.rationale_id}`
  )
  .join('\n\n')}

---

## 3. Action Items / Tindak Lanjut
${result.actions
  .filter(a => a.type === 'TICKET_CREATE')
  .map(
    (a, i) =>
      `${i + 1}. [${a.priority || 'P1'}] **${a.summary_id}**  \n   *PIC:* ${
        a.assignee
      } | *Due:* ${a.deadline} | *Confidence:* ${Math.round(
        a.confidence_score * 100
      )}%`
  )
  .join('\n\n')}

---

## 4. Decision Matrix Recommendation
*Selected Option:* ${result.decision_matrix.recommendation.key}  
*Resolution:* ${result.decision_matrix.recommendation.text_id}  
*Prerequisites:* ${result.decision_matrix.recommendation.prerequisites_id}
`;
  };

  const getContent = () => {
    if (format === 'markdown') return generateMarkdown();
    return JSON.stringify(result, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getContent();
    const ext = format === 'markdown' ? 'md' : 'json';
    const blob = new Blob([text], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orion-export-${result.execution_id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {isEn ? 'Export Analysis & MoM' : isId ? 'Ekspor Analisis & MoM' : 'Export Analysis / Ekspor'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format tabs */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setFormat('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'markdown'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-[#1a2235] text-slate-400 hover:text-slate-200 border border-[#2a3a52]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown (.md)</span>
          </button>
          <button
            onClick={() => setFormat('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              format === 'json'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-[#1a2235] text-slate-400 hover:text-slate-200 border border-[#2a3a52]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON (.json)</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6">
          <pre className="p-4 rounded-xl bg-[#0a0e1a] border border-[#2a3a52] font-mono text-xs text-cyan-300 overflow-x-auto max-h-80 leading-relaxed selection:bg-cyan-500/30">
            {getContent()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a3a52] bg-[#111827] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {result.execution_id}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-[#1a2235] hover:bg-[#253349] text-slate-200 border border-[#2a3a52] text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? 'Copied!' : 'Tersalin!') : isEn ? 'Copy' : 'Salin'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Download File' : 'Unduh Berkas'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
