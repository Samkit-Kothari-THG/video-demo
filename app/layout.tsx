import type {Metadata, Viewport} from 'next';
import {headers} from 'next/headers';
import './globals.css';

const title = 'Vowframe — Video, animated, and photo invitations';
const description =
  'Create and share cinematic videos, looping animated cards, and polished photo invitations.';

export const generateMetadata = async (): Promise<Metadata> => {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  )
    ?.split(',')[0]
    ?.trim();
  const forwardedProtocol = requestHeaders
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();
  const protocol =
    forwardedProtocol === 'http' || forwardedProtocol === 'https'
      ? forwardedProtocol
      : host?.startsWith('localhost')
        ? 'http'
        : 'https';
  let metadataBase: URL | undefined;

  if (host) {
    try {
      metadataBase = new URL(`${protocol}://${host}`);
    } catch {
      metadataBase = undefined;
    }
  }

  const socialImage = metadataBase
    ? new URL('/og.png', metadataBase).toString()
    : undefined;

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: socialImage
        ? [
            {
              url: socialImage,
              width: 1731,
              height: 909,
              alt: 'Vowframe invitation formats',
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
};

export const viewport: Viewport = {
  themeColor: '#f4f1eb',
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
