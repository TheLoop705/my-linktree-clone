"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  isActive: boolean;
  position: number;
}

interface UserPage {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  isPublic: boolean;
  theme?: {
    themeName?: string;
  };
  links: LinkItem[];
}

const THEME_OPTIONS = [
  { value: "default", label: "Default", cssClass: "theme-default" },
  { value: "dark", label: "Dark", cssClass: "theme-dark" },
  { value: "gradient", label: "Gradient", cssClass: "theme-gradient" },
  { value: "minimal", label: "Minimal", cssClass: "theme-minimal" },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [userPage, setUserPage] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    fetchUserPage();
  }, []);

  const fetchUserPage = async () => {
    try {
      const response = await fetch("/api/pages/my-page");
      if (response.ok) {
        const data = await response.json();
        setUserPage(data);
      } else {
        await createDefaultPage();
      }
    } catch (error) {
      console.error("Error fetching user page:", error);
      toast({
        title: "Error",
        description: "Failed to load your page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPage = async () => {
    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: `${session?.user?.email?.split("@")[0] || "user"}-${Date.now()}`,
          title: `${session?.user?.email}'s Links`,
          description: "Welcome to my LinkHub page!",
          isPublic: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserPage(data);
        toast({
          title: "Welcome!",
          description: "Your LinkHub page has been created.",
        });
      }
    } catch (error) {
      console.error("Error creating default page:", error);
    }
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: userPage?.id,
          ...newLink,
          position: userPage?.links?.length || 0,
        }),
      });

      if (response.ok) {
        const linkData = await response.json();
        setUserPage((prev) =>
          prev ? { ...prev, links: [...prev.links, linkData] } : null
        );
        setNewLink({ title: "", url: "", description: "" });
        setIsAddingLink(false);
        toast({ title: "Success", description: "Link added successfully!" });
      } else {
        throw new Error("Failed to add link");
      }
    } catch (error) {
      console.error("Error adding link:", error);
      toast({
        title: "Error",
        description: "Failed to add link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserPage((prev) =>
          prev
            ? { ...prev, links: prev.links.filter((l) => l.id !== linkId) }
            : null
        );
        toast({ title: "Success", description: "Link deleted successfully!" });
      } else {
        throw new Error("Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleLinkStatus = async (linkId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setUserPage((prev) =>
          prev
            ? {
                ...prev,
                links: prev.links.map((link) =>
                  link.id === linkId ? { ...link, isActive } : link
                ),
              }
            : null
        );
      } else {
        throw new Error("Failed to update link");
      }
    } catch (error) {
      console.error("Error updating link:", error);
      toast({
        title: "Error",
        description: "Failed to update link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTheme = async (newTheme: string) => {
    if (!userPage) return;

    try {
      const response = await fetch(`/api/pages/${userPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
      if (response.ok) {
        setUserPage((prev) =>
          prev ? { ...prev, theme: { themeName: newTheme } } : null
        );
        toast({
          title: "Success",
          description: "Theme updated successfully!",
        });
      } else {
        throw new Error("Failed to update theme");
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border spinner-linkhub" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10 col-xxl-8">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
          <div className="mb-3 mb-md-0">
            <h2 className="fw-bold mb-1" style={{ color: "var(--lh-dark)" }}>
              Dashboard
            </h2>
            <p className="text-muted mb-0">Manage your LinkHub page and links</p>
          </div>
          <div className="d-flex gap-2">
            {userPage && (
              <Link
                href={`/${userPage.slug}`}
                target="_blank"
                className="btn btn-outline-primary btn-sm d-flex align-items-center"
              >
                <i className="bi bi-eye me-1"></i>
                View Page
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center"
            >
              <i className="bi bi-gear me-1"></i>
              Settings
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row g-3 mb-4">
          <div className="col-sm-4">
            <div className="card stat-card p-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                  }}
                >
                  <i className="bi bi-link-45deg fs-4" style={{ color: "#7c3aed" }}></i>
                </div>
                <div>
                  <div className="stat-value">{userPage?.links?.length || 0}</div>
                  <div className="stat-label">Total Links</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card stat-card p-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                  }}
                >
                  <i className="bi bi-check-circle fs-4" style={{ color: "#059669" }}></i>
                </div>
                <div>
                  <div className="stat-value">
                    {userPage?.links?.filter((l) => l.isActive).length || 0}
                  </div>
                  <div className="stat-label">Active Links</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card stat-card p-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                  }}
                >
                  <i
                    className={`bi ${userPage?.isPublic ? "bi-globe" : "bi-lock"} fs-4`}
                    style={{ color: "#2563eb" }}
                  ></i>
                </div>
                <div>
                  <div className="stat-value">
                    {userPage?.isPublic ? "Public" : "Private"}
                  </div>
                  <div className="stat-label">Page Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Info Card */}
        {userPage && (
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-file-earmark-text fs-5 me-2" style={{ color: "var(--lh-primary)" }}></i>
                <h5 className="fw-bold mb-0">Your LinkHub Page</h5>
              </div>
              <p className="text-muted mb-2">
                Your public page is available at:{" "}
                <Link
                  href={`/${userPage.slug}`}
                  target="_blank"
                  className="fw-semibold text-decoration-none"
                  style={{ color: "var(--lh-primary)" }}
                >
                  {typeof window !== "undefined" && window.location.origin}/
                  {userPage.slug}{" "}
                  <i className="bi bi-box-arrow-up-right small"></i>
                </Link>
              </p>
              <div className="row mt-3">
                <div className="col-md-6">
                  <small className="text-muted fw-medium text-uppercase">
                    Page Title
                  </small>
                  <p className="mb-0">{userPage.title || "Untitled Page"}</p>
                </div>
                <div className="col-md-6">
                  <small className="text-muted fw-medium text-uppercase">
                    Description
                  </small>
                  <p className="mb-0">
                    {userPage.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Customization */}
        {userPage && (
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-palette fs-5 me-2" style={{ color: "var(--lh-secondary)" }}></i>
                <h5 className="fw-bold mb-0">Theme</h5>
              </div>
              <p className="text-muted small mb-3">
                Choose a theme for your public page.
              </p>
              <div className="d-flex gap-3 align-items-center">
                {THEME_OPTIONS.map((option) => (
                  <div key={option.value} className="text-center">
                    <div
                      className={`theme-option ${option.cssClass} ${
                        userPage.theme?.themeName === option.value ? "active" : ""
                      }`}
                      onClick={() => updateTheme(option.value)}
                      title={option.label}
                    >
                      {userPage.theme?.themeName === option.value && (
                        <span className="check-mark">
                          <i className="bi bi-check"></i>
                        </span>
                      )}
                    </div>
                    <small className="text-muted d-block mt-1" style={{ fontSize: "0.7rem" }}>
                      {option.label}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Links Management */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-list-ul fs-5 me-2" style={{ color: "var(--lh-accent)" }}></i>
                <div>
                  <h5 className="fw-bold mb-0">Your Links</h5>
                  <small className="text-muted">Add and manage your links</small>
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm d-flex align-items-center"
                onClick={() => setIsAddingLink(true)}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add Link
              </button>
            </div>

            {/* Add Link Form */}
            {isAddingLink && (
              <div className="card bg-light border-0 rounded-3 mb-4">
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-plus-circle me-1" style={{ color: "var(--lh-primary)" }}></i>
                    Add New Link
                  </h6>
                  <div className="mb-3">
                    <label htmlFor="link-title" className="form-label fw-medium small">
                      Title
                    </label>
                    <input
                      id="link-title"
                      type="text"
                      className="form-control"
                      placeholder="e.g., My Portfolio"
                      value={newLink.title}
                      onChange={(e) =>
                        setNewLink((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="link-url" className="form-label fw-medium small">
                      URL
                    </label>
                    <input
                      id="link-url"
                      type="url"
                      className="form-control"
                      placeholder="https://example.com"
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink((prev) => ({ ...prev, url: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="link-description" className="form-label fw-medium small">
                      Description (optional)
                    </label>
                    <textarea
                      id="link-description"
                      className="form-control"
                      rows={2}
                      placeholder="Brief description of this link"
                      value={newLink.description}
                      onChange={(e) =>
                        setNewLink((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={addLink}>
                      <i className="bi bi-plus me-1"></i>Add Link
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setIsAddingLink(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Links List */}
            {userPage?.links && userPage.links.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {userPage.links
                  .sort((a, b) => a.position - b.position)
                  .map((link) => (
                    <div
                      key={link.id}
                      className={`link-item-card p-3 ${!link.isActive ? "inactive" : ""}`}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center flex-grow-1 me-3">
                          <i className="bi bi-grip-vertical text-muted me-3 fs-5" style={{ cursor: "move" }}></i>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-semibold mb-0">{link.title}</h6>
                            <small className="text-muted text-truncate d-block">
                              {link.url}
                            </small>
                            {link.description && (
                              <small className="text-secondary mt-1 d-block">
                                {link.description}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={link.isActive}
                              onChange={(e) =>
                                toggleLinkStatus(link.id, e.target.checked)
                              }
                            />
                          </div>
                          <button
                            className="btn btn-sm btn-outline-secondary border-0"
                            onClick={() => window.open(link.url, "_blank")}
                            title="Open link"
                          >
                            <i className="bi bi-box-arrow-up-right"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={() => deleteLink(link.id)}
                            title="Delete link"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-link-45deg display-4 text-muted"></i>
                <p className="text-muted mt-2 mb-3">No links added yet</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsAddingLink(true)}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Add Your First Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
