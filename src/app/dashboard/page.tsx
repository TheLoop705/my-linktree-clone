"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/design/Icon";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  isActive: boolean;
  position: number;
  clicks: number;
  color: string;
}

interface UserPage {
  id: string;
  slug: string;
  title: string;
  links: LinkItem[];
}

const COLORS = ["#6366f1", "#ec4899", "#06b6d4", "#0b0b12", "#f59e0b", "#10b981"];

const INITIAL_PAGE: UserPage = {
  id: "demo",
  slug: "you",
  title: "Your Hub",
  links: [
    { id: "1", title: "Portfolio", url: "https://example.com/portfolio", isActive: true, position: 0, clicks: 1243, color: "#6366f1" },
    { id: "2", title: "Latest collection", url: "https://example.com/shop", isActive: true, position: 1, clicks: 892, color: "#ec4899" },
    { id: "3", title: "Book a call", url: "https://cal.com/demo", isActive: true, position: 2, clicks: 412, color: "#06b6d4" },
    { id: "4", title: "Instagram", url: "https://instagram.com/demo", isActive: false, position: 3, clicks: 76, color: "#0b0b12" },
  ],
};

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

function DashPreview({ userPage }: { userPage: UserPage }) {
  const initial = userPage.title[0]?.toUpperCase() ?? "Y";
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
          <div className="name">{userPage.title}</div>
          <div className="role">Your link page</div>
          <div className="links">
            {activeLinks.slice(0, 6).map((l) => (
              <div key={l.id} className="item">
                <div
                  className="emoji"
                  style={{
                    background: l.color + "22",
                    color: l.color,
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
  const { toast } = useToast();
  const [userPage, setUserPage] = useState<UserPage>(INITIAL_PAGE);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
  });

  const addLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Missing info",
        description: "Please fill in both title and URL.",
        variant: "destructive",
      });
      return;
    }

    const link: LinkItem = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      description: newLink.description || undefined,
      isActive: true,
      position: userPage.links.length,
      clicks: 0,
      color: COLORS[userPage.links.length % COLORS.length],
    };

    setUserPage((prev) => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({ title: "", url: "", description: "" });
    setIsAddingLink(false);
    toast({ title: "Link added", description: "Your new link is live." });
  };

  const deleteLink = (linkId: string) => {
    setUserPage((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== linkId),
    }));
    toast({ title: "Link deleted" });
  };

  const toggleLinkStatus = (linkId: string, isActive: boolean) => {
    setUserPage((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === linkId ? { ...link, isActive } : link
      ),
    }));
  };

  const links = userPage.links;

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
                      background: l.color + "22",
                      color: l.color,
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
                    <span className="mono">{l.clicks.toLocaleString()}</span>
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
