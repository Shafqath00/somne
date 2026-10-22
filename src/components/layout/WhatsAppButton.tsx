import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';

type Position = { x: number; y: number };

function keepOnScreen(position: Position, width: number, height: number): Position {
  return {
    x: Math.max(8, Math.min(position.x, window.innerWidth - width - 8)),
    y: Math.max(8, Math.min(position.y, window.innerHeight - height - 8)),
  };
}

export function WhatsAppButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: Position;
  } | null>(null);
  const suppressClick = useRef(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition((current) => current ? keepOnScreen(current, rect.width, rect.height) : null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    suppressClick.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: { x: rect.left, y: rect.top },
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!suppressClick.current && Math.hypot(dx, dy) < 6) return;
    suppressClick.current = true;
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition(keepOnScreen({ x: drag.origin.x + dx, y: drag.origin.y + dy }, rect.width, rect.height));
  };

  const finishDrag = (event: PointerEvent<HTMLAnchorElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <a
      ref={buttonRef}
      href="https://wa.me/447496725723"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Somne on WhatsApp (opens in a new tab)"
      title="Click to chat on WhatsApp, or drag to move"
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onLostPointerCapture={finishDrag}
      onClick={(event) => {
        if (suppressClick.current && event.detail !== 0) event.preventDefault();
      }}
      style={position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : undefined}
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 touch-none select-none items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128C7E] focus-visible:ring-offset-2 md:bottom-6 md:right-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.58 0 11.93-5.35 11.94-11.93a11.85 11.85 0 0 0-3.48-8.42ZM12.06 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.87 9.87 0 0 1-1.51-5.25c0-5.47 4.45-9.92 9.93-9.92a9.85 9.85 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.48-4.45 9.93-9.97 9.86Zm5.45-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
