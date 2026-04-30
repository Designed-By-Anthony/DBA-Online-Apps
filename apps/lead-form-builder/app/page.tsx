import type { CSSProperties } from "react";

const product = {
  name: "Lead Form Builder",
  status: "Coming Soon",
  eyebrow: "Conversion capture workflow",
  description:
    "Drag-and-drop smart forms with reCAPTCHA, Zapier hooks, and CRM-ready JSON output.",
  accent: "#7c3aed",
  accentSoft: "#ede9fe",
  metrics: [
    ["Builder", "Drag and drop"],
    ["Protection", "reCAPTCHA"],
    ["Export", "CRM-ready JSON"],
  ],
  workflow: ["Design the form", "Map fields to CRM data", "Publish the embed"],
  outputs: ["Form schema", "Zapier payload", "Conversion handoff"],
};

export default function Home() {
  return (
    <main
      className="product-shell"
      style={
        {
          "--accent": product.accent,
          "--accent-soft": product.accentSoft,
        } as CSSProperties
      }
    >
      <section className="hero">
        <div>
          <p className="eyebrow">{product.eyebrow}</p>
          <h1>{product.name}</h1>
          <p className="summary">{product.description}</p>
        </div>
        <span className="status">{product.status}</span>
      </section>

      <section className="metrics" aria-label="Product snapshot">
        {product.metrics.map(([label, value]) => (
          <article className="metric" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="workspace" aria-label="Product workflow">
        <article className="panel">
          <div className="panel-heading">
            <p>Workflow</p>
            <span>v0.1</span>
          </div>
          <ol className="steps">
            {product.workflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="panel output-panel">
          <div className="panel-heading">
            <p>Output</p>
            <span>Preview</span>
          </div>
          <div className="output-list">
            {product.outputs.map((output) => (
              <span key={output}>{output}</span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
