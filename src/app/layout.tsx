import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Euroshop — Premium Fashion',
  description: 'Discover premium clothing and accessories at accessible prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
