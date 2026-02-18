"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Building, Calendar, MapPin, ExternalLink } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  type: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  url?: string | null;
}

const demoExperiences: Experience[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Gojek Indonesia",
    location: "Jakarta, Indonesia",
    type: "FULL_TIME",
    startDate: "2023-01-15",
    endDate: null,
    current: true,
    description: "Leading backend development for payment systems. Architecting microservices handling 1M+ daily transactions.",
    url: "https://gojek.com",
  },
  {
    id: "2",
    title: "Software Development Intern",
    company: "Tokopedia",
    location: "Jakarta, Indonesia",
    type: "INTERNSHIP",
    startDate: "2022-06-01",
    endDate: "2022-12-31",
    current: false,
    description: "Developed features for the marketplace platform. Improved page load time by 30%.",
    url: "https://tokopedia.com",
  },
  {
    id: "3",
    title: "Freelance Web Developer",
    company: "Self-employed",
    location: "Remote",
    type: "FREELANCE",
    startDate: "2021-01-01",
    endDate: null,
    current: true,
    description: "Building websites and web applications for local businesses and startups.",
    url: null,
  },
];

export default function ExperiencePage() {
  const t = useTranslations("experience");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FULL_TIME: "bg-blue-500",
      PART_TIME: "bg-green-500",
      INTERNSHIP: "bg-orange-500",
      FREELANCE: "bg-purple-500",
      CONTRACT: "bg-pink-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {demoExperiences.map((exp) => (
          <Card key={exp.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{exp.title}</CardTitle>
                    <Badge className={getTypeColor(exp.type)}>
                      {t(`types.${exp.type.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{exp.company}</span>
                  </div>
                </div>
                {exp.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={exp.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(exp.startDate)} - {exp.current ? t("present") : formatDate(exp.endDate!)}
                  </span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>
              {exp.description && (
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Experience Button */}
      <div className="flex justify-center">
        <Button size="lg" className="gap-2">
          <Briefcase className="h-4 w-4" />
          {t("addExperience")}
        </Button>
      </div>
    </div>
  );
}
