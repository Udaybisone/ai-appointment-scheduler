import React, { useState } from 'react';
import { parseAppointment } from '../api/client.js';
import JsonViewer from './JsonViewer.jsx';

const AppointmentForm = () => {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('Book dentist next Friday at 3pm');
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await parseAppointment({ mode, text, imageFile });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const status = result?.status || result?.final?.status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-500/40">
              <span className="text-sm font-bold text-slate-950">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Appointment Scheduler
              </h1>
              <p className="text-xs text-slate-400">
                OCR → Entity Extraction → Normalization → Guardrails
              </p>
            </div>
          </div>
          <span className="hidden md:inline-flex text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/40">
            Powered by Gemini · Asia/Kolkata
          </span>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] items-start">
        {/* Left: Form + Info */}
        <section className="space-y-6">
          {/* Primary card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-2xl shadow-black/60">
            <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-teal-500/20 via-sky-500/10 to-transparent pointer-events-none" />
            <div className="relative p-6 lg:p-8 space-y-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/40 text-[11px]">
                    1
                  </span>
                  <span className="uppercase tracking-[0.18em]">
                    Create request
                  </span>
                </div>
                <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">
                  Turn unstructured appointment requests into clean JSON
                </h2>
                <p className="text-sm text-slate-400 max-w-xl">
                  Paste a natural-language request or upload a note screenshot.
                  The pipeline will extract date, time, and department, then
                  normalize into ISO values with guardrails for ambiguity.
                </p>
              </div>

              {/* Mode toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex text-xs rounded-full border border-slate-800 bg-slate-900/80 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('text');
                      setResult(null);
                    }}
                    className={`px-3 py-1.5 rounded-full transition ${
                      mode === 'text'
                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    Text Input
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('image');
                      setResult(null);
                    }}
                    className={`px-3 py-1.5 rounded-full transition ${
                      mode === 'image'
                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    Image (OCR)
                  </button>
                </div>

                {status && (
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border ${
                      status === 'ok'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    {status === 'ok'
                      ? 'Parsed successfully'
                      : 'Needs clarification'}
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'text' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                      Appointment Request
                      <span className="text-[10px] text-slate-500">
                        e.g. “Book dentist next Friday at 3pm”
                      </span>
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-teal-500/70 transition shadow-inner shadow-black/40"
                      placeholder="Describe the appointment you want to book..."
                    />
                  </div>
                )}

                {mode === 'image' && (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-slate-300">
                      Upload Note / Email Screenshot
                    </label>
                    <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-4 py-8 text-center cursor-pointer hover:border-teal-500/70 hover:bg-slate-900 transition">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-teal-500/70 group-hover:bg-slate-900/80 transition">
                          <span className="text-lg">📷</span>
                        </div>
                        <span className="text-xs text-slate-300">
                          Drop image here or click to browse
                        </span>
                        <span className="text-[11px] text-slate-500">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                      />
                      {imageFile && (
                        <p className="mt-2 text-[11px] text-teal-300">
                          Selected: {imageFile.name}
                        </p>
                      )}
                    </label>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 flex items-start gap-2">
                    <span className="mt-0.5 text-sm">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-teal-500/40 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-105 transition"
                  >
                    {loading ? (
                      <>
                        <span className="h-3 w-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <span>Run Pipeline</span>
                        <span className="text-xs opacity-80">↵</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500">
                    We won’t book anything — just parse and normalize the
                    request.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Step guide */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                label: 'Step 1',
                title: 'OCR / Text',
                desc: 'Extract raw text and confidence from user input.',
              },
              {
                label: 'Step 2',
                title: 'Entity Extraction',
                desc: 'Identify date, time, and department phrases.',
              },
              {
                label: 'Step 3',
                title: 'Normalization',
                desc: 'Convert phrases to ISO date/time in Asia/Kolkata.',
              },
              {
                label: 'Step 4',
                title: 'Final JSON',
                desc: 'Return appointment object or ask for clarification.',
              },
            ].map((step, idx) => (
              <div
                key={step.label}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-500">{step.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-500 border border-slate-800">
                    {idx + 1}/4
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100">
                  {step.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: JSON Panel */}
        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 lg:p-5 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Debug View
                </h3>
                <p className="text-[11px] text-slate-500">
                  Inspect raw text, entities, normalization and final appointment.
                </p>
              </div>
              <span className="text-[11px] text-slate-500">
                Read-only · Dev friendly
              </span>
            </div>

            {!result && (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-3 py-4 text-center text-xs text-slate-500">
                Run the pipeline to see structured JSON here.
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Status / message */}
                {status === 'needs_clarification' && (
                  <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100 flex items-start gap-2">
                    <span className="mt-0.5 text-sm">💬</span>
                    <span>
                      <span className="font-semibold">Clarification needed:</span>{' '}
                      {result.message || 'Ambiguous date/time or department'}
                    </span>
                  </div>
                )}

                {/* Step-wise JSON (optional) */}
                <details className="group rounded-2xl border border-slate-800 bg-slate-950/70">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs text-slate-300">
                    <span>Step-wise breakdown</span>
                    <span className="text-slate-500 group-open:hidden">+ Show</span>
                    <span className="text-slate-500 hidden group-open:inline">
                      − Hide
                    </span>
                  </summary>
                  <div className="px-3 pb-3 space-y-3">
                    {result.step1 && (
                      <JsonViewer data={result.step1} title="Step 1 · OCR / Text" />
                    )}
                    {result.step2 && (
                      <JsonViewer
                        data={result.step2}
                        title="Step 2 · Entity Extraction"
                      />
                    )}
                    {result.step3 && (
                      <JsonViewer
                        data={result.step3}
                        title="Step 3 · Normalization"
                      />
                    )}
                  </div>
                </details>

                {/* Final JSON */}
                {result.final && (
                  <JsonViewer data={result.final} title="Step 4 · Final Appointment" />
                )}

                {!result.final && (
                  <JsonViewer data={result} title="Raw Response" />
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppointmentForm;
