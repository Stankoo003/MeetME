interface LightboxProps {
  src: string | null
  alt: string
  onClose: () => void
}

export function Lightbox({ src, alt, onClose }: LightboxProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10500,
        display: src ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'rgba(10,12,18,0.72)',
        backdropFilter: 'saturate(150%) blur(6px)',
        WebkitBackdropFilter: 'saturate(150%) blur(6px)',
        cursor: 'zoom-out',
        animation: 'spotpop .16s ease',
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: 'min(1100px, 92vw)',
            maxHeight: '86vh',
            borderRadius: 12,
            boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  )
}
