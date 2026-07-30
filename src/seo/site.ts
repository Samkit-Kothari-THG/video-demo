import {headers} from 'next/headers';

export const siteName = 'Vowframe';
export const siteTitle =
  'Online Invitation Maker for Video, Animated & Photo Invites';
export const siteDescription =
  'Create personalized video invitations, animated invite cards, and photo invitations for weddings, engagements, birthdays, baby showers, and housewarmings.';

const parseOrigin = (value: string | undefined): URL | null => {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(
      candidate.includes('://') ? candidate : `https://${candidate}`,
    );
    url.pathname = '/';
    url.search = '';
    url.hash = '';
    return url;
  } catch {
    return null;
  }
};

const configuredOrigin = () =>
  parseOrigin(process.env.SITE_URL) ??
  parseOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  parseOrigin(process.env.VERCEL_URL);

export const getSiteOrigin = async (): Promise<URL> => {
  const configured = configuredOrigin();
  if (configured) {
    return configured;
  }

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

  if (host) {
    const isLocalHost =
      host.startsWith('localhost') || host.startsWith('127.0.0.1');
    const protocol =
      forwardedProtocol === 'http' || forwardedProtocol === 'https'
        ? forwardedProtocol
        : isLocalHost
          ? 'http'
          : 'https';
    const requestOrigin = parseOrigin(`${protocol}://${host}`);
    if (requestOrigin) {
      return requestOrigin;
    }
  }

  return new URL('http://localhost:3000');
};

export const absoluteUrl = (origin: URL, path: string) =>
  new URL(path, origin).toString();
