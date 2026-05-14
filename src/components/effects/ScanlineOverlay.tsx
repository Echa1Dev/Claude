'use client'

export default function ScanlineOverlay() {
  return (
    <>
      {/* CRT scanlines */}
      <div className="scanlines" aria-hidden="true" />

      {/* Moving scan line */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.3), transparent)',
          animation: 'scanline 8s linear infinite',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
