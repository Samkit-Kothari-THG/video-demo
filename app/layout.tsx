import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vowframe — Invitation films, made personal',
  description:
    'Personalise, preview, and render a cinematic invitation in minutes.',
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
