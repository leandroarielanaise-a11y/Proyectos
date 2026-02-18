
import React from 'react';
import { Candidate } from '../types';

interface ResultsTableProps {
  candidates: Candidate[];
  bestCandidateId: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ candidates, bestCandidateId }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Candidato</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Conoc.</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Habil.</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Idiomas</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Detalle Idiomas</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50/50">Total</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {candidates.map((candidate) => (
            <tr key={candidate.id} className={`${candidate.id === bestCandidateId ? 'bg-indigo-50/20' : 'hover:bg-slate-50/50'} transition-colors`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold border ${
                    candidate.id === bestCandidateId ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {candidate.name[0]}{candidate.surname[0]}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-slate-900">{candidate.name} {candidate.surname}</div>
                    <div className="text-xs text-slate-400">{candidate.experienceYears} años exp.</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-600">{candidate.scores.knowledge}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-600">{candidate.scores.skills}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-slate-700">
                <span className={candidate.scores.languages === 0 ? 'text-slate-300' : 'text-slate-700'}>
                  {candidate.scores.languages}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-center text-slate-500">
                {candidate.languagesDetail || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-black text-indigo-700 bg-indigo-50/30">
                {candidate.scores.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {candidate.id === bestCandidateId ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    SELECCIONADO
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                    EVALUADO
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
