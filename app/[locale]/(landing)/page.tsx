"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
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
      description: "Monitor perkembangan skill dan portofolio dengan analytics real-time",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      accent: "orange",
      size: "medium",
    },
    {
      icon: Shield,
      title: "Verified Credentials",
      description: "Sertifikat dan pencapaian terverifikasi untuk kredibilitas maksimal",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      accent: "emerald",
      size: "small",
    },
    {
      icon: Rocket,
      title: "Career Booster",
      description: "Koneksi langsung ke opportunity magang dan karir di top companies",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      accent: "pink",
      size: "small",
    },
  ];

  const stats = [
    { value: "10K+", label: t("about.stats.activeUsers"), icon: Users, color: "from-violet-500 to-purple-500" },
    { value: "5K+", label: t("about.stats.portfolios"), icon: Briefcase, color: "from-blue-500 to-cyan-500" },
    { value: "50+", label: t("about.stats.partners"), icon: Award, color: "from-orange-500 to-pink-500" },
    { value: "100%", label: t("about.stats.roadmaps"), icon: Target, color: "from-emerald-500 to-teal-500" },
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
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              EduStride
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#features", label: t("landing.features") },
              { href: "#journey", label: t("landing.journey") },
              { href: "#testimonials", label: t("landing.testimonials") },
              { href: "#about", label: t("landing.about") },
            ].map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:scale-105"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:inline-flex">
                {t("landing.login")}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-600/90 hover:to-fuchsia-600/90 shadow-lg shadow-violet-500/25">
                {t("landing.getStarted")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main>
        {/* Hero Section - Redesigned */}
        <section className="relative pt-32 pb-40 px-4 overflow-hidden">
          <div className="container mx-auto">
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="text-center max-w-6xl mx-auto"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap justify-center gap-2 mb-8"
              >
                {trustBadges.map((badge, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-3 py-1.5 text-xs bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <badge.icon className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    {badge.text}
                  </Badge>
                ))}
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent leading-[1.1]">
                    Build Your Digital
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    Legacy Today
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="group gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-600/90 hover:to-fuchsia-600/90 text-lg px-10 py-7 shadow-2xl shadow-violet-500/30"
                  >
                    {t("landing.exploreDashboard")}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="group gap-2 text-lg px-10 py-7 backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Play className="h-5 w-5" />
                  {t("landing.learnMore")}
                </Button>
              </motion.div>

              {/* Level Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  {t("landing.selectLevel")}
                </p>
                <LevelSwitcher />
              </motion.div>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 100, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-32 relative max-w-6xl mx-auto perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-fuchsia-500/30 blur-3xl -z-10" />
              <div className="relative rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-3 shadow-2xl">
                <div className="rounded-2xl bg-gradient-to-br from-background to-muted p-8 overflow-hidden">
                  {/* Dashboard Mockup */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Sidebar */}
                    <div className="hidden md:block col-span-2 space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-white/10 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                      ))}
                    </div>
                    {/* Main Content */}
                    <div className="col-span-12 md:col-span-10 space-y-4">
                      <div className="h-32 rounded-xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 border border-white/10 animate-pulse" />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 rounded-xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-white/10 animate-pulse delay-100" />
                        <div className="h-24 rounded-xl bg-gradient-to-r from-orange-500/15 to-pink-500/15 border border-white/10 animate-pulse delay-200" />
                        <div className="h-24 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-white/10 animate-pulse delay-300" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40 rounded-xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-white/10 animate-pulse delay-150" />
                        <div className="h-40 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-white/10 animate-pulse delay-250" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Enhanced */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity`} />
                  <stat.icon className={`w-10 h-10 mb-4 bg-gradient-to-br ${stat.color} p-2 rounded-xl text-white`} />
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid Layout */}
        <section id="features" className="py-32 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10">
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

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`
                    group relative overflow-hidden rounded-3xl border border-white/10 
                    bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm
                    hover:border-white/20 transition-all duration-500
                    ${feature.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
                    ${feature.size === "medium" ? "md:col-span-2" : ""}
                  `}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section - Timeline Design */}
        <section id="journey" className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10">
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
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 ${step.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <Card className="relative border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden">
                    <CardContent className="p-8">
                      {/* Number Badge */}
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-5xl font-bold bg-gradient-to-r from-white/20 to-white/5 bg-clip-text text-transparent">
                          {step.number}
                        </span>
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {step.description}
                      </p>
                      
                      {/* Feature Pills */}
                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs bg-white/5 border-white/10"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Modern Cards */}
        <section id="testimonials" className="py-32 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10">
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden group">
                    <CardContent className="p-8 flex flex-col h-full">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      
                      {/* Content */}
                      <p className="text-muted-foreground mb-8 flex-grow text-lg leading-relaxed italic">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      
                      {/* User Info */}
                      <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-2xl shadow-lg">
                          {testimonial.avatar}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-lg">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      {/* Success Badge */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        {testimonial.company}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section - Enhanced */}
        <section id="about" className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border-white/10">
                <Globe className="w-4 h-4 mr-2 text-primary" />
                {t("about.title")}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Building the Future
                </span>
                <br />
                <span className="text-foreground">Of Education</span>
              </h2>
            </motion.div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-semibold mb-6">
                      {t("about.vision.title")}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {t("about.vision.content")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-semibold mb-6">
                      {t("about.mission.title")}
                    </h3>
                    <ul className="space-y-4">
                      {t.raw("about.mission.items").map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-4">
                          <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Why Us */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Lightbulb,
                  title: t("about.whyUs.personalized.title"),
                  description: t("about.whyUs.personalized.description"),
                  gradient: "from-amber-500 via-orange-500 to-red-500",
                },
                {
                  icon: TrendingUp,
                  title: t("about.whyUs.industry.title"),
                  description: t("about.whyUs.industry.description"),
                  gradient: "from-emerald-500 via-teal-500 to-cyan-500",
                },
                {
                  icon: Users,
                  title: t("about.whyUs.community.title"),
                  description: t("about.whyUs.community.description"),
                  gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="text-center border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden group h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Stunning Gradient */}
        <section className="py-40 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -60, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="container mx-auto relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Ready to Start Your
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                  Journey?
                </span>
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                {t("landing.ctaDescription")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group gap-2 text-lg px-10 py-7 shadow-2xl"
                  >
                    {t("landing.getStarted")}
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/60">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Free to Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Join 10K+ Students</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced */}
      <footer className="border-t border-white/10 py-16 px-4 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
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
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Membangun portofolio digital dan skill relevan untuk masa depan pendidikan Indonesia.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Testimonials", "About"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Security", "Cookies"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
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
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Rocket className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
