"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  displayName: string;
  bio: string;
  profession: string;
  location: string;
  websiteUrl: string;
  profileImageUrl: string;
}

interface PageData {
  slug: string;
  title: string;
  description: string;
  isPublic: boolean;
}

export default function ProfilePage() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfileData>({
    displayName: "Maya Okafor",
    bio: "Designing calmer software. Currently building tools for small creative studios.",
    profession: "Product Designer",
    location: "Brooklyn, NY",
    websiteUrl: "https://mayaokafor.com",
    profileImageUrl: "",
  });

  const [pageSettings, setPageSettings] = useState<PageData>({
    slug: "you",
    title: "Your Hub",
    description: "A curated list of my work and current projects.",
    isPublic: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const handleProfileChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (name: string, value: string | boolean) => {
    setPageSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved (demo mode).",
      });
    }, 500);
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPage(true);
    setTimeout(() => {
      setIsLoadingPage(false);
      toast({
        title: "Page Settings Updated",
        description: "Your page settings have been saved (demo mode).",
      });
    }, 500);
  };

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
                  onChange={(e) => handlePageChange("slug", e.target.value)}
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
