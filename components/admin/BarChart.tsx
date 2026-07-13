// Bağımlılıksız, sunucu-taraflı SVG çubuk grafik. Günlük zaman serileri için.
// İki seriyi (ör. aday/işveren) gruplanmış çubuk olarak üst üste gösterebilir.

export interface Series {
  label: string; // renk için anahtar
  color: string; // CSS renk (tailwind token değil, doğrudan hex/var)
  values: number[];
}

interface Props {
  labels: string[]; // x ekseni etiketleri (her N'inci gösterilir)
  series: Series[];
  height?: number;
}

export default function BarChart({ labels, series, height = 140 }: Props) {
  const n = labels.length;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const W = 720;
  const padL = 26;
  const padB = 18;
  const padT = 6;
  const chartH = height - padB - padT;
  const slot = (W - padL) / n; // her gün için yatay dilim
  const groupW = slot * 0.7;
  const barW = groupW / series.length;

  const yTicks = [0, Math.round(max / 2), max];

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      role="img"
    >
      {/* yatay ızgara + y etiketleri */}
      {yTicks.map((t, i) => {
        const y = padT + chartH - (t / max) * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W} y2={y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
            <text x={0} y={y + 3} fontSize="9" fill="currentColor" fillOpacity="0.4" fontFamily="ui-monospace, monospace">
              {t}
            </text>
          </g>
        );
      })}

      {/* çubuklar */}
      {labels.map((_, i) => {
        const gx = padL + i * slot + (slot - groupW) / 2;
        return series.map((s, si) => {
          const v = s.values[i] ?? 0;
          const h = (v / max) * chartH;
          const x = gx + si * barW;
          const y = padT + chartH - h;
          return (
            <rect
              key={`${i}-${si}`}
              x={x + 0.5}
              y={y}
              width={Math.max(1, barW - 1)}
              height={h}
              rx={Math.min(2, barW / 3)}
              fill={s.color}
            />
          );
        });
      })}

      {/* x etiketleri — yaklaşık 6 tane */}
      {labels.map((lb, i) => {
        const step = Math.ceil(n / 6);
        if (i % step !== 0 && i !== n - 1) return null;
        const x = padL + i * slot + slot / 2;
        return (
          <text
            key={`x-${i}`}
            x={x}
            y={height - 5}
            fontSize="9"
            textAnchor="middle"
            fill="currentColor"
            fillOpacity="0.45"
            fontFamily="ui-monospace, monospace"
          >
            {lb}
          </text>
        );
      })}
    </svg>
  );
}
