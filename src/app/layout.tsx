import type { Metadata, Viewport } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_Georgian({
  variable: "--font-noto-sans-georgian",
  subsets: ["georgian", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const notoSerif = Noto_Serif_Georgian({
  variable: "--font-noto-serif-georgian",
  subsets: ["georgian", "latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "ატეხილი — იპოვე შენი ცხოველის იდეალური წყვილი",
  description:
    "ცხოველების დაწყვილების აპლიკაცია საქართველოში. პროფილი შენი ცხოველია — swipe, დამთხვევა, ჩატი.",
};

export const viewport: Viewport = {
  themeColor: "#FBF5EF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <div className="app-column">{children}</div>
      </body>
    </html>
  );
}
