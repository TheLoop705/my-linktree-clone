"use client";

import React, { useState, useEffect } from "react";
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
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { useToast } from "~/hooks/use-toast";

interface UserProfileData {
  displayName: string;
  bio: string;
  profession: string;
  location: string;
  websiteUrl: string;
  profileImageUrl: string;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPublic: boolean;
}

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfileData>({
    displayName: "",
    bio: "",
    profession: "",
    location: "",
    websiteUrl: "",
    profileImageUrl: "",
  });

  const [pageSettings, setPageSettings] = useState<PageData>({
    id: "",
    slug: "",
    title: "",
    description: "",
    isPublic: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Load user profile and page data
  useEffect(() => {
    if (session?.user) {
      loadProfileData();
      loadPageData();
    }
  }, [session]);

  const loadProfileData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setProfile({
        displayName:
          data.displayName || session?.user?.email?.split("@")[0] || "",
        bio: data.bio || "",
        profession: data.profession || "",
        location: data.location || "",
        websiteUrl: data.websiteUrl || "",
        profileImageUrl: data.profileImageUrl || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      // Set defaults from session if API fails
      setProfile((prev) => ({
        ...prev,
        displayName: session?.user?.email?.split("@")[0] || "",
      }));
    }
  };

  const loadPageData = async () => {
    try {
      const response = await fetch("/api/pages/my-page");
      if (!response.ok) throw new Error("Failed to load page data");

      const data = await response.json();
      setPageSettings({
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description || "",
        isPublic: data.isPublic,
      });
    } catch (error) {
      console.error("Error loading page data:", error);
    }
  };

  const handleProfileChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error for this field
  };

  const handlePageChange = (name: string, value: string | boolean) => {
    setPageSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPage(true);

    try {
      const response = await fetch(`/api/pages/${pageSettings.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageSettings.title,
          description: pageSettings.description,
          isPublic: pageSettings.isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update page settings");
      }

      toast({
        title: "Page Settings Updated",
        description: "Your page settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating page settings:", error);
      toast({
        title: "Error",
        description: "Failed to update page settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPage(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Please sign in to access your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information and page settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information that will be displayed on your
              public page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) =>
                    handleProfileChange("displayName", e.target.value)
                  }
                  placeholder="Your display name"
                />
                {errors.displayName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.displayName[0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-sm text-red-600 mt-1">{errors.bio[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={profile.profession}
                  onChange={(e) =>
                    handleProfileChange("profession", e.target.value)
                  }
                  placeholder="Your profession or title"
                />
                {errors.profession && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.profession[0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) =>
                    handleProfileChange("location", e.target.value)
                  }
                  placeholder="Your location"
                />
                {errors.location && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.location[0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={profile.websiteUrl}
                  onChange={(e) =>
                    handleProfileChange("websiteUrl", e.target.value)
                  }
                  placeholder="https://your-website.com"
                />
                {errors.websiteUrl && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.websiteUrl[0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input
                  id="profileImageUrl"
                  type="url"
                  value={profile.profileImageUrl}
                  onChange={(e) =>
                    handleProfileChange("profileImageUrl", e.target.value)
                  }
                  placeholder="https://your-image-url.com/image.jpg"
                />
                {errors.profileImageUrl && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.profileImageUrl[0]}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Page Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Page Settings</CardTitle>
            <CardDescription>
              Configure your public page settings and visibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePageSubmit} className="space-y-4">
              <div>
                <Label htmlFor="slug">Page URL</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : "http://localhost:3000"}
                    /
                  </span>
                  <Input
                    id="slug"
                    value={pageSettings.slug}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your page URL cannot be changed after creation.
                </p>
              </div>

              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={pageSettings.title}
                  onChange={(e) => handlePageChange("title", e.target.value)}
                  placeholder="Your page title"
                />
              </div>

              <div>
                <Label htmlFor="description">Page Description</Label>
                <Textarea
                  id="description"
                  value={pageSettings.description}
                  onChange={(e) =>
                    handlePageChange("description", e.target.value)
                  }
                  placeholder="Describe your page..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Page</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your page visible to everyone
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={pageSettings.isPublic}
                  onCheckedChange={(checked: boolean) =>
                    handlePageChange("isPublic", checked)
                  }
                />
              </div>

              <Button type="submit" disabled={isLoadingPage} className="w-full">
                {isLoadingPage ? "Updating..." : "Update Page Settings"}
              </Button>
            </form>

            {pageSettings.slug && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Your Public Page:</p>
                <a
                  href={`/${pageSettings.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : "http://localhost:3000"}
                  /{pageSettings.slug}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
