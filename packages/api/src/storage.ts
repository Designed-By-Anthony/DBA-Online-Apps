// ── R2 Storage Helpers ───────────────────────────────────────────────────────
// All public assets are stored under a consistent key convention:
//   {type}/{id}/{filename}
// e.g.  pdfs/lh-audit-abc123/report.pdf
//       embeds/map-xyz789/embed.html

const CACHE_TTL = 60 * 60 * 24; // 1 day in seconds

export function pdfKey(jobId: string): string {
  return `pdfs/${jobId}/report.pdf`;
}

export function embedKey(mapId: string): string {
  return `embeds/${mapId}/embed.html`;
}

export async function uploadPdf(
  storage: R2Bucket,
  jobId: string,
  pdf: ArrayBuffer,
): Promise<string> {
  const key = pdfKey(jobId);
  await storage.put(key, pdf, {
    httpMetadata: {
      contentType: 'application/pdf',
      cacheControl: `public, max-age=${CACHE_TTL}`,
    },
    customMetadata: { jobId, generatedAt: new Date().toISOString() },
  });
  return key;
}

export async function uploadEmbed(storage: R2Bucket, mapId: string, html: string): Promise<string> {
  const key = embedKey(mapId);
  await storage.put(key, html, {
    httpMetadata: {
      contentType: 'text/html; charset=utf-8',
      cacheControl: `public, max-age=${CACHE_TTL}`,
    },
    customMetadata: { mapId, generatedAt: new Date().toISOString() },
  });
  return key;
}

export async function getObject(storage: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  return storage.get(key);
}

export async function deleteObject(storage: R2Bucket, key: string): Promise<void> {
  await storage.delete(key);
}

// Generate a signed public URL for a private R2 object.
// In production, use a Cloudflare Worker route that serves R2 with auth checks.
// For now, returns a path that your Worker's /files/:key route will serve.
export function publicUrl(key: string, baseUrl: string): string {
  return `${baseUrl}/files/${encodeURIComponent(key)}`;
}
