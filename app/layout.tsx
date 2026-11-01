import type { Metadata } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "./globals.css";
import Nav from "@/components/Nav";
import LiveRefresh from "@/components/LiveRefresh";
import AdminProvider from "@/components/AdminProvider";
import AdminBar from "@/components/AdminBar";

export const metadata: Metadata = {
  title: "DLS League",
  description: "Live standings for our DLS league",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
  <AdminProvider>
    <header className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 pt-6">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <circle cx="13" cy="13" r="9" />
        <path d="M13 2v22" />
        <circle cx="13" cy="13" r="1.6" fill="currentColor" />
      </svg>
      <span className="font-display text-2xl font-extrabold tracking-wide">
        DLS League
      </span>
    </header>
    <div className="mx-auto max-w-3xl px-3 pb-32 pt-6">
      {children}
      <footer className="mt-10 text-center">
        <AdminBar />
      </footer>
    </div>
    <Nav />
    <LiveRefresh />
  </AdminProvider>
</body>
    </html>
  );
}