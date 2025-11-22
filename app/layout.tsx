import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ReactNode } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Raven Transition Showcase",
  description: "Dramatic raven-inspired image transition between two hero shots."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
