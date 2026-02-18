"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Chrome, Linkedin, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    level: z.enum(["SMA", "S1", "S2_S3"]),
    institution: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      level: "S1",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          level: data.level,
          institution: data.institution,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Email already exists") {
          toast.error(t("errors.emailExists"));
        } else {
          toast.error(t("errors.generic"));
        }
        return;
      }

      toast.success("Account created successfully!");

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push(`/${locale}/login`);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (error) {
      toast.error(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    setIsOAuthLoading(provider);
    signIn(provider, {
      callbackUrl: `/${locale}/dashboard`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            EduStride
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {t("subtitle")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t("title")}</CardTitle>
            <CardDescription className="text-center">
              {t("subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("namePlaceholder")}
                  {...register("name")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    {...register("password")}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t("confirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">{t("level")}</Label>
                <select
                  id="level"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("level")}
                  disabled={isLoading}
                >
                  <option value="SMA">SMA (High School)</option>
                  <option value="S1">S1 (Undergraduate)</option>
                  <option value="S2_S3">S2/S3 (Postgraduate)</option>
                </select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">{t("institution")}</Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder={t("institutionPlaceholder")}
                  {...register("institution")}
                  disabled={isLoading}
                />
                {errors.institution && (
                  <p className="text-sm text-red-500">
                    {errors.institution.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isOAuthLoading === "google"}
              >
                {isOAuthLoading === "google" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-4 w-4" />
                )}
                {t("google")}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("linkedin")}
                disabled={isOAuthLoading === "linkedin"}
              >
                {isOAuthLoading === "linkedin" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Linkedin className="mr-2 h-4 w-4" />
                )}
                {t("linkedin")}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link
                href={`/${locale}/login`}
                className="text-primary hover:underline font-medium"
              >
                {t("login")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
