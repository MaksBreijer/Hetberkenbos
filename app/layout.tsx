import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maksbreijer.github.io/Hetberkenbos/"),
  title: "B&B Het Berkenbos | Overnachten in Hauwert",
  description: "Een eigen barnhouse tussen 3.000 m² tuin en bos in Hauwert. Vier seizoenen, alle tijd en ruimte voor twee tot vier gasten.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "B&B Het Berkenbos",
    description: "Vier seizoenen. Eén plek.",
    type: "website",
    locale: "nl_NL",
    url: "https://maksbreijer.github.io/Hetberkenbos/",
    images: ["og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "B&B Het Berkenbos",
    description: "Vier seizoenen. Eén plek.",
    images: ["og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
