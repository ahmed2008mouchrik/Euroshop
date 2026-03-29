import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Euroshop — Premium Fashion & Lifestyle',
  description: 'Discover premium clothing, decorations and cosmetics at accessible prices. Based in Bruxelles, Belgique.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
