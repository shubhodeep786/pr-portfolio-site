import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const EASE = [0.2, 0.7, 0.2, 1];

export function usePointerCoarse() {
  const [coarse, setCoarse] = useState(true);
  useEffect(() => {
    setCoarse(matchMedia("(pointer: coarse)").matches);
  }, []);
  return coarse;
}

export function useScrollNav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 120);
      setScrolled(y > 40);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { hidden, scrolled };
}

export function Reveal({ as = "div", delay = 0, style, children, ...props }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      style={style}
      initial={reduce ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -7% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : delay / 1000 }}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Counter({ target, suffix = "", style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.7,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  return (
    <span ref={ref} style={style} className={className}>
      {display}
      {suffix}
    </span>
  );
}

const SPRING = { stiffness: 250, damping: 20, mass: 0.5 };

export function Magnetic({ as = "a", strength = 0.3, style, className, children, ...props }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const six = useSpring(ix, SPRING);
  const siy = useSpring(iy, SPRING);

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    x.set(mx * strength);
    y.set(my * (strength + 0.1));
    ix.set(mx * (strength * 0.6));
    iy.set(my * (strength * 0.6 + 0.04));
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
    ix.set(0);
    iy.set(0);
  };

  const Comp = motion[as];
  return (
    <Comp
      ref={ref}
      className={className}
      style={{ ...style, x: sx, y: sy, position: "relative" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      <motion.span style={{ display: "inline-block", x: six, y: siy }}>{children}</motion.span>
    </Comp>
  );
}

export function Tilt({ max = 6, style, className, children }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max);
    ry.set(px * (max + 1));
  };
  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const coarse = usePointerCoarse();
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.4 });
  const ry = useSpring(my, { stiffness: 300, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduce || coarse) return;
    const move = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const overCheck = (e) => setHover(!!e.target.closest("[data-cursor], a, button"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", overCheck);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", overCheck);
    };
  }, [reduce, coarse, mx, my]);

  if (reduce || coarse) return null;

  return (
    <>
      <motion.div
        style={{
          position: "fixed", top: ry, left: rx, transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(244,241,236,0.6)",
          pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference", willChange: "transform",
        }}
        animate={{
          width: hover ? 58 : 34,
          height: hover ? 58 : 34,
          background: hover ? "rgba(244,241,236,0.12)" : "rgba(244,241,236,0)",
        }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        style={{
          position: "fixed", top: my, left: mx, transform: "translate(-50%, -50%)",
          width: 5, height: 5, borderRadius: "50%", background: "#f4f1ec",
          pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference", willChange: "transform",
        }}
      />
    </>
  );
}

export function HeroLine({ text, startIndex, style }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className="hero-line" style={{ ...style, display: "block", paddingBottom: "0.04em" }}>
        {text}
      </span>
    );
  }
  return (
    <span className="hero-line" style={{ ...style, display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
      {[...text].map((ch, i) => {
        const delay = 0.25 + (startIndex + i) * 0.035;
        return (
          <motion.span
            key={i}
            style={{ display: "inline-block" }}
            initial={{ y: "112%", rotate: 5, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            transition={{
              y: { duration: 1, ease: [0.16, 1, 0.3, 1], delay },
              rotate: { duration: 1, ease: [0.16, 1, 0.3, 1], delay },
              opacity: { duration: 0.9, ease: "easeOut", delay },
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        );
      })}
    </span>
  );
}

export function MobileNav({ open, onClose, items }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed", inset: 0, zIndex: 60, background: "rgba(9,9,9,0.97)",
            backdropFilter: "blur(10px)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "clamp(20px,4vh,32px)",
          }}
          onClick={onClose}
        >
          {items.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={onClose}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
              style={{
                fontFamily: "'Bricolage Grotesque'", fontWeight: 700,
                fontSize: "clamp(28px,7vw,40px)", letterSpacing: "-0.02em", color: "var(--txt)",
              }}
            >
              {item.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
