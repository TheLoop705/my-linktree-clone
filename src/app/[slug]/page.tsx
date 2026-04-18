import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/design/Icon";

interface MockProfile {
  themeName: "default" | "dark" | "gradient" | "minimal";
  displayName: string;
  profession?: string;
  location?: string;
  bio?: string;
  avatarInitial: string;
  links: { id: string; title: string; url: string; description?: string }[];
}

const MOCK_PROFILES: Record<string, MockProfile> = {
  demo: {
    themeName: "default",
    displayName: "Maya Okafor",
    profession: "Product Designer",
    location: "Brooklyn, NY",
    bio: "Designing calmer software. Currently building tools for small creative studios.",
    avatarInitial: "M",
    links: [
      { id: "1", title: "Portfolio", url: "#", description: "Selected work 2020—2026" },
      { id: "2", title: "Latest collection", url: "#", description: "New drop — limited run" },
      { id: "3", title: "Book a call", url: "#", description: "30-min intro, free" },
      { id: "4", title: "Instagram", url: "#" },
      { id: "5", title: "Newsletter", url: "#", description: "Weekly, no fluff" },
    ],
  },
  jordan: {
    themeName: "dark",
    displayName: "Jordan Reyes",
    profession: "Founder · Helix Studio",
    location: "Austin, TX",
    bio: "I stopped carrying business cards two months ago. Every new contact starts with a tap.",
    avatarInitial: "J",
    links: [
      { id: "1", title: "Helix Studio", url: "#", description: "Our brand + product work" },
      { id: "2", title: "Case studies", url: "#", description: "12 recent projects" },
      { id: "3", title: "Speaking", url: "#" },
      { id: "4", title: "LinkedIn", url: "#" },
    ],
  },
  lena: {
    themeName: "gradient",
    displayName: "Lena Morikawa",
    profession: "Product photographer",
    location: "Los Angeles",
    bio: "Studio & on-location photography for brands that care about details.",
    avatarInitial: "L",
    links: [
      { id: "1", title: "Book a shoot", url: "#" },
      { id: "2", title: "Portfolio", url: "#" },
      { id: "3", title: "Rates & packages", url: "#" },
      { id: "4", title: "Instagram", url: "#" },
    ],
  },
  you: {
    themeName: "minimal",
    displayName: "Your Name",
    profession: "Your Title",
    location: "Your City",
    bio: "This is your LinkHub page. Customize it in the dashboard.",
    avatarInitial: "Y",
    links: [
      { id: "1", title: "Add your first link", url: "#", description: "Edit in dashboard" },
      { id: "2", title: "Personal site", url: "#" },
      { id: "3", title: "Contact", url: "#" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(MOCK_PROFILES).map((slug) => ({ slug }));
}

export default function PublicPage({ params }: { params: { slug: string } }) {
  const profile = MOCK_PROFILES[params.slug];
  if (!profile) notFound();

  return (
    <div className="profile" data-theme={profile.themeName}>
      {profile.themeName === "dark" && (
        <div className="profile__blobs" aria-hidden>
          <span className="blob blob--pink" />
          <span className="blob blob--indigo" />
          <span className="blob blob--cyan" />
        </div>
      )}

      <div className="profile__inner">
        <div className="profile__avatar">
          <span>{profile.avatarInitial}</span>
        </div>

        <div className="profile__meta">
          <div className="name">{profile.displayName}</div>
          {profile.profession && (
            <div className="role">{profile.profession}</div>
          )}
          {profile.location && (
            <div className="loc">
              <Icon.Pin size={12} /> {profile.location}
            </div>
          )}
          {profile.bio && <p className="bio">{profile.bio}</p>}
        </div>

        <div className="profile__links">
          {profile.links.map((l) => (
            <Link
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
            >
              <div
                className="link-card__emoji"
                style={{
                  background: "var(--indigo-100)",
                  color: "var(--indigo-600)",
                }}
              >
                <Icon.Link size={16} />
              </div>
              <div className="link-card__body">
                <div className="t">{l.title}</div>
                {l.description && <div className="s">{l.description}</div>}
              </div>
              <div className="link-card__arrow">
                <Icon.Arrow size={14} />
              </div>
            </Link>
          ))}
        </div>

        <div className="profile__footer">
          <span className="mark" aria-hidden />
          Powered by <strong>LinkHub</strong>
        </div>
      </div>
    </div>
  );
}
