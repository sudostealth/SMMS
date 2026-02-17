"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createSessionSchema, type CreateSessionInput } from "@/lib/validations/schemas";
import { updateSessionAction } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditSessionClientProps {
  batchId: string;
  session: {
    id: string;
    session_number: number;
    session_date: string;
    method: "Online" | "Offline";
    platform?: string;
    room_number?: string;
  };
}

export default function EditSessionClient({ batchId, session }: EditSessionClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<"Online" | "Offline">(session.method);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  useEffect(() => {
    setValue("session_number", session.session_number);
    setValue("session_date", session.session_date.split('T')[0]);
    setValue("method", session.method);
    if (session.platform) setValue("platform", session.platform);
    if (session.room_number) setValue("room_number", session.room_number);
  }, [session, setValue]);

  const onSubmit = async (data: CreateSessionInput) => {
    setIsLoading(true);
    try {
      const result = await updateSessionAction(batchId, session.id, data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Success!",
        description: "Session updated successfully",
      });
      router.push(`/batches/${batchId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/batches/${batchId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batch
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Session</h1>
        <p className="text-muted-foreground mt-2">Update session details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Edit the session details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session_number">Session Number *</Label>
              <Input
                id="session_number"
                type="number"
                {...register("session_number", { valueAsNumber: true })}
                placeholder="Enter session number"
              />
              {errors.session_number && (
                <p className="text-sm text-destructive">{errors.session_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_date">Session Date *</Label>
              <Input
                id="session_date"
                type="date"
                {...register("session_date")}
              />
              {errors.session_date && (
                <p className="text-sm text-destructive">{errors.session_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Method *</Label>
              <Select
                value={method}
                onValueChange={(value) => {
                  setMethod(value as "Online" | "Offline");
                  setValue("method", value as "Online" | "Offline");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              {errors.method && (
                <p className="text-sm text-destructive">{errors.method.message}</p>
              )}
            </div>

            {method === "Online" && (
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Input
                  id="platform"
                  {...register("platform")}
                  placeholder="e.g., Zoom, Google Meet"
                />
                {errors.platform && (
                  <p className="text-sm text-destructive">{errors.platform.message}</p>
                )}
              </div>
            )}

            {method === "Offline" && (
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number *</Label>
                <Input
                  id="room_number"
                  {...register("room_number")}
                  placeholder="e.g., Room 101"
                />
                {errors.room_number && (
                  <p className="text-sm text-destructive">{errors.room_number.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/batches/${batchId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Session
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
