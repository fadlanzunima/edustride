"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Target,
  Users,
  Lightbulb,
  Heart,
  Rocket,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const params = useParams();
  const locale = (params.locale as string) || "id";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EduStride</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/login`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Masuk
              </Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Tentang EduStride
          </h1>
          <p className="text-xl text-muted-foreground">
            Membangun ekosistem pendidikan terpadu untuk generasi Indonesia yang
            siap menghadapi tantangan industri 2026 dan beyond.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Visi</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi platform edukasi terdepan yang memfasilitasi pelajar
                  Indonesia membangun portofolio digital dan skill relevan
                  dengan industri, menciptakan generasi yang kompeten dan siap
                  bersaing di tingkat global.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Misi</h2>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Menyediakan roadmap skill yang dipersonalisasi untuk
                      setiap jenjang pendidikan
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Membantu pelajar membangun portofolio digital yang
                      profesional
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Menghubungkan pelajar dengan opportunity magang dan kerja
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Menciptakan komunitas pembelajar yang saling mendukung
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why EduStride */}
      <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Mengapa EduStride?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami memahami perjalanan unik setiap pelajar dan menyediakan tools
            yang tepat untuk setiap tahapan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Journey</h3>
            <p className="text-muted-foreground">
              Setiap pelajar memiliki jalur unik. Kami menyesuaikan roadmap
              berdasarkan level, minat, dan tujuan karir Anda.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Industry-Relevant Skills
            </h3>
            <p className="text-muted-foreground">
              Skill yang diajarkan selalu up-to-date dengan kebutuhan industri
              terkini, dari data analytics hingga scientific writing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Bergabung dengan komunitas pelajar dan profesional yang saling
              mendukung pertumbuhan dan pengembangan karir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Target Users */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Untuk Siapa EduStride?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Didesain untuk mendukung perjalanan pendidikan dari SMA hingga
            jenjang pasca sarjana.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="p-6">
              <div className="text-cyan-600 font-bold text-lg mb-2">
                SMA / SMK
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Eksplorasi & Persiapan
              </h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Eksplorasi minat dan bakat</li>
                <li>• Persiapan masuk perguruan tinggi</li>
                <li>• SNBT dan ujian mandiri preparation</li>
                <li>• Basic skill development</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="text-blue-600 font-bold text-lg mb-2">
                Mahasiswa S1
              </div>
              <h3 className="text-xl font-semibold mb-3">Karir & Portofolio</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Magang dan MBKM opportunities</li>
                <li>• Portofolio profesional builder</li>
                <li>• Organisasi dan kepanitiaan</li>
                <li>• Soft skills development</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-500/20 bg-slate-500/5">
            <CardContent className="p-6">
              <div className="text-slate-600 font-bold text-lg mb-2">
                S2 / S3
              </div>
              <h3 className="text-xl font-semibold mb-3">Riset & Akademik</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Research impact tracking</li>
                <li>• Publikasi jurnal guidance</li>
                <li>• Academic branding</li>
                <li>• Grant writing skills</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Pelajar Aktif</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Portofolio Dibuat</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Skill Roadmap</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Partner Industri</div>
          </motion.div>
        </div>
      </section>

      {/* Team / Contact */}
      <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-3xl my-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Mulai Perjalanan Anda</h2>
          <p className="text-muted-foreground mb-8">
            Bergabung dengan ribuan pelajar Indonesia yang sudah membangun
            portofolio dan skill mereka bersama EduStride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/register`}>
              <Button size="lg" className="gap-2">
                <UserPlus className="h-5 w-5" />
                Daftar Sekarang
              </Button>
            </Link>
            <Link href={`/${locale}/login`}>
              <Button size="lg" variant="outline" className="gap-2">
                <LogIn className="h-5 w-5" />
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
