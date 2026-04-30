import type { CSSProperties } from "react";

const product = {
  name: "Service Area Map Generator",
  status: "Coming Soon",
  eyebrow: "Location page workflow",
  description:
    "Generate embeddable service-area maps optimized for local SEO signals.",
  accent: "#be123c",
  accentSoft: "#ffe4e6",
  metrics: [
    ["Map type", "Embeddable"],
    ["SEO target", "Service areas"],
    ["Output", "Location embed"],
  ],
  workflow: ["Add service cities", "Shape coverage zones", "Generate embed code"],
  outputs: ["Map preview", "Embed snippet", "Local SEO signals"],
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
