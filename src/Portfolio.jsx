import { useEffect, useRef } from "react";

export default function Portfolio() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];
    let cursorEls = [];

    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts);
      cleanups.push(() => target.removeEventListener(ev, fn, opts));
    };

    function initReveal() {
      const els = [...root.querySelectorAll("[data-reveal]")];
      if (reduce) {
        els.forEach((el) => {
          el.style.opacity = 1;
          el.style.transform = "none";
        });
        return;
      }
      const io = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (e.isIntersecting) {
              const el = e.target;
              el.style.transitionDelay = (parseFloat(el.dataset.delay || 0)) + "ms";
              el.style.opacity = 1;
              el.style.transform = "none";
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
      );
      els.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    function initCounters() {
      const els = [...root.querySelectorAll("[data-count]")];
      const run = (el) => {
        const target = parseFloat(el.dataset.count);
        const suf = el.dataset.suffix || "";
        if (reduce) {
          el.textContent = target + suf;
          return;
        }
        const dur = 1700,
          t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (e.isIntersecting) {
              run(e.target);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      els.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    function initBars() {
      const els = [...root.querySelectorAll("[data-bar]")];
      const io = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (e.isIntersecting) {
              const el = e.target;
              if (reduce) el.style.transition = "none";
              el.style.width = el.dataset.pct + "%";
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.4 }
      );
      els.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    function initKeywords() {
      root.querySelectorAll(".kw").forEach((btn) => {
        on(btn, "click", () => {
          const open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!open));
          const body = btn.parentElement.querySelector(".kw-body");
          const word = btn.querySelector(".kw-word");
          const plus = btn.querySelector(".kw-plus");
          body.style.maxHeight = open ? "0px" : body.scrollHeight + "px";
          plus.style.transform = open ? "rotate(0deg)" : "rotate(45deg)";
          plus.style.color = open ? "var(--muted)" : "var(--warm)";
          word.style.transform = open ? "translateX(0)" : "translateX(14px)";
          word.style.color = open ? "var(--txt)" : "var(--warm)";
        });
        on(btn, "mouseenter", () => {
          if (btn.getAttribute("aria-expanded") === "true") return;
          btn.querySelector(".kw-word").style.transform = "translateX(14px)";
        });
        on(btn, "mouseleave", () => {
          if (btn.getAttribute("aria-expanded") === "true") return;
          btn.querySelector(".kw-word").style.transform = "translateX(0)";
        });
      });
    }

    function initSkills() {
      const pills = [...root.querySelectorAll(".pill")];
      const title = root.querySelector("[data-skill-title]");
      const desc = root.querySelector("[data-skill-desc]");
      const setActive = (p) => {
        pills.forEach((x) => {
          x.style.background = "rgba(255,255,255,0.04)";
          x.style.color = "var(--muted)";
          x.style.borderColor = "rgba(255,255,255,0.1)";
        });
        p.style.background = "rgba(255,255,255,0.1)";
        p.style.color = "var(--txt)";
        p.style.borderColor = "rgba(255,255,255,0.4)";
        if (title && desc) {
          title.textContent = p.dataset.skill;
          desc.textContent = p.dataset.desc;
        }
      };
      pills.forEach((p) => {
        on(p, "click", () => setActive(p));
        if (!reduce) {
          on(p, "mouseenter", () => {
            p.style.transform = "translateY(-3px)";
          });
          on(p, "mouseleave", () => {
            p.style.transform = "translateY(0)";
          });
        }
      });
    }

    function initNav() {
      const nav = root.querySelector("[data-nav]");
      if (!nav) return;
      let last = window.scrollY,
        ticking = false;
      const update = () => {
        const y = window.scrollY;
        if (y > last && y > 120) nav.style.transform = "translateY(-130%)";
        else nav.style.transform = "translateY(0)";
        if (y > 40) {
          nav.style.background = "rgba(9,9,9,0.45)";
          nav.style.backdropFilter = "blur(14px)";
        } else {
          nav.style.background = "transparent";
          nav.style.backdropFilter = "none";
        }
        last = y;
        ticking = false;
      };
      on(
        window,
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
          }
        },
        { passive: true }
      );
    }

    function initHeroSplit() {
      const lines = [...root.querySelectorAll(".hero-line")];
      let idx = 0;
      lines.forEach((line) => {
        const text = line.textContent;
        line.textContent = "";
        [...text].forEach((ch) => {
          const s = document.createElement("span");
          s.textContent = ch === " " ? "\u00A0" : ch;
          s.style.display = "inline-block";
          s.style.transform = "translateY(112%) rotate(5deg)";
          s.style.opacity = "0";
          s.style.transition = "transform 1s cubic-bezier(.16,1,.3,1), opacity .9s ease";
          s.style.transitionDelay = (0.25 + idx * 0.035) + "s";
          line.appendChild(s);
          idx++;
        });
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.querySelectorAll(".hero-line span").forEach((s) => {
            s.style.transform = "none";
            s.style.opacity = "1";
          });
        });
      });
    }

    function initCursor() {
      if (matchMedia("(pointer: coarse)").matches) {
        root.style.cursor = "auto";
        return;
      }
      const ring = document.createElement("div");
      ring.style.cssText =
        "position:fixed;top:0;left:0;width:34px;height:34px;border:1px solid rgba(244,241,236,0.6);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s,border-color .25s;mix-blend-mode:difference;will-change:transform";
      const dot = document.createElement("div");
      dot.style.cssText =
        "position:fixed;top:0;left:0;width:5px;height:5px;background:#f4f1ec;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:difference;will-change:transform";
      document.body.appendChild(ring);
      document.body.appendChild(dot);
      cursorEls = [ring, dot];
      cleanups.push(() => {
        ring.remove();
        dot.remove();
      });
      let mx = innerWidth / 2,
        my = innerHeight / 2,
        rx = mx,
        ry = my;
      on(window, "mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      });
      let raf;
      const loop = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        raf = requestAnimationFrame(loop);
      };
      loop();
      cleanups.push(() => cancelAnimationFrame(raf));
      const grow = () => {
        ring.style.width = "58px";
        ring.style.height = "58px";
        ring.style.background = "rgba(244,241,236,0.12)";
      };
      const shrink = () => {
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.background = "transparent";
      };
      root.querySelectorAll("[data-cursor], a, button").forEach((el) => {
        on(el, "mouseenter", grow);
        on(el, "mouseleave", shrink);
      });
    }

    function initMagnetic() {
      root.querySelectorAll(".magnetic").forEach((el) => {
        const inner = el.querySelector(".magnetic-inner") || el;
        el.style.transition = "transform .35s cubic-bezier(.2,.7,.2,1)";
        inner.style.transition = "transform .35s cubic-bezier(.2,.7,.2,1)";
        on(el, "mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
          inner.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
        });
        on(el, "mouseleave", () => {
          el.style.transform = "translate(0,0)";
          inner.style.transform = "translate(0,0)";
        });
      });
    }

    function initTilt() {
      root.querySelectorAll(".tilt").forEach((wrap) => {
        const card = wrap.querySelector(".jcard") || wrap;
        const inner = wrap.querySelector(".note > div");
        const t = inner || card;
        on(wrap, "mousemove", (e) => {
          const r = wrap.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          t.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 6}deg) translateY(-4px)`;
          if (card.classList && card.classList.contains("jcard") && !inner) {
            card.style.borderColor = "rgba(244,241,236,0.28)";
          }
        });
        on(wrap, "mouseleave", () => {
          t.style.transform = "";
          if (!inner) card.style.borderColor = "";
        });
      });
    }

    function initParallax() {
      const blobs = [...root.querySelectorAll(".blob")];
      let raf,
        tx = 0,
        ty = 0,
        cx = 0,
        cy = 0;
      on(window, "mousemove", (e) => {
        tx = e.clientX / innerWidth - 0.5;
        ty = e.clientY / innerHeight - 0.5;
      });
      const loop = () => {
        cx += (tx - cx) * 0.05;
        cy += (ty - cy) * 0.05;
        blobs.forEach((b) => {
          const d = parseFloat(b.dataset.depth || 20);
          b.style.marginLeft = cx * d + "px";
          b.style.marginTop = cy * d + "px";
        });
        raf = requestAnimationFrame(loop);
      };
      loop();
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    initReveal();
    initCounters();
    initBars();
    initKeywords();
    initSkills();
    initNav();

    if (reduce) {
      root.querySelectorAll(".hero-line").forEach((l) => {
        l.style.opacity = 1;
      });
    } else {
      initHeroSplit();
      initCursor();
      initMagnetic();
      initTilt();
      initParallax();
    }

    return () => {
      cleanups.forEach((fn) => fn());
      cursorEls.forEach((e) => e.remove());
    };
  }, []);

  return (
<div ref={rootRef} style={{position: 'relative', background: '#090909', color: '#f4f1ec', fontFamily: "'Space Grotesk',sans-serif", '--warm': 'oklch(0.83 0.13 66)', '--pink': 'oklch(0.8 0.14 350)', '--green': 'oklch(0.85 0.11 150)', '--txt': '#f4f1ec', '--muted': 'rgba(244,241,236,0.52)', '--line': 'rgba(244,241,236,0.1)', minHeight: '100vh', overflow: 'hidden', cursor: 'none'}}>

  
  <div style={{position: 'fixed', inset: '0', zIndex: '0', pointerEvents: 'none', overflow: 'hidden'}}>
    <div className="blob" data-depth="40" style={{position: 'absolute', top: '-12vh', left: '-8vw', width: '48vw', height: '48vw', background: 'radial-gradient(circle at 35% 35%, oklch(0.83 0.13 66 / 0.5), transparent 62%)', filter: 'blur(60px)', animation: 'blobFloat 22s ease-in-out infinite, blobMorph 16s ease-in-out infinite'}}></div>
    <div className="blob" data-depth="-30" style={{position: 'absolute', bottom: '-18vh', right: '-10vw', width: '52vw', height: '52vw', background: 'radial-gradient(circle at 60% 40%, oklch(0.8 0.14 350 / 0.42), transparent 60%)', filter: 'blur(70px)', animation: 'blobFloat 28s ease-in-out infinite reverse, blobMorph 19s ease-in-out infinite'}}></div>
    <div className="blob" data-depth="24" style={{position: 'absolute', top: '40%', left: '55%', width: '34vw', height: '34vw', background: 'radial-gradient(circle at 50% 50%, oklch(0.85 0.11 150 / 0.3), transparent 62%)', filter: 'blur(64px)', animation: 'blobFloat 25s ease-in-out infinite, blobMorph 21s ease-in-out infinite'}}></div>
  </div>
  
  <div style={{position: 'fixed', inset: '0', zIndex: '1', pointerEvents: 'none', opacity: '0.05', mixBlendMode: 'soft-light', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}></div>

  
  <nav data-nav="" style={{position: 'fixed', top: '0', left: '0', right: '0', zIndex: '50', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px,5vw,64px)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1), background .4s, backdrop-filter .4s', mixBlendMode: 'difference'}}>
    <a href="#top" data-cursor="" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: '19px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px'}}>
      <span style={{display: 'inline-block', width: '11px', height: '11px', borderRadius: '50%', background: '#fff'}}></span>Payal&nbsp;Raut
    </a>
    <div style={{display: 'flex', gap: 'clamp(14px,2.4vw,34px)', fontSize: '13.5px', letterSpacing: '0.01em', alignItems: 'center'}} data-navlinks="">
      <a href="#think" data-cursor="" style={{opacity: '.85'}}>Think</a>
      <a href="#journey" data-cursor="" style={{opacity: '.85'}}>Journey</a>
      <a href="#skills" data-cursor="" style={{opacity: '.85'}}>Skills</a>
      <a href="#work" data-cursor="" style={{opacity: '.85'}}>Work</a>
      <a href="#contact" data-cursor="" style={{opacity: '.85'}}>Contact</a>
    </div>
  </nav>

  
  <header id="top" style={{position: 'relative', zIndex: '2', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(20px,5vw,64px)', paddingBottom: 'clamp(64px,11vh,100px)', paddingTop: 'clamp(64px,11vh,100px)'}}>
    <div className="hero-copy" style={{position: 'relative'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px,3vh,40px)', fontFamily: "'JetBrains Mono'", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)'}}>
        <span style={{width: '26px', height: '1px', background: 'var(--muted)', display: 'inline-block'}}></span>
        Marketing &amp; Business Development Analyst — Indore, IN
      </div>
      <h1 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', lineHeight: '0.88', letterSpacing: '-0.04em', fontSize: 'clamp(58px,15vw,232px)', textTransform: 'uppercase', margin: '0'}}>
        <span className="hero-line" style={{display: 'block', overflow: 'hidden', paddingBottom: '0.04em'}}>Marketing</span>
        <span className="hero-line" style={{display: 'block', overflow: 'hidden', paddingBottom: '0.04em'}}>that</span>
        <span className="hero-line" style={{display: 'block', overflow: 'hidden', paddingBottom: '0.04em', background: 'linear-gradient(100deg,var(--warm),var(--pink) 55%,var(--green))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic', fontFamily: "'Instrument Serif',serif", fontWeight: '400', textTransform: 'none', letterSpacing: '-0.01em'}}>connects.</span>
      </h1>
      <p style={{maxWidth: '560px', marginTop: 'clamp(16px,3vh,48px)', fontSize: 'clamp(15px,1.5vw,21px)', lineHeight: '1.5', color: 'rgba(244,241,236,0.78)'}}>
        Hi, I'm Payal. I enjoy building campaigns that people actually care about —
        strategy, content and data woven into work that earns attention instead of buying it.
      </p>
    </div>
    <div style={{position: 'absolute', bottom: '34px', left: 'clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)'}}>
      <span className="scroll-dot" style={{display: 'inline-block', width: '22px', height: '34px', border: '1px solid var(--line)', borderRadius: '12px', position: 'relative'}}><span style={{position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '7px', borderRadius: '2px', background: 'var(--muted)'}}></span></span>
      Scroll to explore
    </div>
  </header>

  
  <div style={{position: 'relative', zIndex: '2', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', overflow: 'hidden', padding: '18px 0', background: 'rgba(255,255,255,0.012)'}}>
    <div style={{display: 'flex', width: 'max-content', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite', fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(22px,3.4vw,46px)', letterSpacing: '-0.02em'}}>
      <span style={{display: 'flex', gap: '0'}}>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Content</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>SEO</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Growth</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Branding</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Outreach</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Campaigns</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Analytics</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
      </span>
      <span aria-hidden="true" style={{display: 'flex', gap: '0'}}>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Content</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>SEO</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Growth</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Branding</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Outreach</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Campaigns</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
        <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>Analytics</em><em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
      </span>
    </div>
  </div>

  
  <section id="think" style={{position: 'relative', zIndex: '2', padding: 'clamp(90px,16vh,200px) clamp(20px,5vw,64px)', display: 'none'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,90px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>01</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The way I think</h2>
    </div>
    <p data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', maxWidth: '540px', color: 'var(--muted)', fontSize: '16px', marginBottom: 'clamp(30px,5vh,56px)'}}>Seven words I keep coming back to. Tap any of them.</p>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', borderTop: '1px solid var(--line)'}} data-think-list="">
      
      <div className="kw-row" style={{borderBottom: '1px solid var(--line)'}}>
        <button className="kw" aria-expanded="false" data-cursor="" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: 'clamp(18px,3vh,30px) 0', textAlign: 'left'}}>
          <span className="kw-word" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(28px,5.5vw,68px)', letterSpacing: '-0.03em', lineHeight: '1', transition: 'color .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>Content</span>
          <span className="kw-plus" style={{fontFamily: "'JetBrains Mono'", fontSize: '22px', color: 'var(--muted)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),color .4s'}}>+</span>
        </button>
        <div className="kw-body" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}><p style={{maxWidth: '620px', paddingBottom: 'clamp(20px,3vh,34px)', color: 'rgba(244,241,236,0.72)', fontSize: 'clamp(15px,1.5vw,19px)', lineHeight: '1.55'}}>Content isn't filler — it's the bridge between what a brand says and what a person feels. I plan calendars that map to positioning, not just to a posting schedule.</p></div>
      </div>
      <div className="kw-row" style={{borderBottom: '1px solid var(--line)'}}>
        <button className="kw" aria-expanded="false" data-cursor="" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: 'clamp(18px,3vh,30px) 0', textAlign: 'left'}}>
          <span className="kw-word" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(28px,5.5vw,68px)', letterSpacing: '-0.03em', lineHeight: '1', transition: 'color .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>Growth</span>
          <span className="kw-plus" style={{fontFamily: "'JetBrains Mono'", fontSize: '22px', color: 'var(--muted)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),color .4s'}}>+</span>
        </button>
        <div className="kw-body" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}><p style={{maxWidth: '620px', paddingBottom: 'clamp(20px,3vh,34px)', color: 'rgba(244,241,236,0.72)', fontSize: 'clamp(15px,1.5vw,19px)', lineHeight: '1.55'}}>Growth is a system, not a spike. I look for the loops — content, outreach, referral — that keep working on their own once the initial push is done.</p></div>
      </div>
      <div className="kw-row" style={{borderBottom: '1px solid var(--line)'}}>
        <button className="kw" aria-expanded="false" data-cursor="" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: 'clamp(18px,3vh,30px) 0', textAlign: 'left'}}>
          <span className="kw-word" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(28px,5.5vw,68px)', letterSpacing: '-0.03em', lineHeight: '1', transition: 'color .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>Branding</span>
          <span className="kw-plus" style={{fontFamily: "'JetBrains Mono'", fontSize: '22px', color: 'var(--muted)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),color .4s'}}>+</span>
        </button>
        <div className="kw-body" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}><p style={{maxWidth: '620px', paddingBottom: 'clamp(20px,3vh,34px)', color: 'rgba(244,241,236,0.72)', fontSize: 'clamp(15px,1.5vw,19px)', lineHeight: '1.55'}}>A brand is the gap between expectation and experience. My job is to make that gap a pleasant surprise — consistent voice, considered visuals, no noise.</p></div>
      </div>
      <div className="kw-row" style={{borderBottom: '1px solid var(--line)'}}>
        <button className="kw" aria-expanded="false" data-cursor="" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: 'clamp(18px,3vh,30px) 0', textAlign: 'left'}}>
          <span className="kw-word" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(28px,5.5vw,68px)', letterSpacing: '-0.03em', lineHeight: '1', transition: 'color .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>Outreach</span>
          <span className="kw-plus" style={{fontFamily: "'JetBrains Mono'", fontSize: '22px', color: 'var(--muted)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),color .4s'}}>+</span>
        </button>
        <div className="kw-body" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}><p style={{maxWidth: '620px', paddingBottom: 'clamp(20px,3vh,34px)', color: 'rgba(244,241,236,0.72)', fontSize: 'clamp(15px,1.5vw,19px)', lineHeight: '1.55'}}>The best outreach feels like a conversation someone was already having in their head. Across LinkedIn and email, I lead with relevance — not volume.</p></div>
      </div>
      <div className="kw-row" style={{borderBottom: '1px solid var(--line)'}}>
        <button className="kw" aria-expanded="false" data-cursor="" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: 'clamp(18px,3vh,30px) 0', textAlign: 'left'}}>
          <span className="kw-word" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(28px,5.5vw,68px)', letterSpacing: '-0.03em', lineHeight: '1', transition: 'color .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>Campaigns</span>
          <span className="kw-plus" style={{fontFamily: "'JetBrains Mono'", fontSize: '22px', color: 'var(--muted)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),color .4s'}}>+</span>
        </button>
        <div className="kw-body" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}><p style={{maxWidth: '620px', paddingBottom: 'clamp(20px,3vh,34px)', color: 'rgba(244,241,236,0.72)', fontSize: 'clamp(15px,1.5vw,19px)', lineHeight: '1.55'}}>Every campaign starts with a person, not a channel. I design around the audience first, then choose where to meet them and what to say once I'm there.</p></div>
      </div>
      <div className="kw-row" style={{borderBottom: '1px solid var(--line)'}}>
        <button className="kw" aria-expanded="false" data-cursor="" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: 'clamp(18px,3vh,30px) 0', textAlign: 'left'}}>
          <span className="kw-word" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(28px,5.5vw,68px)', letterSpacing: '-0.03em', lineHeight: '1', transition: 'color .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>Analytics</span>
          <span className="kw-plus" style={{fontFamily: "'JetBrains Mono'", fontSize: '22px', color: 'var(--muted)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1),color .4s'}}>+</span>
        </button>
        <div className="kw-body" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}><p style={{maxWidth: '620px', paddingBottom: 'clamp(20px,3vh,34px)', color: 'rgba(244,241,236,0.72)', fontSize: 'clamp(15px,1.5vw,19px)', lineHeight: '1.55'}}>Numbers are the story's editor. GA and Search Console tell me what to keep and what to cut — so the next round is sharper than the last.</p></div>
      </div>
    </div>
  </section>

  
  <section id="journey" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,90px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>02</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The journey</h2>
    </div>
    <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0'}}>
      
      <div className="jstop tilt" data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}>
        <div className="jcard" style={{position: 'relative', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,44px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', overflow: 'hidden', transition: 'border-color .4s,background .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px'}}>
            <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.6vw,42px)', letterSpacing: '-0.02em'}}>47Billion</h3>
            <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12.5px', color: 'var(--warm)'}}>Aug 2024 — Present</span>
          </div>
          <p style={{color: 'var(--muted)', marginTop: '6px', fontSize: '15px'}}>Marketing &amp; Business Development Analyst · Indore</p>
          <div className="jdetail" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '22px'}}>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>250+ qualified product interactions</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>6+ clients converted</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>+30% campaign engagement</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>LinkedIn + email outreach</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Persona-led content calendars</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>GTM-aligned social campaigns</span>
            </div>
          </div>
          <div style={{position: 'absolute', top: '0', left: '-30%', width: '30%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', pointerEvents: 'none'}} className="jsheen"></div>
        </div>
      </div>
      <div style={{width: '1px', height: '40px', background: 'linear-gradient(var(--line),transparent)', margin: '0 auto'}}></div>
      <div className="jstop tilt" data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}>
        <div className="jcard" style={{position: 'relative', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,44px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', overflow: 'hidden', transition: 'border-color .4s,background .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px'}}>
            <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.6vw,42px)', letterSpacing: '-0.02em'}}>Digital Mind Web Solutions</h3>
            <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12.5px', color: 'var(--pink)'}}>Jun 2025 — Nov 2025</span>
          </div>
          <p style={{color: 'var(--muted)', marginTop: '6px', fontSize: '15px'}}>Digital Marketing Intern</p>
          <div className="jdetail" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '22px'}}>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>WordPress builds &amp; structuring</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>On-page + off-page SEO</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Google &amp; Meta Ads support</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>SEO blog &amp; article content</span>
            </div>
          </div>
          <div style={{position: 'absolute', top: '0', left: '-30%', width: '30%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', pointerEvents: 'none'}} className="jsheen"></div>
        </div>
      </div>
      <div style={{width: '1px', height: '40px', background: 'linear-gradient(var(--line),transparent)', margin: '0 auto'}}></div>
      <div className="jstop tilt" data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}>
        <div className="jcard" style={{position: 'relative', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,44px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', overflow: 'hidden', transition: 'border-color .4s,background .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px'}}>
            <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.6vw,42px)', letterSpacing: '-0.02em'}}>MBA, Marketing Management</h3>
            <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12.5px', color: 'var(--green)'}}>2022 — 2024</span>
          </div>
          <p style={{color: 'var(--muted)', marginTop: '6px', fontSize: '15px'}}>Prestige Institute of Management &amp; Research, Indore</p>
          <div className="jdetail" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '22px'}}>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Brand &amp; marketing strategy</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Consumer behaviour</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Data-driven decision making</span>
            </div>
          </div>
          <div style={{position: 'absolute', top: '0', left: '-30%', width: '30%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', pointerEvents: 'none'}} className="jsheen"></div>
        </div>
      </div>
      <div style={{width: '1px', height: '40px', background: 'linear-gradient(var(--line),transparent)', margin: '0 auto'}}></div>
      <div className="jstop tilt" data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}>
        <div className="jcard" style={{position: 'relative', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,44px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', overflow: 'hidden', transition: 'border-color .4s,background .4s,transform .5s cubic-bezier(.2,.7,.2,1)'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px'}}>
            <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.6vw,42px)', letterSpacing: '-0.02em'}}>BBA</h3>
            <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12.5px', color: 'var(--muted)'}}>2019 — 2022</span>
          </div>
          <p style={{color: 'var(--muted)', marginTop: '6px', fontSize: '15px'}}>Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</p>
          <div className="jdetail" style={{maxHeight: '0', overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.2,.7,.2,1)'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '22px'}}>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Business foundations</span>
              <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Where the marketing curiosity began</span>
            </div>
          </div>
          <div style={{position: 'absolute', top: '0', left: '-30%', width: '30%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', pointerEvents: 'none'}} className="jsheen"></div>
        </div>
      </div>
    </div>
  </section>

  
  <section id="skills" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(30px,5vh,56px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>03</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The toolkit</h2>
    </div>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', flexWrap: 'wrap', gap: '12px', maxWidth: '1000px', marginBottom: 'clamp(28px,4vh,44px)'}} data-pills="">
      <button className="pill" data-cursor="" data-skill="SEO" data-desc="On-page and off-page fundamentals — keyword research, content optimisation and technical hygiene that builds organic visibility over time." style={{border: '1px solid rgba(255,255,255,0.4)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--txt)', background: 'rgba(255,255,255,0.1)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>SEO</button>
      <button className="pill" data-cursor="" data-skill="LinkedIn" data-desc="Organic growth and outreach — relevance-led messaging and campaigns that drove 250+ qualified product interactions." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>LinkedIn</button>
      <button className="pill" data-cursor="" data-skill="Google Analytics" data-desc="Reading behaviour, not just traffic — turning sessions, sources and funnels into decisions about what to keep and what to cut." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Google Analytics</button>
      <button className="pill" data-cursor="" data-skill="Canva" data-desc="Fast, on-brand creative for social and campaigns — turning a content plan into things people actually want to look at." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Canva</button>
      <button className="pill" data-cursor="" data-skill="Mailchimp" data-desc="Email campaigns and lead nurturing — segmented sends and sequences that keep a brand in mind without wearing out its welcome." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Mailchimp</button>
      <button className="pill" data-cursor="" data-skill="Google Ads" data-desc="Search-certified — keyword planning and campaign support aimed at intent, with an eye on what each click is really worth." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Google Ads</button>
      <button className="pill" data-cursor="" data-skill="Meta Ads" data-desc="Audience targeting and creative testing across the Meta family — matching the message to where attention actually lives." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Meta Ads</button>
      <button className="pill" data-cursor="" data-skill="Content" data-desc="Planning content that maps to product positioning — calendars, blogs and social built around a real audience need." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Content</button>
      <button className="pill" data-cursor="" data-skill="Campaign Planning" data-desc="End-to-end campaign execution — from objective and audience through channel mix to measurement and the next iteration." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Campaign Planning</button>
      <button className="pill" data-cursor="" data-skill="Audience Personas" data-desc="Building personas from competitor research and user behaviour — empathy with a spreadsheet, which lifted engagement 30%." style={{border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,color .3s'}}>Audience Personas</button>
    </div>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', maxWidth: '760px', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)'}}>
      <h3 data-skill-title="" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '-0.02em', marginBottom: '12px'}}>SEO</h3>
      <p data-skill-desc="" style={{color: 'rgba(244,241,236,0.74)', fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: '1.55'}}>On-page and off-page fundamentals — keyword research, content optimisation and technical hygiene that builds organic visibility over time.</p>
    </div>
  </section>

  
  <section id="work" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(16px,3vh,28px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>04</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The campaign</h2>
    </div>
    <p data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', maxWidth: '600px', color: 'var(--muted)', fontSize: '16px', marginBottom: '14px'}}>Student Engagement Campaign — a registration &amp; engagement campaign, planned and run end to end.</p>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: 'clamp(36px,6vh,64px)'}}>
      <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Campaign Planning</span>
      <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Webinar Promotion</span>
      <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Referral Marketing</span>
      <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Student Ambassador Activation</span>
      <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>Community Engagement</span>
    </div>

    <div style={{maxWidth: '1100px'}}>
      <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--warm)'}}>01</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '10px'}}>Campaign Overview</h3>
          <p style={{color: 'rgba(244,241,236,0.78)', fontSize: '15.5px', lineHeight: '1.6', maxWidth: '660px'}}>Drive 500+ student registrations and build active participation around the campaign.</p>
        </div>
      </div>

      <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--warm)'}}>02</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '10px'}}>The Challenge</h3>
          <p style={{color: 'rgba(244,241,236,0.78)', fontSize: '15.5px', lineHeight: '1.6', maxWidth: '660px'}}>The target was 500+ student registrations — a number standard organic promotion alone was unlikely to reach. The campaign needed a strategy that could turn a single event into a growing, self-referring audience.</p>
          <span style={{display: 'inline-block', marginTop: '14px', border: '1px solid var(--line)', borderRadius: '999px', padding: '7px 15px', fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>Goal: 500+ registrations</span>
        </div>
      </div>

      <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--warm)'}}>03</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '14px'}}>Campaign Strategy</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '14px'}}>
            <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.03)'}}>Audience</span><span style={{color: 'var(--muted)'}}>→</span>
            <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.03)'}}>Content &amp; Promotion</span><span style={{color: 'var(--muted)'}}>→</span>
            <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.03)'}}>Webinar</span><span style={{color: 'var(--muted)'}}>→</span>
            <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.03)'}}>Student Ambassadors</span><span style={{color: 'var(--muted)'}}>→</span>
            <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.03)'}}>Referral Marketing</span><span style={{color: 'var(--muted)'}}>→</span>
            <span style={{border: '1px solid var(--warm)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', color: 'var(--warm)', background: 'rgba(255,255,255,0.03)'}}>Registrations</span>
          </div>
          <p style={{color: 'rgba(244,241,236,0.78)', fontSize: '15.5px', lineHeight: '1.6', maxWidth: '660px'}}>Built a multi-touch student acquisition campaign combining content promotion, webinar activation, referral marketing, and student ambassador outreach. The webinar created initial engagement, while student ambassadors and peer referrals helped extend the campaign into student communities.</p>
        </div>
      </div>

      <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--green)'}}>04</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '14px'}}>Campaign Execution</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: '12px'}}>
            <div style={{border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '13.5px', color: 'rgba(244,241,236,0.85)'}}>Planned campaign messaging and promotional activities</p></div>
            <div style={{border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '13.5px', color: 'rgba(244,241,236,0.85)'}}>Promoted the webinar and drove student participation</p></div>
            <div style={{border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '13.5px', color: 'rgba(244,241,236,0.85)'}}>Coordinated student ambassador activation</p></div>
            <div style={{border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '13.5px', color: 'rgba(244,241,236,0.85)'}}>Used referral-led outreach to increase registrations</p></div>
            <div style={{border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '13.5px', color: 'rgba(244,241,236,0.85)'}}>Managed ongoing student/community engagement</p></div>
          </div>
        </div>
      </div>

      <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(30px,4vh,44px) 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--green)'}}>05</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '20px'}}>Results</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px,5vw,64px)', alignItems: 'flex-end'}}>
            <div><p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px'}}>Target</p><div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(38px,5.5vw,58px)', letterSpacing: '-0.04em', lineHeight: '1', color: 'rgba(244,241,236,0.5)'}}>500+</div></div>
            <div><p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm)', marginBottom: '8px'}}>Achieved</p><div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(56px,9vw,96px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--warm),var(--pink))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}><span data-count="750" data-suffix="+">0</span></div></div>
            <div><p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '8px'}}>Target achievement</p><div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(38px,5.5vw,58px)', letterSpacing: '-0.04em', lineHeight: '1', color: 'var(--green)'}}><span data-count="150" data-suffix="%">0</span></div></div>
          </div>
          <p style={{color: 'var(--muted)', fontSize: '14px', marginTop: '20px'}}>200–300 students attended the webinar.</p>
        </div>
      </div>

      <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', paddingTop: 'clamp(30px,4vh,44px)'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '16px'}}>
          <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--muted)'}}>06</span>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em'}}>What I Learned</h3>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '14px'}}>
          <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '14.5px', color: 'rgba(244,241,236,0.82)', lineHeight: '1.5'}}>Community-led marketing can amplify campaign reach.</p></div>
          <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '14.5px', color: 'rgba(244,241,236,0.82)', lineHeight: '1.5'}}>Referral mechanisms can turn existing participants into an acquisition channel.</p></div>
          <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '14.5px', color: 'rgba(244,241,236,0.82)', lineHeight: '1.5'}}>Webinars can work as both an engagement and a conversion touchpoint.</p></div>
          <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '14.5px', color: 'rgba(244,241,236,0.82)', lineHeight: '1.5'}}>Combining multiple acquisition channels can outperform relying on a single content format.</p></div>
        </div>
      </div>
    </div>

    
    <div data-reveal style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', marginTop: 'clamp(56px,9vh,100px)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '20px'}}>Content pillars</p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px'}}>
        <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)', display: 'none'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>Career Readiness</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>Resume, ATS and skill-gap posts that meet job seekers where the anxiety actually is.</p></div>
        <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)', display: 'none'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>Confidence &amp; Interview Prep</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>The final skill nobody teaches — reframed as something buildable, not innate.</p></div>
        <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)', display: 'none'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>Student Community</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>Clubs, competitions and referral loops that turn learners into recruiters.</p></div>
        <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>Product Education</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>Feature explainers that sell the outcome first, the interface second.</p></div>
        <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>Culture &amp; Behind-the-Scenes</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>Office reels that make a brand feel like people, not a logo.</p></div>
        <div style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>Events &amp; Partnerships</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>National-level competitions and sponsor creative built for co-branded reach.</p></div>
      </div>
    </div>

    
    <div data-reveal style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', marginTop: '24px', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(26px,3vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '28px', justifyContent: 'space-between'}}>
      <div style={{maxWidth: '34ch'}}>
        <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px'}}>Organic growth</p>
        <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', lineHeight: '1.15'}}>Grew the page's following with zero paid boosting — consistent short-form content and community engagement did the work.</h3>
      </div>
      <div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(56px,8vw,96px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--green),var(--warm))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: '0'}}><span data-count="23" data-suffix="%">0</span></div>
    </div>

    
    <div data-reveal style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', marginTop: 'clamp(56px,9vh,100px)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px'}}>Designed in Canva</p>
      <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.2vw,36px)', letterSpacing: '-0.02em', marginBottom: '28px'}}>Social creative, shipped</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,210px),1fr))', gap: '16px'}}>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/mood-today.png" alt="If Your Resume Had a Mood Today — carousel hook" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Resume mood — hook-led carousel</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/skill-gap.png" alt="Your Skill Gap Is Pulling You Back" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Skill gap — problem-agitation visual</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/magic-skills.png" alt="Magic Won't Get You Placed" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Value-prop still frame</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/pov-shortcut.png" alt="POV: You've found the shortcut to becoming job-ready" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Swipe-style POV hook</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/confidence-interview.png" alt="Has the skills, but isn't confident enough for interviews?" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Pain-point acquisition ad</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/student-club.png" alt="7Seers Student Club recruitment post" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Community recruitment post</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/arthneeti.png" alt="Arthneeti 5.0 national economics case competition" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>National event sponsor creative</p></div></div>
        <div className="tilt" style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)'}}><img src="assets/social/track-progress.png" alt="Track your progress, turn effort into results — app promo" loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover'}} /><div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>Product feature carousel</p></div></div>
      </div>
    </div>

    
    <div data-reveal style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', marginTop: 'clamp(56px,9vh,100px)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px'}}>Reels performance</p>
      <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.2vw,36px)', letterSpacing: '-0.02em', marginBottom: '26px'}}>Reach, not just posts</h3>
      <div style={{display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px'}}>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/colleague-le-me.png" alt="Colleague versus me office humor reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>2.1M views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>Colleague vs. me — office humor</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/two-employees-leave.png" alt="Two employees took leave the same day reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>13.2K views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>POV: two employees, one leave day</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/client-onboard.png" alt="Client on board sales team celebration reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>11K views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>Client on board — sales team celebrates</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/black-screen-hook.png" alt="Cold-open hook frame reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>5,673 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>A cold-open hook</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/ceo-voices.png" alt="Can our CEO get all our voices right reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>5,522 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>Can our CEO get all our voices right?</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/choreo-teaching.png" alt="Choreo teaching steps to the team reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>4,901 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>Choreo, teaching steps to the team</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/heads-stressing.png" alt="POV the heads stressing over event permissions reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>4,524 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>POV: event permissions day</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/womens-day.png" alt="POV it's Women's Day Eve reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>4,048 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>POV: Women's Day eve</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/internship-journey.png" alt="The Internship Journey Part 1 reel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>3,410 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>The internship journey, part 1</p></div>
        <div className="tilt" style={{width: '148px', flexShrink: '0'}}><div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}><img src="assets/reels/radhika-travel.png" alt="Team culture reel — Radhika on travel" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /><span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>3,389 views</span></div><p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>Asking the team why they work</p></div>
      </div>
    </div>
  </section>

  
  <section style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)', display: 'none'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,80px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>05</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>By the numbers</h2>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 'clamp(16px,2vw,22px)', marginBottom: 'clamp(16px,2vw,22px)'}}>
      <div data-reveal="" className="jcard" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(26px,3vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)'}}>
        <div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(48px,7vw,86px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--warm),var(--pink))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}><span data-count="250" data-suffix="+">0</span></div>
        <p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '12px', maxWidth: '220px'}}>Qualified product interactions driven through outreach</p>
      </div>
      <div data-reveal="" data-delay="90" className="jcard" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(26px,3vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)'}}>
        <div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(48px,7vw,86px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--pink),var(--green))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}><span data-count="30" data-suffix="%">0</span></div>
        <p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '12px', maxWidth: '220px'}}>Higher campaign engagement from persona-led work</p>
      </div>
      <div data-reveal="" data-delay="180" className="jcard" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(26px,3vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)'}}>
        <div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(48px,7vw,86px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--green),var(--warm))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}><span data-count="6" data-suffix="+">0</span></div>
        <p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '12px', maxWidth: '220px'}}>Clients converted from cold to closed</p>
      </div>
    </div>
    <div data-reveal="" className="jcard" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(26px,3vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '24px'}}>Where the focus goes</p>
      <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '18px'}}><span style={{width: '130px', flexShrink: '0', fontSize: '15px'}}>SEO</span><div style={{flex: '1', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}><div data-bar="" data-pct="82" style={{height: '100%', width: '0', borderRadius: '999px', background: 'linear-gradient(90deg,var(--warm),var(--pink))', transition: 'width 1.4s cubic-bezier(.2,.7,.2,1)'}}></div></div></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '18px'}}><span style={{width: '130px', flexShrink: '0', fontSize: '15px'}}>Campaigns</span><div style={{flex: '1', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}><div data-bar="" data-pct="90" style={{height: '100%', width: '0', borderRadius: '999px', background: 'linear-gradient(90deg,var(--warm),var(--pink))', transition: 'width 1.4s cubic-bezier(.2,.7,.2,1)'}}></div></div></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '18px'}}><span style={{width: '130px', flexShrink: '0', fontSize: '15px'}}>Content</span><div style={{flex: '1', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}><div data-bar="" data-pct="88" style={{height: '100%', width: '0', borderRadius: '999px', background: 'linear-gradient(90deg,var(--warm),var(--pink))', transition: 'width 1.4s cubic-bezier(.2,.7,.2,1)'}}></div></div></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '18px'}}><span style={{width: '130px', flexShrink: '0', fontSize: '15px'}}>Email</span><div style={{flex: '1', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}><div data-bar="" data-pct="74" style={{height: '100%', width: '0', borderRadius: '999px', background: 'linear-gradient(90deg,var(--warm),var(--pink))', transition: 'width 1.4s cubic-bezier(.2,.7,.2,1)'}}></div></div></div>
      </div>
    </div>
  </section>

  
  <section style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,80px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>06</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>Creative notebook</h2>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,290px),1fr))', gap: 'clamp(18px,2.4vw,30px)', maxWidth: '1100px'}}>
      <div className="note tilt" data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}><div style={{background: 'oklch(0.83 0.13 66 / 0.92)', color: '#1a1206', borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: 'rotate(-2deg)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'}}><p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>People don't remember ads. They remember feelings.</p><span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span></div></div>
      <div className="note tilt" data-reveal="" data-delay="80" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}><div style={{background: 'oklch(0.8 0.14 350 / 0.9)', color: '#1a0612', borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: 'rotate(1.5deg)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'}}><p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>Every scroll is earned.</p><span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span></div></div>
      <div className="note tilt" data-reveal="" data-delay="160" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}><div style={{background: 'oklch(0.85 0.11 150 / 0.9)', color: '#06160c', borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: 'rotate(-1deg)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'}}><p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>Good content answers. Great content starts conversations.</p><span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span></div></div>
      <div className="note tilt" data-reveal="" data-delay="60" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}><div style={{background: '#f4f1ec', color: '#15110c', borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: 'rotate(2deg)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'}}><p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>A persona is just empathy with a spreadsheet.</p><span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span></div></div>
      <div className="note tilt" data-reveal="" data-delay="140" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}><div style={{background: 'oklch(0.83 0.13 66 / 0.88)', color: '#1a1206', borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: 'rotate(-2.5deg)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'}}><p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>If the data surprises you, you weren't listening.</p><span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span></div></div>
      <div className="note tilt" data-reveal="" data-delay="220" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)'}}><div style={{background: '#f4f1ec', color: '#15110c', borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: 'rotate(1deg)', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'}}><p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>Reach is rented. Trust is owned.</p><span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span></div></div>
    </div>
  </section>

  
  <section style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)', display: 'none'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,80px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>07</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>Always learning</h2>
    </div>
    <div style={{maxWidth: '840px', display: 'flex', flexDirection: 'column'}}>
      <div className="learn-row" data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', gap: 'clamp(16px,3vw,40px)', alignItems: 'flex-start', padding: 'clamp(20px,3vh,30px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--warm)', paddingTop: '6px', flexShrink: '0'}}>Certified</span>
        <div><h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(20px,2.6vw,30px)', letterSpacing: '-0.02em'}}>Fundamentals of Digital Marketing</h3><p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '4px'}}>Google Digital Garage</p></div>
      </div>
      <div className="learn-row" data-reveal="" data-delay="80" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', gap: 'clamp(16px,3vw,40px)', alignItems: 'flex-start', padding: 'clamp(20px,3vh,30px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--pink)', paddingTop: '6px', flexShrink: '0'}}>Certified</span>
        <div><h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(20px,2.6vw,30px)', letterSpacing: '-0.02em'}}>Google Ads Search Certification</h3><p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '4px'}}>Google Skillshop</p></div>
      </div>
      <div className="learn-row" data-reveal="" data-delay="160" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', gap: 'clamp(16px,3vw,40px)', alignItems: 'flex-start', padding: 'clamp(20px,3vh,30px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--green)', paddingTop: '6px', flexShrink: '0'}}>Ongoing</span>
        <div><h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(20px,2.6vw,30px)', letterSpacing: '-0.02em'}}>Marketing books &amp; courses</h3><p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '4px'}}>A steady habit — strategy, behaviour and brand, a chapter at a time.</p></div>
      </div>
      <div className="learn-row" data-reveal="" data-delay="240" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)', display: 'flex', gap: 'clamp(16px,3vw,40px)', alignItems: 'flex-start', padding: 'clamp(20px,3vh,30px) 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)', paddingTop: '6px', flexShrink: '0'}}>Languages</span>
        <div><h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: 'clamp(20px,2.6vw,30px)', letterSpacing: '-0.02em'}}>English · Hindi · Marathi</h3><p style={{color: 'var(--muted)', fontSize: '15px', marginTop: '4px'}}>Communicating across audiences and registers.</p></div>
      </div>
    </div>
  </section>

  
  <section id="contact" style={{position: 'relative', zIndex: '2', padding: 'clamp(90px,16vh,200px) clamp(20px,5vw,64px) clamp(50px,8vh,90px)', textAlign: 'center', overflow: 'hidden'}}>
    <div data-reveal="" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '28px'}}>08 — Command center</p>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(40px,8.5vw,128px)', letterSpacing: '-0.04em', lineHeight: '0.95', maxWidth: '14ch', margin: '0 auto'}}>Let's build something <span style={{background: 'linear-gradient(110deg,var(--warm),var(--pink),var(--green))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: '400'}}>memorable.</span></h2>
    </div>
    <div data-reveal="" data-delay="120" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1)', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: 'clamp(40px,7vh,70px)'}}>
      <a className="magnetic" data-cursor="" href="mailto:payalraut0805@gmail.com" style={{position: 'relative', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '999px', padding: '18px 34px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', transition: 'background .3s,border-color .3s'}}><span className="magnetic-inner" style={{display: 'inline-block'}}>Email</span></a>
      <a className="magnetic" data-cursor="" href="https://linkedin.com/in/payal-raut-319645242/" target="_blank" rel="noopener" style={{position: 'relative', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '999px', padding: '18px 34px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', transition: 'background .3s,border-color .3s'}}><span className="magnetic-inner" style={{display: 'inline-block'}}>LinkedIn</span></a>
      <a className="magnetic" data-cursor="" href="uploads/PAYAL%20RAUT%20%20RESUME.pdf" target="_blank" rel="noopener" style={{position: 'relative', border: '1px solid transparent', borderRadius: '999px', padding: '18px 34px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#15110c', background: 'linear-gradient(110deg,var(--warm),var(--pink))', transition: 'filter .3s'}}><span className="magnetic-inner" style={{display: 'inline-block', fontWeight: '500'}}>Résumé ↗</span></a>
    </div>
    <div data-reveal="" data-delay="220" style={{opacity: '0', transform: 'translateY(34px)', transition: 'opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1)', marginTop: 'clamp(60px,10vh,120px)', display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono'", fontSize: '11.5px', letterSpacing: '0.08em', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '28px'}}>
      <span>Payal Raut · Marketing &amp; Business Development Analyst</span>
      <span>Indore, India · payalraut0805@gmail.com</span>
      <span>© 2026</span>
    </div>
  </section>

</div>
  );
}
