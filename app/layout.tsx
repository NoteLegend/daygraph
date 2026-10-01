import type { Metadata } from "next";
import "./globals.css";
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';

export const metadata: Metadata = {
  title: "Daygraph — Make your days count",
  description: "Your habits, spending and shared balances, in one calm dashboard.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
