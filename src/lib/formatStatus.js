/** PENDING, IN PROGRESS, COMPLETED — never mixed or lowercase in badges. */
export function formatStatusLabel(status, fallback = '—') {
  if (status === null || status === undefined || String(status).trim() === '') {
    return fallback;
  }
  return String(status).replace(/[_-]+/g, ' ').trim().toUpperCase();
}
