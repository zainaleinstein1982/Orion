import { OrionAnalysisResult } from '../types/orion';

export interface ScenarioPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  rawInput: string;
  result: OrionAnalysisResult;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'budget-q4',
    title: 'Review Budget Marketing Q4 (Default)',
    badge: 'Finance & Growth',
    description: 'Pemotongan 20% budget marketing menjadi 800M IDR dan dampak terhadap campaign launching November.',
    rawInput: `[00:12:10] Budi: Oke jadi kita fix ya, budget marketing Q4 dipotong 20% jadi 800 juta.
[00:12:45] Sari: Tapi itu nanti impact ke campaign launching November gimana?
[00:13:10] Budi: Nanti Sari bikin analisis dampaknya minggu depan, terus kirim ke saya.
[00:13:45] Andi: Kopi pantry lantai 3 udah abis lagi ya, nanti saya pesenin.
[00:14:00] Andi: Saya catat ya semuanya untuk MoM dan tiket Jira.`,
    result: {
      orion_version: '1.0',
      execution_id: 'exec-20261018-001',
      timestamp: '2026-10-18T10:15:00Z',
      meeting: {
        topic_id: 'Review Budget Marketing Q4',
        topic_en: 'Q4 Marketing Budget Review',
        date: '2026-10-18',
        attendees: ['Budi', 'Sari', 'Andi'],
        source_ref: 'MTG-20261018-001'
      },
      executive_summary: {
        id: 'Rapat memutuskan pemotongan budget marketing Q4 sebesar 20% menjadi IDR 800 juta. Dampak terhadap campaign November belum terukur dan memerlukan analisis mendalam. Sari ditugaskan menyusun analisis dampak dalam satu minggu ke depan.',
        en: 'The meeting decided to cut Q4 marketing budget by 20% to IDR 800 million. Impact on the November campaign remains unquantified and requires in-depth analysis. Sari is assigned to deliver the impact analysis within one week.'
      },
      extraction_items: [
        {
          id: 1,
          category: 'Keputusan',
          item: 'Budget marketing Q4 dipotong 20% → IDR 800 juta',
          item_en: 'Q4 marketing budget cut by 20% → IDR 800M',
          owner: 'Budi',
          deadline: '—',
          timestamp: '00:12:10',
          label: '[FAKTA]',
          confidence: 0.95
        },
        {
          id: 2,
          category: 'Action Item',
          item: 'Analisis dampak pemotongan ke campaign November',
          item_en: 'Impact analysis of budget cut on November campaign',
          owner: 'Sari',
          deadline: '2026-10-24',
          timestamp: '00:13:10',
          label: '[FAKTA]',
          confidence: 0.92
        },
        {
          id: 3,
          category: 'Risiko',
          item: 'Dampak pemotongan terhadap campaign November belum terukur',
          item_en: 'Impact of cut on November campaign is not yet quantified',
          owner: '—',
          deadline: '—',
          timestamp: '00:12:45',
          label: '[INFERENSI]',
          confidence: 0.78
        },
        {
          id: 4,
          category: 'Open Question',
          item: 'Strategi mitigasi jika performa acquisition campaign turun drastis',
          item_en: 'Mitigation strategy if campaign user acquisition drops drastically',
          owner: '—',
          deadline: '—',
          timestamp: '00:12:55',
          label: '[INFERENSI]',
          confidence: 0.81
        },
        {
          id: 5,
          category: 'Noise',
          item: 'Kopi pantry lantai 3 habis dan akan dipesan Andi',
          item_en: '3rd floor pantry coffee ran out, Andi ordering refill',
          owner: 'Andi',
          deadline: '—',
          timestamp: '00:13:45',
          label: '[FAKTA]',
          confidence: 0.99,
          filtered: true
        }
      ],
      rag_queries: [
        'budget marketing Q3 actual vs plan',
        'campaign November historical performance ROAS',
        'marketing budget cut precedent impact 2025'
      ],
      consistency_checks: [
        {
          id: 'c1',
          type: 'warning',
          icon: '⚠️',
          message_id: 'Potensi konflik: Pemotongan budget vs target launching November — perlu validasi dengan tim Campaign.',
          message_en: 'Potential conflict: Budget cut vs November launch target — requires validation with Campaign team.'
        },
        {
          id: 'c2',
          type: 'info',
          icon: '👤',
          message_id: 'Stakeholder terdampak yang belum dikonfirmasi: Tim Campaign & Media Buying Vendor.',
          message_en: 'Impacted stakeholders not yet confirmed: Campaign Team & Media Buying Vendor.'
        },
        {
          id: 'c3',
          type: 'ok',
          icon: '✅',
          message_id: 'Keputusan selaras dengan kebijakan cost optimization Q4 2026 (ref: POL-FIN-2026-003).',
          message_en: 'Decision aligns with Q4 2026 cost optimization directive (ref: POL-FIN-2026-003).',
          reference: 'POL-FIN-2026-003'
        }
      ],
      decisions: [
        {
          id: 1,
          decision_id: 'Budget marketing Q4 dipotong 20% → IDR 800 juta',
          decision_en: 'Q4 marketing budget cut by 20% → IDR 800M',
          decided_by: 'Budi (VP Marketing)',
          rationale_id: 'Kepatuhan terhadap kebijakan efisiensi biaya opex perusahaan',
          rationale_en: 'Compliance with enterprise opex efficiency directives'
        }
      ],
      decision_matrix: {
        context_id: 'Pemotongan budget marketing Q4 sebesar 20% — bagaimana memitigasi dampak terhadap campaign November?',
        context_en: 'Q4 marketing budget cut by 20% — how to mitigate impact on the November product campaign?',
        deadline: '2026-10-24',
        options: [
          {
            id: 'opt-a',
            key: 'A',
            description_id: 'Fokuskan budget pada high-ROI channels (Search Ads & Referral)',
            description_en: 'Concentrate remaining budget strictly on high-ROI channels (Search Ads & Referral)',
            business_impact_id: 'Positif — efisiensi konversi terjaga 15-20%',
            business_impact_en: 'Positive — preserves conversion efficiency by 15-20%',
            risk_id: 'Brand awareness top-of-funnel berkurang',
            risk_en: 'Top-of-funnel brand awareness reduced',
            effort: 'Low',
            data_backing_id: 'Laporan Performa Channel Q3 2026',
            data_backing_en: 'Q3 2026 Channel Performance Report',
            score: 4,
            is_recommended: true
          },
          {
            id: 'opt-b',
            key: 'B',
            description_id: 'Tunda campaign November digabung ke Harbolnas Desember',
            description_en: 'Postpone November campaign into December Mega Sale',
            business_impact_id: 'Netral — pengalihan jadwal belanja modal',
            business_impact_en: 'Neutral — temporal shift in promotional spend',
            risk_id: 'Kehilangan momentum peluncuran fitur baru',
            risk_en: 'Miss seasonal product launch momentum',
            effort: 'Med',
            data_backing_id: 'Histori Belanja Pelanggan Nov vs Des 2025',
            data_backing_en: 'Historical Consumer Spend Nov vs Dec 2025',
            score: 3
          },
          {
            id: 'opt-c',
            key: 'C',
            description_id: 'Partnership co-marketing / barter sponsor untuk menutupi gap',
            description_en: 'Co-marketing barter partnership to cover budget deficit',
            business_impact_id: 'Tinggi jika ada partner strategis',
            business_impact_en: 'High upside if strategic brand partner signs',
            risk_id: 'Ketergantungan tinggi pada negosiasi eksternal yang lambat',
            risk_en: 'High external dependency on prolonged negotiations',
            effort: 'High',
            data_backing_id: 'Database MoU Mitra Ekosistem',
            data_backing_en: 'Ecosystem Partner MoU Database',
            score: 2
          }
        ],
        recommendation: {
          key: 'A',
          text_id: 'Opsi A — Fokuskan budget pada channel ber-ROI tinggi.',
          text_en: 'Option A — Concentrate budget strictly on high-ROI channels.',
          prerequisites_id: 'Data performa channel Q3 harus divalidasi oleh Sari sebelum Senin.',
          prerequisites_en: 'Q3 channel performance data must be verified by Sari before Monday.',
          requires_human_confirmation: true
        }
      },
      actions: [
        {
          action_id: 'ACT-001',
          type: 'TICKET_CREATE',
          target_system: 'jira',
          target_project: 'MKT',
          summary_id: 'Analisis dampak pemotongan budget Q4 terhadap campaign November',
          summary_en: 'Impact analysis of Q4 budget cut on November campaign',
          assignee: 'Sari',
          deadline: '2026-10-24',
          priority: 'P1',
          confidence_score: 0.92,
          requires_human_confirmation: false,
          sensitive_data: false,
          status: 'pending'
        },
        {
          action_id: 'ACT-002',
          type: 'SLACK_NOTIFY',
          target_system: 'slack',
          target: '#marketing',
          summary_id: 'Notifikasi ringkasan MoM dan penugasan analisis dampak ke Sari',
          summary_en: 'MoM executive summary notification and impact analysis assignment to Sari',
          confidence_score: 0.95,
          requires_human_confirmation: false,
          sensitive_data: false,
          status: 'pending'
        },
        {
          action_id: 'ACT-003',
          type: 'RAG_UPSERT',
          target_system: 'rag',
          target: 'meeting_minutes',
          summary_id: 'Indexing risalah rapat budget Q4 ke dalam knowledge base',
          summary_en: 'Index Q4 budget meeting minutes into knowledge base',
          confidence_score: 0.98,
          requires_human_confirmation: false,
          sensitive_data: false,
          status: 'pending'
        }
      ],
      notification: {
        channel: 'slack',
        target: '#project-alpha',
        message_id: 'Risalah rapat diterbitkan; action item dibuat untuk Sari terkait analisis dampak campaign November.',
        message_en: 'Meeting minutes published; action item assigned to Sari regarding November campaign impact analysis.'
      },
      reasoning_trace: {
        step1_parsing: 'Noise filtered: 1 item (small talk kopi pantry). Signal extracted: 1 keputusan, 1 action item, 1 risiko (inferensi), 1 open question.',
        step2_rag: 'Formulated 3 RAG search queries. Checked alignment with POL-FIN-2026-003. Flagged campaign launch dependency.',
        step3_mom: 'Normalized code-switching ID/EN. Built executive summary, decision table, and P1 prioritized action items.',
        step4_agentic: 'Synthesized 3 automation payloads (Jira ticket, Slack broadcast, RAG vector upsert). Safety checks verified.'
      },
      noise_items_count: 1,
      average_confidence: 0.92
    }
  },
  {
    id: 'core-banking',
    title: 'Core Banking Cloud Migration Go/No-Go',
    badge: 'Tech & Architecture',
    description: 'Evaluasi kesiapan database failover latency multi-region dan batas regulasi OJK sebelum cutover.',
    rawInput: `[14:02:10] Riko (Lead Architect): Berdasarkan rehearsal semalam, cross-region replication latency ada di 140ms. SLA kita maksimal 80ms.
[14:03:05] Maya (Compliance): Regulasi OJK mengharuskan zero data loss (RPO=0) dan audit log tersimpan immutable di region domestik.
[14:04:20] Denny (VP Eng): Kalau gitu keputusan kita: Cutover weekend ini tunda dulu (NO-GO). Kita optimasi sync protocol via CDC.
[14:05:00] Riko: Saya dan tim infra akan deliver benchmark baru paling lambat Kamis depan tanggal 26 Oktober.
[14:05:40] Denny: Tolong eskalasi status ini ke SteerCo dan kirim memo ke Divisi Operasional.`,
    result: {
      orion_version: '1.0',
      execution_id: 'exec-20261018-002',
      timestamp: '2026-10-18T14:10:00Z',
      meeting: {
        topic_id: 'Core Banking Cloud Migration Go/No-Go Decision',
        topic_en: 'Core Banking Cloud Migration Go/No-Go Decision',
        date: '2026-10-18',
        attendees: ['Denny (VP Eng)', 'Riko (Lead Architect)', 'Maya (Compliance)'],
        source_ref: 'MTG-20261018-002'
      },
      executive_summary: {
        id: 'Rapat memutuskan status NO-GO untuk cutover Core Banking akhir pekan ini karena latency replikasi antar region (140ms) melampaui SLA (80ms). Riko memimpin optimasi CDC untuk benchmark ulang per 26 Oktober.',
        en: 'The committee determined a NO-GO decision for this weekend Core Banking cutover due to cross-region replication latency (140ms) exceeding the 80ms SLA. Riko will lead CDC protocol optimization for re-benchmarking by October 26.'
      },
      extraction_items: [
        {
          id: 1,
          category: 'Keputusan',
          item: 'Cutover cloud migration akhir pekan ini diputuskan NO-GO / ditunda',
          item_en: 'Weekend cloud migration cutover is formally deferred (NO-GO)',
          owner: 'Denny',
          deadline: 'Immediate',
          timestamp: '14:04:20',
          label: '[FAKTA]',
          confidence: 0.98
        },
        {
          id: 2,
          category: 'Action Item',
          item: 'Optimasi sync protocol via CDC dan deliver benchmark latency baru',
          item_en: 'Optimize sync protocol via CDC and deliver updated latency benchmarks',
          owner: 'Riko',
          deadline: '2026-10-26',
          timestamp: '14:05:00',
          label: '[FAKTA]',
          confidence: 0.96
        },
        {
          id: 3,
          category: 'Risiko',
          item: 'Kegagalan memenuhi ambang batas SLA 80ms berisiko time-out pada transaksi debit/QRIS real-time',
          item_en: 'Failure to hit 80ms SLA risks transaction timeouts on live debit and QRIS flows',
          owner: 'Riko',
          deadline: '—',
          timestamp: '14:02:10',
          label: '[FAKTA]',
          confidence: 0.94
        },
        {
          id: 4,
          category: 'Risiko',
          item: 'Pelanggaran audit regulasi OJK jika storage log domestik tidak lolos uji immutability',
          item_en: 'OJK regulatory breach risk if domestic log immutability check fails',
          owner: 'Maya',
          deadline: '—',
          timestamp: '14:03:05',
          label: '[INFERENSI]',
          confidence: 0.89
        }
      ],
      rag_queries: [
        'OJK financial cloud compliance data sovereignty requirements',
        'PostgreSQL cross-region physical replication vs logical CDC latency',
        'Core banking dry run rehearsal fallback procedures'
      ],
      consistency_checks: [
        {
          id: 'c1',
          type: 'danger',
          icon: '🛑',
          message_id: 'Kritikal: Latency 140ms melanggar batas SLA Sistem Pembayaran Nasional (maks 80ms).',
          message_en: 'Critical: 140ms latency violates National Payment System SLA upper bound (max 80ms).'
        },
        {
          id: 'c2',
          type: 'ok',
          icon: '✅',
          message_id: 'Keputusan NO-GO konsisten dengan prinsip High Availability Tier-4 per SOP-IT-DR-09.',
          message_en: 'NO-GO decision is fully consistent with High Availability Tier-4 principles in SOP-IT-DR-09.'
        }
      ],
      decisions: [
        {
          id: 1,
          decision_id: 'Menunda cutover produksi hingga latency CDC <= 75ms',
          decision_en: 'Postpone production cutover until CDC replication latency <= 75ms',
          decided_by: 'Denny (VP Eng)',
          rationale_id: 'Mencegah risiko kegagalan kliring transaksi nasabah',
          rationale_en: 'Prevent customer settlement failure risks'
        }
      ],
      decision_matrix: {
        context_id: 'Bagaimana mitigasi latency cross-region sebelum cutover resmi?',
        context_en: 'How to remediate cross-region replication latency prior to production cutover?',
        deadline: '2026-10-26',
        options: [
          {
            id: 'opt-a',
            key: 'A',
            description_id: 'Terapkan asynchronous change-data-capture (Debezium + Kafka) dengan dual write',
            description_en: 'Implement asynchronous CDC (Debezium + Kafka) with dual write pipeline',
            business_impact_id: 'SLA latency tercapai (<60ms), overhead minim',
            business_impact_en: 'SLA latency attained (<60ms), negligible overhead',
            risk_id: 'Perlu pengujian konsistensi data bertahap',
            risk_en: 'Requires phased data consistency testing',
            effort: 'Med',
            data_backing_id: 'Spesifikasi Arsitektur Event-Driven v3',
            data_backing_en: 'Event-Driven Architecture Spec v3',
            score: 5,
            is_recommended: true
          },
          {
            id: 'opt-b',
            key: 'B',
            description_id: 'Sewa dedicated Direct Connect 10Gbps leased line antar cloud zone',
            description_en: 'Procure dedicated 10Gbps Direct Connect private cloud interconnect',
            business_impact_id: 'Latency turun instan ke 45ms',
            business_impact_en: 'Immediate drop to 45ms latency',
            risk_id: 'Biaya capex/opex naik IDR 250M/bulan',
            risk_en: 'Opex increases by IDR 250M/month',
            effort: 'High',
            data_backing_id: 'Proposal Vendor Telco Tier-1',
            data_backing_en: 'Tier-1 Telco Vendor Proposal',
            score: 3
          }
        ],
        recommendation: {
          key: 'A',
          text_id: 'Opsi A — Optimasi arsitektur CDC asinkron sebelum mengambil opsi hardware mahal.',
          text_en: 'Option A — Optimize asynchronous CDC architecture prior to committing to expensive private circuits.',
          prerequisites_id: 'Uji simulasi 25.000 TPS transaksi simultan.',
          prerequisites_en: 'Simulate 25,000 concurrent TPS transaction load test.',
          requires_human_confirmation: true
        }
      },
      actions: [
        {
          action_id: 'ACT-004',
          type: 'TICKET_CREATE',
          target_system: 'jira',
          target_project: 'INFRA',
          summary_id: 'Benchmark CDC Latency Replikasi Multi-Region',
          summary_en: 'Benchmark CDC Multi-Region Replication Latency',
          assignee: 'Riko',
          deadline: '2026-10-26',
          priority: 'P0',
          confidence_score: 0.98,
          requires_human_confirmation: true,
          sensitive_data: false,
          status: 'pending'
        },
        {
          action_id: 'ACT-005',
          type: 'SLACK_NOTIFY',
          target_system: 'slack',
          target: '#incident-war-room',
          summary_id: 'Eskalasi status NO-GO Cutover Core Banking ke SteerCo',
          summary_en: 'Escalate Core Banking cutover NO-GO status to SteerCo',
          confidence_score: 0.99,
          requires_human_confirmation: false,
          sensitive_data: false,
          status: 'pending'
        }
      ],
      notification: {
        channel: 'slack',
        target: '#executive-updates',
        message_id: 'SteerCo update: Cutover migrasi core banking ditunda; tim arsitektur mengejar perbaikan CDC hingga 26 Okt.',
        message_en: 'SteerCo update: Core banking migration cutover deferred; architecture team resolving CDC latency by Oct 26.'
      },
      reasoning_trace: {
        step1_parsing: 'Filtered out non-critical chatter. Identified 1 P0 NO-GO decision, 1 benchmark action item, and 2 compliance/latency risks.',
        step2_rag: 'Matched with OJK Banking Directives and internal High Availability SOP Tier-4.',
        step3_mom: 'Constructed executive MoM highlighting risk containment rationale.',
        step4_agentic: 'Generated P0 Infra Jira ticket and priority SteerCo notification broadcast.'
      },
      noise_items_count: 0,
      average_confidence: 0.96
    }
  }
];
