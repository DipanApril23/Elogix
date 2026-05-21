"use client";

import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  type Transition,
} from "framer-motion";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

import {
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  BarChart2,
  Shield,
  Zap,
  Users,
  CreditCard,
  LayoutDashboard,
  type LucideIcon,
  X,
} from "lucide-react";

/* ───────────────────────── animation ───────────────────────── */

const SMOOTH_EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const FAST_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.7,
};

const MENU_SPRING: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 30,
};

/* ───────────────────────── types ───────────────────────── */

type DropdownItem = {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
};

type NavDropdownProps = {
  items: DropdownItem[];
  isOpen: boolean;
};

type MobileNavItemProps = {
  item: NavItem;
  idx: number;
  onClick: () => void;
};

/* ───────────────────────── data ───────────────────────── */

const FEATURES_DROPDOWN: DropdownItem[] = [
  {
    icon: BarChart2,
    label: "Analytics",
    desc: "Real-time spend insights",
    href: "#analytics",
  },
  {
    icon: Zap,
    label: "Automation",
    desc: "AI-powered workflows",
    href: "#automation",
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    desc: "Unified control center",
    href: "#dashboard",
  },
];

const WORKFLOW_DROPDOWN: DropdownItem[] = [
  {
    icon: Users,
    label: "Teams",
    desc: "Collaborate seamlessly",
    href: "#teams",
  },
  {
    icon: Shield,
    label: "Approvals",
    desc: "Multi-level control",
    href: "#approvals",
  },
  {
    icon: CreditCard,
    label: "Budgets",
    desc: "Set & enforce limits",
    href: "#budgets",
  },
];

const NAV_ITEMS: NavItem[] = [
  {
    label: "Features",
    href: "#features",
    dropdown: FEATURES_DROPDOWN,
  },
  {
    label: "Workflow",
    href: "#workflow",
    dropdown: WORKFLOW_DROPDOWN,
  },
  {
    label: "Security",
    href: "#security",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

/* ───────────────────────── dropdown ───────────────────────── */

function NavDropdown({
  items,
  isOpen,
}: NavDropdownProps): ReactNode {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 8,
            scale: 0.98,
          }}
          transition={{
            duration: 0.22,
            ease: SMOOTH_EASE,
          }}
          className="absolute left-1/2 top-full z-50 mt-4 w-64 -translate-x-1/2"
        >
          <div className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-[#0d1525]" />

          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d1525]/95 p-1.5 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-3xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

            {items.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.03,
                    duration: 0.18,
                  }}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-white/[0.05]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-gradient-to-br from-indigo-500/15 to-violet-500/15">
                    <Icon className="h-4 w-4 text-indigo-300" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">
                      {item.label}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      {item.desc}
                    </span>
                  </div>

                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-indigo-400" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── mobile nav item ───────────────────────── */

function MobileNavItem({
  item,
  idx,
  onClick,
}: MobileNavItemProps): ReactNode {
  const [open, setOpen] = useState(false);

  const hasDropdown = Boolean(item.dropdown?.length);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: idx * 0.04,
        duration: 0.25,
        ease: SMOOTH_EASE,
      }}
    >
      {hasDropdown ? (
        <div className="overflow-hidden rounded-2xl">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="group flex w-full items-center justify-between rounded-2xl px-4 py-4 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-[15px] font-medium text-white">
              {item.label}
            </span>

            <motion.div
              animate={{
                rotate: open ? 180 : 0,
              }}
              transition={FAST_SPRING}
            >
              <ChevronDown className="h-4 w-4 text-slate-500 transition-colors duration-200 group-hover:text-white" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.22,
                  ease: SMOOTH_EASE,
                }}
                className="overflow-hidden"
              >
                <div className="space-y-1 px-2 pb-2">
                  {item.dropdown?.map((sub) => {
                    const Icon = sub.icon;

                    return (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={onClick}
                        className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-white/[0.04]"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10">
                          <Icon className="h-3.5 w-3.5 text-indigo-400" />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-200">
                            {sub.label}
                          </span>

                          <span className="text-[11px] text-slate-500">
                            {sub.desc}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <a
          href={item.href}
          onClick={onClick}
          className="group flex items-center justify-between rounded-2xl px-4 py-4 transition-all duration-200 hover:bg-white/[0.04]"
        >
          <span className="text-[15px] font-medium text-white">
            {item.label}
          </span>

          <ArrowUpRight className="h-4 w-4 text-slate-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-indigo-400" />
        </a>
      )}
    </motion.div>
  );
}

/* ───────────────────────── navbar ───────────────────────── */

export default function Navbar(): ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [scrollPct, setScrollPct] = useState(0);

  const navRef = useRef<HTMLElement | null>(null);

  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrollPct(value);
  });

  /* scroll */
  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* body lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* outside click */
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const openMenu = useCallback((label: string): void => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }

    setOpenDropdown(label);
  }, []);

  const closeMenu = useCallback((): void => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 80);
  }, []);

  return (
    <>
      {/* progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400"
        style={{
          scaleX: scrollPct,
        }}
      />

      {/* header */}
      <motion.header
        ref={navRef}
        initial={{
          y: -70,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.45,
          ease: SMOOTH_EASE,
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* background */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            scrolled || mobileOpen
              ? "bg-[#050816]/80 backdrop-blur-3xl"
              : "bg-transparent"
          }`}
        />

        {/* removed grey border issue */}
        <div
          className={`absolute bottom-0 inset-x-0 h-px transition-opacity duration-300 ${
            scrolled || mobileOpen
              ? "opacity-100 bg-white/[0.05]"
              : "opacity-0"
          }`}
        />

        {/* glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

        <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* logo */}
          <Link
            href="/"
            className="group relative z-20 flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40" />

              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_10px_40px_rgba(99,102,241,0.45)]">
                <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative z-10 text-sm font-bold text-white">
                  E
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[16px] font-semibold tracking-tight text-white">
                Expendesk
              </span>

              <span className="hidden text-[9px] uppercase tracking-[0.24em] text-slate-500 min-[480px]:block">
                Intelligence
              </span>
            </div>
          </Link>

          {/* desktop nav */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = Boolean(
                item.dropdown?.length
              );

              const isOpen =
                openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    openMenu(item.label)
                  }
                  onMouseLeave={closeMenu}
                >
                  {hasDropdown ? (
                    <button className="group relative flex items-center gap-1 rounded-full px-4 py-2.5 text-[13px] font-medium text-slate-300 transition-all duration-200 hover:text-white">
                      <span className="relative">
                        {item.label}

                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-200 group-hover:w-full" />
                      </span>

                      <motion.div
                        animate={{
                          rotate: isOpen ? 180 : 0,
                        }}
                        transition={FAST_SPRING}
                      >
                        <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-colors duration-200 group-hover:text-white" />
                      </motion.div>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="group relative rounded-full px-4 py-2.5 text-[13px] font-medium text-slate-300 transition-all duration-200 hover:text-white"
                    >
                      <span className="relative">
                        {item.label}

                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-200 group-hover:w-full" />
                      </span>
                    </a>
                  )}

                  {hasDropdown && item.dropdown && (
                    <div
                      onMouseEnter={() =>
                        openMenu(item.label)
                      }
                      onMouseLeave={closeMenu}
                    >
                      <NavDropdown
                        items={item.dropdown}
                        isOpen={isOpen}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* desktop buttons */}
          <div className="hidden items-center gap-3 md:flex">

            <motion.a
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={FAST_SPRING}
              href="#demo"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-2.5 text-[13px] font-medium text-white shadow-[0_10px_40px_rgba(99,102,241,0.4)]"
            >
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative z-10 flex items-center gap-1.5">
                Book a Demo

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          </div>

          {/* mobile hamburger */}
          <button
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            aria-label="Toggle mobile menu"
            className={`relative z-[90] flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 md:hidden ${
              mobileOpen
                ? "bg-indigo-500/10"
                : "bg-white/[0.04]"
            }`}
          >
            <div className="relative h-5 w-5">
              {/* top */}
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 8 : 2,
                }}
                transition={MENU_SPRING}
                className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-white"
              />

              {/* middle */}
              <motion.span
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  scaleX: mobileOpen ? 0 : 1,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="absolute left-0 top-[8px] h-[2px] w-5 rounded-full bg-white"
              />

              {/* bottom */}
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -8 : 14,
                }}
                transition={MENU_SPRING}
                className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-white"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence mode="wait">
        {mobileOpen && (
          <>
            {/* overlay */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={() =>
                setMobileOpen(false)
              }
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xl md:hidden"
            />

            {/* drawer */}
            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                duration: 0.35,
                ease: SMOOTH_EASE,
              }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[340px] flex-col overflow-hidden bg-[#050816]/95 backdrop-blur-3xl md:hidden"
            >
              {/* glow */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-[-100px] top-[-100px] h-[220px] w-[220px] rounded-full bg-indigo-500/15 blur-[100px]" />

                <div className="absolute bottom-[-120px] right-[-120px] h-[240px] w-[240px] rounded-full bg-violet-500/15 blur-[120px]" />
              </div>

              {/* top */}
              <div className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-5">
                <div className="flex items-center gap-3">
                  {/* logo */}
                </div>

                <button
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04]"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* nav */}
              <div className="relative flex-1 overflow-y-auto px-3 py-5">
                <div className="space-y-1">
                  {NAV_ITEMS.map((item, idx) => (
                    <MobileNavItem
                      key={item.label}
                      item={item}
                      idx={idx}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* buttons */}
              <div className="relative border-t border-white/[0.06] p-5">
                <motion.a
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  transition={FAST_SPRING}
                  href="#demo"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-4 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(99,102,241,0.45)]"
                >
                  <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative z-10">
                    Book a Demo
                  </span>

                  <Sparkles className="relative z-10 h-4 w-4" />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
          background: #050816;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }
      `}</style>
    </>
  );
}