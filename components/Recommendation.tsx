
import React from 'react';
import { Candidate, AnalysisResult } from '../types';

interface RecommendationProps {
  result: AnalysisResult;
}

const Recommendation: React.FC<RecommendationProps> = ({ result }) => {
  const bestCandidate = result.candidates.find(c => c.id === result.bestCandidateId);

  if (!bestCandidate) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/50">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l7 3a1 1 0 00.788 0l7-3a1 1 0 000-1.848l-7-3z" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-500/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-indigo-400/30">
              Candidato Seleccionado
            </span>
          </div>
          
          <h2 className="text-4xl font-black mb-4">
            {bestCandidate.name} {bestCandidate.surname}
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
            <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Justificación de la Elección</h4>
            <p className="text-lg text-indigo-50 leading-relaxed font-medium">
              "{result.overallRecommendation}"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">Perfil Profesional</h4>
                <p className="text-white/90 leading-relaxed text-sm">{bestCandidate.summary}</p>
              </div>
              <div>
                <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">Idiomas Detectados</h4>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 px-3 py-1 rounded text-xs font-bold border border-indigo-400">
                    {bestCandidate.languagesDetail || 'Ninguno detectado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {bestCandidate.uniqueAttributes && (
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-5">
                  <h4 className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Atributos Diferenciadores (Exclusivos)
                  </h4>
                  <p className="text-amber-50 text-sm leading-relaxed italic">
                    {bestCandidate.uniqueAttributes}
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">Notas Adicionales</h4>
                <p className="text-white/90 text-sm leading-relaxed">{bestCandidate.recommendationReason}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.candidates.filter(c => c.id !== result.bestCandidateId).map(candidate => (
          <div key={candidate.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-slate-800">{candidate.name} {candidate.surname}</h4>
              <span className="text-indigo-600 font-black text-sm">{candidate.scores.total}/100</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Diferenciador:</p>
                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  {candidate.uniqueAttributes || 'Sin atributos exclusivos detectados.'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Idiomas:</p>
                <p className="text-xs text-slate-700 font-medium">
                  {candidate.languagesDetail || 'No menciona.'}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
               <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: `${candidate.scores.total}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;
