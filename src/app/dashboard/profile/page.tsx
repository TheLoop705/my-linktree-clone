"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea"; // Assuming you have a Textarea component
import { useToast } from "~/components/ui/use-toast";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schemas/profile";

// Mock UserProfile data - replace with actual data fetching
interface UserProfileData {
  displayName: string;
  bio: string;
  // Add other fields as they become available from the backend
}

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UpdateProfileInput>({
    displayName: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );

  // Fetch user profile data when component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      // TODO: Fetch full profile from your backend API
      // For now, using placeholder or data from session if available
      setProfile({
        displayName: session.user.name || "", // Assuming name is in session
        bio: "", // Bio would come from UserProfile table
      });
    }
  }, [session]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error for this field
  };

  const handleSubmitProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = updateProfileSchema.safeParse(profile);
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please check your input.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual API call to update profile
      console.log("Submitting profile update:", validation.data);
      // const response = await fetch('/api/profile/update', { // Example API endpoint
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(validation.data),
      // });
      // const result = await response.json();

      // Mock success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = {
        success: true,
        message: "Profile updated successfully!",
        user: { name: validation.data.displayName },
      };

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Optionally update the session if name/email changed and is part of session
        if (validation.data.displayName) {
          await updateSession({
            user: { ...session?.user, name: validation.data.displayName },
          });
        }
      } else {
        // toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (status === "loading") {
    return <p>Loading profile...</p>;
  }

  if (!session) {
    return <p>Access Denied. Please log in.</p>; // Should be handled by DashboardLayout, but as a fallback
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your display name and bio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={profile.displayName || ""}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.displayName && (
                <p className="text-sm text-red-600">
                  {errors.displayName.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio || ""}
                onChange={handleInputChange}
                placeholder="Tell us a little about yourself"
                rows={4}
                disabled={isLoading}
              />
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.join(", ")}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Placeholder for Change Email Form */}
      <Card>
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
          <CardDescription>
            Update your email address. This may require re-verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Email change functionality coming soon.
          </p>
          {/* TODO: Implement Change Email Form */}
        </CardContent>
      </Card>

      {/* Placeholder for Change Password Form */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Password change functionality coming soon.
          </p>
          {/* TODO: Implement Change Password Form */}
        </CardContent>
      </Card>

      {/* Placeholder for Profile Picture Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload or update your profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Profile picture upload coming soon.
          </p>
          {/* TODO: Implement Profile Picture Upload */}
        </CardContent>
      </Card>
    </div>
  );
}
