"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Trophy, Award, Medal, Star, Calendar, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeTracker } from "@/components/widgets/badge-tracker";

interface Achievement {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  issuer?: string | null;
  issueDate?: string | null;
  credentialUrl?: string | null;
  image?: string | null;
}

// Demo achievements data
const demoAchievements: Achievement[] = [
  {
    id: "1",
    title: "Google Cloud Professional",
    description: "Professional Cloud Architect Certification",
    type: "CERTIFICATION",
    issuer: "Google Cloud",
    issueDate: "2024-01-15",
    credentialUrl: "https://cloud.google.com/certification",
    image: null,
  },
  {
    id: "2",
    title: "Hackathon Winner 2024",
    description: "1st Place in National AI Hackathon",
    type: "AWARD",
    issuer: "Tech Indonesia",
    issueDate: "2024-06-20",
    credentialUrl: null,
    image: null,
  },
  {
    id: "3",
    title: "Published Research Paper",
    description: "Machine Learning in Education - IEEE Journal",
    type: "PUBLICATION",
    issuer: "IEEE",
    issueDate: "2024-03-10",
    credentialUrl: "https://ieee.org/paper/12345",
    image: null,
  },
];

export default function AchievementsPage() {
  const t = useTranslations("achievements");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Badges Section */}
      <BadgeTracker />

      {/* Tabs for Achievements */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="certification">{t("tabs.certifications")}</TabsTrigger>
          <TabsTrigger value="award">{t("tabs.awards")}</TabsTrigger>
          <TabsTrigger value="publication">{t("tabs.publications")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {demoAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certification" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {demoAchievements
              .filter((a) => a.type === "CERTIFICATION")
              .map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="award" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {demoAchievements
              .filter((a) => a.type === "AWARD")
              .map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="publication" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {demoAchievements
              .filter((a) => a.type === "PUBLICATION")
              .map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const t = useTranslations("achievements");
  
  const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    CERTIFICATION: { icon: Award, color: "blue" },
    AWARD: { icon: Trophy, color: "yellow" },
    PUBLICATION: { icon: Medal, color: "green" },
    PATENT: { icon: Star, color: "purple" },
    OTHER: { icon: Award, color: "gray" },
  };

  const config = typeConfig[achievement.type] || typeConfig.OTHER;
  const Icon = config.icon;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", `bg-${config.color}-100 dark:bg-${config.color}-900`)}>
            <Icon className={cn("h-5 w-5", `text-${config.color}-600`)} />
          </div>
          <Badge variant="secondary">{t(`types.${achievement.type.toLowerCase()}`)}</Badge>
        </div>
        <CardTitle className="mt-3 text-lg">{achievement.title}</CardTitle>
        {achievement.description && (
          <CardDescription className="line-clamp-2">{achievement.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {achievement.issueDate
                ? new Date(achievement.issueDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                  })
                : t("noDate")}
            </span>
          </div>
          {achievement.issuer && (
            <span className="text-muted-foreground">{achievement.issuer}</span>
          )}
        </div>
        
        {achievement.credentialUrl && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={achievement.credentialUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-3 w-3" />
              {t("viewCredential")}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
