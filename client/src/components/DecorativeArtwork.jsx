const KoruMotif = ({ transform }) => (
  <g
    transform={transform}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer koru silhouette */}
    <path d="M0 0C-38-9-60-40-57-76C-54-111-25-137-8-171C8-139 36-113 49-79C65-40 43-8 0 0Z" />

    {/* Inner flowing contour */}
    <path d="M0-13C-29-23-43-48-40-75C-37-99-17-120-8-143C4-119 24-98 32-74C42-48 27-23 0-13Z" />

    {/* Main spiral */}
    <path d="M-8-28C-32-39-35-65-24-83C-15-99 4-110 7-128C24-111 36-91 36-70C37-48 22-30 0-24" />

    {/* Koru curl */}
    <path d="M-8-28C-25-39-27-55-19-68C-11-81 5-86 8-101C12-115-1-126-14-120C-27-114-25-98-15-94" />

    {/* Secondary spiral */}
    <path d="M2-37C17-46 24-59 20-73C17-84 8-91 7-103" />

    {/* Inner curl detail */}
    <path d="M-12-25C-21-31-22-40-16-46C-10-52-1-48 0-42C1-37-5-35-8-39" />

    {/* Connecting stem */}
    <path d="M0 0C7 9 15 15 25 19" />
  </g>
);

export const KoruArtwork = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={`koru-artwork ${className}`}
    viewBox="0 0 1100 650"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="koru-flow-lines"
        width="350"
        height="220"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M-100 120C-20 40 55 28 125 75S240 173 320 100S420 45 470 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M-100 140C-20 60 55 48 125 95S240 193 320 120S420 65 470 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </pattern>

      <linearGradient id="koru-fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
        <stop offset="30%" stopColor="currentColor" stopOpacity=".8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
      </linearGradient>

      <mask id="koru-banner-mask">
        <rect width="1100" height="650" fill="url(#koru-fade)" />
      </mask>
    </defs>

    {/* Flowing background contours */}
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity=".65"
      mask="url(#koru-banner-mask)"
    >
      <path d="M170-80C285 0 290 90 405 115S575 120 630 215S805 310 900 255S1050 210 1170 320" />
      <path d="M145-55C260 25 265 115 380 140S550 145 605 240S780 335 875 280S1025 235 1145 345" />

      <path d="M210 140C320 210 320 295 430 320S590 320 650 415S820 505 915 450S1060 410 1170 510" />
      <path d="M185 165C295 235 295 320 405 345S565 345 625 440S795 530 890 475S1035 435 1145 535" />

      <path d="M130 370C245 435 245 525 355 550S525 550 585 640" />
      <path d="M105 395C220 460 220 550 330 575S500 575 560 665" />
    </g>

    {/* Large interlocking koru motifs */}
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <KoruMotif transform="translate(220 180) rotate(-38) scale(1.2)" />
      <KoruMotif transform="translate(420 100) rotate(43) scale(1.1)" />
      <KoruMotif transform="translate(625 195) rotate(-38) scale(1.25)" />
      <KoruMotif transform="translate(835 115) rotate(43) scale(1.12)" />
      <KoruMotif transform="translate(1040 200) rotate(-38) scale(1.25)" />

      <KoruMotif transform="translate(315 395) rotate(43) scale(1.2)" />
      <KoruMotif transform="translate(525 460) rotate(-38) scale(1.15)" />
      <KoruMotif transform="translate(745 390) rotate(43) scale(1.25)" />
      <KoruMotif transform="translate(955 470) rotate(-38) scale(1.2)" />

      <KoruMotif transform="translate(180 610) rotate(-38) scale(1.1)" />
      <KoruMotif transform="translate(610 640) rotate(43) scale(1.1)" />
      <KoruMotif transform="translate(1030 640) rotate(43) scale(1.1)" />
    </g>

    {/* Subtle repeating texture */}
    <rect
      width="1100"
      height="650"
      fill="url(#koru-flow-lines)"
      opacity=".25"
    />
  </svg>
);

export const FooterPattern = () => (
  <svg
    aria-hidden="true"
    className="koru-artwork footer-pattern"
    viewBox="0 0 1200 500"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="footer-chevron-pattern"
        width="160"
        height="80"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M-40 40L0 0L40 40L80 0L120 40L160 0M-40 80L0 40L40 80L80 40L120 80L160 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </pattern>
    </defs>

    <rect
      width="1200"
      height="500"
      fill="url(#footer-chevron-pattern)"
    />
  </svg>
);