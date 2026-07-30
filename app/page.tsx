import {InviteEditor} from '../src/editor/InviteEditor';
import {HomeSeoContent} from '../src/marketing/HomeSeoContent';
import {occasionPages, occasionSlugs} from '../src/marketing/occasionPages';
import {JsonLd} from '../src/seo/JsonLd';
import {
  absoluteUrl,
  getSiteOrigin,
  siteDescription,
  siteName,
} from '../src/seo/site';

export default async function HomePage() {
  const origin = await getSiteOrigin();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin.toString()}#website`,
        url: origin.toString(),
        name: siteName,
        alternateName: 'Vowframe Invitation Studio',
        description: siteDescription,
      },
      {
        '@type': 'WebApplication',
        '@id': `${origin.toString()}#application`,
        url: origin.toString(),
        name: 'Vowframe Invitation Studio',
        description: siteDescription,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires a modern web browser',
        image: absoluteUrl(origin, '/og-v2.png'),
        featureList: [
          'Video invitation maker',
          'Animated invitation maker',
          'Photo invitation maker',
          'Personalized invitation templates',
          'Portrait and music customization',
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Invitation occasions',
        itemListElement: occasionSlugs.map((slug, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: occasionPages[slug].label,
          url: absoluteUrl(origin, `/invitations/${slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div id="invitation-maker">
        <InviteEditor />
      </div>
      <HomeSeoContent />
    </>
  );
}
