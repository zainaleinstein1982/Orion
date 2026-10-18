import React, { useState } from 'react';
import { Sliders, ShieldCheck, Check, Save, Sparkles, SlidersHorizontal } from 'lucide-react';
import { AnalyzerOptions } from '../../services/analyzer';
import { LanguageMode } from '../../types/orion';

interface SettingsViewProps {
  options: AnalyzerOptions;
  onUpdateOptions: (newOpts: Partial<AnalyzerOptions>) => void;
  langMode: LanguageMode;
}

export default function SettingsView({ options, onUpdateOptions, langMode }: SettingsViewProps) {
  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  const [orgName, setOrgName] = useState('PT Enterprise Indonesia');
  const [timezone, setTimezone] = useState('Asia/Jakarta (WIB, UTC+7)');
  const [n8nUrl, setN8nUrl] = useState('https://n8n.company.com/webhook/orion');
  const [jiraUrl, setJiraUrl] = useState('https://company.atlassian.net');
  const [ragUrl, setRagUrl] = useState('https://rag.company.com/api/v1');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const guardrailsList = [
    {
      key: 'g1_redact_sensitive',
      code: 'G1',
      label: isEn
        ? 'Auto-redact sensitive data (ID numbers, account numbers, credentials)'
        : 'Sensor otomatis data sensitif (NIK, nomor rekening, kata sandi)'
    },
    {
      key: 'g2_flag_ambiguous',
      code: 'G2',
      label: isEn
        ? 'Flag ambiguous decisions as OPEN_QUESTION'
        : 'Tandai keputusan yang ambigu sebagai OPEN_QUESTION'
    },
    {
      key: 'g3_prevent_hallucination',
      code: 'G3',
      label: isEn
        ? 'Prevent hallucination — ground every claim in transcript tokens'
        : 'Cegah halusinasi — tautkan setiap klaim ke token transkrip'
    },
    {
      key: 'g4_payload_only',
      code: 'G4',
      label: isEn
        ? 'Generate payload only — no direct execution without human sign-off'
        : 'Hasilkan payload saja — tidak ada eksekusi langsung tanpa persetujuan'
    },
    {
      key: 'g5_handle_incomplete',
      code: 'G5',
      label: isEn
        ? 'Handle incomplete input gracefully with fallback heuristics'
        : 'Tangani input tidak lengkap secara otomatis dengan fallback aman'
    },
    {
      key: 'g7_rag_unavailable',
      code: 'G7',
      label: isEn
        ? 'Mark RAG_UNAVAILABLE when no knowledge base connection exists'
        : 'Tandai RAG_UNAVAILABLE jika koneksi basis pengetahuan terputus'
    },
    {
      key: 'g8_auto_escalate_p0',
      code: 'G8',
      label: isEn
        ? 'Auto-escalate P0 risks (fraud, regulatory breach, critical downtime)'
        : 'Eskalasi otomatis risiko P0 (pelanggaran hukum, downtime kritis)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Relocated Configuration / Pengaturan Card */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {isEn ? 'Analysis & Pipeline Configuration' : isId ? 'Konfigurasi Analisis & Alur Kerja' : 'Analysis Configuration / Pengaturan Analisis'}
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {isEn ? 'Pipeline Controls' : isId ? 'Kontrol Analisis' : 'Pipeline Controls'}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isEn ? 'Default Input Type' : isId ? 'Tipe Input Default' : 'Input Type / Tipe Input'}
            </label>
            <select
              value={options.inputType}
              onChange={e => onUpdateOptions({ inputType: e.target.value as any })}
              className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="auto">{isEn ? '🔄 Auto-detect' : '🔄 Deteksi Otomatis'}</option>
              <option value="transcript">{isEn ? '📝 Meeting Transcript' : '📝 Transkrip Rapat'}</option>
              <option value="document">{isEn ? '📄 Project Document' : '📄 Dokumen Proyek'}</option>
              <option value="query">{isEn ? '🔍 Direct Query' : '🔍 Pertanyaan Langsung'}</option>
            </select>
          </div>

          {/* Output Language */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isEn ? 'Target Output Language' : isId ? 'Bahasa Output Target' : 'Output Language / Bahasa Output'}
            </label>
            <select
              value={options.outputLang}
              onChange={e => onUpdateOptions({ outputLang: e.target.value as any })}
              className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="bi">{isEn ? '🌐 Bilingual (ID + EN)' : '🌐 Dwibahasa (ID + EN)'}</option>
              <option value="id">🇮🇩 Bahasa Indonesia</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          {/* Confidence Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="uppercase tracking-wider">
                {isEn ? 'Confidence Threshold' : isId ? 'Ambang Batas Keyakinan' : 'Confidence Threshold'}
              </span>
              <span className="text-cyan-400 font-mono">
                {options.confidenceThreshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.50"
              max="1.00"
              step="0.05"
              value={options.confidenceThreshold}
              onChange={e => onUpdateOptions({ confidenceThreshold: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.50 ({isEn ? 'Permissive' : 'Permisif'})</span>
              <span>1.00 ({isEn ? 'Strict' : 'Ketat'})</span>
            </div>
          </div>
        </div>

        {/* Target Systems Checklist */}
        <div className="px-6 pb-6 pt-2 border-t border-[#2a3a52]/60">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            {isEn ? 'Automated Target Systems Integration' : isId ? 'Integrasi Sistem Otomatis' : 'Target Systems Integration'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { key: 'jira', label: 'Jira (Tickets)' },
              { key: 'slack', label: 'Slack (Notifications)' },
              { key: 'odoo', label: 'Odoo ERP (Financial)' },
              { key: 'calendar', label: 'Google Calendar' },
              { key: 'email', label: 'Email (SMTP)' }
            ].map(sys => (
              <label key={sys.key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none bg-[#1a2235] p-2.5 rounded-lg border border-[#2a3a52]">
                <input
                  type="checkbox"
                  checked={(options.targetSystems as any)[sys.key]}
                  onChange={e =>
                    onUpdateOptions({
                      targetSystems: {
                        ...options.targetSystems,
                        [sys.key]: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 rounded border-[#2a3a52] bg-[#111827] text-cyan-500 focus:ring-0"
                />
                <span className="truncate">{sys.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* General Settings Card */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {isEn ? 'ORION System & Endpoints Settings' : isId ? 'Pengaturan Sistem & Endpoint ORION' : 'System & Endpoints Settings'}
            </h3>
          </div>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              {isEn ? 'Settings Saved!' : 'Pengaturan Berhasil Disimpan!'}
            </span>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: General */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {isEn ? 'Organization Profile' : isId ? 'Profil Organisasi' : 'Organization Profile'}
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">
                {isEn ? 'Organization Name' : isId ? 'Nama Organisasi' : 'Organization Name'}
              </label>
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">
                {isEn ? 'Default Timezone' : isId ? 'Zona Waktu Default' : 'Default Timezone'}
              </label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
              >
                <option>Asia/Jakarta (WIB, UTC+7)</option>
                <option>Asia/Makassar (WITA, UTC+8)</option>
                <option>Asia/Jayapura (WIT, UTC+9)</option>
                <option>UTC (Coordinated Universal Time)</option>
              </select>
            </div>
          </div>

          {/* Right Column: Webhook Integrations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {isEn ? 'API & Webhook Endpoints' : isId ? 'Endpoint API & Webhook' : 'API & Webhook Endpoints'}
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">n8n / Flow Webhook URL</label>
              <input
                type="text"
                value={n8nUrl}
                onChange={e => setN8nUrl(e.target.value)}
                className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Jira Cloud URL</label>
              <input
                type="text"
                value={jiraUrl}
                onChange={e => setJiraUrl(e.target.value)}
                className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">RAG / Vector DB Endpoint</label>
              <input
                type="text"
                value={ragUrl}
                onChange={e => setRagUrl(e.target.value)}
                className="w-full bg-[#1a2235] border border-[#2a3a52] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guardrails Configuration */}
      <div className="bg-[#1e293b] border border-[#2a3a52] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2a3a52] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {isEn ? 'Safety Guardrails (G1 – G8)' : isId ? 'Protokol Keamanan Guardrails (G1 – G8)' : 'Safety Guardrails (G1 – G8)'}
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {isEn ? 'Deterministic Enforcement' : isId ? 'Penerapan Deterministik' : 'Deterministic Enforcement'}
          </span>
        </div>

        <div className="p-6 space-y-3">
          {guardrailsList.map(g => (
            <label
              key={g.key}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#1a2235] border border-[#2a3a52] hover:border-cyan-500/40 transition-all cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={(options.guardrails as any)[g.key] ?? true}
                onChange={e =>
                  onUpdateOptions({
                    guardrails: {
                      ...options.guardrails,
                      [g.key]: e.target.checked
                    }
                  })
                }
                className="w-4 h-4 rounded border-[#2a3a52] bg-[#111827] text-cyan-500 focus:ring-0 shrink-0"
              />
              <span className="font-mono text-cyan-400 text-xs font-bold shrink-0">{g.code}:</span>
              <span className="text-xs text-slate-200">{g.label}</span>
            </label>
          ))}
        </div>

        <div className="p-4 bg-[#111827]/80 border-t border-[#2a3a52] flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save All Settings' : isId ? 'Simpan Semua Pengaturan' : 'Save Settings / Simpan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
