"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  ExternalLink,
  Plus,
  Settings,
  Eye,
  GripVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Link {
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
  links: Link[];
}

// Add theme options
const THEME_OPTIONS = [
  { value: "default", label: "Default", bg: "bg-white", accent: "bg-blue-600" },
  {
    value: "dark",
    label: "Dark Mode",
    bg: "bg-gray-900",
    accent: "bg-purple-600",
  },
  {
    value: "gradient",
    label: "Gradient",
    bg: "bg-gradient-to-br from-pink-500 to-orange-400",
    accent: "bg-white",
  },
  { value: "minimal", label: "Minimal", bg: "bg-gray-50", accent: "bg-black" },
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
        // Create a default page if none exists
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId: userPage?.id,
          ...newLink,
          position: userPage?.links?.length || 0,
        }),
      });

      if (response.ok) {
        const linkData = await response.json();
        setUserPage((prev) =>
          prev
            ? {
                ...prev,
                links: [...prev.links, linkData],
              }
            : null
        );
        setNewLink({ title: "", url: "", description: "" });
        setIsAddingLink(false);
        toast({
          title: "Success",
          description: "Link added successfully!",
        });
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
            ? {
                ...prev,
                links: prev.links.filter((link) => link.id !== linkId),
              }
            : null
        );
        toast({
          title: "Success",
          description: "Link deleted successfully!",
        });
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: newTheme }),
      });
      if (response.ok) {
        setUserPage((prev) =>
          prev ? { ...prev, theme: { themeName: newTheme } } : null
        );
        toast({
          title: "Success",
          description: "Theme updated successfully!",
          variant: "default",
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your LinkHub page and links</p>
        </div>
        <div className="flex gap-2">
          {userPage && (
            <Button asChild variant="outline">
              <Link href={`/${userPage.slug}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Page
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard/profile">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Page Info */}
      {userPage && (
        <Card>
          <CardHeader>
            <CardTitle>Your LinkHub Page</CardTitle>
            <CardDescription>
              Your public page is available at:
              <Link
                href={`/${userPage.slug}`}
                target="_blank"
                className="ml-2 text-blue-600 hover:underline"
              >
                {window.location.origin}/{userPage.slug}
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {userPage.title || "Untitled Page"}
                </p>
              </div>
              <div>
                <Label htmlFor="page-description">Description</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {userPage.description || "No description"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Customization */}
      {userPage && (
        <Card>
          <CardHeader>
            <CardTitle>Theme Customization</CardTitle>
            <CardDescription>
              Choose a theme for your LinkHub page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {" "}
              {THEME_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    userPage.theme?.themeName === option.value
                      ? "default"
                      : "outline"
                  }
                  className="flex-1"
                  onClick={() => updateTheme(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Links</CardTitle>
            <CardDescription>
              Add, edit, and manage your links. Drag to reorder them.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingLink(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Link Form */}
          {isAddingLink && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="link-title">Title</Label>
                  <Input
                    id="link-title"
                    placeholder="e.g., My Portfolio"
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    placeholder="https://example.com"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink((prev) => ({ ...prev, url: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="link-description">
                    Description (optional)
                  </Label>{" "}
                  <Textarea
                    id="link-description"
                    placeholder="Brief description of this link"
                    value={newLink.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewLink((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addLink}>Add Link</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingLink(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links List */}
          {userPage?.links && userPage.links.length > 0 ? (
            <div className="space-y-3">
              {userPage.links
                .sort((a, b) => a.position - b.position)
                .map((link) => (
                  <Card
                    key={link.id}
                    className={`${!link.isActive ? "opacity-50" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          <div className="flex-1">
                            <h3 className="font-medium">{link.title}</h3>
                            <p className="text-sm text-gray-600 truncate">
                              {link.url}
                            </p>
                            {link.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {" "}
                          <Switch
                            checked={link.isActive}
                            onCheckedChange={(checked: boolean) =>
                              toggleLinkStatus(link.id, checked)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(link.url, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLink(link.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No links added yet</p>
              <Button onClick={() => setIsAddingLink(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {userPage?.links?.length || 0}
            </div>
            <p className="text-gray-600">Total Links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {userPage?.links?.filter((link) => link.isActive).length || 0}
            </div>
            <p className="text-gray-600">Active Links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {userPage?.isPublic ? "Public" : "Private"}
            </div>
            <p className="text-gray-600">Page Status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
