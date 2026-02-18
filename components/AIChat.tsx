
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { askQuestionAboutAnalysis } from '../services/geminiService';

interface AIChatProps {
  context: AnalysisResult;
}

const AIChat: React.FC<AIChatProps> = ({ context }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isTyping) return;

    const userQ = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: userQ }]);
    setIsTyping(true);

    try {
      const answer = await askQuestionAboutAnalysis(userQ, context);
      setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Lo siento, hubo un error al procesar tu consulta." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-slate-900 p-4 text-white flex items-center gap-3">
        <div className="bg-indigo-500 p-1.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="font-bold">Consultas al Asistente de IA</h3>
      </div>
      
      <div className="p-6 h-[400px] overflow-y-auto bg-slate-50 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <p className="text-sm italic">¿Tienes dudas sobre por qué un candidato fue puntuado así? <br/> Pregúntame detalles sobre el análisis.</p>
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta sobre los candidatos..."
          className="flex-grow px-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={!question.trim() || isTyping}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AIChat;
