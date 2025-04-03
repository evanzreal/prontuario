import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prontuário - PWA para Psicólogos",
  description: "Um PWA para gravar e transcrever sessões de psicoterapia",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => {
                    console.log('ServiceWorker registration successful');
                  })
                  .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                  });
              });
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <main className="max-w-md mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
