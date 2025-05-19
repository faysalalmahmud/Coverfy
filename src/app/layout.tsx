import type {Metadata} from 'next';
// Removed Geist font imports
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Removed geistSans and geistMono constants

export const metadata: Metadata = {
  title: 'SohojCover - Academic Cover Page Generator',
  description: 'Easily create and download professional A4 cover pages for your assignments and lab reports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-sans`}> {/* Removed font variables */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
