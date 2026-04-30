import type { CSSProperties } from "react";

const product = {
  name: "Cold Outreach Sequencer",
  status: "Coming Soon",
  eyebrow: "Agency prospecting workflow",
  description:
    "Personalized email sequences for web design agencies targeting local service businesses.",
  accent: "#c2410c",
  accentSoft: "#ffedd5",
  metrics: [
    ["Segments", "Local services"],
    ["Sequence", "Personalized"],
    ["Goal", "Booked calls"],
  ],
  workflow: ["Import prospects", "Personalize messages", "Schedule follow-ups"],
  outputs: ["Sequence draft", "Prospect status", "Reply tracking"],
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
