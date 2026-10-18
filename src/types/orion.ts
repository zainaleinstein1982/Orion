export type LanguageMode = 'id' | 'en' | 'bi';

export type CategoryType = 'Keputusan' | 'Action Item' | 'Risiko' | 'Open Question' | 'Noise';

export type LabelType = '[FAKTA]' | '[INFERENSI]' | '[ASUMSI]' | '[KONFLIK]';

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

export type ActionType = 'TICKET_CREATE' | 'SLACK_NOTIFY' | 'RAG_UPSERT' | 'APPROVAL_REQUEST' | 'CALENDAR_INVITE';

export interface ExtractionItem {
  id: number;
  category: CategoryType;
  item: string;
  item_en?: string;
  owner: string;
  deadline: string;
  timestamp?: string;
  label: LabelType;
  confidence: number;
  filtered?: boolean;
}

export interface ConsistencyCheck {
  id: string;
  type: 'ok' | 'warning' | 'danger' | 'info';
  icon: string;
  message_id: string;
  message_en: string;
  reference?: string;
}

export interface DecisionOption {
  id: string;
  key: string;
  description_id: string;
  description_en: string;
  business_impact_id: string;
  business_impact_en: string;
  risk_id: string;
  risk_en: string;
  effort: 'Low' | 'Med' | 'High';
  data_backing_id: string;
  data_backing_en: string;
  score: number;
  is_recommended?: boolean;
}

export interface DecisionMatrixData {
  context_id: string;
  context_en: string;
  deadline: string;
  options: DecisionOption[];
  recommendation: {
    key: string;
    text_id: string;
    text_en: string;
    prerequisites_id: string;
    prerequisites_en: string;
    requires_human_confirmation: boolean;
  };
}

export interface AgenticAction {
  action_id: string;
  type: ActionType;
  target_system: 'jira' | 'slack' | 'rag' | 'odoo' | 'calendar' | 'email';
  target_project?: string;
  target?: string;
  summary_id?: string;
  summary_en?: string;
  assignee?: string;
  deadline?: string;
  priority?: PriorityLevel;
  confidence_score: number;
  requires_human_confirmation: boolean;
  sensitive_data: boolean;
  status?: 'pending' | 'dispatched' | 'confirmed';
}

export interface OrionAnalysisResult {
  orion_version: string;
  execution_id: string;
  timestamp: string;
  meeting: {
    topic_id: string;
    topic_en: string;
    date: string;
    attendees: string[];
    source_ref: string;
  };
  executive_summary: {
    id: string;
    en: string;
  };
  extraction_items: ExtractionItem[];
  rag_queries: string[];
  consistency_checks: ConsistencyCheck[];
  decisions: {
    id: number;
    decision_id: string;
    decision_en: string;
    decided_by: string;
    rationale_id: string;
    rationale_en: string;
  }[];
  decision_matrix: DecisionMatrixData;
  actions: AgenticAction[];
  notification: {
    channel: string;
    target: string;
    message_id: string;
    message_en: string;
  };
  reasoning_trace: {
    step1_parsing: string;
    step2_rag: string;
    step3_mom: string;
    step4_agentic: string;
  };
  noise_items_count: number;
  average_confidence: number;
}
