import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vowframe — Video Invite Studio',
  description: 'Create and render a personalized engagement invitation.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
