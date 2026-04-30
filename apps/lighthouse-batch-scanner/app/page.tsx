"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { startAudit, type AuditResponse } from "../lib/api";

const product = {
  name: "Lighthouse Batch Scanner",
  status: "Running on ElysiaJS",
  eyebrow: "Decoupled Frontend + Backend",
  description:
    "Next.js frontend (Cloudflare Pages) + ElysiaJS API (Cloudflare Workers). No coupling between layers.",
  accent: "#2563eb",
  accentSoft: "#dbeafe",
  metrics: [
    ["Frontend", "Next.js 16 + React 19"],
    ["Backend", "ElysiaJS on Workers"],
    ["Deployment", "Fully Decoupled"],
  ],
  workflow: ["Enter URLs", "POST to /lighthouse/audit", "Receive jobId + poll status"],
  outputs: ["JSON from Elysia", "PDF generation", "Client-ready report"],
};

export default function Home() {
  const [urls, setUrls] = useState("");
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // DECOUPLED: Frontend calls ElysiaJS API via HTTP
      const response = await startAudit({
        urls: urls.split("\n").filter(Boolean),
        device: "desktop",
        categories: ["performance", "accessibility", "best-practices", "seo"],
      });
      setResult(response);
    } catch (error) {
      console.error("API Error:", error);
      alert(`Failed to connect to ElysiaJS backend.\n\nPlease check:\n1. Is 'turbo run dev' running?\n2. Is @dba/api#dev showing in the task list?\n3. Try opening http://localhost:8787/health in your browser`);
    } finally {
      setLoading(false);
    }
  };

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

      <section className="metrics" aria-label="Architecture">
        {product.metrics.map(([label, value]) => (
          <article className="metric" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="workspace" aria-label="API Demo">
        <article className="panel">
          <div className="panel-heading">
            <p>Live API Test</p>
            <span>POST /lighthouse/audit</span>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
            <textarea
              placeholder="Enter URLs (one per line)\nhttps://example.com\nhttps://example.org"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={5}
              style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "#94a3b8" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Calling ElysiaJS..." : "Start Audit (Calls API)"}
            </button>
          </form>
          
          {result && (
            <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", margin: "1rem" }}>
              <h4>Response from ElysiaJS:</h4>
              <pre style={{ fontSize: "0.75rem", overflow: "auto" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </article>

        <article className="panel output-panel">
          <div className="panel-heading">
            <p>Architecture</p>
            <span>Decoupled</span>
          </div>
          <div className="output-list" style={{ padding: "1rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Frontend (This Page):</strong>
              <ul>
                <li>Next.js 16.2.4 static export</li>
                <li>React 19 client components</li>
                <li>Cloudflare Pages</li>
                <li>No server-side code</li>
              </ul>
            </div>
            <div>
              <strong>Backend (ElysiaJS):</strong>
              <ul>
                <li>ElysiaJS framework</li>
                <li>Cloudflare Workers</li>
                <li>REST API only</li>
                <li>Standalone deployment</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
