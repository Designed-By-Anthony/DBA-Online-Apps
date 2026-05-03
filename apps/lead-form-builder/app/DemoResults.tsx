'use client';

const DEMO_EMBED = `<style>
  .dba-form { font-family: Arial, Helvetica, sans-serif; max-width: 520px; }
  .dba-form h3 { color: #172033; font-size: 20px; margin: 0 0 16px; }
  .dba-form label { color: #334155; display: block; font-size: 14px; font-weight: 700; margin: 14px 0 6px; }
  .dba-form input { border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font: inherit; padding: 10px 12px; width: 100%; }
  .dba-form button { background: #0369a1; border: none; border-radius: 8px; color: #fff; cursor: pointer; font: inherit; font-weight: 700; margin-top: 18px; padding: 12px 16px; }
</style>

<form class="dba-form" id="contact-form">
  <h3>Website Contact Form</h3>
  <label>Full Name</label>
  <input type="text" name="full-name" required />

  <label>Email</label>
  <input type="email" name="email" required />

  <label>Phone</label>
  <input type="tel" name="phone" />

  <button type="submit">Send</button>
</form>`;

export function DemoResults() {
  return (
    <section className="workspace">
      <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
        <div className="panel-heading">
          <p>Embed Preview</p>
          <span>3 fields</span>
        </div>
        <div className="result-stack">
          <pre className="code-block">{DEMO_EMBED}</pre>
        </div>
      </article>
    </section>
  );
}
