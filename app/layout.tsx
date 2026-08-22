import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B&B Het Berkenbos | Overnachten in Hauwert",
  description: "Kom op adem bij B&B Het Berkenbos in Hauwert. Een kleinschalig en persoonlijk verblijf in het West-Friese landschap.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "B&B Het Berkenbos",
    description: "Even helemaal weg.",
    type: "website",
    locale: "nl_NL",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
