import React, { useState, useEffect, useRef } from 'react';
import { AnalyzerOptions } from '../../services/analyzer';
import { LanguageMode } from '../../types/orion';
import {
  Play,
  Upload,
  RefreshCw,
  Languages,
  Trash2,
  Volume2
} from 'lucide-react';
import { SCENARIO_PRESETS } from '../../data/sampleScenarios';
import {
  containsEnglish,
  translateEnglishToIndonesian,
  processBilingualTranscript
} from '../../services/translator';

interface InputViewProps {
  inputText: string;
  onSetInputText: (text: string) => void;
  options: AnalyzerOptions;
  onUpdateOptions: (newOpts: Partial<AnalyzerOptions>) => void;
  onRunAnalysis: () => void;
  isProcessing: boolean;
  langMode: LanguageMode;
}

export default function InputView({
  inputText,
  onSetInputText,
  options,
  onUpdateOptions,
  onRunAnalysis,
  isProcessing,
  langMode
}: InputViewProps) {
  const isEn = langMode === 'en';
  const isId = langMode === 'id';

  const [activeTab, setActiveTab] = useState<'transcript' | 'document' | 'query' | 'upload'>('transcript');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechLang, setSpeechLang] = useState<'id-ID' | 'en-US' | 'auto'>('id-ID');
  const [autoTranslateEnglish, setAutoTranslateEnglish] = useState(true);

  const recognitionRef = useRef<any>(null);
  const shouldRecordRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const baseTextRef = useRef('');

  useEffect(() => {
    setCharCount(inputText.length);
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [inputText]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldRecordRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isEn
          ? 'Your browser does not support the Web Speech API (SpeechRecognition).\n\nPlease use Google Chrome, Microsoft Edge, or Safari to record voice.'
          : 'Browser Anda tidak mendukung Web Speech API (SpeechRecognition).\n\nDisarankan menggunakan Google Chrome, Microsoft Edge, atau Safari versi terbaru untuk merekam suara.'
      );
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      alert(
        isEn
          ? 'Microphone Access Denied!\n\nPlease grant microphone permission in your browser address bar to record audio during the meeting.'
          : 'Akses Mikrofon Ditolak!\n\nUntuk merekam selama rapat, izinkan akses mikrofon di browser Anda dengan mengklik ikon gembok di samping address bar browser Anda.'
      );
      setIsRecording(false);
      shouldRecordRef.current = false;
      return;
    }

    try {
      shouldRecordRef.current = true;
      setIsRecording(true);
      setRecordingSeconds(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      baseTextRef.current = inputText ? (inputText.endsWith('\n') ? inputText : inputText + '\n') : '';

      const initRecognition = () => {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = speechLang === 'auto' ? (isEn ? 'en-US' : 'id-ID') : speechLang;

        let sessionFinalTranscript = '';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              let finalText = transcriptChunk.trim();

              if (autoTranslateEnglish && containsEnglish(finalText)) {
                const idTrans = translateEnglishToIndonesian(finalText);
                if (idTrans && idTrans.toLowerCase() !== finalText.toLowerCase()) {
                  finalText = `${finalText} [ID: ${idTrans}]`;
                }
              }

              sessionFinalTranscript += (sessionFinalTranscript ? '\n' : '') + finalText;
            } else {
              interimTranscript += transcriptChunk;
            }
          }

          const combined = sessionFinalTranscript + (interimTranscript ? (sessionFinalTranscript ? ' ' : '') + interimTranscript : '');
          onSetInputText(baseTextRef.current + combined);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning/error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            alert(
              isEn
                ? 'Microphone permission was not granted. Please allow microphone access in browser settings.'
                : 'Izin mikrofon tidak diberikan. Silakan izinkan mikrofon di browser Anda.'
            );
            stopRecording();
          }
        };

        recognition.onend = () => {
          if (shouldRecordRef.current) {
            try {
              recognition.start();
            } catch {
              setTimeout(() => {
                if (shouldRecordRef.current) {
                  try {
                    recognition.start();
                  } catch {
                    initRecognition();
                  }
                }
              }, 200);
            }
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.warn('Start recognition failed, retrying:', e);
        }
      };

      initRecognition();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      alert(
        isEn
          ? 'Failed to initialize speech recording. Ensure your microphone is connected.'
          : 'Gagal menginisialisasi rekaman suara. Pastikan mikrofon terpasang.'
      );
      stopRecording();
    }
  };

  const stopRecording = () => {
    shouldRecordRef.current = false;
    setIsRecording(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleTranslateEntireTranscript = () => {
    if (!inputText.trim()) {
      alert(
        isEn
          ? 'Transcript box is currently empty. Please record or paste text first.'
          : 'Kotak transkrip masih kosong. Silakan rekam atau ketik teks terlebih dahulu.'
      );
      return;
    }
    const translated = processBilingualTranscript(inputText);
    onSetInputText(translated);
    alert(
      isEn
        ? 'Transcript successfully translated and aligned bilingually!'
        : 'Transkrip berhasil diterjemahkan & diselaraskan dwibahasa!'
    );
  };

  const handleClearBox = () => {
    if (isRecording) {
      stopRecording();
    }
    onSetInputText('');
  };

  const loadSample = (presetId: string) => {
    const found = SCENARIO_PRESETS.find(p => p.id === presetId);
    if (found) {
      onSetInputText(found.rawInput);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const text = ev.target?.result as string;
        if (text) {
          onSetInputText(text);
          setActiveTab('transcript');
        }
      };
      reader.readAsText(file);
    }
  };

  // Localized placeholders
  const placeholderText = isEn
    ? `Analysis workspace is clean and ready to use.

Click '🎙️ Start Recording' to record your meeting directly (recording will remain active continuously throughout the meeting), or type / paste meeting transcripts here...

If any meeting participant speaks English or Indonesian, the Bilingual Translator will automatically detect and translate it.`
    : `Kotak analisis bersih dan siap digunakan.

Klik '🎙️ Mulai Rekam' untuk merekam rapat Anda secara langsung (rekaman akan terus berjalan selama rapat berlangsung), atau ketik / tempel transkrip percakapan di sini...

Jika ada peserta rapat yang berbicara dalam bahasa Inggris, fitur Bilingual Translator akan otomatis mendeteksi dan menerjemahkannya.`;

  return (
    <div className="w-full h-full flex flex-col justify-between gap-3 overflow-hidden">
      {/* Top Bar: Tabs & Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex bg-[#1a2235] p-1 rounded-xl border border-[#2a3a52] gap-1">
          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'transcript'
                ? 'bg-[#1e293b] text-cyan-400 shadow-sm border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📝 {isEn ? 'Transcript' : isId ? 'Transkrip' : 'Transcript / Transkrip'}</span>
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'document'
                ? 'bg-[#1e293b] text-cyan-400 shadow-sm border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📄 {isEn ? 'Document' : isId ? 'Dokumen' : 'Document / Dokumen'}</span>
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'query'
                ? 'bg-[#1e293b] text-cyan-400 shadow-sm border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔍 {isEn ? 'Query' : isId ? 'Kueri' : 'Query / Kueri'}</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-[#1e293b] text-cyan-400 shadow-sm border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📎 {isEn ? 'Upload File' : isId ? 'Unggah Berkas' : 'Upload / Unggah'}</span>
          </button>
        </div>

        {/* Clear and Demo Presets */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleClearBox}
            className="px-3 py-1.5 rounded-lg bg-[#1a2235] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-[#2a3a52] text-xs font-medium flex items-center gap-1.5 transition-all"
            title={isEn ? 'Clear workspace' : 'Kosongkan teks'}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>{isEn ? 'Clear Box' : isId ? 'Bersihkan Kotak' : 'Clear / Bersihkan'}</span>
          </button>
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            | {isEn ? 'Demo Presets:' : 'Contoh Preset:'}
          </span>
          <button
            onClick={() => loadSample('budget-q4')}
            className="px-2.5 py-1 rounded-lg bg-[#1a2235] hover:bg-[#253349] text-cyan-400 border border-[#2a3a52] text-[11px]"
          >
            {isEn ? 'Budget Review' : 'Review Anggaran Q4'}
          </button>
          <button
            onClick={() => loadSample('core-banking')}
            className="px-2.5 py-1 rounded-lg bg-[#1a2235] hover:bg-[#253349] text-cyan-400 border border-[#2a3a52] text-[11px]"
          >
            {isEn ? 'Cloud Migration' : 'Migrasi Cloud'}
          </button>
        </div>
      </div>

      {/* Main Full-Width Workspace (No right column, full monitor width) */}
      <div className="w-full flex-1 min-h-0 flex flex-col">
        {activeTab === 'upload' ? (
          <div className="w-full h-full bg-[#1a2235] border-2 border-dashed border-[#2a3a52] hover:border-cyan-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              {isEn ? 'Upload Transcript or Project Document' : 'Unggah Berkas Transkrip atau Dokumen'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {isEn
                ? 'Supports .txt, .vtt, .srt, .md, and .json files.'
                : 'Mendukung berkas teks .txt, .vtt, .srt, .md, dan .json.'}
            </p>
            <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs cursor-pointer hover:shadow-lg transition-all">
              {isEn ? 'Browse File' : 'Pilih Berkas'}
              <input
                type="file"
                accept=".txt,.vtt,.srt,.md,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        ) : (
          <div className="w-full h-full bg-[#1a2235] border border-[#2a3a52] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-md focus-within:border-cyan-500/40 transition-all overflow-hidden">
            {/* Voice Recording & Bilingual Translation Bar (Active on Transcript tab) */}
            {activeTab === 'transcript' && (
              <div className="pb-3 mb-2.5 border-b border-[#2a3a52]/80 space-y-2.5 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Primary Recording Button */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-md cursor-pointer select-none ${
                        isRecording
                          ? 'bg-rose-500/25 text-rose-200 border-2 border-rose-500 hover:bg-rose-500/35 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                          </span>
                          <span>{isEn ? '🛑 Stop Recording' : '🛑 Berhenti Merekam'}</span>
                          <span className="font-mono text-white bg-rose-950/80 px-2 py-0.5 rounded text-[11px] ml-1">
                            {formatTime(recordingSeconds)}
                          </span>
                        </>
                      ) : (
                        <span>{isEn ? '🎙️ Start Recording' : isId ? '🎙️ Mulai Rekam' : '🎙️ Start Recording / Mulai Rekam'}</span>
                      )}
                    </button>

                    {/* Recording status badge */}
                    {isRecording && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                        <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>
                          {isEn ? 'Recording meeting audio... (Continuous)' : 'Merekam Rapat... (Terus berjalan)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bilingual Translator Quick Action */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTranslateEntireTranscript}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#253349] text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      title={isEn ? 'Translate English phrases to Indonesian' : 'Terjemahkan percakapan bahasa Inggris ke bahasa Indonesia'}
                    >
                      <Languages className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isEn ? '🌐 Translate English ⇄ ID' : '🌐 Terjemahkan English ⇄ ID'}</span>
                    </button>
                  </div>
                </div>

                {/* Bilingual Settings & Language Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 bg-[#111827]/40 px-3 py-2 rounded-xl border border-[#2a3a52]/40">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-300">
                      {isEn ? 'Audio Language:' : 'Bahasa Rekaman:'}
                    </span>
                    <div className="flex gap-1 bg-[#1a2235] p-0.5 rounded-lg border border-[#2a3a52]">
                      <button
                        type="button"
                        onClick={() => setSpeechLang('id-ID')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          speechLang === 'id-ID' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🇮🇩 {isEn ? 'Indonesian' : 'Indonesia'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeechLang('en-US')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          speechLang === 'en-US' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeechLang('auto')}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          speechLang === 'auto' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🌐 {isEn ? 'Bilingual (ID/EN)' : 'Dwibahasa (ID/EN)'}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoTranslateEnglish}
                      onChange={e => setAutoTranslateEnglish(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-cyan-500 border-[#2a3a52] bg-[#1a2235] focus:ring-0"
                    />
                    <span>
                      {isEn
                        ? 'Auto-translate when English speech is detected'
                        : 'Auto-terjemahkan jika ada yang bicara bahasa Inggris'}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Clean Textarea (Fills full width and height) */}
            <textarea
              value={inputText}
              onChange={e => onSetInputText(e.target.value)}
              placeholder={placeholderText}
              className="w-full flex-1 min-h-[180px] bg-transparent border-0 outline-none resize-none text-xs md:text-sm font-mono text-slate-200 leading-relaxed placeholder:text-slate-500 p-1"
            />

            {/* Footer with Counters and Process Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2a3a52]/80 mt-2 shrink-0">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>
                  {charCount} {isEn ? 'characters' : 'karakter'} · {wordCount} {isEn ? 'words' : 'kata'}
                </span>
                {inputText.trim() && (
                  <button
                    type="button"
                    onClick={handleClearBox}
                    className="text-slate-500 hover:text-rose-400 text-[11px] underline ml-2"
                  >
                    {isEn ? 'Clear text' : 'Kosongkan teks'}
                  </button>
                )}
              </div>

              <button
                onClick={onRunAnalysis}
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{isEn ? 'Processing with ORION...' : 'Memproses dengan ORION...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isEn ? 'Process with ORION' : 'Proses dengan ORION'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
