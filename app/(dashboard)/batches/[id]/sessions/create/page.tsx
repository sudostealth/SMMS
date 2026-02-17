"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import{ zodResolver } from "@hookform/resolvers/zod";
import { createSessionSchema, type CreateSessionInput } from "@/lib/validations/schemas";
import { createSessionAction } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CreateSessionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreateSessionPage({ params }: CreateSessionPageProps) {
  const { id } = await params;
  return <CreateSessionClient batchId={id} />;
}

function CreateSessionClient({ batchId }: { batchId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  const method = watch("method");

  const onSubmit = async (data: CreateSessionInput) => {
    setIsLoading(true);
    try {
      const result = await createSessionAction(batchId, data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Success!",
        description: "Session created successfully",
      });
      router.push(`/batches/${batchId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create session",
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
        <h1 className="text-3xl font-bold">Create Session</h1>
        <p className="text-muted-foreground mt-2">
          Add a new session for this batch
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session_number">Session Number</Label>
              <Input
                id="session_number"
                type="number"
                placeholder="e.g. 1"
                {...register("session_number", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.session_number && (
                <p className="text-sm text-destructive">{errors.session_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_date">Session Date</Label>
              <Input
                id="session_date"
                type="date"
                {...register("session_date")}
                disabled={isLoading}
              />
              {errors.session_date && (
                <p className="text-sm text-destructive">{errors.session_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select
                value={method}
                onValueChange={(value) => setValue("method", value as "Online" | "Offline")}
                disabled={isLoading}
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
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  placeholder="e.g. Zoom, Google Meet"
                  {...register("platform")}
                  disabled={isLoading}
                />
                {errors.platform && (
                  <p className="text-sm text-destructive">{errors.platform.message}</p>
                )}
              </div>
            )}

            {method === "Offline" && (
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                  id="room_number"
                  placeholder="e.g. 301"
                  {...register("room_number")}
                  disabled={isLoading}
                />
                {errors.room_number && (
                  <p className="text-sm text-destructive">{errors.room_number.message}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
