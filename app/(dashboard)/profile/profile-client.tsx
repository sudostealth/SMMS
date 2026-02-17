"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateMentorProfileAction, deleteMentorAccountAction } from "./actions";
import { Loader2, User, Mail, IdCard, BookOpen, GraduationCap } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { DeleteProfileDialog } from "@/components/ui/delete-profile-dialog";

interface ProfileClientProps {
  mentor: {
    id: string;
    email: string;
    full_name: string;
    student_id?: string;
    batch?: string;
    department?: string;
  };
}

export default function ProfileClient({ mentor }: ProfileClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: mentor.full_name || "",
    student_id: mentor.student_id || "",
    batch: mentor.batch || "",
    department: mentor.department || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateMentorProfileAction(formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: t("success"),
        description: t("profileUpdated") || "Profile updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMentorAccountAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: t("success"),
        description: t("accountDeleted") || "Account deleted successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("profileSettings")}</h1>
        <p className="text-muted-foreground mt-2">{t("updateProfileDesc")}</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profileInfo")}</CardTitle>
            <CardDescription>{t("updateProfileDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  <User className="inline h-4 w-4 mr-2" />
                  {t("fullName")} *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-2" />
                  {t("email")} (Cannot be changed)
                </Label>
                <Input
                  id="email"
                  value={mentor.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">
                    <IdCard className="inline h-4 w-4 mr-2" />
                    {t("studentId")}
                  </Label>
                  <Input
                    id="student_id"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    placeholder="9-digit student ID"
                    maxLength={9}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">
                    <GraduationCap className="inline h-4 w-4 mr-2" />
                    {t("batch")}
                  </Label>
                  <Input
                    id="batch"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="3-digit batch number"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  <BookOpen className="inline h-4 w-4 mr-2" />
                  {t("department")}
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., CSE, EEE, BBA"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("saveChanges")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("accountInfo")}</CardTitle>
            <CardDescription>{t("viewAccountDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">{t("accountId")}</span>
              <span className="text-sm text-muted-foreground font-mono">{mentor.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">{t("emailStatus")}</span>
              <span className="text-sm text-green-600 font-medium">{t("verified")}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">{t("accountType")}</span>
              <span className="text-sm text-muted-foreground">{t("mentor")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Card */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">{t("deleteAccount")}</CardTitle>
            <CardDescription>{t("deleteAccountDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
             <DeleteProfileDialog isLoading={isDeleting} onConfirm={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
