import { useState } from "react";
import { motion } from "framer-motion";
import {
  Counter,
  CustomCursor,
  HeroLine,
  Magnetic,
  MobileNav,
  Reveal,
  Tilt,
  usePointerCoarse,
  useScrollNav,
} from "./motion-primitives";

const NAV_ITEMS = [
  { href: "#journey", label: "Journey" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#social", label: "Social" },
  { href: "#contact", label: "Contact" },
];

const SKILLS = [
  { name: "Sales Navigator", desc: "Organic growth and outreach — relevance-led messaging and campaigns that drove 250+ qualified product interactions." },
  { name: "Google Analytics", desc: "Reading behaviour, not just traffic — turning sessions, sources and funnels into decisions about what to keep and what to cut." },
  { name: "Canva", desc: "Fast, on-brand creative for social and campaigns — turning a content plan into things people actually want to look at." },
  { name: "Mailchimp", desc: "Email campaigns and lead nurturing — segmented sends and sequences that keep a brand in mind without wearing out its welcome." },
  { name: "Google Ads", desc: "Search-certified — keyword planning and campaign support aimed at intent, with an eye on what each click is really worth." },
  { name: "Meta Ads", desc: "Audience targeting and creative testing across the Meta family — matching the message to where attention actually lives." },
  { name: "Content", desc: "Planning content that maps to product positioning — calendars, blogs and social built around a real audience need." },
  { name: "Campaign Planning", desc: "End-to-end campaign execution — from objective and audience through channel mix to measurement and the next iteration." },
  { name: "Audience Personas", desc: "Building personas from competitor research and user behaviour — empathy with a spreadsheet, which lifted engagement 30%." },
  { name: "Email Marketing", desc: "End-to-end email campaigns — list segmentation, copy and send-time testing built into lifecycle sequences that keep a brand top of mind." },
  { name: "Social Media Marketing", desc: "Planning and running a brand's social presence — content calendars, community engagement and platform-native formats that build an audience over time." },
];

const PILLARS = [
  { title: "Product Education", desc: "Feature explainers that sell the outcome first, the interface second." },
  { title: "Culture & Behind-the-Scenes", desc: "Office reels that make a brand feel like people, not a logo." },
  { title: "Events & Partnerships", desc: "National-level competitions and sponsor creative built for co-branded reach." },
];

const SOCIAL = [
  { src: "/assets/social/mood-today.jpg", alt: "If Your Resume Had a Mood Today — carousel hook", caption: "Resume mood — hook-led carousel" },
  { src: "/assets/social/skill-gap.jpg", alt: "Your Skill Gap Is Pulling You Back", caption: "Skill gap — problem-agitation visual" },
  { src: "/assets/social/magic-skills.jpg", alt: "Magic Won't Get You Placed", caption: "Value-prop still frame" },
  { src: "/assets/social/pov-shortcut.jpg", alt: "POV: You've found the shortcut to becoming job-ready", caption: "Swipe-style POV hook" },
  { src: "/assets/social/confidence-interview.jpg", alt: "Has the skills, but isn't confident enough for interviews?", caption: "Pain-point acquisition ad" },
  { src: "/assets/social/student-club.jpg", alt: "7Seers Student Club recruitment post", caption: "Community recruitment post" },
  { src: "/assets/social/arthneeti.jpg", alt: "Arthneeti 5.0 national economics case competition", caption: "National event sponsor creative" },
  { src: "/assets/social/track-progress.jpg", alt: "Track your progress, turn effort into results — app promo", caption: "Product feature carousel" },
];

const REELS = [
  { src: "/assets/reels/colleague-le-me.jpg", alt: "Colleague versus me office humor reel", views: "2.1M views", caption: "Colleague vs. me — office humor" },
  { src: "/assets/reels/two-employees-leave.jpg", alt: "Two employees took leave the same day reel", views: "13.2K views", caption: "POV: two employees, one leave day" },
  { src: "/assets/reels/client-onboard.jpg", alt: "Client on board sales team celebration reel", views: "11K views", caption: "Client on board — sales team celebrates" },
  { src: "/assets/reels/black-screen-hook.jpg", alt: "Cold-open hook frame reel", views: "5,673 views", caption: "A cold-open hook" },
  { src: "/assets/reels/ceo-voices.jpg", alt: "Can our CEO get all our voices right reel", views: "5,522 views", caption: "Can our CEO get all our voices right?" },
  { src: "/assets/reels/choreo-teaching.jpg", alt: "Choreo teaching steps to the team reel", views: "4,901 views", caption: "Choreo, teaching steps to the team" },
  { src: "/assets/reels/heads-stressing.jpg", alt: "POV the heads stressing over event permissions reel", views: "4,524 views", caption: "POV: event permissions day" },
  { src: "/assets/reels/womens-day.jpg", alt: "POV it's Women's Day Eve reel", views: "4,048 views", caption: "POV: Women's Day eve" },
  { src: "/assets/reels/internship-journey.jpg", alt: "The Internship Journey Part 1 reel", views: "3,410 views", caption: "The internship journey, part 1" },
  { src: "/assets/reels/radhika-travel.jpg", alt: "Team culture reel — Radhika on travel", views: "3,389 views", caption: "Asking the team why they work" },
];

function PlayBadge() {
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(9,9,9,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,241,236,0.35)", pointerEvents: "none" }}>
      <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "9px solid rgba(244,241,236,0.9)", marginLeft: "2px" }} />
    </div>
  );
}

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState(SKILLS[0]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { hidden, scrolled } = useScrollNav();
  const coarse = usePointerCoarse();

  return (
<div style={{position: 'relative', background: '#090909', color: '#f4f1ec', fontFamily: "'Space Grotesk',sans-serif", '--warm': 'oklch(0.83 0.13 66)', '--pink': 'oklch(0.8 0.14 350)', '--green': 'oklch(0.85 0.11 150)', '--txt': '#f4f1ec', '--muted': 'rgba(244,241,236,0.52)', '--line': 'rgba(244,241,236,0.1)', minHeight: '100vh', overflow: 'hidden', cursor: coarse ? 'auto' : 'none'}}>

  <CustomCursor />

  <div style={{position: 'fixed', inset: '0', zIndex: '0', pointerEvents: 'none', overflow: 'hidden'}}>
    <div className="blob" style={{position: 'absolute', top: '-12vh', left: '-8vw', width: '48vw', height: '48vw', background: 'radial-gradient(circle at 35% 35%, oklch(0.83 0.13 66 / 0.5), transparent 62%)', filter: 'blur(60px)', animation: 'blobFloat 22s ease-in-out infinite, blobMorph 16s ease-in-out infinite'}}></div>
    <div className="blob" style={{position: 'absolute', bottom: '-18vh', right: '-10vw', width: '52vw', height: '52vw', background: 'radial-gradient(circle at 60% 40%, oklch(0.8 0.14 350 / 0.42), transparent 60%)', filter: 'blur(70px)', animation: 'blobFloat 28s ease-in-out infinite reverse, blobMorph 19s ease-in-out infinite'}}></div>
    <div className="blob" style={{position: 'absolute', top: '40%', left: '55%', width: '34vw', height: '34vw', background: 'radial-gradient(circle at 50% 50%, oklch(0.85 0.11 150 / 0.3), transparent 62%)', filter: 'blur(64px)', animation: 'blobFloat 25s ease-in-out infinite, blobMorph 21s ease-in-out infinite'}}></div>
  </div>

  <div style={{position: 'fixed', inset: '0', zIndex: '1', pointerEvents: 'none', opacity: '0.05', mixBlendMode: 'soft-light', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}></div>

  <motion.nav
    animate={{ y: hidden ? '-130%' : '0%', background: scrolled ? 'rgba(9,9,9,0.45)' : 'rgba(9,9,9,0)', backdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)' }}
    transition={{ duration: 0.5, ease: [0.2,0.7,0.2,1] }}
    style={{position: 'fixed', top: '0', left: '0', right: '0', zIndex: '50', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px,5vw,64px)', mixBlendMode: 'difference'}}>
    <a href="#top" data-cursor="" style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: '19px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px'}}>
      <span style={{display: 'inline-block', width: '11px', height: '11px', borderRadius: '50%', background: '#fff'}}></span>Payal&nbsp;Raut
    </a>
    <div className="nav-links" style={{display: 'flex', gap: 'clamp(14px,2.4vw,34px)', fontSize: '13.5px', letterSpacing: '0.01em', alignItems: 'center'}}>
      {NAV_ITEMS.map((item) => (
        <a key={item.href} href={item.href} data-cursor="" style={{opacity: '.85'}}>{item.label}</a>
      ))}
    </div>
    <button
      className="nav-hamburger"
      aria-label="Open menu"
      onClick={() => setMobileNavOpen(true)}
      style={{display: 'none', flexDirection: 'column', gap: '5px', padding: '8px'}}>
      <span style={{width: '20px', height: '1.5px', background: '#fff'}}></span>
      <span style={{width: '20px', height: '1.5px', background: '#fff'}}></span>
    </button>
  </motion.nav>

  <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} items={NAV_ITEMS} />

  <header id="top" style={{position: 'relative', zIndex: '2', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(20px,5vw,64px)', paddingBottom: 'clamp(64px,11vh,100px)', paddingTop: 'clamp(64px,11vh,100px)'}}>
    <div className="hero-copy" style={{position: 'relative'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px,3vh,40px)', fontFamily: "'JetBrains Mono'", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)'}}>
        <span style={{width: '26px', height: '1px', background: 'var(--muted)', display: 'inline-block'}}></span>
        Marketing &amp; Business Development Analyst — Indore, IN
      </div>
      <h1 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', lineHeight: '0.88', letterSpacing: '-0.04em', fontSize: 'clamp(58px,15vw,232px)', textTransform: 'uppercase', margin: '0'}}>
        <HeroLine text="Marketing" startIndex={0} />
        <HeroLine text="that" startIndex={9} />
        <HeroLine text="connects." startIndex={13} style={{background: 'linear-gradient(100deg,var(--warm),var(--pink) 55%,var(--green))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic', fontFamily: "'Instrument Serif',serif", fontWeight: '400', textTransform: 'none', letterSpacing: '-0.01em'}} />
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
      {[0, 1].map((rep) => (
        <span key={rep} aria-hidden={rep === 1 ? "true" : undefined} style={{display: 'flex', gap: '0'}}>
          {["Content", "Sales Navigator", "Growth", "Branding", "Outreach", "Campaigns", "Analytics"].map((word) => (
            <span key={word} style={{display: 'flex'}}>
              <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--txt)'}}>{word}</em>
              <em style={{fontStyle: 'normal', padding: '0 28px', color: 'var(--warm)'}}>·</em>
            </span>
          ))}
        </span>
      ))}
    </div>
  </div>

  <section id="journey" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <Reveal style={{display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,90px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>01</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The journey</h2>
    </Reveal>
    <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0'}}>
      {[
        { org: "47Billion", when: "Aug 2024 — Present", accent: "var(--warm)", role: "Marketing & Business Development Analyst · Indore", tags: ["250+ qualified product interactions", "6+ clients converted", "+30% campaign engagement", "LinkedIn + email outreach", "Persona-led content calendars", "GTM-aligned social campaigns"] },
        { org: "Digital Mind Web Solutions", when: "Jun 2025 — Nov 2025", accent: "var(--pink)", role: "Digital Marketing Intern", tags: ["WordPress builds & structuring", "On-page + off-page SEO", "Google & Meta Ads support", "SEO blog & article content"] },
        { org: "MBA, Marketing Management", when: "2022 — 2024", accent: "var(--green)", role: "Prestige Institute of Management & Research, Indore", tags: ["Brand & marketing strategy", "Consumer behaviour", "Data-driven decision making"] },
        { org: "BBA", when: "2019 — 2022", accent: "var(--muted)", role: "Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore", tags: ["Business foundations", "Where the marketing curiosity began"] },
      ].map((stop, i) => (
        <div key={stop.org}>
          <Reveal>
            <div className="jcard" style={{border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,44px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', transition: 'border-color .4s,background .4s'}}>
              <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px'}}>
                <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.6vw,42px)', letterSpacing: '-0.02em'}}>{stop.org}</h3>
                <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12.5px', color: stop.accent}}>{stop.when}</span>
              </div>
              <p style={{color: 'var(--muted)', marginTop: '6px', fontSize: '15px'}}>{stop.role}</p>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '22px'}}>
                {stop.tags.map((tag) => (
                  <span key={tag} style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
          {i < 3 && <div style={{width: '1px', height: '40px', background: 'linear-gradient(var(--line),transparent)', margin: '0 auto'}}></div>}
        </div>
      ))}
    </div>
  </section>

  <section id="skills" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <Reveal style={{display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(30px,5vh,56px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>02</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The toolkit</h2>
    </Reveal>
    <Reveal style={{display: 'flex', flexWrap: 'wrap', gap: '12px', maxWidth: '1000px', marginBottom: 'clamp(28px,4vh,44px)'}}>
      {SKILLS.map((skill) => {
        const active = activeSkill.name === skill.name;
        return (
          <motion.button
            key={skill.name}
            data-cursor=""
            onClick={() => setActiveSkill(skill)}
            whileHover={{ y: -3 }}
            style={{
              border: active ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px', padding: '12px 20px', fontSize: '14px',
              color: active ? 'var(--txt)' : 'var(--muted)',
              background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              transition: 'background .3s,border-color .3s,color .3s',
            }}>
            {skill.name}
          </motion.button>
        );
      })}
    </Reveal>
    <Reveal style={{maxWidth: '760px', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(24px,4vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)'}}>
      <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '-0.02em', marginBottom: '12px'}}>{activeSkill.name}</h3>
      <p style={{color: 'rgba(244,241,236,0.74)', fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: '1.55'}}>{activeSkill.desc}</p>
    </Reveal>
  </section>

  <section id="work" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <Reveal style={{display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(16px,3vh,28px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>03</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>The campaign</h2>
    </Reveal>
    <Reveal as="p" style={{maxWidth: '600px', color: 'var(--muted)', fontSize: '16px', marginBottom: '14px'}}>Student Engagement Campaign — a registration &amp; engagement campaign, planned and run end to end.</Reveal>
    <Reveal style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: 'clamp(36px,6vh,64px)'}}>
      {["Campaign Planning", "Webinar Promotion", "Referral Marketing", "Student Ambassador Activation", "Community Engagement"].map((tag) => (
        <span key={tag} style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 15px', fontSize: '13px', color: 'rgba(244,241,236,0.82)'}}>{tag}</span>
      ))}
    </Reveal>

    <div style={{maxWidth: '1100px'}}>
      <Reveal style={{display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--warm)'}}>01</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '10px'}}>Campaign Overview</h3>
          <p style={{color: 'rgba(244,241,236,0.78)', fontSize: '15.5px', lineHeight: '1.6', maxWidth: '660px'}}>Drive 500+ student registrations and build active participation around the campaign.</p>
        </div>
      </Reveal>

      <Reveal style={{display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--warm)'}}>02</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '10px'}}>The Challenge</h3>
          <p style={{color: 'rgba(244,241,236,0.78)', fontSize: '15.5px', lineHeight: '1.6', maxWidth: '660px'}}>The target was 500+ student registrations — a number standard organic promotion alone was unlikely to reach. The campaign needed a strategy that could turn a single event into a growing, self-referring audience.</p>
          <span style={{display: 'inline-block', marginTop: '14px', border: '1px solid var(--line)', borderRadius: '999px', padding: '7px 15px', fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>Goal: 500+ registrations</span>
        </div>
      </Reveal>

      <Reveal style={{display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--warm)'}}>03</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '14px'}}>Campaign Strategy</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '14px'}}>
            {["Audience", "Content & Promotion", "Webinar", "Student Ambassadors", "Referral Marketing"].map((step) => (
              <span key={step} style={{display: 'contents'}}>
                <span style={{border: '1px solid var(--line)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.03)'}}>{step}</span>
                <span style={{color: 'var(--muted)'}}>→</span>
              </span>
            ))}
            <span style={{border: '1px solid var(--warm)', borderRadius: '999px', padding: '10px 16px', fontSize: '13.5px', whiteSpace: 'nowrap', color: 'var(--warm)', background: 'rgba(255,255,255,0.03)'}}>Registrations</span>
          </div>
          <p style={{color: 'rgba(244,241,236,0.78)', fontSize: '15.5px', lineHeight: '1.6', maxWidth: '660px'}}>Built a multi-touch student acquisition campaign combining content promotion, webinar activation, referral marketing, and student ambassador outreach. The webinar created initial engagement, while student ambassadors and peer referrals helped extend the campaign into student communities.</p>
        </div>
      </Reveal>

      <Reveal style={{display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(24px,3.2vh,36px) 0', borderTop: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--green)'}}>04</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '14px'}}>Campaign Execution</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: '12px'}}>
            {["Planned campaign messaging and promotional activities", "Promoted the webinar and drove student participation", "Coordinated student ambassador activation", "Used referral-led outreach to increase registrations", "Managed ongoing student/community engagement"].map((item) => (
              <div key={item} style={{border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '13.5px', color: 'rgba(244,241,236,0.85)'}}>{item}</p></div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal style={{display: 'grid', gridTemplateColumns: '56px 1fr', gap: '20px', padding: 'clamp(30px,4vh,44px) 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
        <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--green)'}}>05</span>
        <div>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em', marginBottom: '20px'}}>Results</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px,5vw,64px)', alignItems: 'flex-end'}}>
            <div><p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px'}}>Target</p><div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(38px,5.5vw,58px)', letterSpacing: '-0.04em', lineHeight: '1', color: 'rgba(244,241,236,0.5)'}}>500+</div></div>
            <div><p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm)', marginBottom: '8px'}}>Achieved</p><div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(56px,9vw,96px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--warm),var(--pink))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}><Counter target={750} suffix="+" /></div></div>
            <div><p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '8px'}}>Target achievement</p><div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(38px,5.5vw,58px)', letterSpacing: '-0.04em', lineHeight: '1', color: 'var(--green)'}}><Counter target={150} suffix="%" /></div></div>
          </div>
          <p style={{color: 'var(--muted)', fontSize: '14px', marginTop: '20px'}}>200–300 students attended the webinar.</p>
        </div>
      </Reveal>

      <Reveal style={{paddingTop: 'clamp(30px,4vh,44px)'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '16px'}}>
          <span style={{fontFamily: "'JetBrains Mono'", fontSize: '13px', color: 'var(--muted)'}}>06</span>
          <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.02em'}}>What I Learned</h3>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '14px'}}>
          {["Community-led marketing can amplify campaign reach.", "Referral mechanisms can turn existing participants into an acquisition channel.", "Webinars can work as both an engagement and a conversion touchpoint.", "Combining multiple acquisition channels can outperform relying on a single content format."].map((item) => (
            <div key={item} style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><p style={{fontSize: '14.5px', color: 'rgba(244,241,236,0.82)', lineHeight: '1.5'}}>{item}</p></div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>

  <section id="social" style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <Reveal style={{display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(16px,3vh,28px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>04</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>Social work</h2>
    </Reveal>
    <Reveal as="p" style={{maxWidth: '600px', color: 'var(--muted)', fontSize: '16px', marginBottom: 'clamp(40px,7vh,80px)'}}>Proof beyond the case study — the content pillars, the creative shipped, and how the reels performed.</Reveal>

    <Reveal style={{marginBottom: 'clamp(56px,9vh,100px)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '20px'}}>Content pillars</p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px'}}>
        {PILLARS.map((p) => (
          <div key={p.title} style={{border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', background: 'rgba(255,255,255,0.025)'}}><h4 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '600', fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px'}}>{p.title}</h4><p style={{fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.45'}}>{p.desc}</p></div>
        ))}
      </div>
    </Reveal>

    <Reveal style={{marginBottom: 'clamp(56px,9vh,100px)', border: '1px solid var(--line)', borderRadius: '24px', padding: 'clamp(26px,3vw,40px)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(14px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '28px', justifyContent: 'space-between'}}>
      <div style={{maxWidth: '34ch'}}>
        <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px'}}>Organic growth</p>
        <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', lineHeight: '1.15'}}>Grew the page's following with zero paid boosting — consistent short-form content and community engagement did the work.</h3>
      </div>
      <div style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(56px,8vw,96px)', letterSpacing: '-0.04em', lineHeight: '1', background: 'linear-gradient(120deg,var(--warm),var(--pink))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: '0'}}><Counter target={23} suffix="%" /></div>
    </Reveal>

    <Reveal style={{marginBottom: 'clamp(56px,9vh,100px)'}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px'}}>Designed in Canva</p>
      <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.2vw,36px)', letterSpacing: '-0.02em', marginBottom: '28px'}}>Social creative, shipped</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,210px),1fr))', gap: '16px'}}>
        {SOCIAL.map((item) => (
          <Tilt key={item.src} max={4} style={{borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)'}}>
            <img src={item.src} alt={item.alt} loading="lazy" style={{width: '100%', display: 'block', aspectRatio: '3/4', objectFit: 'contain'}} />
            <div style={{padding: '12px 15px'}}><p style={{fontSize: '12.5px', color: 'rgba(244,241,236,0.78)'}}>{item.caption}</p></div>
          </Tilt>
        ))}
      </div>
    </Reveal>

    <Reveal>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px'}}>Reels performance</p>
      <h3 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(24px,3.2vw,36px)', letterSpacing: '-0.02em', marginBottom: '26px'}}>Reach, not just posts</h3>
      <div className="reel-row" style={{display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', scrollSnapType: 'x mandatory', WebkitMaskImage: 'linear-gradient(to right, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, black 92%, transparent 100%)'}}>
        {REELS.map((reel) => (
          <Tilt key={reel.src} max={5} style={{width: '148px', flexShrink: '0', scrollSnapAlign: 'start'}}>
            <div style={{borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '9/16', position: 'relative'}}>
              <img src={reel.src} alt={reel.alt} loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
              <PlayBadge />
              <span style={{position: 'absolute', bottom: '8px', left: '8px', fontFamily: "'JetBrains Mono'", fontSize: '11px', background: 'rgba(9,9,9,0.65)', border: '1px solid var(--line)', borderRadius: '999px', padding: '4px 9px', backdropFilter: 'blur(6px)'}}>{reel.views}</span>
            </div>
            <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '8px', lineHeight: '1.3'}}>{reel.caption}</p>
          </Tilt>
        ))}
      </div>
    </Reveal>
  </section>

  <section style={{position: 'relative', zIndex: '2', padding: 'clamp(70px,12vh,150px) clamp(20px,5vw,64px)'}}>
    <Reveal style={{display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: 'clamp(40px,7vh,80px)'}}>
      <span style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', color: 'var(--muted)'}}>05</span>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '700', fontSize: 'clamp(34px,6vw,84px)', letterSpacing: '-0.03em', lineHeight: '0.95'}}>Creative notebook</h2>
    </Reveal>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,290px),1fr))', gap: 'clamp(18px,2.4vw,30px)', maxWidth: '1100px'}}>
      {[
        { text: "People don't remember ads. They remember feelings.", bg: 'oklch(0.83 0.13 66 / 0.92)', color: '#1a1206', rotate: '-2deg' },
        { text: "Every scroll is earned.", bg: 'oklch(0.8 0.14 350 / 0.9)', color: '#1a0612', rotate: '1.5deg' },
        { text: "Good content answers. Great content starts conversations.", bg: 'oklch(0.85 0.11 150 / 0.9)', color: '#06160c', rotate: '-1deg' },
        { text: "A persona is just empathy with a spreadsheet.", bg: '#f4f1ec', color: '#15110c', rotate: '2deg' },
        { text: "If the data surprises you, you weren't listening.", bg: 'oklch(0.83 0.13 66 / 0.88)', color: '#1a1206', rotate: '-2.5deg' },
        { text: "Reach is rented. Trust is owned.", bg: '#f4f1ec', color: '#15110c', rotate: '1deg' },
      ].map((note, i) => (
        <Reveal key={note.text} delay={i * 60}>
          <Tilt style={{background: note.bg, color: note.color, borderRadius: '6px', padding: '30px 26px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 50px -22px rgba(0,0,0,0.7)', transform: `rotate(${note.rotate})`}}>
            <p style={{fontFamily: "'Instrument Serif',serif", fontSize: '25px', lineHeight: '1.25', fontStyle: 'italic'}}>{note.text}</p>
            <span style={{fontFamily: "'JetBrains Mono'", fontSize: '10.5px', letterSpacing: '0.1em', opacity: '0.6'}}>— note to self</span>
          </Tilt>
        </Reveal>
      ))}
    </div>
  </section>

  <section id="contact" style={{position: 'relative', zIndex: '2', padding: 'clamp(90px,16vh,200px) clamp(20px,5vw,64px) clamp(50px,8vh,90px)', textAlign: 'center', overflow: 'hidden'}}>
    <Reveal transition={{duration: 1, ease: [0.2,0.7,0.2,1]}}>
      <p style={{fontFamily: "'JetBrains Mono'", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '28px'}}>06 — Command center</p>
      <h2 style={{fontFamily: "'Bricolage Grotesque'", fontWeight: '800', fontSize: 'clamp(40px,8.5vw,128px)', letterSpacing: '-0.04em', lineHeight: '0.95', maxWidth: '14ch', margin: '0 auto'}}>Let's build something <span style={{background: 'linear-gradient(110deg,var(--warm),var(--pink),var(--green))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontWeight: '400'}}>memorable.</span></h2>
    </Reveal>
    <Reveal delay={120} style={{display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: 'clamp(40px,7vh,70px)'}}>
      <Magnetic data-cursor="" href="https://mail.google.com/mail/?view=cm&fs=1&to=payalraut0805@gmail.com" target="_blank" rel="noopener" style={{border: '1px solid rgba(255,255,255,0.5)', borderRadius: '999px', padding: '18px 34px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)'}}>Email</Magnetic>
      <Magnetic data-cursor="" href="https://linkedin.com/in/payal-raut-319645242/" target="_blank" rel="noopener" style={{border: '1px solid rgba(255,255,255,0.5)', borderRadius: '999px', padding: '18px 34px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)'}}>LinkedIn</Magnetic>
      <Magnetic data-cursor="" href="/uploads/PAYAL%20RAUT%20%20RESUME.pdf" target="_blank" rel="noopener" style={{border: '1px solid transparent', borderRadius: '999px', padding: '18px 34px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#15110c', background: 'linear-gradient(110deg,var(--warm),var(--pink))', fontWeight: '500'}}>Résumé ↗</Magnetic>
    </Reveal>
    <Reveal delay={220} style={{marginTop: 'clamp(60px,10vh,120px)', display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono'", fontSize: '11.5px', letterSpacing: '0.08em', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '28px'}}>
      <span>Payal Raut · Marketing &amp; Business Development Analyst</span>
      <span>Indore, India · payalraut0805@gmail.com</span>
      <span>© 2026</span>
    </Reveal>
  </section>

</div>
  );
}
