"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  School,
  GraduationCap,
  Target,
  Award,
  Users,
  BookOpen,
  Globe,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const t = useTranslations("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const user = session?.user;

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Profile updated successfully");
    setIsLoading(false);
  };

  const handleTogglePublic = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      if (enabled) {
        const response = await fetch("/api/profile/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setShareUrl(data.shareUrl);
        setIsPublic(true);
        toast.success("Profile sharing enabled!");
      } else {
        await fetch("/api/profile/share", { method: "DELETE" });
        setShareUrl("");
        setIsPublic(false);
        toast.success("Profile sharing disabled");
      }
    } catch {
      toast.error("Failed to update sharing settings");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil SMA</h1>
        <p className="text-muted-foreground">
          Kelola informasi profil dan akademikmu untuk persiapan SNBT
        </p>
      </div>

      {/* Profile Sharing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Bagikan Profil
          </CardTitle>
          <CardDescription>
            Bagikan portofoliomu ke teman, guru, atau mentor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profil Publik</Label>
              <p className="text-sm text-muted-foreground">
                Izinkan orang lain melihat portofoliomu dengan link
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={isLoading}
            />
          </div>

          {isPublic && shareUrl && (
            <div className="space-y-2">
              <Label>Link Share</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Informasi dasar profilmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="text-2xl bg-cyan-100 text-cyan-700">
                {user?.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user?.name || "Siswa SMA"}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                <School className="h-3 w-3 mr-1" />
                SMA
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information - SMA Specific */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Informasi Akademik
          </CardTitle>
          <CardDescription>Data sekolah dan target akademikmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schoolName">Nama Sekolah</Label>
              <Input
                id="schoolName"
                placeholder="Contoh: SMA Negeri 1 Jakarta"
                defaultValue={user?.institution || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Tingkat Kelas</Label>
              <Select defaultValue="12">
                <SelectTrigger id="gradeLevel">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Kelas 10</SelectItem>
                  <SelectItem value="11">Kelas 11</SelectItem>
                  <SelectItem value="12">Kelas 12</SelectItem>
                  <SelectItem value="Alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="majorStream">Jurusan</Label>
              <Select>
                <SelectTrigger id="majorStream">
                  <SelectValue placeholder="Pilih jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IPA">
                    IPA (Ilmu Pengetahuan Alam)
                  </SelectItem>
                  <SelectItem value="IPS">
                    IPS (Ilmu Pengetahuan Sosial)
                  </SelectItem>
                  <SelectItem value="Bahasa">Bahasa</SelectItem>
                  <SelectItem value="Other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Tahun Kelulusan</Label>
              <Input
                id="graduationYear"
                type="number"
                placeholder="2026"
                defaultValue="2026"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="snbtTarget" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target PTN (SNBT)
              </Label>
              <Input
                id="snbtTarget"
                placeholder="Contoh: Universitas Indonesia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dreamMajor" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Jurusan Impian
              </Label>
              <Input id="dreamMajor" placeholder="Contoh: Teknik Informatika" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicInterests">Minat Akademik</Label>
            <Input
              id="academicInterests"
              placeholder="Contoh: Matematika, Fisika, Programming (pisahkan dengan koma)"
            />
          </div>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Informasi Akademik"}
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Prestasi & Pencapaian
          </CardTitle>
          <CardDescription>
            Catat prestasi akademik dan non-akademikmu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Prestasi Akademik</Label>
              <Input placeholder="Contoh: Juara 1 Olimpiade Matematika" />
            </div>
            <div className="space-y-2">
              <Label>Tingkat</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="School">Sekolah</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="National">Nasional</SelectItem>
                  <SelectItem value="International">Internasional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            + Tambah Prestasi
          </Button>
        </CardContent>
      </Card>

      {/* Extracurricular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kegiatan Ekstrakurikuler
          </CardTitle>
          <CardDescription>
            Organisasi dan kegiatan yang kamu ikuti
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Kegiatan</Label>
              <Input placeholder="Contoh: OSIS, Rohis, Pecinta Alam" />
            </div>
            <div className="space-y-2">
              <Label>Jabatan</Label>
              <Input placeholder="Contoh: Ketua, Anggota" />
            </div>
          </div>
          <Button variant="outline" className="w-full">
            + Tambah Kegiatan
          </Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Media Sosial
          </CardTitle>
          <CardDescription>Hubungkan akun media sosialmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" placeholder="https://github.com/username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="@username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website Pribadi</Label>
              <Input id="website" placeholder="https://yourwebsite.com" />
            </div>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Media Sosial"}
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-2" />

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
          <CardDescription>Kelola preferensi akunmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Ubah Password</h4>
              <p className="text-sm text-muted-foreground">
                Perbarui password akunmu
              </p>
            </div>
            <Button variant="outline">Ubah Password</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">Hapus Akun</h4>
              <p className="text-sm text-muted-foreground">
                Hapus akun dan semua data secara permanen
              </p>
            </div>
            <Button variant="destructive">Hapus Akun</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
