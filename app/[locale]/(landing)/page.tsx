"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Target,
  Zap,
  Globe,
  CheckCircle2,
  Star,
  Play,
  ChevronRight,
  Layers,
  Shield,
  Rocket,
  BarChart3,
  FileText,
  Lightbulb,
  Heart,
  ArrowUpRight,
  MousePointer2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState, useCallback } from "react";

// Text scramble animation component
function TextScramble({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    let frame = 0;
    const finalText = text;
    const duration = 30;

    const animate = () => {
      let output = "";
      const progress = frame / duration;

      for (let i = 0; i < finalText.length; i++) {
        if (i < Math.floor(progress * finalText.length)) {
          output += finalText[i];
        } else if (finalText[i] === " ") {
          output += " ";
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(output);
      frame++;

      if (frame <= duration) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(finalText);
      }
    };

    const timer = setTimeout(() => animate(), 500);
    return () => clearTimeout(timer);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}

// Magnetic button component
function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Button ref={ref} className={className}>
        {children}
      </Button>
    </motion.div>
  );
}

// Floating particle component
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Marquee component
function Marquee({
  children,
  direction = "left",
  speed = 30,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
}) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex"
        animate={{
          x: direction === "left" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// 3D Card component
function Card3D({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateY.set(((e.clientX - centerX) / rect.width) * 20);
    rotateX.set(-((e.clientY - centerY) / rect.height) * 20);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Spotlight effect component
function SpotlightEffect() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.15), transparent 80%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ background }}
    />
  );
}

// Scroll velocity skew hook
function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > 0) {
        const newVelocity = (deltaY / deltaTime) * 10;
        setVelocity(Math.max(-5, Math.min(5, newVelocity)));
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return velocity;
}

export default function LandingPage() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollVelocity = useScrollVelocity();
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const skewY = useTransform(() => scrollVelocity * 0.5);

  const features = [
    {
      icon: FileText,
      title: t("features.autoPortfolio.title"),
      description: t("features.autoPortfolio.description"),
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      accent: "violet",
      size: "large",
    },
    {
      icon: Target,
      title: t("features.smartRoadmap.title"),
      description: t("features.smartRoadmap.description"),
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      accent: "cyan",
      size: "medium",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Monitor perkembangan skill dan portofolio dengan analytics real-time",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      accent: "orange",
      size: "medium",
    },
    {
      icon: Shield,
      title: "Verified Credentials",
      description:
        "Sertifikat dan pencapaian terverifikasi untuk kredibilitas maksimal",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      accent: "emerald",
      size: "small",
    },
    {
      icon: Rocket,
      title: "Career Booster",
      description:
        "Koneksi langsung ke opportunity magang dan karir di top companies",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      accent: "pink",
      size: "small",
    },
  ];

  const stats = [
    {
      value: "10K+",
      label: t("about.stats.activeUsers"),
      icon: Users,
      color: "from-violet-500 to-purple-500",
    },
    {
      value: "5K+",
      label: t("about.stats.portfolios"),
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "50+",
      label: t("about.stats.partners"),
      icon: Award,
      color: "from-orange-500 to-pink-500",
    },
    {
      value: "100%",
      label: t("about.stats.roadmaps"),
      icon: Target,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Amelia",
      role: "S1 - Universitas Indonesia",
      avatar: "👩‍🎓",
      content:
        "EduStride membantu saya membuat portofolio profesional dengan mudah. Sekarang saya lebih percaya diri melamar magang!",
      rating: 5,
      company: "Accepted at GoTo",
    },
    {
      name: "Muhammad Rizki",
      role: "SMA - SMAN 8 Jakarta",
      avatar: "👨‍🎓",
      content:
        "Platform ini membantuku menemukan passion di bidang data science. Roadmap-nya sangat terstruktur!",
      rating: 5,
      company: "SNBT Accepted",
    },
    {
      name: "Dr. Andi Pratama",
      role: "S3 - Institut Teknologi Bandung",
      avatar: "🧑‍🏫",
      content:
        "Fitur tracking publikasi riset sangat membantu saya mengelola penelitian dan meningkatkan academic branding.",
      rating: 5,
      company: "Published 5 Papers",
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("levels.sma.title"),
      description: t("levels.sma.description"),
      icon: Sparkles,
      color: "from-cyan-400 via-cyan-500 to-blue-500",
      bgGlow: "bg-cyan-500/30",
      features: ["Career Exploration", "SNBT Prep", "Skill Discovery"],
    },
    {
      number: "02",
      title: t("levels.s1.title"),
      description: t("levels.s1.description"),
      icon: TrendingUp,
      color: "from-blue-500 via-indigo-500 to-purple-500",
      bgGlow: "bg-blue-500/30",
      features: ["Internship Ready", "Portfolio Build", "Network Growth"],
    },
    {
      number: "03",
      title: t("levels.s2s3.title"),
      description: t("levels.s2s3.description"),
      icon: Award,
      color: "from-purple-500 via-pink-500 to-rose-500",
      bgGlow: "bg-purple-500/30",
      features: ["Research Track", "Publication Mgmt", "Academic Brand"],
    },
  ];

  const trustBadges = [
    { icon: Shield, text: "Data Terenkripsi" },
    { icon: CheckCircle2, text: "Terpercaya 10K+ Users" },
    { icon: Rocket, text: "Career Success" },
    { icon: Heart, text: "Built with Love" },
    { icon: Star, text: "4.9/5 Rating" },
    { icon: Award, text: "Award Winning" },
  ];

  const partners = [
    "Google",
    "Microsoft",
    "Amazon",
    "Tokopedia",
    "Gojek",
    "Grab",
    "Shopee",
    "Sea",
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background overflow-x-hidden"
    >
      {/* Spotlight Effect */}
      <SpotlightEffect />

      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] -z-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <FloatingParticles />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/15 via-pink-500/15 to-rose-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/70 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25"
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              EduStride
            </span>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-8"
          >
            {["features", "journey", "testimonials", "about"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <LevelSwitcher />
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex hover:bg-white/5"
              >
                {t("navigation.login")}
              </Button>
            </Link>
            <MagneticButton className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-90 shadow-lg shadow-violet-500/25">
              {t("navigation.getStarted")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </MagneticButton>
          </motion.div>
        </div>
      </header>

      <motion.main style={{ skewY }}>
        {/* Hero Section - 3D Perspective */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 overflow-hidden">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="container mx-auto text-center relative z-10"
          >
            {/* Trust Badges Marquee */}
            <div className="mb-8">
              <Marquee speed={40}>
                <div className="flex items-center gap-8 px-4">
                  {trustBadges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                    >
                      <badge.icon className="w-4 h-4 text-primary" />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Now with AI-Powered Portfolio Builder
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <TextScramble
                text="Build Your"
                className="block bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
              />
              <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Digital Legacy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {t("landing.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <MagneticButton className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-90 text-lg px-8 py-6 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
                {t("landing.ctaPrimary")}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              </MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="group border-white/20 hover:bg-white/5 px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("landing.ctaSecondary")}
              </Button>
            </motion.div>

            {/* 3D Floating Cards */}
            <div className="relative max-w-5xl mx-auto h-[400px] perspective-1000">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateX: [0, 5, 0],
                  rotateY: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-0 top-0 w-64 h-40 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(50px)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold">Portfolio Builder</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded-full" />
                  <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotateX: [0, -5, 0],
                  rotateY: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute right-0 top-10 w-64 h-40 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(100px)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold">Skill Roadmap</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["React", "Node.js", "AI/ML"].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white/10 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -25, 0],
                  rotateX: [0, 3, 0],
                  rotateY: [0, -3, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 w-80 h-48 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/30 p-6 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateX(-50%) translateZ(150px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold block">
                        Analytics Dashboard
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Real-time tracking
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    +24%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Skills",
                      value: "12",
                      color: "from-violet-500 to-purple-500",
                    },
                    {
                      label: "Projects",
                      value: "8",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      label: "Score",
                      value: "94",
                      color: "from-emerald-500 to-teal-500",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-white/5"
                    >
                      <div
                        className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -18, 0],
                  rotateX: [0, -3, 0],
                  rotateY: [0, 3, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute left-20 bottom-0 w-56 h-32 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-white/20 p-5 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(75px)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-5 h-5 text-pink-400" />
                  <span className="font-medium text-sm">Career Boost</span>
                </div>
                <div className="flex -space-x-2">
                  {["👨‍💼", "👩‍💻", "👨‍🎓", "👩‍🏫"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs text-violet-400">
                    +99
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -22, 0],
                  rotateX: [0, 4, 0],
                  rotateY: [0, -4, 0],
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute right-20 bottom-10 w-56 h-32 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-white/20 p-5 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(125px)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-sm">Achievement</span>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Level 5
                  </span>
                  <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Partners Marquee */}
        <section className="py-12 border-y border-white/10 overflow-hidden">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by students from leading universities
          </p>
          <Marquee speed={25} direction="right">
            <div className="flex items-center gap-16 px-8">
              {partners.map((partner) => (
                <div
                  key={partner}
                  className="text-2xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-default"
                >
                  {partner}
                </div>
              ))}
            </div>
          </Marquee>
        </section>

        {/* Stats Section - Floating Cards */}
        <section id="about" className="py-32 px-4 relative">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10"
              >
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                {t("about.statsTitle")}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Growing Together
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <Card3D key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity`}
                    />
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-30 rounded-3xl blur-xl transition-opacity`}
                    />
                    <stat.icon
                      className={`w-10 h-10 mb-4 bg-gradient-to-br ${stat.color} p-2 rounded-xl text-white`}
                    />
                    <motion.div
                      className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </motion.div>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid with 3D */}
        <section id="features" className="py-32 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10"
              >
                <Zap className="w-4 h-4 mr-2 text-primary" />
                {t("landing.featuresTitle")}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="text-foreground">To Succeed</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("landing.featuresSubtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto perspective-1000">
              {features.map((feature, index) => (
                <Card3D
                  key={index}
                  className={`
                    ${
                      feature.size === "large"
                        ? "md:col-span-2 md:row-span-2"
                        : ""
                    }
                    ${feature.size === "medium" ? "md:col-span-2" : ""}
                  `}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`
                      group relative overflow-hidden rounded-3xl border border-white/10
                      bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm
                      hover:border-white/20 transition-all duration-500 h-full
                    `}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <div
                      className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                    />
                    <CardContent className="p-8 h-full flex flex-col relative">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground flex-grow">
                        {feature.description}
                      </p>
                      <motion.div
                        className="mt-6 flex items-center text-sm font-medium text-primary"
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                      >
                        Learn more <ArrowUpRight className="w-4 h-4 ml-1" />
                      </motion.div>
                    </CardContent>
                  </motion.div>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section - Enhanced Timeline */}
        <section id="journey" className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10"
              >
                <Target className="w-4 h-4 mr-2 text-primary" />
                {t("landing.levelsTitle")}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Your Journey,
                </span>
                <br />
                <span className="text-foreground">Your Pace</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("landing.levelsSubtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div
                    className={`absolute inset-0 ${step.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <Card className="relative border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <motion.span
                          className="text-5xl font-bold bg-gradient-to-r from-white/20 to-white/5 bg-clip-text text-transparent"
                          whileHover={{ scale: 1.1 }}
                        >
                          {step.number}
                        </motion.span>
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 6 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <step.icon className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>

                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {step.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                          >
                            <Badge
                              variant="secondary"
                              className="text-xs bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                            >
                              {feature}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10"
              >
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                {t("landing.testimonials")}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Loved by Students
                </span>
                <br />
                <span className="text-foreground">Across Indonesia</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card3D key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card className="h-full border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden group">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex items-center gap-1 mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 + i * 0.05 }}
                            >
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-lg mb-6 flex-grow">
                          {testimonial.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-2xl border border-white/10"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            {testimonial.avatar}
                          </motion.div>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          >
                            {testimonial.company}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20" />
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="container mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  Ready to Build
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Your Legacy?
                </span>
              </h2>
              <p className="text-xl text-white/70 mb-10">
                Join 10,000+ students who are already building their digital
                future with EduStride.
              </p>
              <MagneticButton className="bg-white text-violet-600 hover:bg-white/90 text-lg px-10 py-7 shadow-2xl shadow-black/20">
                {t("landing.ctaPrimary")}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              </MagneticButton>

              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/60">
                {[
                  { icon: Shield, text: "Free to Start" },
                  { icon: CheckCircle2, text: "No Credit Card Required" },
                  { icon: Heart, text: "Join 10K+ Students" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    EduStride
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Platform Edukasi Terpadu
                  </p>
                </div>
              </motion.div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Membangun portofolio digital dan skill relevan untuk masa depan
                pendidikan Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Testimonials", "About"].map(
                  (item) => (
                    <li key={item}>
                      <motion.a
                        href={`#${item.toLowerCase()}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                        whileHover={{ x: 5 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Security", "Cookies"].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-6">
              {[Globe, Users, Rocket].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
