import React, { useState } from 'react';
import ConstellationCanvas from './components/ConstellationCanvas';
import Sidebar, { ViewType } from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './components/views/DashboardView';
import InputView from './components/views/InputView';
import OutputView from './components/views/OutputView';
import ExtractionView from './components/views/ExtractionView';
import DecisionView from './components/views/DecisionView';
import ActionPlanView from './components/views/ActionPlanView';
import KnowledgeView from './components/views/KnowledgeView';
import SettingsView from './components/views/SettingsView';
import ActionDetailModal from './components/modals/ActionDetailModal';
import ExportModal from './components/modals/ExportModal';

import { OrionAnalysisResult, LanguageMode, AgenticAction } from './types/orion';
import { SCENARIO_PRESETS } from './data/sampleScenarios';
import { AnalyzerOptions, analyzeWithOrion } from './services/analyzer';

export default function App() {
  const defaultPreset = SCENARIO_PRESETS[0];

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [langMode, setLangMode] = useState<LanguageMode>('id');
  const [inputText, setInputText] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<OrionAnalysisResult>(defaultPreset.result);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [options, setOptions] = useState<AnalyzerOptions>({
    inputType: 'auto',
    outputLang: 'bi',
    targetSystems: {
      jira: true,
      slack: true,
      odoo: false,
      calendar: false,
      email: false
    },
    guardrails: {
      g1_redact_sensitive: true,
      g2_flag_ambiguous: true,
      g3_prevent_hallucination: true,
      g4_payload_only: true,
      g5_handle_incomplete: true,
      g7_rag_unavailable: true,
      g8_auto_escalate_p0: true
    },
    confidenceThreshold: 0.85
  });

  const [selectedAction, setSelectedAction] = useState<AgenticAction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const handleUpdateOptions = (newOpts: Partial<AnalyzerOptions>) => {
    setOptions(prev => ({ ...prev, ...newOpts }));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = SCENARIO_PRESETS.find(p => p.id === presetId);
    if (found) {
      setInputText(found.rawInput);
      setCurrentResult(found.result);
    }
  };

  const handleRunAnalysis = async () => {
    setIsProcessing(true);
    try {
      const res = await analyzeWithOrion(inputText, options);
      setCurrentResult(res);
      setCurrentView('output');
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNavigateToView = (view: ViewType) => {
    if (view === 'input') {
      setInputText('');
    }
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0e1a] text-[#f1f5f9] overflow-hidden relative">
      {/* Dynamic constellation particle network */}
      <ConstellationCanvas />

      {/* Main navigation sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={handleNavigateToView}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        langMode={langMode}
      />

      {/* Application workspace */}
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-[#0a0e1a]/90 backdrop-blur-sm">
        <TopBar
          currentView={currentView}
          langMode={langMode}
          onSetLangMode={setLangMode}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onLoadPreset={handleLoadPreset}
        />

        {/* Viewport Area */}
        <main
          className={`flex-1 ${
            currentView === 'dashboard' || currentView === 'input'
              ? 'p-4 sm:p-5 lg:p-6 overflow-hidden h-[calc(100vh-64px)]'
              : 'overflow-y-auto p-4 sm:p-6 md:p-8'
          }`}
        >
          <div
            className={
              currentView === 'dashboard' || currentView === 'input'
                ? 'w-full h-full'
                : 'max-w-7xl mx-auto pb-12'
            }
          >
            {currentView === 'dashboard' && (
              <DashboardView
                currentResult={currentResult}
                langMode={langMode}
                onNavigate={handleNavigateToView}
                onLoadPreset={handleLoadPreset}
              />
            )}

            {currentView === 'input' && (
              <InputView
                inputText={inputText}
                onSetInputText={setInputText}
                options={options}
                onUpdateOptions={handleUpdateOptions}
                onRunAnalysis={handleRunAnalysis}
                isProcessing={isProcessing}
                langMode={langMode}
              />
            )}

            {currentView === 'output' && (
              <OutputView
                result={currentResult}
                langMode={langMode}
                onOpenActionDetail={setSelectedAction}
              />
            )}

            {currentView === 'extraction' && (
              <ExtractionView
                result={currentResult}
                langMode={langMode}
              />
            )}

            {currentView === 'decision' && (
              <DecisionView
                result={currentResult}
                langMode={langMode}
              />
            )}

            {currentView === 'actions' && (
              <ActionPlanView
                result={currentResult}
                langMode={langMode}
                onOpenActionDetail={setSelectedAction}
              />
            )}

            {currentView === 'knowledge' && (
              <KnowledgeView
                langMode={langMode}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                options={options}
                onUpdateOptions={handleUpdateOptions}
                langMode={langMode}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedAction && (
        <ActionDetailModal
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          langMode={langMode}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          result={currentResult}
          onClose={() => setIsExportModalOpen(false)}
          langMode={langMode}
        />
      )}
    </div>
  );
}
