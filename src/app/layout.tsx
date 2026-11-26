import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nurdent.uz'),
  title: 'NurDent — Pro Stomatologiya',
  description:
    'NurDent: Stomatologlar uchun professional asbob-uskunalar va materiallar. Aniq. Ishonchli. Mukammal.',
  openGraph: {
    title: 'NurDent — Pro Stomatologiya',
    description:
      'Stomatologlar uchun professional asbob-uskunalar va materiallar. Aniq. Ishonchli. Mukammal.',
    images: ['/assets/images/nurdent_logo.jpg'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="scroll-smooth">
      <head>
        {/* Telegram Web App SDK */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-white text-[#1d1d1f] antialiased selection:bg-[#0071e3] selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
