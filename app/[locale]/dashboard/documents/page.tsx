"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { FileText, File, Image, Video, Folder, Download, Trash2, MoreVertical, Search } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
  url?: string;
}

const demoDocuments: Document[] = [
  {
    id: "1",
    name: "Transkrip Nilai S1.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
    category: "academic",
  },
  {
    id: "2",
    name: "Ijazah SMA.pdf",
    type: "pdf",
    size: "1.8 MB",
    uploadedAt: "2024-01-10",
    category: "certificate",
  },
  {
    id: "3",
    name: "Sertifikat Google Cloud.pdf",
    type: "pdf",
    size: "856 KB",
    uploadedAt: "2024-02-20",
    category: "certificate",
  },
  {
    id: "4",
    name: "Portfolio Project Screenshots.png",
    type: "image",
    size: "4.2 MB",
    uploadedAt: "2024-03-05",
    category: "portfolio",
  },
  {
    id: "5",
    name: "Presentasi Skripsi.pptx",
    type: "presentation",
    size: "12.5 MB",
    uploadedAt: "2024-01-25",
    category: "academic",
  },
  {
    id: "6",
    name: "CV Terbaru.pdf",
    type: "pdf",
    size: "1.2 MB",
    uploadedAt: "2024-03-10",
    category: "personal",
  },
];

const fileIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  doc: File,
  docx: File,
  xls: File,
  xlsx: File,
  pptx: File,
  presentation: File,
  image: Image,
  png: Image,
  jpg: Image,
  jpeg: Image,
  video: Video,
  mp4: Video,
  folder: Folder,
};

const categoryLabels: Record<string, string> = {
  academic: "Akademik",
  certificate: "Sertifikat",
  portfolio: "Portofolio",
  personal: "Personal",
  other: "Lainnya",
};

export default function DocumentsPage() {
  const t = useTranslations("documents");

  const getFileIcon = (type: string) => {
    const Icon = fileIcons[type.toLowerCase()] || File;
    return Icon;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button size="lg">{t("upload")}</Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="academic">{t("tabs.academic")}</TabsTrigger>
          <TabsTrigger value="certificate">{t("tabs.certificate")}</TabsTrigger>
          <TabsTrigger value="portfolio">{t("tabs.portfolio")}</TabsTrigger>
          <TabsTrigger value="personal">{t("tabs.personal")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <DocumentGrid 
            documents={demoDocuments} 
            getFileIcon={getFileIcon} 
            formatDate={formatDate}
            t={t}
          />
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <DocumentGrid 
            documents={demoDocuments.filter(d => d.category === "academic")} 
            getFileIcon={getFileIcon} 
            formatDate={formatDate}
            t={t}
          />
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <DocumentGrid 
            documents={demoDocuments.filter(d => d.category === "certificate")} 
            getFileIcon={getFileIcon} 
            formatDate={formatDate}
            t={t}
          />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <DocumentGrid 
            documents={demoDocuments.filter(d => d.category === "portfolio")} 
            getFileIcon={getFileIcon} 
            formatDate={formatDate}
            t={t}
          />
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <DocumentGrid 
            documents={demoDocuments.filter(d => d.category === "personal")} 
            getFileIcon={getFileIcon} 
            formatDate={formatDate}
            t={t}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DocumentGridProps {
  documents: Document[];
  getFileIcon: (type: string) => React.ComponentType<{ className?: string }>;
  formatDate: (date: string) => string;
  t: any;
}

function DocumentGrid({ documents, getFileIcon, formatDate, t }: DocumentGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => {
        const Icon = getFileIcon(doc.type);
        return (
          <Card key={doc.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium line-clamp-1">{doc.name}</CardTitle>
                    <CardDescription className="text-xs">{doc.size}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      {t("download")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MoreVertical className="mr-2 h-4 w-4" />
                      {t("details")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[doc.category] || doc.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
