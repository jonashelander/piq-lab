import { useState, useEffect } from 'react';
import { ConfigRecord } from '../types';
import { fetchConfigFor, saveConfigFor } from '../api';

function AttributesEditor({
  attrs,
  onChange,
  disabled = false,
}: {
  attrs: Record<string, string>;
  onChange: (attrs: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const entries = Object.entries(attrs);

  function handleKeyChange(oldKey: string, newKey: string) {
    const updated: Record<string, string> = {};
    for (const [k, v] of Object.entries(attrs)) {
      updated[k === oldKey ? newKey : k] = v;
    }
    onChange(updated);
  }

  function handleValueChange(key: string, newValue: string) {
    onChange({ ...attrs, [key]: newValue });
  }

  function handleRemove(key: string) {
    const updated = { ...attrs };
    delete updated[key];
    onChange(updated);
  }

  function handleAdd() {
    const base = 'key';
    let i = Object.keys(attrs).length + 1;
    while (attrs[`${base}${i}`] !== undefined) i++;
    onChange({ ...attrs, [`${base}${i}`]: '' });
  }

  return (
    <div className="attributes-editor" style={disabled ? { pointerEvents: 'none' } : {}}>
      {entries.length === 0 && (
        <p className="attr-empty">No attributes. Add one below.</p>
      )}
      {entries.map(([key, value]) => (
        <div key={key} className="attr-row">
          <input
            className="attr-key-input"
            value={key}
            onChange={e => handleKeyChange(key, e.target.value)}
            placeholder="key"
            disabled={disabled}
          />
          <span className="attr-separator">:</span>
          <input
            className="attr-value-input"
            value={value}
            onChange={e => handleValueChange(key, e.target.value)}
            placeholder="value"
            disabled={disabled}
          />
          <button
            className="attr-remove-btn"
            onClick={() => handleRemove(key)}
            title="Remove"
            disabled={disabled}
          >
            ×
          </button>
        </div>
      ))}
      {!disabled && (
        <button className="attr-add-btn" onClick={handleAdd}>
          + Add attribute
        </button>
      )}
    </div>
  );
}

interface Props {
  endpoint: string;
  nestedField?: string;
}

export default function EndpointConfigPage({ endpoint, nestedField }: Props) {
  const [config, setConfig] = useState<ConfigRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    setLoading(true);
    setConfig([]);
    fetchConfigFor(endpoint)
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [endpoint]);

  const allIncluded = config.length > 0 && config.every(r => r.included);

  function handleToggleAll() {
    const nextState = !allIncluded;
    setConfig(cfg => cfg.map(r => ({ ...r, included: nextState })));
  }

  function handleToggle(key: string) {
    setConfig(cfg =>
      cfg.map(r => (r.key === key ? { ...r, included: !r.included } : r))
    );
  }

  function handleValueChange(key: string, value: string) {
    setConfig(cfg =>
      cfg.map(r => (r.key === key ? { ...r, value } : r))
    );
  }

  function handleNestedChange(attrs: Record<string, string>) {
    setConfig(cfg =>
      cfg.map(r => (r.key === nestedField ? { ...r, value: attrs } : r))
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus('idle');
    try {
      await saveConfigFor(endpoint, config);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  function handleApplyJson() {
    setJsonError('');
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setJsonError('Invalid JSON — please check your input and try again.');
      return;
    }

    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
      setJsonError('Expected a JSON object at the top level.');
      return;
    }

    setConfig(cfg =>
      cfg.map(r => {
        if (!(r.key in parsed)) return r;

        if (nestedField && r.key === nestedField) {
          const rawAttrs = parsed[r.key];
          if (
            rawAttrs !== null &&
            typeof rawAttrs === 'object' &&
            !Array.isArray(rawAttrs)
          ) {
            const attrs: Record<string, string> = {};
            for (const [k, v] of Object.entries(rawAttrs as Record<string, unknown>)) {
              attrs[k] = String(v);
            }
            return { ...r, value: attrs };
          }
          return r;
        }

        return { ...r, value: String(parsed[r.key]) };
      })
    );

    setJsonInput('');
  }

  async function handleCopyJson() {
    const sorted = [...config].sort((a, b) => a.order - b.order);
    const responseBody: Record<string, unknown> = {};
    for (const record of sorted) {
      if (record.included) {
        responseBody[record.key] = record.value;
      }
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(responseBody, null, 2));
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2500);
    }
  }

  if (loading) {
    return <div className="page-loading">Loading configuration…</div>;
  }

  const sorted = [...config].sort((a, b) => a.order - b.order);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{endpoint}</h1>
          <p className="page-subtitle">
            Configure the response returned by <code>POST /{endpoint}</code>
          </p>
        </div>
        <div className="page-actions">
          {saveStatus === 'saved' && (
            <span className="save-status success">Saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="save-status error">Error saving</span>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Response Parameters</h2>
          <div className="include-all-row">
            <span className="include-all-label">Include all</span>
            <button
              className={`toggle ${allIncluded ? 'toggle-on' : ''}`}
              onClick={handleToggleAll}
              role="switch"
              aria-checked={allIncluded}
            />
          </div>
        </div>

        <div className="config-table">
          <div className="config-table-header">
            <span className="col-include">Include</span>
            <span className="col-key">Parameter</span>
            <span className="col-value">Value</span>
          </div>

          {sorted.map(record => (
            <div
              key={record.key}
              className={`config-row ${!record.included ? 'row-disabled' : ''}`}
            >
              <div className="col-include">
                <button
                  className={`toggle ${record.included ? 'toggle-on' : ''}`}
                  onClick={() => handleToggle(record.key)}
                  role="switch"
                  aria-checked={record.included}
                />
              </div>
              <div className="col-key">
                <span className="param-key">{record.key}</span>
              </div>
              <div className="col-value">
                {nestedField && record.key === nestedField ? (
                  <AttributesEditor
                    attrs={record.value as Record<string, string>}
                    onChange={handleNestedChange}
                    disabled={!record.included}
                  />
                ) : (
                  <input
                    className="field-input"
                    value={record.value as string}
                    onChange={e => handleValueChange(record.key, e.target.value)}
                    disabled={!record.included}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Export JSON</h2>
            <p className="card-description">
              Copy the current response body (included fields only) as a JSON object.
            </p>
          </div>
        </div>
        <div className="card-body">
          <div className="json-actions">
            <button className="btn btn-secondary" onClick={handleCopyJson}>
              Copy JSON
            </button>
            {copyStatus === 'copied' && (
              <span className="save-status success">Copied</span>
            )}
            {copyStatus === 'error' && (
              <span className="save-status error">Copy failed</span>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Import JSON</h2>
            <p className="card-description">
              Paste a complete {endpoint} JSON object to populate the fields above.
            </p>
          </div>
        </div>
        <div className="card-body">
          <textarea
            className="json-textarea"
            value={jsonInput}
            onChange={e => {
              setJsonInput(e.target.value);
              setJsonError('');
            }}
            placeholder={'{\n  "userId": "abc123",\n  ...\n}'}
            rows={7}
          />
          {jsonError && <p className="json-error">{jsonError}</p>}
          <div className="json-actions">
            <button
              className="btn btn-secondary"
              onClick={handleApplyJson}
              disabled={!jsonInput.trim()}
            >
              Apply JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
