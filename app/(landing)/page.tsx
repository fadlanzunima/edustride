import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Briefcase, GraduationCap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">EduStride</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Fitur</a>
          <a href="#levels" className="text-sm font-medium hover:text-primary transition-colors">Level</a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">Tentang</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Mulai Sekarang</Button>
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Bangun Portofolio Digital &amp; Skill untuk Masa Depan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Platform edukasi terpadu untuk pelajar Indonesia dari SMA hingga S3. 
              Eksplorasi minat, bangun portofolio, dan siapkan karir impianmu.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Jelajahi Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">Pilih level edukasimu:</p>
              <LevelSwitcher />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Berbagai fitur untuk membantumu berkembang di setiap jenjang pendidikan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-semibold mb-2">Auto-Portfolio Generator</h3>
              <p className="text-muted-foreground">
                Generate portofolio profesional secara otomatis dari data dan pencapaianmu.
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
              <h3 className="text-xl font-semibold mb-2">Smart Skill Roadmap</h3>
              <p className="text-muted-foreground">
                Roadmap skill yang dipersonalisasi berdasarkan level dan tujuan karirmu.
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
              <h3 className="text-xl font-semibold mb-2">LinkedIn Integration</h3>
              <p className="text-muted-foreground">
                Sinkronisasi otomatis dengan LinkedIn untuk membangun personal branding.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Levels Section */}
        <section id="levels" className="container mx-auto px-4 py-20 bg-muted/50 rounded-3xl my-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Untuk Setiap Jenjang</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Didesain khusus untuk kebutuhan pelajar di setiap level pendidikan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-cyan-600 font-bold text-lg mb-2">SMA</div>
              <h3 className="text-xl font-semibold mb-2">Eksplorasi Minat</h3>
              <p className="text-muted-foreground">
                Temukan passionmu dan persiapkan diri untuk masuk perguruan tinggi impian.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-blue-600 font-bold text-lg mb-2">S1</div>
              <h3 className="text-xl font-semibold mb-2">Bangun Karir</h3>
              <p className="text-muted-foreground">
                Magang, organisasi, dan portofolio profesional untuk memulai karir.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-500/10 border border-slate-500/20">
              <div className="text-slate-600 font-bold text-lg mb-2">S2/S3</div>
              <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
              <p className="text-muted-foreground">
                Riset, publikasi jurnal, dan academic branding untuk jenjang pakar.
              </p>
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
            © 2025 EduStride. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
