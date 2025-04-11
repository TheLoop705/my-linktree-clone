import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/marketing/feature-card";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Testimonial } from "@/components/marketing/testimonial";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "One Link for All Your Content",
  description: "Connect all your content in one beautiful link in bio page. Share your social profiles, videos, music, and more.",
};

export default function HomePage() {
  return (
    <>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white dark:from-gray-950 dark:to-gray-900" />
        <div className="relative container px-4 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <h1 className="mb-6 text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                One Link for <br />
                <span className="text-primary-500">All Your Content</span>
              </h1>
              <p className="mb-8 text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Connect all your social media profiles, websites, videos, music, and more in one beautiful link in bio page.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/register">Get Started for Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/templates">See Examples</Link>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative mx-auto max-w-md">
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <Image 
                    src="/images/demo-profile.png" 
                    alt="LinkHub Profile Example" 
                    width={320}
                    height={640}
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-200 dark:bg-primary-900 rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-accent-200 dark:bg-accent-900 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              LinkHub provides all the tools you need to create a professional online presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.features.map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Start with our free plan or upgrade for more features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              tier={siteConfig.pricing.free}
              popular={false}
              className="md:mt-8"
            />
            <PricingCard 
              tier={siteConfig.pricing.pro}
              popular={true}
            />
            <PricingCard 
              tier={siteConfig.pricing.business}
              popular={false}
              className="md:mt-8"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join thousands of content creators, influencers, and businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="LinkHub has completely changed how I share content with my audience. It's so much easier than managing multiple links."
              author="Sarah Johnson"
              role="Content Creator"
              avatarSrc="/images/testimonials/user-1.jpg"
            />
            <Testimonial 
              quote="The analytics feature has been a game-changer for understanding what content my audience engages with most."
              author="David Chen"
              role="YouTube Creator"
              avatarSrc="/images/testimonials/user-2.jpg"
            />
            <Testimonial 
              quote="As a small business owner, I needed an affordable way to showcase all my products. LinkHub was the perfect solution."
              author="Maria Rodriguez"
              role="Small Business Owner"
              avatarSrc="/images/testimonials/user-3.jpg"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Simplify Your Online Presence?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of creators and businesses who use LinkHub to connect with their audience.
            </p>
            <Button asChild size="lg">
              <Link href="/register">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}