"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Bell, Globe, Lock, Moon, Shield, User, Palette } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const t = useTranslations("settings");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>{t("profile.title")}</CardTitle>
                  <CardDescription>{t("profile.description")}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">{t("profile.edit")}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("profile.name")}</p>
                <p className="text-sm text-muted-foreground">Demo User</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("profile.email")}</p>
                <p className="text-sm text-muted-foreground">demo@edustride.id</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>{t("appearance.title")}</CardTitle>
                <CardDescription>{t("appearance.description")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{t("appearance.darkMode")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("appearance.darkModeDesc")}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{t("appearance.language")}</p>
                <p className="text-xs text-muted-foreground">{t("appearance.languageDesc")}</p>
              </div>
              <Badge variant="outline">Bahasa Indonesia</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>{t("notifications.title")}</CardTitle>
                <CardDescription>{t("notifications.description")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{t("notifications.email")}</p>
                <p className="text-xs text-muted-foreground">{t("notifications.emailDesc")}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{t("notifications.push")}</p>
                <p className="text-xs text-muted-foreground">{t("notifications.pushDesc")}</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{t("notifications.badges")}</p>
                <p className="text-xs text-muted-foreground">{t("notifications.badgesDesc")}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>{t("privacy.title")}</CardTitle>
                <CardDescription>{t("privacy.description")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{t("privacy.twoFactor")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("privacy.twoFactorDesc")}</p>
              </div>
              <Button variant="outline" size="sm">{t("privacy.enable")}</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{t("privacy.publicProfile")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("privacy.publicProfileDesc")}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">{t("cancel")}</Button>
        <Button>{t("save")}</Button>
      </div>
    </div>
  );
}
