/**
 * ORION Bilingual Translation & Code-Switching Engine
 * Translates English phrases spoken during meetings into Indonesian and vice-versa.
 */

// Common business and meeting phrase dictionary for instant client-side translation
const PHRASE_DICTIONARY: [RegExp, string][] = [
  // Common corporate & executive sentences
  [/we need to fix/gi, 'kita harus menetapkan'],
  [/we need to postpone/gi, 'kita perlu menunda'],
  [/we need to delay/gi, 'kita harus menunda'],
  [/we need to approve/gi, 'kita perlu menyetujui'],
  [/we need to cut/gi, 'kita harus memotong'],
  [/we have to decide/gi, 'kita harus memutuskan'],
  [/what is the impact/gi, 'apa dampaknya'],
  [/how about the impact/gi, 'bagaimana dampaknya'],
  [/impact on the campaign/gi, 'dampak terhadap kampanye'],
  [/launching next month/gi, 'peluncuran bulan depan'],
  [/launching next week/gi, 'peluncuran minggu depan'],
  [/budget is cut by/gi, 'anggaran dipotong sebesar'],
  [/marketing budget/gi, 'anggaran marketing'],
  [/q4 budget/gi, 'anggaran Q4'],
  [/action item/gi, 'tindak lanjut'],
  [/key decision/gi, 'keputusan penting'],
  [/who is the owner/gi, 'siapa penanggung jawabnya'],
  [/who will be responsible/gi, 'siapa yang akan bertanggung jawab'],
  [/please send the report/gi, 'tolong kirimkan laporannya'],
  [/by next week/gi, 'paling lambat minggu depan'],
  [/by monday/gi, 'paling lambat hari senin'],
  [/by friday/gi, 'paling lambat hari jumat'],
  [/high priority/gi, 'prioritas tinggi'],
  [/low priority/gi, 'prioritas rendah'],
  [/risk assessment/gi, 'analisis risiko'],
  [/cost optimization/gi, 'optimasi biaya'],
  [/cutover weekend/gi, 'cutover akhir pekan'],
  [/latency issue/gi, 'masalah latensi'],
  [/data loss/gi, 'kehilangan data'],
  [/compliance risk/gi, 'risiko kepatuhan'],
  [/regulatory compliance/gi, 'kepatuhan regulasi'],
  [/stakeholder alignment/gi, 'penyelarasan pemangku kepentingan'],
  [/let's move to the next topic/gi, 'mari lanjut ke topik berikutnya'],
  [/let's wrap up/gi, 'mari kita simpulkan'],
  [/i agree with this/gi, 'saya setuju dengan ini'],
  [/i don't agree/gi, 'saya tidak setuju'],
  [/makes sense/gi, 'masuk akal'],
  [/please take note/gi, 'tolong dicatat'],
  [/i will take care of this/gi, 'saya akan menangani hal ini'],
  [/follow up/gi, 'tindak lanjut'],
  [/status update/gi, 'pembaruan status'],
  [/next steps/gi, 'langkah selanjutnya']
];

// Word dictionary for corporate terms
const WORD_DICTIONARY: Record<string, string> = {
  'budget': 'anggaran',
  'meeting': 'rapat',
  'decision': 'keputusan',
  'decisions': 'keputusan-keputusan',
  'cut': 'potong',
  'cutover': 'cutover/transisi',
  'postpone': 'tunda',
  'approved': 'disetujui',
  'rejected': 'ditolak',
  'pending': 'tertunda',
  'impact': 'dampak',
  'campaign': 'kampanye',
  'launch': 'peluncuran',
  'latency': 'latensi/jeda',
  'compliance': 'kepatuhan',
  'priority': 'prioritas',
  'deadline': 'tenggat waktu',
  'revenue': 'pendapatan',
  'expense': 'beban pengeluaran',
  'vendor': 'mitra/vendor',
  'agreement': 'kesepakatan',
  'target': 'sasaran',
  'next': 'selanjutnya',
  'week': 'minggu',
  'month': 'bulan',
  'quarter': 'kuartal',
  'urgent': 'mendesak',
  'blocker': 'kendala/hambatan',
  'timeline': 'linimasa'
};

/**
 * Checks if a string contains substantial English text
 */
export function containsEnglish(text: string): boolean {
  const englishWordPattern = /\b(the|is|are|we|you|they|our|need|to|cut|budget|impact|decision|will|have|has|for|with|this|that|next|week|month|project|meeting|please|about|from|agree)\b/i;
  return englishWordPattern.test(text);
}

/**
 * Translates English text into Indonesian using phrase-mapping & dictionary rules
 */
export function translateEnglishToIndonesian(text: string): string {
  if (!text.trim()) return '';

  let translated = text;

  // Apply phrase dictionary
  for (const [regex, replacement] of PHRASE_DICTIONARY) {
    translated = translated.replace(regex, replacement);
  }

  // Tokenize and replace common business words if standalone
  const words = translated.split(/\b/);
  const resultWords = words.map(word => {
    const lower = word.toLowerCase();
    if (WORD_DICTIONARY[lower]) {
      // Maintain capitalization
      if (word[0] === word[0].toUpperCase()) {
        const rep = WORD_DICTIONARY[lower];
        return rep.charAt(0).toUpperCase() + rep.slice(1);
      }
      return WORD_DICTIONARY[lower];
    }
    return word;
  });

  return resultWords.join('');
}

/**
 * Translates an entire transcript block, annotating English speeches with Indonesian translations
 */
export function processBilingualTranscript(rawTranscript: string): string {
  const lines = rawTranscript.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return line;

    // Check if line contains English
    if (containsEnglish(trimmed)) {
      const idTranslation = translateEnglishToIndonesian(trimmed);
      if (idTranslation !== trimmed) {
        // Return original line with translation annotation
        return `${line}\n  ↳ [Terjemahan ID]: ${idTranslation}`;
      }
    }
    return line;
  });

  return processedLines.join('\n');
}
