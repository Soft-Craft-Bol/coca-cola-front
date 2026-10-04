// Ilustraciones pequeñas y decorativas hechas en SVG; no contienen datos ni códigos reales
const RED = '#F40009'
const SOFT = '#FFD9DB'
const LINE = '#E3E4E8'

function Svg({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 120 120" role="presentation" aria-hidden="true" focusable="false">{children}</svg>
}

const Phone = ({ x = 34, y = 8, w = 52, h = 100 }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx="9" fill="#fff" stroke={LINE} strokeWidth="2" />
    <rect x={x + w / 2 - 8} y={y + 4} width="16" height="3" rx="1.5" fill={LINE} />
  </>
)

export const TicketIllustration = () => (
  <Svg>
    <Phone />
    <rect x="42" y="26" width="36" height="14" rx="3" fill={RED} />
    <rect x="46" y="31" width="14" height="3" rx="1.5" fill="#fff" />
    <rect x="42" y="46" width="36" height="40" rx="4" fill="#F7F7F8" />
    {[0, 1, 2].map(r => [0, 1, 2].map(c => (
      <rect key={`${r}${c}`} x={48 + c * 10} y={52 + r * 10} width="7" height="7" rx="1.5" fill="#171717" opacity={(r + c) % 2 ? 0.85 : 0.35} />
    )))}
    <rect x="42" y="92" width="36" height="8" rx="4" fill={SOFT} />
  </Svg>
)

export const ScannerIllustration = () => (
  <Svg>
    <rect x="76" y="14" width="30" height="88" rx="6" fill="#F0F0F2" stroke={LINE} strokeWidth="2" />
    <rect x="82" y="26" width="18" height="6" rx="3" fill={RED} />
    <rect x="82" y="40" width="18" height="30" rx="3" fill="#fff" stroke={LINE} />
    <rect x="12" y="34" width="46" height="76" rx="8" fill="#fff" stroke={LINE} strokeWidth="2" />
    <rect x="22" y="46" width="26" height="26" rx="3" fill="#F7F7F8" />
    <path d="M26 56h18M26 62h18M26 68h12" stroke="#171717" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <path d="M60 52h10" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
  </Svg>
)

export const CupIllustration = () => (
  <Svg>
    <ellipse cx="60" cy="108" rx="26" ry="4" fill="#000" opacity="0.06" />
    <path d="M36 40h48l-5 64a5 5 0 0 1-5 4H46a5 5 0 0 1-5-4z" fill={RED} />
    <path d="M36 40h48l-1 12H37z" fill="#C70007" />
    <rect x="32" y="34" width="56" height="8" rx="4" fill="#fff" stroke={LINE} />
    <path d="M60 62c-6 0-10 4-10 8s4 8 10 8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    <rect x="62" y="12" width="4" height="26" rx="2" fill="#171717" transform="rotate(14 64 25)" />
  </Svg>
)

export const PanelIllustration = () => (
  <Svg>
    <rect x="10" y="22" width="100" height="76" rx="10" fill="#fff" stroke={LINE} strokeWidth="2" />
    <rect x="20" y="32" width="30" height="5" rx="2.5" fill={LINE} />
    {[14, 26, 20, 38, 30, 46].map((h, i) => (
      <rect key={i} x={22 + i * 14} y={90 - h} width="9" height={h} rx="2.5" fill={RED} opacity={0.35 + i * 0.13} />
    ))}
  </Svg>
)

export const SurveyIllustration = () => (
  <Svg>
    <rect x="8" y="26" width="104" height="68" rx="10" fill="#fff" stroke={LINE} strokeWidth="2" />
    <rect x="20" y="38" width="52" height="5" rx="2.5" fill={LINE} />
    {[0, 1, 2, 3, 4].map(i => (
      <path
        key={i}
        transform={`translate(${20 + i * 18} 54)`}
        d="M8 0l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L8 12.4 3 15.2l1.2-5.6L0 5.8l5.6-.6z"
        fill={i < 4 ? RED : LINE}
      />
    ))}
    <rect x="20" y="78" width="40" height="6" rx="3" fill={SOFT} />
  </Svg>
)

export const ReportIllustration = () => (
  <Svg>
    <rect x="10" y="12" width="100" height="96" rx="10" fill="#fff" stroke={LINE} strokeWidth="2" />
    <rect x="20" y="22" width="34" height="5" rx="2.5" fill={LINE} />
    {[16, 28, 20, 34, 24].map((h, i) => (
      <rect key={i} x={20 + i * 11} y={64 - h} width="7" height={h} rx="2" fill={RED} opacity={0.4 + i * 0.12} />
    ))}
    <circle cx="82" cy="84" r="15" fill="none" stroke={LINE} strokeWidth="9" />
    <circle cx="82" cy="84" r="15" fill="none" stroke={RED} strokeWidth="9" strokeDasharray="60 100" transform="rotate(-90 82 84)" />
    <rect x="20" y="82" width="34" height="5" rx="2.5" fill={LINE} />
    <rect x="20" y="92" width="24" height="5" rx="2.5" fill={SOFT} />
  </Svg>
)
