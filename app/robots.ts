import type {MetadataRoute} from 'next';
import {absoluteUrl, getSiteOrigin} from '../src/seo/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteOrigin();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/renders/', '/uploads/'],
    },
    sitemap: absoluteUrl(origin, '/sitemap.xml'),
    host: origin.origin,
  };
}
