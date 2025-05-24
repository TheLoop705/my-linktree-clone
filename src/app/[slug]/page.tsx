import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { ExternalLink, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        isPublic: true 
      },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { position: 'asc' }
        },
        user: {
          include: {
            profile: true
          }
        },
        theme: true
      }
    });

    return page;
  } catch (error) {
    console.error('Error fetching page:', error);
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

  // Apply theme styles based on theme name
  const getThemeStyles = (themeName?: string) => {
    switch (themeName) {
      case 'dark':
        return {
          containerClass: 'min-h-screen py-8 px-4 bg-gray-900 text-white',
          cardClass: 'bg-gray-800 border-gray-700 hover:bg-gray-750',
          accentColor: '#a855f7',
          textColor: 'text-white'
        };
      case 'gradient':
        return {
          containerClass: 'min-h-screen py-8 px-4 bg-gradient-to-br from-pink-500 to-orange-400 text-white',
          cardClass: 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20',
          accentColor: '#ffffff',
          textColor: 'text-white'
        };
      case 'minimal':
        return {
          containerClass: 'min-h-screen py-8 px-4 bg-gray-50 text-gray-900',
          cardClass: 'bg-white border-gray-200 hover:bg-gray-50',
          accentColor: '#000000',
          textColor: 'text-gray-900'
        };
      default: // 'default'
        return {
          containerClass: 'min-h-screen py-8 px-4 bg-white text-gray-900',
          cardClass: 'bg-white border-gray-200 hover:bg-gray-50',
          accentColor: '#3b82f6',
          textColor: 'text-gray-900'
        };
    }
  };

  const themeStyles = getThemeStyles(theme?.themeName || undefined);
  return (
    <div className={themeStyles.containerClass}>
      <div className="max-w-md mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={profile?.displayName || user.email}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg"
              style={{ backgroundColor: themeStyles.accentColor }}
            >
              <User className="w-12 h-12 text-white" />
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2">
            {title || profile?.displayName || user.email}
          </h1>

          {(description || profile?.bio) && (
            <p className="opacity-75 mb-4 max-w-sm mx-auto">
              {description || profile?.bio}
            </p>
          )}

          {profile?.profession && (
            <p className="text-sm opacity-75 mb-2">{profile.profession}</p>
          )}

          {profile?.location && (
            <p className="text-sm opacity-75 mb-4">{profile.location}</p>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {links.length > 0 ? (
            links.map((link) => (
              <Card 
                key={link.id} 
                className={`hover:shadow-md transition-shadow duration-200 border-0 shadow-sm ${themeStyles.cardClass}`}
              >
                <CardContent className="p-0">
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-4 hover:opacity-75 transition-opacity duration-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{link.title}</h3>
                        {link.description && (
                          <p className="text-sm opacity-75 mt-1">{link.description}</p>
                        )}
                      </div>
                      <ExternalLink className="w-5 h-5 opacity-50" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="opacity-75 mb-4">No links available yet</p>
              <p className="text-sm opacity-50">Check back later for updates!</p>
            </div>
          )}
        </div>

        {/* Additional Profile Links */}
        {profile?.websiteUrl && (
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="sm">
              <Link 
                href={profile.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Visit Website
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm opacity-50">
            Powered by{' '}
            <Link 
              href="/" 
              className="hover:underline font-medium"
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

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: 'Page Not Found',
    };
  }

  const { title, description, user } = pageData;
  const profile = user.profile;

  return {
    title: title || profile?.displayName || `${user.email}'s LinkHub`,
    description: description || profile?.bio || `Check out ${user.email}'s links on LinkHub`,
    openGraph: {
      title: title || profile?.displayName || `${user.email}'s LinkHub`,
      description: description || profile?.bio || `Check out ${user.email}'s links on LinkHub`,
      images: profile?.profileImageUrl ? [profile.profileImageUrl] : [],
    },
  };
}
