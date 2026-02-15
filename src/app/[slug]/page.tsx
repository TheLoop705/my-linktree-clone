import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

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

export default async function PublicPage({ params }: PageProps) {
  const { slug } = params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { title, description, links, user, theme } = pageData;
  const profile = user.profile;

  const getThemeStyles = (themeName?: string) => {
    switch (themeName) {
      case "dark":
        return {
          bg: "background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);",
          textClass: "text-white",
          cardBg: "background: rgba(255,255,255,0.08); backdrop-filter: blur(10px);",
          cardBorder: "border: 1px solid rgba(255,255,255,0.1);",
          accentColor: "#a855f7",
          mutedClass: "opacity-75",
        };
      case "gradient":
        return {
          bg: "background: linear-gradient(135deg, #ec4899 0%, #f97316 50%, #eab308 100%);",
          textClass: "text-white",
          cardBg: "background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);",
          cardBorder: "border: 1px solid rgba(255,255,255,0.2);",
          accentColor: "#ffffff",
          mutedClass: "opacity-75",
        };
      case "minimal":
        return {
          bg: "background: #f8f9fa;",
          textClass: "text-dark",
          cardBg: "background: #ffffff;",
          cardBorder: "border: 1px solid #e5e7eb;",
          accentColor: "#111827",
          mutedClass: "text-muted",
        };
      default:
        return {
          bg: "background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%);",
          textClass: "text-dark",
          cardBg: "background: #ffffff;",
          cardBorder: "border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.06);",
          accentColor: "#6366f1",
          mutedClass: "text-muted",
        };
    }
  };

  const themeStyles = getThemeStyles(theme?.themeName || undefined);

  return (
    <div
      className={`public-page-container ${themeStyles.textClass}`}
      style={{ cssText: themeStyles.bg } as React.CSSProperties}
    >
      <div className="container" style={{ maxWidth: "480px" }}>
        {/* Profile Section */}
        <div className="text-center mb-4">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={profile?.displayName || user.email}
              className="profile-avatar mb-3"
            />
          ) : (
            <div
              className="avatar-placeholder mx-auto mb-3"
              style={{ backgroundColor: themeStyles.accentColor }}
            >
              <i className="bi bi-person-fill"></i>
            </div>
          )}

          <h2 className="fw-bold mb-1">
            {title || profile?.displayName || user.email}
          </h2>

          {(description || profile?.bio) && (
            <p className={`mb-2 ${themeStyles.mutedClass}`} style={{ maxWidth: "360px", margin: "0 auto" }}>
              {description || profile?.bio}
            </p>
          )}

          {profile?.profession && (
            <p className={`small mb-1 ${themeStyles.mutedClass}`}>
              <i className="bi bi-briefcase me-1"></i>
              {profile.profession}
            </p>
          )}

          {profile?.location && (
            <p className={`small mb-0 ${themeStyles.mutedClass}`}>
              <i className="bi bi-geo-alt me-1"></i>
              {profile.location}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="d-flex flex-column gap-3 mt-4">
          {links.length > 0 ? (
            links.map((link) => (
              <div
                key={link.id}
                className="public-link-card rounded-3"
                style={{ cssText: `${themeStyles.cardBg} ${themeStyles.cardBorder}` } as React.CSSProperties}
              >
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block p-3 text-decoration-none"
                  style={{ color: "inherit" }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-0 fs-6">{link.title}</h6>
                      {link.description && (
                        <small className={themeStyles.mutedClass}>
                          {link.description}
                        </small>
                      )}
                    </div>
                    <i className={`bi bi-arrow-up-right ${themeStyles.mutedClass}`}></i>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <i className={`bi bi-link-45deg display-4 ${themeStyles.mutedClass}`}></i>
              <p className={`mt-2 ${themeStyles.mutedClass}`}>
                No links available yet
              </p>
              <p className={`small ${themeStyles.mutedClass}`}>
                Check back later for updates!
              </p>
            </div>
          )}
        </div>

        {/* Website Link */}
        {profile?.websiteUrl && (
          <div className="mt-4 text-center">
            <Link
              href={profile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-light rounded-pill px-4"
              style={{
                borderColor: themeStyles.accentColor,
                color: themeStyles.accentColor,
              }}
            >
              <i className="bi bi-globe me-1"></i>
              Visit Website
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className={`small ${themeStyles.mutedClass}`}>
            Powered by{" "}
            <Link
              href="/"
              className="fw-semibold text-decoration-none"
              style={{ color: themeStyles.accentColor }}
            >
              LinkHub
            </Link>
          </p>
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
