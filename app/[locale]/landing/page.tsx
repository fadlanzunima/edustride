"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">EduStride</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            {t("navigation.features")}
          </a>
          <a href="#levels" className="text-sm font-medium hover:text-primary transition-colors">
            {t("navigation.levels")}
          </a>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            {t("navigation.about")}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/dashboard">
            <Button variant="ghost">{t("navigation.login")}</Button>
          </Link>
          <Link href="/dashboard">
            <Button>{t("navigation.getStarted")}</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 px-4 sm:px-0">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  {t("navigation.exploreDashboard")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">{t("hero.selectLevel")}</p>
              <LevelSwitcher />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("features.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("features.autoPortfolio.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("features.autoPortfolio.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("features.smartRoadmap.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("features.smartRoadmap.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("features.linkedin.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("features.linkedin.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Levels Section */}
        <section id="levels" className="container mx-auto px-4 py-20 bg-muted/50 rounded-3xl my-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("levels.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t("levels.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-cyan-600 font-bold text-lg mb-2">{t("levels.sma.name")}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("levels.sma.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{t("levels.sma.description")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-blue-600 font-bold text-lg mb-2">{t("levels.s1.name")}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("levels.s1.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{t("levels.s1.description")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-500/10 border border-slate-500/20">
              <div className="text-slate-600 font-bold text-lg mb-2">{t("levels.s2s3.name")}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("levels.s2s3.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{t("levels.s2s3.description")}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">EduStride</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
