"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Linkedin,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  User,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useLinkedInProfile,
  useSaveLinkedInData,
  type LinkedInData,
} from "@/hooks/use-linkedin-import";
import { cn } from "@/lib/utils";

interface LinkedInImportProps {
  className?: string;
}

export function LinkedInImport({ className }: LinkedInImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<{
    profile: boolean;
    positions: boolean;
    education: boolean;
    skills: boolean;
    certifications: boolean;
  }>({
    profile: true,
    positions: true,
    education: true,
    skills: true,
    certifications: true,
  });

  const {
    data: linkedinData,
    isLoading,
    isError,
    error,
    refetch,
    isFetched,
  } = useLinkedInProfile();

  const saveMutation = useSaveLinkedInData();

  const handleImport = async () => {
    if (!linkedinData?.data) return;

    const dataToSave: Partial<LinkedInData> = {};

    if (selectedData.profile) dataToSave.profile = linkedinData.data.profile;
    if (selectedData.positions)
      dataToSave.positions = linkedinData.data.positions;
    if (selectedData.education)
      dataToSave.education = linkedinData.data.education;
    if (selectedData.skills) dataToSave.skills = linkedinData.data.skills;
    if (selectedData.certifications)
      dataToSave.certifications = linkedinData.data.certifications;

    await saveMutation.mutateAsync(dataToSave as LinkedInData);
    setIsOpen(false);
  };

  const handleFetch = async () => {
    await refetch();
  };

  return (
    <Card className={cn("border-dashed border-2", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          Import from LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Import your professional experience, education, and skills directly
          from your LinkedIn profile.
        </p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90">
              <Download className="h-4 w-4" />
              Import LinkedIn Profile
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                Import from LinkedIn
              </DialogTitle>
              <DialogDescription>
                Preview and select the data you want to import from your
                LinkedIn profile.
              </DialogDescription>
            </DialogHeader>

            {!isFetched && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <Linkedin className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click the button below to fetch your LinkedIn profile data.
                </p>
                <Button onClick={handleFetch} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <motion.div
                        className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Fetch Profile Data
                    </>
                  )}
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-sm text-destructive text-center">
                  {error?.message || "Failed to fetch LinkedIn profile"}
                </p>
                <Button variant="outline" onClick={handleFetch}>
                  Try Again
                </Button>
              </div>
            )}

            <AnimatePresence>
              {linkedinData?.data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Profile Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="profile"
                        checked={selectedData.profile}
                        onCheckedChange={(checked) =>
                          setSelectedData((prev) => ({
                            ...prev,
                            profile: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="profile"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profile Information
                      </label>
                    </div>

                    {selectedData.profile && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 p-4 bg-muted/50 rounded-lg space-y-2"
                      >
                        <h4 className="font-semibold">
                          {linkedinData.data.profile.firstName}{" "}
                          {linkedinData.data.profile.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {linkedinData.data.profile.headline}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {linkedinData.data.profile.location.city},{" "}
                          {linkedinData.data.profile.location.country}
                        </div>
                        <p className="text-sm mt-2">
                          {linkedinData.data.profile.summary}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <Separator />

                  {/* Experience Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="positions"
                        checked={selectedData.positions}
                        onCheckedChange={(checked) =>
                          setSelectedData((prev) => ({
                            ...prev,
                            positions: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="positions"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <Briefcase className="h-4 w-4" />
                        Work Experience ({
                          linkedinData.data.positions.length
                        }{" "}
                        items)
                      </label>
                    </div>

                    {selectedData.positions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-2"
                      >
                        {linkedinData.data.positions.map((position, index) => (
                          <div
                            key={index}
                            className="p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium text-sm">
                                  {position.title}
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                  {position.company}
                                </p>
                              </div>
                              {position.isCurrent && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {position.startDate.month}/
                              {position.startDate.year} -{" "}
                              {position.isCurrent
                                ? "Present"
                                : `${position.endDate?.month}/${position.endDate?.year}`}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <Separator />

                  {/* Education Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="education"
                        checked={selectedData.education}
                        onCheckedChange={(checked) =>
                          setSelectedData((prev) => ({
                            ...prev,
                            education: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="education"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Education ({linkedinData.data.education.length} items)
                      </label>
                    </div>

                    {selectedData.education && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-2"
                      >
                        {linkedinData.data.education.map((edu, index) => (
                          <div
                            key={index}
                            className="p-3 bg-muted/50 rounded-lg"
                          >
                            <h5 className="font-medium text-sm">
                              {edu.school}
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              {edu.degree} in {edu.fieldOfStudy}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.startDate.year} - {edu.endDate.year}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <Separator />

                  {/* Skills Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="skills"
                        checked={selectedData.skills}
                        onCheckedChange={(checked) =>
                          setSelectedData((prev) => ({
                            ...prev,
                            skills: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="skills"
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <Award className="h-4 w-4" />
                        Skills ({linkedinData.data.skills.length} items)
                      </label>
                    </div>

                    {selectedData.skills && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6"
                      >
                        <div className="flex flex-wrap gap-2">
                          {linkedinData.data.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill.name}
                              <span className="ml-1 text-muted-foreground">
                                ({skill.endorsements})
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Import Button */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={saveMutation.isPending}
                      className="gap-2"
                    >
                      {saveMutation.isPending ? (
                        <>
                          <motion.div
                            className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Import Selected Data
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
