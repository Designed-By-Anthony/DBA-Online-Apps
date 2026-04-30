import type { CSSProperties } from "react";

const product = {
  name: "Local SEO Audit Kit",
  status: "Coming Soon",
  eyebrow: "Local visibility workflow",
  description:
    "Google Business Profile checks, citation consistency reporting, and schema validation in one workflow.",
  accent: "#0f766e",
  accentSoft: "#ccfbf1",
  metrics: [
    ["Profile checks", "GBP coverage"],
    ["Citation scan", "NAP consistency"],
    ["Schema review", "LocalBusiness"],
  ],
  workflow: ["Enter business details", "Compare citations", "Validate schema"],
  outputs: ["Local SEO score", "Citation mismatch list", "Schema fixes"],
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
