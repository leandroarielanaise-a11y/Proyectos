
import React, { useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 flex flex-col items-center justify-center
          ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="cv-upload"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
          disabled={isLoading}
        />
        
        <div className="bg-indigo-100 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {isLoading ? 'Analizando currículums...' : 'Subir Currículums'}
        </h3>
        <p className="text-slate-500 text-center max-w-sm mb-6">
          Arrastra y suelta varios archivos PDF o Word aquí. El sistema analizará automáticamente el talento.
        </p>
        
        <div className="flex gap-4">
          <label 
            htmlFor="cv-upload" 
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer
              ${isLoading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {isLoading ? 'Procesando...' : 'Seleccionar Archivos'}
          </label>
        </div>

        {isLoading && (
          <div className="mt-8 w-full max-w-xs bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-full animate-progress-indeterminate"></div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 30%; }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
