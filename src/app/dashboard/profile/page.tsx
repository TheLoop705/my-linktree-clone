"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/design/Icon";

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
  const { data: session, status } = useSession();
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
  };

  const handlePageChange = (name: string, value: string | boolean) => {
    setPageSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

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

      if (!response.ok) throw new Error("Failed to update page settings");

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
      <div className="dash-main">
        <div className="dash-main__left">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              color: "var(--text-2)",
              fontSize: 14,
            }}
          >
            Loading...
          </div>
        </div>
        <div className="dash-main__right" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="dash-main">
        <div className="dash-main__left">
          <div className="card" style={{ padding: 24 }}>
            <p style={{ margin: 0 }}>Please sign in to access your profile.</p>
          </div>
        </div>
        <div className="dash-main__right" />
      </div>
    );
  }

  return (
    <div className="dash-main">
      <div className="dash-main__left" style={{ padding: "20px 28px 32px" }}>
        <div className="dash-header">
          <div>
            <div className="dash-header__eyebrow mono">SETTINGS</div>
            <h1>Profile</h1>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, margin: "0 0 16px", fontWeight: 600 }}>
              Profile information
            </h2>

            <div className="field">
              <label className="label" htmlFor="displayName">
                Display Name
              </label>
              <input
                className="input"
                id="displayName"
                type="text"
                value={profile.displayName}
                onChange={(e) =>
                  handleProfileChange("displayName", e.target.value)
                }
                placeholder="Your display name"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="bio">
                Bio
              </label>
              <textarea
                className="input"
                id="bio"
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="profession">
                Profession
              </label>
              <input
                className="input"
                id="profession"
                type="text"
                value={profile.profession}
                onChange={(e) =>
                  handleProfileChange("profession", e.target.value)
                }
                placeholder="Your profession or title"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="location">
                Location
              </label>
              <input
                className="input"
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) =>
                  handleProfileChange("location", e.target.value)
                }
                placeholder="Your location"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="websiteUrl">
                Website URL
              </label>
              <input
                className="input"
                id="websiteUrl"
                type="url"
                value={profile.websiteUrl}
                onChange={(e) =>
                  handleProfileChange("websiteUrl", e.target.value)
                }
                placeholder="https://your-website.com"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="profileImageUrl">
                Profile Image URL
              </label>
              <input
                className="input"
                id="profileImageUrl"
                type="url"
                value={profile.profileImageUrl}
                onChange={(e) =>
                  handleProfileChange("profileImageUrl", e.target.value)
                }
                placeholder="https://your-image-url.com/image.jpg"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving\u2026" : "Save changes"}
            </button>
          </div>
        </form>

        <form onSubmit={handlePageSubmit}>
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 17, margin: "0 0 16px", fontWeight: 600 }}>
              Page settings
            </h2>

            <div className="field">
              <label className="label" htmlFor="slug">
                Page URL
              </label>
              <div className="input-inline-prefix">
                <span className="prefix mono">linkhub.to/</span>
                <input
                  className="input"
                  id="slug"
                  value={pageSettings.slug}
                  disabled
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="title">
                Page Title
              </label>
              <input
                className="input"
                id="title"
                type="text"
                value={pageSettings.title}
                onChange={(e) => handlePageChange("title", e.target.value)}
                placeholder="Your page title"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="description">
                Page Description
              </label>
              <textarea
                className="input"
                id="description"
                value={pageSettings.description}
                onChange={(e) =>
                  handlePageChange("description", e.target.value)
                }
                placeholder="Describe your page..."
                rows={3}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                marginBottom: 16,
              }}
            >
              <div>
                <label
                  className="label"
                  htmlFor="isPublic"
                  style={{ marginBottom: 2 }}
                >
                  Public Page
                </label>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--text-3)",
                  }}
                >
                  Make your page visible to everyone
                </p>
              </div>
              <button
                type="button"
                className="lh-toggle"
                data-on={pageSettings.isPublic ? "true" : "false"}
                onClick={() =>
                  handlePageChange("isPublic", !pageSettings.isPublic)
                }
                aria-label="Toggle public"
              >
                <span className="lh-toggle__knob" />
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoadingPage}
            >
              {isLoadingPage ? "Saving\u2026" : "Save settings"}
            </button>
          </div>
        </form>
      </div>
      <div className="dash-main__right" />
    </div>
  );
}
