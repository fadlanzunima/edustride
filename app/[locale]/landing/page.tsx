"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, useScroll, useTransform } from "motion/react";
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
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

// Simple floating particles with CSS animation
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20 animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + i * 2}s`,
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

// Simple 3D hover effect with CSS
function Card3D({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`group perspective ${className}`}>
      <div className="transition-transform duration-300 ease-out group-hover:rotate-y-2 group-hover:rotate-x-2 transform-gpu">
        {children}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] -z-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Gradient Mesh Background - CSS only */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <FloatingParticles />
        <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/15 via-pink-500/15 to-rose-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/70 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              EduStride
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#features", label: t("landing.features") },
              { href: "#levels", label: t("landing.levels") },
              { href: "#about", label: t("landing.about") },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <LanguageSwitcher />
            <ModeToggle />
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/id/login">{t("navigation.login")}</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-90 shadow-lg shadow-violet-500/25"
              asChild
            >
              <Link href="/id/register">
                {t("navigation.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 py-20"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm mb-8"
            >
              <Star className="w-4 h-4 text-violet-500 fill-violet-500" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                {t("landing.badge")}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {t("landing.subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-90 text-lg px-8 py-6 shadow-xl shadow-violet-500/25"
                asChild
              >
                <Link href="/id/register">
                  {t("landing.ctaPrimary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 hover:bg-violet-500/10 transition-colors"
                asChild
              >
                <Link href="/id/dashboard">
                  <Play className="mr-2 h-5 w-5" />
                  {t("landing.ctaSecondary")}
                </Link>
              </Button>
            </motion.div>

            {/* Level Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-sm text-muted-foreground">
                {t("landing.selectLevel")}
              </p>
              <LevelSwitcher />
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 pt-8 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Dipercaya oleh pelajar dari
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-50">
                {partners.slice(0, 4).map((partner) => (
                  <span
                    key={partner}
                    className="text-lg font-semibold text-muted-foreground"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-sm bg-violet-500/10 text-violet-600 border-violet-500/20"
            >
              <Zap className="w-4 h-4 mr-2 text-primary" />
              {t("landing.featuresTitle")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("landing.featuresSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${
                  feature.size === "large" ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <Card3D>
                  <Card className="h-full bg-gradient-to-br from-background to-muted/50 border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 group overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />
                    <CardContent className="p-6 relative">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-sm bg-violet-500/10 text-violet-600 border-violet-500/20"
            >
              <Target className="w-4 h-4 mr-2 text-primary" />
              {t("landing.levelsTitle")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("landing.levelsTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("landing.levelsSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-2xl opacity-20 group-hover:opacity-40 blur transition-opacity duration-500`}
                />
                <Card className="relative h-full bg-background/80 backdrop-blur-xl border-border/50 overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
                      >
                        {step.number}
                      </span>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${step.color}`}
                      >
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-1 rounded-full bg-muted"
                        >
                          {feature}
                        </span>
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
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-sm bg-violet-500/10 text-violet-600 border-violet-500/20"
            >
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              {t("landing.testimonials")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Apa Kata Mereka?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-background to-muted/30 border-border/50 hover:border-violet-500/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{testimonial.avatar}</span>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <span className="text-sm font-medium text-violet-600">
                        {testimonial.company}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl blur-2xl opacity-50" />
              <div className="relative rounded-[22px] bg-background p-8 md:p-12">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {t("landing.ctaTitle")}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                    {t("landing.ctaDescription")}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-90 text-lg px-10 py-7 shadow-xl"
                      asChild
                    >
                      <Link href="/id/register">
                        {t("landing.ctaPrimary")}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-10 py-7"
                      asChild
                    >
                      <Link href="/id/dashboard">
                        {t("landing.exploreDashboard")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Marquee */}
      <section className="py-12 border-y border-border/50 overflow-hidden">
        <Marquee speed={40}>
          <div className="flex items-center gap-12 px-6">
            {trustBadges.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <badge.icon className="w-5 h-5 text-violet-500" />
                <span className="font-medium whitespace-nowrap">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                EduStride
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright", { year: 2026 })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
