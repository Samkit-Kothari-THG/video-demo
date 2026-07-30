import type {MetadataRoute} from 'next';
import {occasionSlugs} from '../src/marketing/occasionPages';
import {absoluteUrl, getSiteOrigin} from '../src/seo/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin();

  return [
    {
      url: absoluteUrl(origin, '/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...occasionSlugs.map((occasion) => ({
      url: absoluteUrl(origin, `/invitations/${occasion}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
