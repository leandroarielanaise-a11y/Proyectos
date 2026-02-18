
import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import Recommendation from './components/Recommendation';
import AIChat from './components/AIChat';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeCVs } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setStatus(AnalysisStatus.LOADING);
    setError(null);
    
    try {
      const analysis = await analyzeCVs(files);
      setResult(analysis);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Error al analizar los currículums. Intente nuevamente.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {status === AnalysisStatus.IDLE && (
          <div className="mt-10 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Optimiza tu Selección con IA</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Analiza conocimientos, habilidades y experiencia de múltiples candidatos de forma automática y objetiva.
              </p>
            </div>
            <FileUpload onFilesSelected={handleFilesSelected} isLoading={false} />
            
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl group-hover:scale-110 transition-transform">1</div>
                <h4 className="font-bold text-slate-800 mb-2">Carga Masiva</h4>
                <p className="text-sm text-slate-500">Sube múltiples CVs en PDF o Word simultáneamente para un análisis paralelo.</p>
              </div>
              <div className="p-6 group">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl group-hover:scale-110 transition-transform">2</div>
                <h4 className="font-bold text-slate-800 mb-2">Extracción Inteligente</h4>
                <p className="text-sm text-slate-500">Gemini identifica automáticamente habilidades técnicas, idiomas y experiencia.</p>
              </div>
              <div className="p-6 group">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl group-hover:scale-110 transition-transform">3</div>
                <h4 className="font-bold text-slate-800 mb-2">Ranking Objetivo</h4>
                <p className="text-sm text-slate-500">Recibe una tabla comparativa ponderada y la recomendación del mejor perfil.</p>
              </div>
            </div>
          </div>
        )}

        {status === AnalysisStatus.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <FileUpload onFilesSelected={() => {}} isLoading={true} />
            <p className="mt-4 text-slate-500 animate-pulse font-medium">Procesando perfiles y calculando métricas...</p>
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-red-800 mb-2">Error de Análisis</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Intentar de Nuevo
            </button>
          </div>
        )}

        {status === AnalysisStatus.SUCCESS && result && (
          <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resultados de Evaluación</h2>
                <p className="text-slate-500">Total de {result.candidates.length} perfiles analizados objetivamente.</p>
              </div>
              <button 
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Realizar Nuevo Análisis
              </button>
            </div>

            {/* FIRST: Comparative Table */}
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                1. Tabla Comparativa de Talentos
              </h3>
              <ResultsTable candidates={result.candidates} bestCandidateId={result.bestCandidateId} />
            </section>

            {/* SECOND: Choice Result and Justification */}
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                2. Elección y Justificación Profesional
              </h3>
              <Recommendation result={result} />
            </section>

            {/* THIRD: AI Chat for follow-up questions */}
            <section>
              <AIChat context={result} />
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center mt-20">
        <p className="text-slate-400 text-sm">© 2024 HR Talent Scouter AI - Herramienta de Soporte a Decisiones para Analistas de RRHH</p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
