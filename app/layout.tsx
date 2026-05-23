import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Amarants Instagrowht',
  description: 'Transforme seu Instagram em uma máquina de crescimento automático com Inteligência Artificial',
  icons: {
    icon: [
      { url: '/Logo_amarantsGroth.png', type: 'image/png' },
    ],
    apple: '/Logo_amarantsGroth.png',
    shortcut: '/Logo_amarantsGroth.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}