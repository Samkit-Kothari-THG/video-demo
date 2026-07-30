import type {Metadata, Viewport} from 'next';
import {
  absoluteUrl,
  getSiteOrigin,
  siteDescription,
  siteName,
  siteTitle,
} from '../src/seo/site';
import './globals.css';

export const generateMetadata = async (): Promise<Metadata> => {
  const metadataBase = await getSiteOrigin();
  const title = `${siteTitle} | ${siteName}`;
  const socialImage = absoluteUrl(metadataBase, '/og-v2.png');
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();

  return {
    metadataBase,
    applicationName: 'Vowframe Invitation Studio',
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    alternates: {
      canonical: '/',
    },
    category: 'design',
    creator: siteName,
    publisher: siteName,
    referrer: 'origin-when-cross-origin',
    manifest: '/manifest.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification:
      googleVerification || bingVerification
        ? {
            google: googleVerification || undefined,
            other: bingVerification
              ? {
                  'msvalidate.01': bingVerification,
                }
              : undefined,
          }
        : undefined,
    openGraph: {
      title,
      description: siteDescription,
      type: 'website',
      url: '/',
      siteName,
      locale: 'en_IN',
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: 'Vowframe video, animated, and photo invitation maker',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: siteDescription,
      images: [socialImage],
    },
  };
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#75364a',
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
