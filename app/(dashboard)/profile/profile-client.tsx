"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateMentorProfileAction } from "./actions";
import { Loader2, User, Mail, IdCard, BookOpen, GraduationCap } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
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
        title: "Success!",
        description: "Profile updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  <User className="inline h-4 w-4 mr-2" />
                  Full Name *
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
                  Email (Cannot be changed)
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
                    Student ID
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
                    Batch
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
                  Department
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
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Account ID</span>
              <span className="text-sm text-muted-foreground font-mono">{mentor.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium">Email Status</span>
              <span className="text-sm text-green-600 font-medium">Verified</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Account Type</span>
              <span className="text-sm text-muted-foreground">Mentor</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
