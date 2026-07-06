import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from '@/shared/hooks/session-provider';

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'mini-competitions',
  description: 'Competition management and authentication playground',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
