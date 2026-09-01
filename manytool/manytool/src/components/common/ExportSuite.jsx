import React, { useState } from 'react';
import { Download, FileText, FileCode, Check } from 'lucide-react';
import { exportAsTxt, exportAsJson } from '../../utils/exportUtils';

const ExportSuite = ({ data, filename = 'manytool-output' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTxtExport = () => {
    const textContent = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    exportAsTxt(filename, textContent);
    setIsOpen(false);
  };

  const handleJsonExport = () => {
    const jsonData = typeof data === 'object' ? data : { content: data };
    exportAsJson(filename, jsonData);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer font-mono shadow-sm"
        type="button"
      >
        <Download size={14} className="text-cyan-400" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl z-50 p-1.5 space-y-1 font-mono backdrop-blur-xl">
          <button
            onClick={handleTxtExport}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-cyan-500/15 hover:text-cyan-300 transition-all text-left cursor-pointer"
          >
            <FileText size={14} className="text-cyan-400" />
            <span>Download .TXT</span>
          </button>
          <button
            onClick={handleJsonExport}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-purple-500/15 hover:text-purple-300 transition-all text-left cursor-pointer"
          >
            <FileCode size={14} className="text-purple-400" />
            <span>Download .JSON</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportSuite;