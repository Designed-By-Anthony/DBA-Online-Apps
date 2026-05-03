'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

type FieldType = 'text' | 'email' | 'tel' | 'textarea';

type LeadField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
};

const FIELD_OPTIONS: FieldType[] = ['text', 'email', 'tel', 'textarea'];

function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function fieldHtml(field: LeadField): string {
  const required = field.required ? ' required' : '';
  const name = toSlug(field.label) || field.id;

  if (field.type === 'textarea') {
    return `  <label>${field.label}</label>\n  <textarea name="${name}"${required}></textarea>`;
  }

  return `  <label>${field.label}</label>\n  <input type="${field.type}" name="${name}"${required} />`;
}

export default function Home() {
  const [formName, setFormName] = useState('Website Contact Form');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/123456/abcde');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [required, setRequired] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState<LeadField[]>([
    { id: 'full-name', label: 'Full Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
  ]);

  const addField = () => {
    const label = fieldLabel.trim();
    if (!label) return;

    setFields((prev) => [
      ...prev,
      {
        id: `${toSlug(label) || 'field'}-${prev.length + 1}`,
        label,
        type: fieldType,
        required,
      },
    ]);
    setFieldLabel('');
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const embedCode = useMemo(() => {
    const formId = toSlug(formName) || 'dba-lead-form';
    const safeWebhook = webhookUrl.trim() || 'https://example.com/webhook';
    const fieldsMarkup = fields.map(fieldHtml).join('\n\n');

    return `<style>
  .dba-form { font-family: Arial, Helvetica, sans-serif; max-width: 520px; }
  .dba-form h3 { color: #172033; font-size: 20px; margin: 0 0 16px; }
  .dba-form label { color: #334155; display: block; font-size: 14px; font-weight: 700; margin: 14px 0 6px; }
  .dba-form input, .dba-form textarea { border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font: inherit; padding: 10px 12px; width: 100%; }
  .dba-form textarea { min-height: 100px; resize: vertical; }
  .dba-form button { background: #0369a1; border: none; border-radius: 8px; color: #fff; cursor: pointer; font: inherit; font-weight: 700; margin-top: 18px; padding: 12px 16px; }
  .dba-form button:hover { background: #075985; }
  .dba-success { color: #166534; font-weight: 700; margin-top: 12px; }
</style>

<form class="dba-form" id="${formId}">
  <h3>${formName}</h3>
${fieldsMarkup}

  <button type="submit">Send</button>
  <p id="${formId}-status" class="dba-success" style="display:none;">Thanks, we got your message.</p>
</form>

<script>
  document.getElementById('${formId}').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = this;
    const status = document.getElementById('${formId}-status');
    const payload = Object.fromEntries(new FormData(form));

    try {
      await fetch('${safeWebhook}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      form.reset();
      status.style.display = 'block';
    } catch (err) {
      alert('Could not send form. Please check your webhook URL.');
    }
  });
</script>`;
  }, [fields, formName, webhookUrl]);

  const copyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      <div className="dba-topbar">
        <a
          className="dba-topbar-brand"
          href="https://designedbyanthony.com"
          target="_blank"
          rel="noreferrer"
        >
          DBA
        </a>
        <span className="dba-topbar-sep">/</span>
        <span className="dba-topbar-name">Lead Form Builder</span>
      </div>

      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Lead Capture Tool</p>
            <h1>Build a contact form in minutes.</h1>
            <p className="summary">
              Drop it on your website, get leads emailed or sent wherever you want.
            </p>
          </div>
          <span className="status">Ready to Embed</span>
        </section>

        <section className="workspace">
          <article className="panel">
            <div className="panel-heading">
              <p>Form Builder</p>
              <span>{fields.length} fields</span>
            </div>

            <div className="tool-form">
              <label className="field">
                Form Name
                <input
                  className="text-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </label>

              <label className="field">
                Webhook URL
                <input
                  className="text-input"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/..."
                />
              </label>

              <div className="form-grid three-col">
                <label className="field">
                  Field Label
                  <input
                    className="text-input"
                    value={fieldLabel}
                    onChange={(e) => setFieldLabel(e.target.value)}
                    placeholder="Phone Number"
                  />
                </label>

                <label className="field">
                  Type
                  <select
                    className="text-input"
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value as FieldType)}
                  >
                    {FIELD_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="checkbox-row" style={{ marginTop: 26 }}>
                  <input
                    type="checkbox"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                  />
                  Required
                </label>
              </div>

              <div className="action-row">
                <button type="button" className="primary-button" onClick={addField}>
                  Add Field
                </button>
              </div>

              <ul className="list">
                {fields.map((field) => (
                  <li key={field.id} className="item-row">
                    <span>
                      {field.label} · {field.type} · {field.required ? 'required' : 'optional'}
                    </span>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeField(field.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="panel output-panel">
            <div className="panel-heading">
              <p>Embed Code</p>
              <button
                type="button"
                className={`copy-button${copied ? ' copied' : ''}`}
                onClick={copyEmbed}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <p className="muted-note">Paste this anywhere in your website&apos;s HTML.</p>
            <pre className="code-block">{embedCode}</pre>
          </article>
        </section>
      </main>

      <footer className="dba-footer">
        <div className="dba-footer-inner">
          <p>
            <strong>Designed by Anthony</strong> tools built for real client work.
          </p>
          <a
            className="dba-footer-link"
            href="https://designedbyanthony.online"
            target="_blank"
            rel="noreferrer"
          >
            designedbyanthony.online
          </a>
        </div>
      </footer>
    </>
  );
}
