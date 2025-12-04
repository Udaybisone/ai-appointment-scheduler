import React from 'react';
import JsonViewer from './JsonViewer.jsx';

const StatusPill = ({ status }) => {
  if (!status) return null;
  const isOk = status === 'ok';

  return (
    <span className={`status-pill ${isOk ? 'status-ok' : 'status-clarify'}`}>
      <span className="status-dot" />
      {isOk ? 'OK' : 'Needs Clarification'}
    </span>
  );
};

const ResultPanel = ({ result }) => {
  if (!result) {
    return (
      <div className="result-panel empty">
        <p className="muted">
          Run the pipeline to see <strong>step-by-step</strong> JSON output here.
        </p>
      </div>
    );
  }

  const { step1, step2, step3, final, status, message } = result;

  const effectiveStatus = final?.status || status;

  return (
    <div className="result-panel">
      <div className="result-panel-header">
        <div>
          <h2>Pipeline Output</h2>
          <p className="muted small">
            Raw → Entities → Normalization → Final / Guardrail
          </p>
        </div>
        <StatusPill status={effectiveStatus} />
      </div>

      {message && (
        <div className="alert warning">
          <strong>Guardrail:</strong> {message}
        </div>
      )}

      <div className="steps-grid">
        {/* Step 1 */}
        <div className="step-card">
          <div className="step-tag">Step 1 · OCR / Text</div>
          {step1 ? (
            <>
              <p className="step-title">Raw Text & Confidence</p>
              <p className="step-highlight">"{step1.raw_text}"</p>
              <p className="step-meta">
                Confidence:{' '}
                <span className="chip chip-soft">
                  {Math.round((step1.confidence || 0) * 100)}%
                </span>
              </p>
            </>
          ) : (
            <p className="muted small">No data yet.</p>
          )}
        </div>

        {/* Step 2 */}
        <div className="step-card">
          <div className="step-tag">Step 2 · Entities</div>
          {step2 ? (
            <>
              <p className="step-title">Extracted Entities</p>
              <ul className="step-list">
                <li>
                  <span>Date phrase</span>
                  <span className="value">
                    {step2.entities?.date_phrase || <em>–</em>}
                  </span>
                </li>
                <li>
                  <span>Time phrase</span>
                  <span className="value">
                    {step2.entities?.time_phrase || <em>–</em>}
                  </span>
                </li>
                <li>
                  <span>Department</span>
                  <span className="value">
                    {step2.entities?.department || <em>–</em>}
                  </span>
                </li>
              </ul>
              <p className="step-meta">
                Confidence:{' '}
                <span className="chip chip-soft">
                  {Math.round((step2.entities_confidence || 0) * 100)}%
                </span>
              </p>
            </>
          ) : (
            <p className="muted small">No data yet.</p>
          )}
        </div>

        {/* Step 3 */}
        <div className="step-card">
          <div className="step-tag">Step 3 · Normalization (IST)</div>
          {step3 ? (
            <>
              <p className="step-title">ISO Date & Time</p>
              <ul className="step-list">
                <li>
                  <span>Date</span>
                  <span className="value">{step3.normalized?.date || <em>–</em>}</span>
                </li>
                <li>
                  <span>Time</span>
                  <span className="value">{step3.normalized?.time || <em>–</em>}</span>
                </li>
                <li>
                  <span>Timezone</span>
                  <span className="value">{step3.normalized?.tz || <em>–</em>}</span>
                </li>
                <li>
                  <span>Department</span>
                  <span className="value">
                    {step3.normalized?.department_canonical || <em>–</em>}
                  </span>
                </li>
              </ul>
              <p className="step-meta">
                Confidence:{' '}
                <span className="chip chip-soft">
                  {Math.round((step3.normalization_confidence || 0) * 100)}%
                </span>
              </p>
            </>
          ) : (
            <p className="muted small">No data yet.</p>
          )}
        </div>

        {/* Final JSON */}
        <div className="step-card">
          <div className="step-tag">Step 4 · Final JSON</div>
          {final ? (
            <>
              <p className="step-title">Appointment Object</p>
              <ul className="step-list">
                <li>
                  <span>Department</span>
                  <span className="value">{final.appointment?.department || <em>–</em>}</span>
                </li>
                <li>
                  <span>Date</span>
                  <span className="value">{final.appointment?.date || <em>–</em>}</span>
                </li>
                <li>
                  <span>Time</span>
                  <span className="value">{final.appointment?.time || <em>–</em>}</span>
                </li>
                <li>
                  <span>Timezone</span>
                  <span className="value">{final.appointment?.tz || <em>–</em>}</span>
                </li>
              </ul>
            </>
          ) : (
            <p className="muted small">Guardrail output or partial pipeline.</p>
          )}
        </div>
      </div>

      <details className="json-details">
        <summary>View raw JSON</summary>
        <JsonViewer data={result} />
      </details>
    </div>
  );
};

export default ResultPanel;
