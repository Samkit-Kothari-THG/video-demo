import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@remotion/bundler', '@remotion/renderer'],
  async headers() {
    const privateAssetHeaders = [
      {
        key: 'X-Robots-Tag',
        value: 'noindex, nofollow, noarchive',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
    ];

    return [
      {
        source: '/api/:path*',
        headers: privateAssetHeaders,
      },
      {
        source: '/renders/:path*',
        headers: privateAssetHeaders,
      },
      {
        source: '/uploads/:path*',
        headers: privateAssetHeaders,
      },
    ];
  },
};

export default nextConfig;
