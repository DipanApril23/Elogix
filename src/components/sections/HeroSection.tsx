"use client";

import { Syne } from "next/font/google";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2,
  TrendingDown, GitBranch, Eye, Clock, AlertTriangle, Zap,
} from "lucide-react";
import { useEffect, useRef, useState, ReactNode } from "react";

// Configure the Syne font
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});


// framer-motion typings don't accept numeric bezier arrays directly for 'ease' in some setups
const EASE_BEZIER: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─────────────────────── helpers ─────────────────────── */

type CounterProps = {
  to: number;
  suffix?: string;
  duration?: number;
};

function Counter({ to, suffix = "", duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────── live expense ticker ─────────────────────── */

const TICKER_ITEMS = [
  { id: 1, name: "Arjun Mehta",     amount: "₹4,200",  cat: "Travel",       status: "approved", time: "2m ago" },
  { id: 2, name: "Priya Sharma",    amount: "₹12,800", cat: "Software",     status: "flagged",  time: "5m ago" },
  { id: 3, name: "Rohan Das",       amount: "₹780",    cat: "Meals",        status: "approved", time: "9m ago" },
  { id: 4, name: "Sneha Kapoor",    amount: "₹34,000", cat: "Conference",   status: "pending",  time: "14m ago" },
  { id: 5, name: "Vikram Singh",    amount: "₹2,100",  cat: "Office",       status: "approved", time: "20m ago" },
];

const STATUS_CONFIG = {
  approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  flagged:  { label: "Flagged",  color: "text-amber-400",   bg: "bg-amber-400/10",   dot: "bg-amber-400"   },
  pending:  { label: "Pending",  color: "text-slate-400",   bg: "bg-slate-400/10",   dot: "bg-slate-400"   },
};
function LiveExpenseTicker() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % TICKER_ITEMS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090e1c]/90 backdrop-blur-2xl shadow-2xl shadow-black/60"
    >
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-slate-400">Live Expense Feed</span>
        </div>
        <span className="text-[10px] text-slate-600">{TICKER_ITEMS.length} recent</span>
      </div>

      {/* items */}
      <div className="divide-y divide-white/[0.04]">
        {TICKER_ITEMS.map((item, i) => {
          const s = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
          const isActive = i === active;
          return (
            <motion.div
              key={item.id}
              animate={{ backgroundColor: isActive ? "rgba(99,102,241,0.04)" : "rgba(0,0,0,0)" }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 px-4 py-3"
            >
              {/* avatar */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-600/30 text-[10px] font-semibold text-indigo-300">
                {item.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[12px] font-medium text-slate-200">{item.name}</span>
                  <span className="text-[12px] font-semibold text-white">{item.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">{item.cat} · {item.time}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${s.bg} ${s.color}`}>
                    <span className={`h-1 w-1 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* bottom summary */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
        <span className="text-[10px] text-slate-600">Total processed today</span>
        <span className="text-[11px] font-semibold text-indigo-300">₹2,14,680</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── floating badges ─────────────────────── */

function FloatingBadge({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none absolute ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const rawMouse     = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 22, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 22, mass: 0.5 });

  /* mouse tracking */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x); mouseY.set(y);
      rawMouse.current = { x, y };
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  /* enhanced canvas dot grid */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Array<{ baseX: number; baseY: number; x: number; y: number; vx: number; vy: number; opacity: number }> = [];
    const GAP = 28;

    const init = () => {
      particles = [];
      canvas.width  = canvas.getBoundingClientRect().width;
      canvas.height = canvas.getBoundingClientRect().height;
      for (let x = GAP / 2; x < canvas.width; x += GAP) {
        for (let y = GAP / 2; y < canvas.height; y += GAP) {
          particles.push({ baseX: x, baseY: y, x, y, vx: 0, vy: 0, opacity: 0.12 + Math.random() * 0.1 });
        }
      }
    };

    init();

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const mouse = rawMouse.current;
      const ATTRACT = 140;  // glow attract radius
      const REPEL   = 60;   // push radius

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        /* repel */
        if (dist < REPEL && mouse.x > 0) {
          const force = ((REPEL - dist) / REPEL) * 5;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        /* spring back */
        p.vx += (p.baseX - p.x) * 0.07;
        p.vy += (p.baseY - p.y) * 0.07;
        p.vx *= 0.8; p.vy *= 0.8;
        p.x  += p.vx; p.y  += p.vy;

        /* brightness by proximity */
        const proximity = Math.max(0, 1 - dist / ATTRACT);
        const alpha = p.opacity + proximity * 0.5;
        const radius = 1 + proximity * 1.2;

        /* indigo tint near cursor */
        if (proximity > 0.1) {
          const r = Math.round(99  + proximity * 50);
          const g = Math.round(102 + proximity * 20);
          const b = Math.round(241);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, []);

  /* stagger variants */
  const fadeUp = (delay = 0) => ({
    initial:  { opacity: 0, y: 28 },
    animate:  { opacity: 1, y: 0  },
    transition: { delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
   <section
  ref={containerRef}
  className={`${syne.className} relative min-h-screen overflow-hidden bg-[#050816]`}
      style={{ paddingTop: "clamp(100px, 14vw, 152px)", paddingBottom: "clamp(60px, 8vw, 120px)" }}
    >
      {/* ── Canvas dot grid ── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* ── Mouse glow ── */}
      <motion.div
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute z-0 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.12] blur-[100px]"
      />

      {/* ── Static ambient glows ── */}
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-[10%] h-[300px] w-[300px] rounded-full bg-indigo-600/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-[10%] h-[260px] w-[260px] rounded-full bg-fuchsia-600/[0.05] blur-[100px]" />

      {/* ── Subtle horizontal lines ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[15, 40, 65, 87].map((t) => (
          <div key={t} className="absolute left-0 right-0 h-px bg-white/[0.025]" style={{ top: `${t}%` }} />
        ))}
      </div>

      {/* ── Grain overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "180px" }}
      />

      {/* ── Main content grid ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-8 xl:gap-16">

          {/* ════ LEFT COLUMN ════ */}
          <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left lg:flex-1">

            {/* Badge */}
            <motion.div {...fadeUp(0.05)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/[0.07] px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[11.5px] font-medium tracking-wide text-indigo-300">
                Expense Intelligence Platform · For Finance Teams
              </span>
              <span className="ml-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-300">
                New
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.12)}
              className="max-w-2xl text-[clamp(2.1rem,6vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-white"
            >
              Automate Expense{" "}
              <span
                className="relative inline-block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
              >
                Control
                {/* underline accent */}
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#ul)" strokeWidth="1.5" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="ul" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8"/>
                      <stop offset="100%" stopColor="#e879f9"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {" "}&amp; Approvals<br className="hidden sm:block" />
              <span className="text-slate-300"> Without the Chaos.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 max-w-xl text-[clamp(0.875rem,2vw,1.0625rem)] leading-[1.85] text-slate-400"
            >
              Expendesk brings the entire expense lifecycle into one structured system — from claim
              submission to final payout — eliminating manual approvals, reducing leakage, and giving
              finance teams complete audit visibility across every transaction.
            </motion.p>

            {/* Trust pills */}
            <motion.div {...fadeUp(0.27)} className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {[
                { icon: ShieldCheck, label: "SOC 2 Ready"      },
                { icon: Zap,         label: "Real-time Alerts" },
                { icon: Eye,         label: "Full Audit Trail" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-400">
                  <Icon className="h-3 w-3 text-indigo-400" />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.33)}
              className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row lg:items-start"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-7 py-3.5 text-[13.5px] font-semibold text-white shadow-[0_8px_40px_rgba(99,102,241,0.4)] transition-shadow hover:shadow-[0_8px_55px_rgba(99,102,241,0.55)]"
              >
                {/* shimmer */}
                <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                {/* gloss */}
                <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-white/10" />
                <span className="relative z-10">Book Discovery Call</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.a>

              <a
                href="#features"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-[13.5px] font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/25 hover:bg-white/[0.06] hover:text-white"
              >
                Explore Features
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-400" />
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              {...fadeUp(0.42)}
              className="mt-10 flex items-center gap-6 divide-x divide-white/[0.07]"
            >
              {[
                { value: 94, suffix: "%", label: "Faster closures"    },
                { value: 3,  suffix: "×", label: "Audit speed"        },
                { value: 0,  suffix: " leakage", label: "With auto-flags" },
              ].map(({ value, suffix, label }, i) => (
                <div key={label} className={`${i > 0 ? "pl-6" : ""} flex flex-col`}>
                  <span className="text-2xl font-bold text-white tabular-nums">
                    <Counter to={value} suffix={suffix} duration={1.8} />
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-500">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="relative flex w-full flex-col items-center gap-4 lg:w-[360px] xl:w-[400px] shrink-0">

            {/* Live expense ticker */}
            <LiveExpenseTicker />

            {/* Floating badges around the card */}
            <FloatingBadge
              delay={1.1}
              className="-left-4 top-16 hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090e1c]/90 px-3 py-2 backdrop-blur-xl shadow-xl"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-white">Duplicate Detected</span>
                <span className="text-[9px] text-slate-500">Claim #4821 flagged</span>
              </div>
            </FloatingBadge>

            <FloatingBadge
              delay={1.25}
              className="-right-4 bottom-32 hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090e1c]/90 px-3 py-2 backdrop-blur-xl shadow-xl"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-white">Batch Approved</span>
                <span className="text-[9px] text-slate-500">14 claims · ₹91,200</span>
              </div>
            </FloatingBadge>

            <FloatingBadge
              delay={1.4}
              className="left-1/2 -translate-x-1/2 -bottom-4 hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090e1c]/90 px-3 py-2 backdrop-blur-xl shadow-xl whitespace-nowrap"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20">
                <TrendingDown className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-white">Leakage Reduced</span>
                <span className="text-[9px] text-slate-500">↓ 38% this month</span>
              </div>
            </FloatingBadge>
          </div>
        </div>

        {/* ════ FEATURE CARDS ROW ════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              icon: AlertTriangle,
              color: "from-amber-500/20 to-orange-500/20",
              iconColor: "text-amber-300",
              border: "hover:border-amber-400/20",
              title: "Leakage Detection",
              desc: "Auto-flags duplicates, over-limit claims & policy violations before they hit payout.",
            },
            {
              icon: GitBranch,
              color: "from-violet-500/20 to-purple-500/20",
              iconColor: "text-violet-300",
              border: "hover:border-violet-400/20",
              title: "Multi-Level Approvals",
              desc: "Structured workflows with partial approvals, delegation, and escalation paths.",
            },
            {
              icon: Eye,
              color: "from-indigo-500/20 to-blue-500/20",
              iconColor: "text-indigo-300",
              border: "hover:border-indigo-400/20",
              title: "Full Audit Trail",
              desc: "Every edit, approval, and payout logged with timestamps and actor identity.",
            },
            {
              icon: Clock,
              color: "from-emerald-500/20 to-teal-500/20",
              iconColor: "text-emerald-300",
              border: "hover:border-emerald-400/20",
              title: "Faster Month-End",
              desc: "Eliminate back-and-forth. Finance closes books in days, not weeks.",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-400 ${card.border} hover:bg-white/[0.04]`}
              >
                {/* hover top glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} border border-white/[0.06]`}>
                  <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
                </div>

                <h3 className="text-[14px] font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.7] text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                  {card.desc}
                </p>

                {/* Corner accent */}
                <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-slate-600" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ════ SOCIAL PROOF STRIP ════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8"
        >
          {/* Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["SM", "AK", "RD", "PJ"].map((initials, i) => (
                <div
                  key={initials}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#050816] bg-gradient-to-br from-indigo-500/40 to-violet-600/40 text-[9px] font-semibold text-indigo-200"
                  style={{ zIndex: 4 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-[12px] text-slate-500">
              <span className="font-semibold text-slate-300">140+ finance teams</span> trust Expendesk
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="text-[12px] text-slate-500 ml-1">4.9 / 5 from early teams</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}