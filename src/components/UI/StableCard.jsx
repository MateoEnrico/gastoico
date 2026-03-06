import { useRef, useLayoutEffect } from 'react';

export function StableCard({ children }) {
  const ref   = useRef(null);
  const maxH  = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.minHeight = '';           // reset para medir el alto natural
    const h = el.offsetHeight;
    if (h > maxH.current) maxH.current = h;
    el.style.minHeight = maxH.current + 'px';
  });

  return <div ref={ref} className="cont-prod">{children}</div>;
}
