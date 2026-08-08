const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthName(month) {
  if (month === null || month === undefined || month === '') return '';
  const n = Number(month);
  if (n >= 1 && n <= 12) return MONTHS[n - 1];
  const raw = String(month).trim();
  const found = MONTHS.find((name) => name.toLowerCase().startsWith(raw.toLowerCase().slice(0, 3)));
  return found || raw;
}

export function parseDate(value) {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const str = String(value).trim();
  if (!str || str === '0000-00-00' || str === '0000-00-00 00:00:00') return null;

  const isoDate = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
  }

  const isoDateTime = str.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (isoDateTime) {
    return new Date(
      Number(isoDateTime[1]),
      Number(isoDateTime[2]) - 1,
      Number(isoDateTime[3]),
      Number(isoDateTime[4]),
      Number(isoDateTime[5]),
      Number(isoDateTime[6] || 0),
    );
  }

  const slash = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (slash) {
    return new Date(
      Number(slash[3]),
      Number(slash[2]) - 1,
      Number(slash[1]),
      Number(slash[4] || 0),
      Number(slash[5] || 0),
      Number(slash[6] || 0),
    );
  }

  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTime(date) {
  return date
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s+/g, ' ');
}

function formatDatePart(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function hasDisplayableTime(value, date) {
  const raw = String(value ?? '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    return /[T ]\d{2}:\d{2}/.test(raw) && !/[T ]00:00(?::00)?/.test(raw);
  }
  return true;
}

/** 20 January 2026 */
export function formatDate(value, fallback = '—') {
  const date = parseDate(value);
  if (!date) return fallback;
  return formatDatePart(date);
}

/** 20 January 2026 at 8:33 PM */
export function formatDateTime(value, fallback = '—') {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${formatDatePart(date)} at ${formatTime(date)}`;
}

/** Date only, or date + time when a real time is present. */
export function formatDisplayDate(value, fallback = '—') {
  const date = parseDate(value);
  if (!date) return fallback;
  return hasDisplayableTime(value, date) ? formatDateTime(value, fallback) : formatDate(value, fallback);
}
