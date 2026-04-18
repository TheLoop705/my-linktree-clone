import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Icon } from "@/components/design/Icon";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPageData(slug: string) {
  try {
    const page = await prisma.linkPage.findUnique({
      where: {
        slug,
        isPublic: true,
      },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { position: "asc" },
        },
        user: {
          include: {
            profile: true,
          },
        },
        theme: true,
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

type ThemeName = "default" | "dark" | "gradient" | "minimal";

function resolveThemeName(raw?: string | null): ThemeName {
  if (raw === "dark" || raw === "gradient" || raw === "minimal") {
    return raw;
  }
  return "default";
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { title, description, links, user, theme } = pageData;
  const profile = user.profile;

  const themeName = resolveThemeName(theme?.themeName);

  const displayName = title || profile?.displayName || user.email;
  const initial = (displayName || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="profile" data-theme={themeName}>
      {themeName === "dark" && (
        <div className="profile__blobs" aria-hidden>
          <span className="blob blob--pink" />
          <span className="blob blob--indigo" />
          <span className="blob blob--cyan" />
        </div>
      )}

      <div className="profile__inner">
        <div className="profile__avatar">
          {profile?.profileImageUrl ? (
            <img src={profile.profileImageUrl} alt="" />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="profile__meta">
          <div className="name">{displayName}</div>
          {profile?.profession && (
            <div className="role">{profile.profession}</div>
          )}
          {profile?.location && (
            <div className="loc">
              <Icon.Pin size={12} /> {profile.location}
            </div>
          )}
          {(description || profile?.bio) && (
            <p className="bio">{description || profile?.bio}</p>
          )}
        </div>

        <div className="profile__links">
          {links.map((l) => (
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
          {links.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                opacity: 0.7,
                fontSize: 13,
              }}
            >
              No links yet — check back soon.
            </div>
          )}
        </div>

        <div className="profile__footer">
          <span className="mark" aria-hidden />
          Powered by <strong>LinkHub</strong>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    return { title: "Page Not Found" };
  }

  const { title, description, user } = pageData;
  const profile = user.profile;

  return {
    title: title || profile?.displayName || `${user.email}'s LinkHub`,
    description:
      description ||
      profile?.bio ||
      `Check out ${user.email}'s links on LinkHub`,
    openGraph: {
      title: title || profile?.displayName || `${user.email}'s LinkHub`,
      description:
        description ||
        profile?.bio ||
        `Check out ${user.email}'s links on LinkHub`,
      images: profile?.profileImageUrl ? [profile.profileImageUrl] : [],
    },
  };
}
