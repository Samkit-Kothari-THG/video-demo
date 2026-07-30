import type {MetadataRoute} from 'next';
import {siteDescription} from '../src/seo/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vowframe Invitation Studio',
    short_name: 'Vowframe',
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f1eb',
    theme_color: '#75364a',
    categories: ['design', 'photo', 'video'],
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
