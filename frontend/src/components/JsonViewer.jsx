import React from 'react';

const JsonViewer = ({ data, title = 'Pipeline Output' }) => {
  if (!data) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          JSON View
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-purple-500/10 rounded-2xl blur-2xl" />
        <pre className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 overflow-x-auto shadow-xl shadow-slate-950/70">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonViewer;
