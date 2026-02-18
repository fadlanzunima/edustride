"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  User,
  Clock,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActivityType =
  | "portfolio"
  | "certificate"
  | "experience"
  | "skill"
  | "profile"
  | "all";

interface Activity {
  id: string;
  type: Exclude<ActivityType, "all">;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

const activityTypes: Record<
  Exclude<ActivityType, "all">,
  { label: string; color: string }
> = {
  portfolio: { label: "Portfolio", color: "bg-blue-500" },
  certificate: { label: "Certificate", color: "bg-amber-500" },
  experience: { label: "Experience", color: "bg-green-500" },
  skill: { label: "Skill", color: "bg-purple-500" },
  profile: { label: "Profile", color: "bg-gray-500" },
};

// Extended sample activities
const allActivities: Activity[] = [
  {
    id: "1",
    type: "portfolio",
    title: "Created new portfolio project",
    description: "Added 'E-commerce Website' to portfolio",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    type: "certificate",
    title: "Earned React Certificate",
    description: "Completed Advanced React course",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    type: "skill",
    title: "Added new skill",
    description: "TypeScript - Advanced level",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "4",
    type: "experience",
    title: "Updated work experience",
    description: "Added internship at Tech Company",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "5",
    type: "profile",
    title: "Updated profile information",
    description: "Changed profile picture and bio",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "6",
    type: "certificate",
    title: "Completed JavaScript Course",
    description: "Earned JavaScript Fundamentals certificate",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: "7",
    type: "portfolio",
    title: "Updated project screenshots",
    description: "Added new images to Portfolio Website project",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
  {
    id: "8",
    type: "skill",
    title: "Skill assessment completed",
    description: "Scored 85% on React Advanced Assessment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120),
  },
  {
    id: "9",
    type: "experience",
    title: "Added volunteer experience",
    description: "Community teaching program",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168),
  },
  {
    id: "10",
    type: "profile",
    title: "Linked account",
    description: "Connected LinkedIn profile",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 192),
  },
];

export function ActivitiesContent() {
  const [filter, setFilter] = React.useState<ActivityType>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredActivities = React.useMemo(() => {
    return allActivities.filter((activity) => {
      const matchesFilter = filter === "all" || activity.type === filter;
      const matchesSearch =
        !searchQuery ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const getActivityStats = () => {
    const stats = {
      portfolio: allActivities.filter((a) => a.type === "portfolio").length,
      certificate: allActivities.filter((a) => a.type === "certificate").length,
      experience: allActivities.filter((a) => a.type === "experience").length,
      skill: allActivities.filter((a) => a.type === "skill").length,
      profile: allActivities.filter((a) => a.type === "profile").length,
    };
    return stats;
  };

  const stats = getActivityStats();

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Activities
          </h1>
          <p className="text-muted-foreground">
            Track all your recent activities and achievements.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(activityTypes).map(([type, config]) => (
          <Card
            key={type}
            className={`cursor-pointer transition-colors ${
              filter === type ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() =>
              setFilter(filter === type ? "all" : (type as ActivityType))
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats[type as Exclude<ActivityType, "all">]}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${config.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as ActivityType)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              {Object.entries(activityTypes).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Timeline */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => {
                  const config = activityTypes[activity.type];

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`h-3 w-3 mt-1.5 rounded-full shrink-0 ${config.color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{activity.title}</p>
                          <Badge variant="secondary" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="relative pl-8 border-l-2 border-muted space-y-8">
                {filteredActivities.map((activity, index) => {
                  const config = activityTypes[activity.type];

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <div
                        className={`absolute -left-[41px] h-6 w-6 rounded-full border-4 border-background ${config.color}`}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{activity.title}</p>
                          <Badge variant="secondary" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {activity.timestamp.toLocaleDateString()} at{" "}
                            {activity.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
