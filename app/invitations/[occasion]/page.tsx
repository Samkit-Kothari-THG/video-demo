import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {OccasionPage} from '../../../src/marketing/OccasionPage';
import {
  getOccasionPage,
  occasionSlugs,
} from '../../../src/marketing/occasionPages';
import {JsonLd} from '../../../src/seo/JsonLd';
import {absoluteUrl, getSiteOrigin} from '../../../src/seo/site';

type OccasionRouteProps = {
  params: Promise<{occasion: string}>;
};

export const dynamicParams = false;

export const generateStaticParams = () =>
  occasionSlugs.map((occasion) => ({occasion}));

export const generateMetadata = async ({
  params,
}: OccasionRouteProps): Promise<Metadata> => {
  const {occasion} = await params;
  const content = getOccasionPage(occasion);
  if (!content) {
    notFound();
  }

  const canonicalPath = `/invitations/${content.slug}`;
  return {
    title: content.metaTitle,
    description: content.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${content.metaTitle} | Vowframe`,
      description: content.description,
      type: 'website',
      url: canonicalPath,
      images: [
        {
          url: '/og-v2.png',
          width: 1200,
          height: 630,
          alt: 'Vowframe video, animated, and photo invitation maker',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${content.metaTitle} | Vowframe`,
      description: content.description,
      images: ['/og-v2.png'],
    },
  };
};

export default async function InvitationOccasionPage({
  params,
}: OccasionRouteProps) {
  const {occasion} = await params;
  const content = getOccasionPage(occasion);
  if (!content) {
    notFound();
  }

  const origin = await getSiteOrigin();
  const pageUrl = absoluteUrl(origin, `/invitations/${content.slug}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: content.metaTitle,
        description: content.description,
        isPartOf: {
          '@id': `${origin.toString()}#website`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl(origin, content.heroImage),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Vowframe',
            item: origin.toString(),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: content.label,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <OccasionPage content={content} />
    </>
  );
}
