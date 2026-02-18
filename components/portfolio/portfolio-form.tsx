"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarIcon,
  Link2,
  Github,
  ExternalLink,
  Tag,
  FileImage,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  createPortfolioSchema,
  updatePortfolioSchema,
} from "@/lib/validations/portfolio";
import type { Portfolio } from "@prisma/client";

// Extended schema with client-side validation
const portfolioFormSchema = z.object({
  title: z
    .string()
    .min(1, "Judul wajib diisi")
    .max(200, "Judul terlalu panjang"),
  description: z.string().max(5000, "Deskripsi terlalu panjang").optional(),
  type: z.enum([
    "PROJECT",
    "CERTIFICATE",
    "EXPERIENCE",
    "PUBLICATION",
    "AWARD",
  ]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  thumbnail: z.string().optional(),
  link: z.string().url("URL tidak valid").optional().or(z.literal("")),
  githubUrl: z
    .string()
    .url("URL GitHub tidak valid")
    .optional()
    .or(z.literal("")),
  demoUrl: z.string().url("URL demo tidak valid").optional().or(z.literal("")),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isFeatured: z.boolean(),
  tags: z.array(z.string().max(50)).max(20, "Maksimal 20 tag"),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

interface PortfolioFormProps {
  initialData?: Portfolio;
  onSubmit: (data: PortfolioFormValues) => void;
  isSubmitting?: boolean;
}

const portfolioTypes = [
  { value: "PROJECT", label: "Proyek", color: "bg-blue-500" },
  { value: "CERTIFICATE", label: "Sertifikat", color: "bg-green-500" },
  { value: "EXPERIENCE", label: "Pengalaman", color: "bg-purple-500" },
  { value: "PUBLICATION", label: "Publikasi", color: "bg-orange-500" },
  { value: "AWARD", label: "Penghargaan", color: "bg-yellow-500" },
];

const statusOptions = [
  { value: "DRAFT", label: "Draft", color: "bg-gray-500" },
  { value: "PUBLISHED", label: "Dipublikasikan", color: "bg-green-500" },
  { value: "ARCHIVED", label: "Diarsipkan", color: "bg-red-500" },
];

export function PortfolioForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PortfolioFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = React.useState("");

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: (initialData?.type as PortfolioFormValues["type"]) || "PROJECT",
      status: (initialData?.status as PortfolioFormValues["status"]) || "DRAFT",
      thumbnail: initialData?.thumbnail || "",
      link: initialData?.link || "",
      githubUrl: initialData?.githubUrl || "",
      demoUrl: initialData?.demoUrl || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      isFeatured: initialData?.isFeatured || false,
      tags: initialData?.tags || [],
    },
  });

  const tags = form.watch("tags");

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 20) {
      form.setValue("tags", [...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (values: PortfolioFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Informasi Dasar</h3>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Judul <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Masukkan judul portfolio"
              {...form.register("title")}
              className={cn(form.formState.errors.title && "border-red-500")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Type and Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) =>
                  form.setValue("type", value as PortfolioFormValues["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("w-2 h-2 rounded-full", type.color)}
                        />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as PortfolioFormValues["status"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("w-2 h-2 rounded-full", status.color)}
                        />
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Deskripsikan portfolio Anda..."
              rows={5}
              {...form.register("description")}
              className={cn(
                form.formState.errors.description && "border-red-500"
              )}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {form.watch("description")?.length || 0}/5000 karakter
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Timeline</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("startDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("startDate")
                      ? format(form.watch("startDate")!, "dd MMMM yyyy", {
                          locale: idLocale,
                        })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("startDate")}
                    onSelect={(date) => form.setValue("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("endDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("endDate")
                      ? format(form.watch("endDate")!, "dd MMMM yyyy", {
                          locale: idLocale,
                        })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("endDate")}
                    onSelect={(date) => form.setValue("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Tautan</h3>

          <div className="space-y-4">
            {/* External Link */}
            <div className="space-y-2">
              <Label htmlFor="link" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Tautan Eksternal
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com"
                {...form.register("link")}
                className={cn(form.formState.errors.link && "border-red-500")}
              />
              {form.formState.errors.link && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.link.message}
                </p>
              )}
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                URL GitHub
              </Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/repo"
                {...form.register("githubUrl")}
                className={cn(
                  form.formState.errors.githubUrl && "border-red-500"
                )}
              />
              {form.formState.errors.githubUrl && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.githubUrl.message}
                </p>
              )}
            </div>

            {/* Demo URL */}
            <div className="space-y-2">
              <Label htmlFor="demoUrl" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                URL Demo
              </Label>
              <Input
                id="demoUrl"
                type="url"
                placeholder="https://demo.example.com"
                {...form.register("demoUrl")}
                className={cn(
                  form.formState.errors.demoUrl && "border-red-500"
                )}
              />
              {form.formState.errors.demoUrl && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.demoUrl.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Gambar Thumbnail
          </h3>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">URL Thumbnail</Label>
            <Input
              id="thumbnail"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...form.register("thumbnail")}
              className={cn(
                form.formState.errors.thumbnail && "border-red-500"
              )}
            />
            {form.formState.errors.thumbnail && (
              <p className="text-sm text-red-500">
                {form.formState.errors.thumbnail.message}
              </p>
            )}

            {form.watch("thumbnail") && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border">
                  <img
                    src={form.watch("thumbnail")}
                    alt="Thumbnail preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=Invalid+Image";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tag
          </h3>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Tambahkan tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Tambah
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Tekan Enter untuk menambahkan tag
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {tags.length}/20 tag
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Featured Switch */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured" className="text-base">
                Tampilkan di Beranda
              </Label>
              <p className="text-sm text-muted-foreground">
                Portfolio yang ditampilkan akan muncul di bagian featured
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={form.watch("isFeatured")}
              onCheckedChange={(checked) =>
                form.setValue("isFeatured", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Buat Portfolio"
          )}
        </Button>
      </div>
    </form>
  );
}
