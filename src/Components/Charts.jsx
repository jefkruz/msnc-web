import { useEffect, useId, useState } from 'react';

function niceMax(raw) {
  const n = Math.max(1, Number(raw) || 0);
  if (n <= 5) return n;
  const mag = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / mag) * mag;
}

function axisTicks(maxVal) {
  if (maxVal <= 4) return Array.from({ length: maxVal + 1 }, (_, i) => i);
  return [0, Math.round(maxVal / 2), maxVal];
}

function labelIndexes(length, count) {
  if (length <= count) return Array.from({ length }, (_, i) => i);
  const last = length - 1;
  if (count <= 2) return [0, last];
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(Math.round((i * last) / (count - 1)));
  }
  return [...new Set(out)];
}

function useNarrow(bp = 640) {
  const [narrow, setNarrow] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < bp : true));

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [bp]);

  return narrow;
}

export function AreaChart({ labels = [], values = [], color = '#136dec' }) {
  const uid = useId().replace(/:/g, '');
  const narrow = useNarrow();
  const safe = values.map((v) => Number(v) || 0);

  if (!safe.length) {
    return <p className="dash-chart-empty">No data yet</p>;
  }

  const pad = { top: 12, right: narrow ? 8 : 12, bottom: 28, left: narrow ? 26 : 32 };
  const w = 480;
  const h = 200;
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const maxVal = niceMax(Math.max(...safe));
  const ticks = axisTicks(maxVal);
  const step = safe.length > 1 ? innerW / (safe.length - 1) : 0;
  const points = safe.map((v, i) => {
    const x = pad.left + i * step;
    const y = pad.top + innerH - (maxVal ? (v / maxVal) * innerH : 0);
    return { x, y, v, label: labels[i] || '' };
  });
  const line = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${pad.left},${pad.top + innerH} ${line} ${pad.left + innerW},${pad.top + innerH}`;
  const shown = new Set(labelIndexes(points.length, narrow ? 3 : 5));
  const gid = `chart-fill-${uid}`;

  return (
    <div className="dash-chart-frame">
      <svg viewBox={`0 0 ${w} ${h}`} className="dash-chart-svg" role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => {
          const y = pad.top + innerH - (maxVal ? (tick / maxVal) * innerH : 0);
          return (
            <g key={tick}>
              <line x1={pad.left} x2={w - pad.right} y1={y} y2={y} className="dash-chart-rule" />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" className="dash-chart-axis">
                {tick}
              </text>
            </g>
          );
        })}
        <polygon points={area} fill={`url(#${gid})`} />
        <polyline points={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={points.length > 20 ? 1.75 : 2.75} fill={color}>
            <title>
              {p.label}: {p.v}
            </title>
          </circle>
        ))}
        {points.map((p, i) =>
          shown.has(i) ? (
            <text key={`l-${i}`} x={p.x} y={h - 8} textAnchor="middle" className="dash-chart-axis">
              {p.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

export function StatBars({ labels = [], values = [], color = '#136dec' }) {
  const safe = values.map((v) => Number(v) || 0);
  if (!labels.length) {
    return <p className="dash-chart-empty">No data yet</p>;
  }
  const maxVal = Math.max(1, ...safe);

  return (
    <div className="dash-hbar">
      {labels.map((label, i) => (
        <div key={`${label}-${i}`} className="dash-hbar__row">
          <span className="dash-hbar__label" title={label}>
            {label}
          </span>
          <div className="dash-hbar__track">
            <div
              className="dash-hbar__fill"
              style={{
                width: `${(safe[i] / maxVal) * 100}%`,
                minWidth: safe[i] > 0 ? 6 : 0,
                background: color,
              }}
            />
          </div>
          <span className="dash-hbar__value">{safe[i]}</span>
        </div>
      ))}
    </div>
  );
}
