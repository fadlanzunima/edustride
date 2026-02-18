"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Plus, Search, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { useSkills, useCreateSkill, useDeleteSkill, useUpdateSkillProgress } from "@/hooks/use-skills";
import { SkillRoadmap } from "@/components/widgets/skill-roadmap";
import { QuizTaker } from "@/components/widgets/quiz-taker";
import { SkillCharts } from "@/components/widgets/skill-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Skill, SkillCategory, SkillLevel } from "@prisma/client";

// Category icons and labels
const categoryConfig: Record<SkillCategory, { label: string; color: string }> = {
  TECHNICAL: { label: "Technical", color: "bg-blue-500" },
  SOFT_SKILL: { label: "Soft Skill", color: "bg-green-500" },
  LANGUAGE: { label: "Language", color: "bg-yellow-500" },
  TOOL: { label: "Tool", color: "bg-purple-500" },
  DOMAIN_KNOWLEDGE: { label: "Domain Knowledge", color: "bg-red-500" },
};

const levelConfig: Record<SkillLevel, { label: string; color: string }> = {
  BEGINNER: { label: "Beginner", color: "bg-slate-500" },
  INTERMEDIATE: { label: "Intermediate", color: "bg-blue-500" },
  ADVANCED: { label: "Advanced", color: "bg-indigo-500" },
  EXPERT: { label: "Expert", color: "bg-violet-500" },
};

export default function SkillsPage() {
  const t = useTranslations("skills");
  const router = useRouter();
  const { data: session } = useSession();
  
  // State
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [level, setLevel] = React.useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  
  // Form state
  const [skillName, setSkillName] = React.useState("");
  const [skillCategory, setSkillCategory] = React.useState<SkillCategory>("TECHNICAL");
  const [skillLevel, setSkillLevel] = React.useState<SkillLevel>("BEGINNER");
  const [skillDescription, setSkillDescription] = React.useState("");
  const [skillPublic, setSkillPublic] = React.useState(true);
  
  // Fetch skills
  const { data, isLoading, error } = useSkills({
    search: search || undefined,
    category: category !== "all" ? (category as SkillCategory) : undefined,
    level: level !== "all" ? (level as SkillLevel) : undefined,
    limit: 50,
  });
  
  // Mutations
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const updateProgress = useUpdateSkillProgress();
  
  const skills = data?.data || [];
  
  const handleAddSkill = () => {
    if (!skillName.trim()) {
      toast.error("Skill name is required");
      return;
    }
    
    createSkill.mutate(
      {
        name: skillName,
        category: skillCategory,
        level: skillLevel,
        description: skillDescription || undefined,
        isPublic: skillPublic,
        progress: 0,
      },
      {
        onSuccess: () => {
          toast.success("Skill added successfully");
          setIsAddDialogOpen(false);
          resetForm();
        },
        onError: () => {
          toast.error("Failed to add skill");
        },
      }
    );
  };
  
  const handleDeleteSkill = (id: string) => {
    deleteSkill.mutate(id, {
      onSuccess: () => {
        toast.success("Skill deleted");
      },
      onError: () => {
        toast.error("Failed to delete skill");
      },
    });
  };
  
  const handleProgressChange = (id: string, value: number) => {
    updateProgress.mutate({ id, progress: value }, {
      onSuccess: () => {
        toast.success("Progress updated");
      },
    });
  };
  
  const resetForm = () => {
    setSkillName("");
    setSkillCategory("TECHNICAL");
    setSkillLevel("BEGINNER");
    setSkillDescription("");
    setSkillPublic(true);
  };
  
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
  };
  
  const hasActiveFilters = search || category !== "all" || level !== "all";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("addSkill")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("addSkill")}</DialogTitle>
              <DialogDescription>
                Add a new skill to track your progress
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("skillName")}</Label>
                <Input
                  id="name"
                  placeholder="e.g., JavaScript, Public Speaking"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">{t("categoryLabel")}</Label>
                  <Select value={skillCategory} onValueChange={(v) => setSkillCategory(v as SkillCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="level">{t("levelLabel")}</Label>
                  <Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as SkillLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(levelConfig).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your experience with this skill..."
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="public">{t("makePublic")}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t("makePublicDescription")}
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={skillPublic}
                  onCheckedChange={setSkillPublic}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleAddSkill} disabled={createSkill.isPending}>
                {createSkill.isPending ? t("adding") : t("addSkill")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryConfig).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {Object.entries(levelConfig).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Skills and Quiz */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="skills">{t("tabs.skills")}</TabsTrigger>
          <TabsTrigger value="quiz">{t("tabs.quiz")}</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {/* Charts Section */}
          {!isLoading && skills.length > 0 && (
            <SkillCharts skills={skills} isLoading={isLoading} />
          )}

      {/* Skills Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Skills List */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("yourSkills")}</h2>
            <Badge variant="secondary">{skills.length} skills</Badge>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                    <div className="h-3 w-20 bg-muted rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 w-full bg-muted rounded mb-2" />
                    <div className="h-3 w-12 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Failed to load skills. Please try again.
                </p>
              </CardContent>
            </Card>
          ) : skills.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-6">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{t("noSkills")}</h3>
                  <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                    {t("noSkillsDescription")}
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addYourFirstSkill")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onDelete={handleDeleteSkill}
                  onProgressChange={handleProgressChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Skill Roadmap Sidebar */}
        <div>
          <SkillRoadmap skills={skills} isLoading={isLoading} />
        </div>
      </div>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          <div className="mx-auto max-w-2xl">
            <QuizTaker />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SkillCardProps {
  skill: Skill;
  onDelete: (id: string) => void;
  onProgressChange: (id: string, progress: number) => void;
}

function SkillCard({ skill, onDelete, onProgressChange }: SkillCardProps) {
  const t = useTranslations("skills");
  const [isEditing, setIsEditing] = React.useState(false);
  const [localProgress, setLocalProgress] = React.useState(skill.progress);
  
  const categoryInfo = categoryConfig[skill.category];
  const levelInfo = levelConfig[skill.level];
  
  const handleProgressChange = (value: number) => {
    setLocalProgress(value);
    onProgressChange(skill.id, value);
  };
  
  return (
    <Card className="group relative transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{skill.name}</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {t(`category.${skill.category.toLowerCase()}`)}
              </Badge>
              <Badge className={`text-xs ${levelInfo.color}`}>
                {t(`level.${skill.level.toLowerCase()}`)}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onDelete(skill.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {skill.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {skill.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t("progress")}</span>
            <span className="font-medium">{localProgress}%</span>
          </div>
          <Progress value={localProgress} className="h-2" />
          <input
            type="range"
            min="0"
            max="100"
            value={localProgress}
            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
