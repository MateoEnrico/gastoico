import { useEffect, useRef } from "react";

export function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onResize    = () => resize();
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseOut  = ()  => { mouse.x = -9999;     mouse.y = -9999; };

    window.addEventListener("resize",    onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout",  onMouseOut);

    const mkParticle = () => ({
      x:       Math.random() * canvas.width,
      y:       canvas.height + Math.random() * canvas.height * 0.5,
      r:       1.5 + Math.random() * 4.5,
      vy:      -(0.35 + Math.random() * 0.65),
      vx:      (Math.random() - 0.5) * 0.2,
      alpha:   0.25 + Math.random() * 0.55,
      wobble:  Math.random() * Math.PI * 2,
      wSpeed:  0.008 + Math.random() * 0.016,
    });

    const particles = Array.from({ length: 100 }, mkParticle);

    const MOUSE_R = 200;

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Drift + wobble
        p.wobble += p.wSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.22;
        p.y += p.vy;

        // Mouse repulsion
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_R && dist > 0) {
          const force = ((MOUSE_R - dist) / MOUSE_R) * 2.2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Recycle off-screen
        if (p.y < -20 || p.x < -40 || p.x > canvas.width + 40) {
          Object.assign(p, mkParticle());
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        // Draw with glow
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur  = p.r * 4;
        ctx.shadowColor = "#efac3b";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#efac3b";
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout",  onMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  );
}
