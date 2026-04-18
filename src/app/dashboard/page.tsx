"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/design/Icon";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  isActive: boolean;
  position: number;
  clicks?: number;
  color?: string;
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

const SparkSvg = () => (
  <svg preserveAspectRatio="none" viewBox="0 0 100 20">
    <polyline
      fill="none"
      stroke="var(--indigo)"
      strokeWidth="1.2"
      points="0,15 10,12 20,13 30,9 40,11 50,7 60,8 70,5 80,6 90,3 100,2"
    />
  </svg>
);

function DashPreview({
  userPage,
}: {
  userPage: UserPage | null;
}) {
  if (!userPage) return null;

  const email = userPage.slug || "you";
  const initial = (email[0] ?? "U").toUpperCase();
  const displayName = userPage.title || email;
  const activeLinks = userPage.links.filter((l) => l.isActive);

  return (
    <div className="dash-preview">
      <div className="dash-preview__head">
        <div className="eyebrow mono">LIVE PREVIEW</div>
        <div className="seg">
          <button type="button" aria-pressed="true">
            Mobile
          </button>
          <button type="button" aria-pressed="false">
            Desktop
          </button>
        </div>
      </div>
      <div className="dash-preview__phone">
        <div className="screen">
          <div className="avatar">{initial}</div>
          <div className="name">{displayName}</div>
          <div className="role">Your link page</div>
          <div className="links">
            {activeLinks.slice(0, 6).map((l) => (
              <div key={l.id} className="item">
                <div
                  className="emoji"
                  style={{
                    background: (l.color || "#6366f1") + "22",
                    color: l.color || "#6366f1",
                  }}
                >
                  🔗
                </div>
                <span>{l.title}</span>
              </div>
            ))}
          </div>
          <div className="foot">Powered by LinkHub</div>
        </div>
      </div>
      <div className="dash-preview__url">
        <Icon.Globe size={14} />{" "}
        <span className="mono">linkhub.to/{userPage.slug}</span>
        <button type="button">Copy</button>
      </div>
    </div>
  );
}

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

  if (loading) {
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
            Loading your dashboard...
          </div>
        </div>
        <div className="dash-main__right" />
      </div>
    );
  }

  const links = userPage?.links ?? [];

  return (
    <div className="dash-main">
      <div className="dash-main__left">
        <div className="dash-header">
          <div>
            <div className="dash-header__eyebrow mono">LINKS</div>
            <h1>Your links</h1>
          </div>
          <div className="dash-header__actions">
            <button type="button" className="btn btn-ghost">
              <Icon.Eye size={14} /> Preview
            </button>
            <button type="button" className="btn btn-ghost">
              <Icon.Copy size={14} /> Copy URL
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddingLink(true)}
            >
              <Icon.Plus size={14} /> Add link
            </button>
          </div>
        </div>

        <div className="dash-stats">
          <div className="dash-stats__card">
            <div className="l">Page views</div>
            <div className="row">
              <div className="v">12,483</div>
              <div className="delta delta--up">+18.2%</div>
            </div>
            <div className="spark">
              <SparkSvg />
            </div>
          </div>
          <div className="dash-stats__card">
            <div className="l">Link clicks</div>
            <div className="row">
              <div className="v">3,842</div>
              <div className="delta delta--up">+12.5%</div>
            </div>
            <div className="spark">
              <SparkSvg />
            </div>
          </div>
          <div className="dash-stats__card">
            <div className="l">NFC taps</div>
            <div className="row">
              <div className="v">1,249</div>
              <div className="delta delta--up">+32.1%</div>
            </div>
            <div className="spark">
              <SparkSvg />
            </div>
          </div>
          <div className="dash-stats__card">
            <div className="l">Click rate</div>
            <div className="row">
              <div className="v">30.8%</div>
              <div className="delta delta--up">+4.3%</div>
            </div>
            <div className="spark">
              <SparkSvg />
            </div>
          </div>
        </div>

        {isAddingLink && (
          <div className="card" style={{ padding: 20, marginTop: 20 }}>
            <div className="field">
              <label className="label" htmlFor="link-title">
                Title
              </label>
              <input
                className="input"
                id="link-title"
                type="text"
                placeholder="e.g., My Portfolio"
                value={newLink.title}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="link-url">
                URL
              </label>
              <input
                className="input"
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={newLink.url}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, url: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="link-desc">
                Description (optional)
              </label>
              <textarea
                className="input"
                id="link-desc"
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
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" className="btn btn-primary" onClick={addLink}>
                Add Link
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsAddingLink(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="dash-links">
          <div className="dash-links__head">
            <div className="t">{links.length} links · drag to reorder</div>
            <div className="r mono">LAST 30 DAYS</div>
          </div>
          <div className="dash-links__list">
            {links
              .sort((a, b) => a.position - b.position)
              .map((l) => (
                <div
                  key={l.id}
                  className="dash-links__item"
                  data-inactive={!l.isActive}
                >
                  <span className="grip">
                    <Icon.Grip size={14} />
                  </span>
                  <div
                    className="emoji"
                    style={{
                      background: (l.color || "#6366f1") + "22",
                      color: l.color || "#6366f1",
                    }}
                  >
                    🔗
                  </div>
                  <div className="body">
                    <div className="t">{l.title}</div>
                    <div className="u mono">{l.url}</div>
                  </div>
                  <div className="clicks">
                    <Icon.ArrowUp size={11} />{" "}
                    <span className="mono">
                      {(l.clicks ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="lh-toggle"
                    data-on={l.isActive ? "true" : "false"}
                    onClick={() => toggleLinkStatus(l.id, !l.isActive)}
                    aria-label="Toggle link"
                  >
                    <span className="lh-toggle__knob" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: 6 }}
                    onClick={() => deleteLink(l.id)}
                  >
                    <Icon.Trash size={14} />
                  </button>
                </div>
              ))}
            <button
              type="button"
              className="dash-links__add"
              onClick={() => setIsAddingLink(true)}
            >
              <Icon.Plus size={14} /> Add a new link
            </button>
          </div>
        </div>

        <div className="dash-nfc">
          <div className="dash-nfc__head">
            <div className="t">Paired NFC devices</div>
            <button type="button" className="pair-btn">
              + Pair new wristband
            </button>
          </div>
          <div className="dash-nfc__list">
            <div className="dash-nfc__item">
              <div className="ico">
                <Icon.NFC size={18} />
              </div>
              <div className="body">
                <div className="n">Rose silicone · everyday</div>
                <div className="s mono">LH-S · Last tap 2h ago</div>
              </div>
              <div className="taps mono">483 taps</div>
            </div>
            <div className="dash-nfc__item">
              <div className="ico">
                <Icon.NFC size={18} />
              </div>
              <div className="body">
                <div className="n">Black leather · events</div>
                <div className="s mono">LH-L · Last tap 1d ago</div>
              </div>
              <div className="taps mono">766 taps</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-main__right">
        <DashPreview userPage={userPage} />
      </div>
    </div>
  );
}
