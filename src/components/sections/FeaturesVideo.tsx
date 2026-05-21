"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Play,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Layers3,
  Activity,
} from "lucide-react";

const floatingBadges = [
  {
    title: "Autonomous Auditing",
    icon: ShieldCheck,
    position:
      "-top-5 left-1/2 -translate-x-1/2 lg:left-auto lg:right-16 lg:translate-x-0",
    depth: 1.4,
  },
  {
    title: "Real-time Showreel",
    icon: Activity,
    position: "top-1/2 -right-4 -translate-y-1/2 lg:-right-8",
    depth: 1.8,
  },
  {
    title: "Ledger Sync",
    icon: Layers3,
    position: "-bottom-4 left-5 lg:left-12",
    depth: 1.2,
  },
  {
    title: "AI Validation",
    icon: Sparkles,
    position: "top-20 -left-3 lg:-left-8",
    depth: 1.6,
  },
];

type FloatingBadgeProps = {
  title: string;
  icon: React.ElementType;
  position: string;
  depth: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
};

function FloatingBadge({
  title,
  icon: Icon,
  position,
  depth,
  mouseX,
  mouseY,
}: FloatingBadgeProps) {
  const x = useTransform(mouseX, [-0.5, 0.5], [-18 * depth, 18 * depth]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-14 * depth, 14 * depth]);

  return (
    <motion.div
      style={{ x, y }}
      whileHover={{
        scale: 1.08,
        y: -2,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className={`absolute z-40 ${position}`}
    >
      <div
        className="
          group relative overflow-hidden
          rounded-2xl border border-white/[0.08]
          bg-white/[0.04]
          backdrop-blur-xl
          shadow-[0_0_40px_rgba(124,58,237,0.12)]
        "
      >
        <div
          className="
            absolute inset-0 opacity-0 transition-opacity duration-500
            group-hover:opacity-100
            bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.28),transparent_70%)]
          "
        />

        <div className="relative flex items-center gap-3 px-4 py-3">
          <div
            className="
              flex h-9 w-9 items-center justify-center rounded-xl
              border border-white/[0.08]
              bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10
            "
          >
            <Icon className="h-4 w-4 text-violet-200" />
          </div>

          <div className="overflow-hidden">
            <p
              className="
                text-sm font-medium tracking-tight text-white/90
                transition-all duration-300
                group-hover:tracking-normal
              "
            >
              {title}
            </p>

            <p className="text-[11px] text-white/40">
              Interactive intelligence
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductVideoShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    {
      stiffness: 90,
      damping: 25,
      mass: 0.8,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-12, 12]),
    {
      stiffness: 90,
      damping: 25,
      mass: 0.8,
    }
  );

  const glowX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const glowY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const glowTranslateX = useTransform(glowX, [-0.5, 0.5], [-120, 120]);
  const glowTranslateY = useTransform(glowY, [-0.5, 0.5], [-80, 80]);

  const backgroundGlow = useMotionTemplate`
    radial-gradient(
      circle at 50% 50%,
      rgba(139,92,246,0.24),
      rgba(91,33,182,0.12),
      transparent 70%
    )
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const width = rect.width;
    const height = rect.height;

    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className="
        relative overflow-hidden
        bg-[#030617]
        py-24 sm:py-28 lg:py-36
      "
    >
      {/* Deep Background Grid */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
          bg-[size:72px_72px]
          [mask-image:radial-gradient(circle_at_center,black,transparent_95%)]
        "
      />

      {/* Ambient Glow Mesh */}
      <motion.div
        style={{
          x: glowTranslateX,
          y: glowTranslateY,
          background: backgroundGlow,
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute left-1/2 top-1/2
          h-[520px] w-[520px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full blur-[120px]
        "
      />

      {/* Extra Blur Layer */}
      <div
        className="
          absolute left-1/2 top-[55%]
          h-[320px] w-[720px]
          -translate-x-1/2
          rounded-full
          bg-violet-600/10
          blur-[140px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="
              inline-flex items-center gap-2
              rounded-full border border-white/[0.08]
              bg-white/[0.03]
              px-4 py-2
              backdrop-blur-xl
            "
          >
            <Sparkles className="h-4 w-4 text-violet-300" />

            <span className="text-sm text-white/70">
              Interactive Product Intelligence
            </span>
          </div>

          <h2
            className="
              mt-6 text-4xl font-semibold tracking-tight text-white
              sm:text-5xl lg:text-6xl
            "
          >
            Your financial workflow,
            <span
              className="
                bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300
                bg-clip-text text-transparent
              "
            >
              {" "}
              rendered in motion.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-6 max-w-2xl
              text-base leading-7 text-white/50 sm:text-lg
            "
          >
            Showcase intelligent approvals, AI-powered auditing, and live
            operational visibility inside a cinematic product experience built
            for modern finance teams.
          </p>
        </div>

        {/* Showcase */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="
            relative mx-auto mt-20
            flex max-w-6xl items-center justify-center
            [perspective:1800px]
          "
        >
          {/* Floating Badges */}
          {floatingBadges.map((badge) => (
            <FloatingBadge
              key={badge.title}
              {...badge}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}

          {/* Main 3D Window */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="
              relative w-full
              rounded-[2rem]
              border border-white/[0.08]
              bg-slate-950/40
              backdrop-blur-2xl
              shadow-[0_40px_120px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.04),0_0_120px_rgba(91,33,182,0.18)]
            "
          >
            {/* Reflection Layer */}
            <div
              className="
                pointer-events-none absolute inset-0 rounded-[2rem]
                bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_18%,transparent_82%,rgba(255,255,255,0.03))]
              "
            />

            {/* Inner Shadow */}
            <div
              className="
                absolute inset-0 rounded-[2rem]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-30px_80px_rgba(0,0,0,0.55)]
              "
            />

            {/* Top Browser Bar */}
            <div
              className="
                flex items-center justify-between
                border-b border-white/[0.06]
                px-5 py-4
              "
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>

              <div
                className="
                  hidden rounded-full border border-white/[0.06]
                  bg-white/[0.03]
                  px-4 py-1 text-xs text-white/40
                  sm:block
                "
              >
                expendedesk.ai/dashboard-preview
              </div>

              <div className="flex items-center gap-2 text-white/40">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Video Area */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-b-[2rem]">
              {/* Replace this with your actual video later */}
              <div
                className="
                  absolute inset-0
                  bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_45%),linear-gradient(to_bottom,rgba(15,23,42,0.5),rgba(2,6,23,0.98))]
                "
              />

              {/* Decorative Dashboard */}
              <div className="absolute inset-0 p-5 sm:p-8">
                <div className="grid h-full grid-cols-12 gap-4">
                  {/* Sidebar */}
                  <div
                    className="
                      col-span-3 hidden rounded-3xl
                      border border-white/[0.06]
                      bg-white/[0.03]
                      p-4 lg:block
                    "
                  >
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="
                            h-10 rounded-2xl
                            bg-white/[0.04]
                          "
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main Panel */}
                  <div className="col-span-12 lg:col-span-9">
                    <div
                      className="
                        relative flex h-full flex-col overflow-hidden
                        rounded-3xl border border-white/[0.06]
                        bg-white/[0.03]
                      "
                    >
                      {/* Fake Graph Glow */}
                      <div
                        className="
                          absolute inset-0 opacity-60
                          bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.28),transparent_35%)]
                        "
                      />

                      <div className="relative flex items-center justify-between border-b border-white/[0.05] px-6 py-5">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            AI Finance Intelligence
                          </h3>

                          <p className="mt-1 text-sm text-white/40">
                            Interactive platform preview
                          </p>
                        </div>

                        <button
                          className="
                            group inline-flex items-center gap-2
                            rounded-full border border-white/[0.08]
                            bg-white/[0.04]
                            px-4 py-2 text-sm text-white/80
                            transition-all duration-300
                            hover:border-violet-400/40
                            hover:bg-violet-500/10
                          "
                        >
                          Watch Flow

                          <ArrowUpRight
                            className="
                              h-4 w-4 transition-transform duration-300
                              group-hover:-translate-y-0.5
                              group-hover:translate-x-0.5
                            "
                          />
                        </button>
                      </div>

                      <div className="relative flex-1 p-6">
                        <div className="grid h-full grid-cols-12 gap-4">
                          <div
                            className="
                              col-span-12 rounded-3xl
                              border border-white/[0.05]
                              bg-black/20 p-5
                              md:col-span-8
                            "
                          >
                            <div
                              className="
                                flex h-full items-center justify-center
                                rounded-[1.75rem]
                                border border-dashed border-white/[0.08]
                                bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10
                              "
                            >
                              <button
                                className="
                                  group flex h-24 w-24 items-center justify-center
                                  rounded-full
                                  border border-white/10
                                  bg-white/[0.08]
                                  backdrop-blur-xl
                                  transition-all duration-500
                                  hover:scale-105
                                  hover:bg-violet-500/20
                                "
                              >
                                <div
                                  className="
                                    flex h-16 w-16 items-center justify-center
                                    rounded-full
                                    bg-gradient-to-br from-violet-500 to-fuchsia-500
                                    shadow-[0_0_40px_rgba(168,85,247,0.55)]
                                  "
                                >
                                  <Play
                                    className="ml-1 h-6 w-6 fill-white text-white"
                                  />
                                </div>
                              </button>
                            </div>
                          </div>

                          <div className="col-span-12 space-y-4 md:col-span-4">
                            {[1, 2, 3].map((item) => (
                              <div
                                key={item}
                                className="
                                  rounded-2xl border border-white/[0.05]
                                  bg-white/[0.03]
                                  p-4
                                "
                              >
                                <div className="h-2 w-20 rounded-full bg-white/10" />

                                <div className="mt-4 h-24 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Noise Texture */}
              <div
                className="
                  pointer-events-none absolute inset-0 opacity-[0.035]
                  [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]
                "
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}