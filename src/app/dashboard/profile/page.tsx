"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
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
      <div className="container py-4">
        <div className="placeholder-glow">
          <div className="placeholder col-3 mb-4" style={{ height: "2rem" }}></div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="placeholder col-12" style={{ height: "400px", borderRadius: "1rem" }}></div>
            </div>
            <div className="col-md-6">
              <div className="placeholder col-12" style={{ height: "400px", borderRadius: "1rem" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <p className="mb-0">Please sign in to access your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10 col-xxl-8">
        <div className="mb-4">
          <h2 className="fw-bold" style={{ color: "var(--lh-dark)" }}>
            Profile Settings
          </h2>
          <p className="text-muted mb-0">
            Manage your profile information and page settings.
          </p>
        </div>

        <div className="row g-4">
          {/* Profile Information */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                    }}
                  >
                    <i className="bi bi-person fs-5" style={{ color: "#7c3aed" }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Profile Information</h5>
                    <small className="text-muted">
                      Displayed on your public page
                    </small>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label fw-medium small">
                      Display Name *
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
                      value={profile.displayName}
                      onChange={(e) =>
                        handleProfileChange("displayName", e.target.value)
                      }
                      placeholder="Your display name"
                    />
                    {errors.displayName && (
                      <div className="invalid-feedback">
                        {errors.displayName[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label fw-medium small">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      className={`form-control ${errors.bio ? "is-invalid" : ""}`}
                      value={profile.bio}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                    {errors.bio && (
                      <div className="invalid-feedback">{errors.bio[0]}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="profession" className="form-label fw-medium small">
                      Profession
                    </label>
                    <input
                      id="profession"
                      type="text"
                      className={`form-control ${errors.profession ? "is-invalid" : ""}`}
                      value={profile.profession}
                      onChange={(e) =>
                        handleProfileChange("profession", e.target.value)
                      }
                      placeholder="Your profession or title"
                    />
                    {errors.profession && (
                      <div className="invalid-feedback">
                        {errors.profession[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="location" className="form-label fw-medium small">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      className={`form-control ${errors.location ? "is-invalid" : ""}`}
                      value={profile.location}
                      onChange={(e) =>
                        handleProfileChange("location", e.target.value)
                      }
                      placeholder="Your location"
                    />
                    {errors.location && (
                      <div className="invalid-feedback">
                        {errors.location[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="websiteUrl" className="form-label fw-medium small">
                      Website URL
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      className={`form-control ${errors.websiteUrl ? "is-invalid" : ""}`}
                      value={profile.websiteUrl}
                      onChange={(e) =>
                        handleProfileChange("websiteUrl", e.target.value)
                      }
                      placeholder="https://your-website.com"
                    />
                    {errors.websiteUrl && (
                      <div className="invalid-feedback">
                        {errors.websiteUrl[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="profileImageUrl" className="form-label fw-medium small">
                      Profile Image URL
                    </label>
                    <input
                      id="profileImageUrl"
                      type="url"
                      className={`form-control ${errors.profileImageUrl ? "is-invalid" : ""}`}
                      value={profile.profileImageUrl}
                      onChange={(e) =>
                        handleProfileChange("profileImageUrl", e.target.value)
                      }
                      placeholder="https://your-image-url.com/image.jpg"
                    />
                    {errors.profileImageUrl && (
                      <div className="invalid-feedback">
                        {errors.profileImageUrl[0]}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2 me-1"></i>
                        Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Page Settings */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                    }}
                  >
                    <i className="bi bi-gear fs-5" style={{ color: "#2563eb" }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Page Settings</h5>
                    <small className="text-muted">
                      Configure visibility and details
                    </small>
                  </div>
                </div>

                <form onSubmit={handlePageSubmit}>
                  <div className="mb-3">
                    <label htmlFor="slug" className="form-label fw-medium small">
                      Page URL
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light small">
                        {typeof window !== "undefined"
                          ? window.location.origin
                          : "http://localhost:3000"}
                        /
                      </span>
                      <input
                        id="slug"
                        type="text"
                        className="form-control bg-light"
                        value={pageSettings.slug}
                        disabled
                      />
                    </div>
                    <div className="form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Your page URL cannot be changed after creation.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-medium small">
                      Page Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      value={pageSettings.title}
                      onChange={(e) => handlePageChange("title", e.target.value)}
                      placeholder="Your page title"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-medium small">
                      Page Description
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      value={pageSettings.description}
                      onChange={(e) =>
                        handlePageChange("description", e.target.value)
                      }
                      placeholder="Describe your page..."
                      rows={3}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-4 p-3 bg-light rounded-3">
                    <div>
                      <label
                        htmlFor="isPublic"
                        className="form-label fw-medium small mb-0"
                      >
                        Public Page
                      </label>
                      <p className="text-muted small mb-0">
                        Make your page visible to everyone
                      </p>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input
                        id="isPublic"
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={pageSettings.isPublic}
                        onChange={(e) =>
                          handlePageChange("isPublic", e.target.checked)
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={isLoadingPage}
                  >
                    {isLoadingPage ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2 me-1"></i>
                        Update Page Settings
                      </>
                    )}
                  </button>
                </form>

                {pageSettings.slug && (
                  <div className="mt-4 p-3 bg-light rounded-3">
                    <small className="fw-medium d-block mb-1">
                      <i className="bi bi-globe me-1"></i>Your Public Page:
                    </small>
                    <a
                      href={`/${pageSettings.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small text-break fw-semibold text-decoration-none"
                      style={{ color: "var(--lh-primary)" }}
                    >
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : "http://localhost:3000"}
                      /{pageSettings.slug}{" "}
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
