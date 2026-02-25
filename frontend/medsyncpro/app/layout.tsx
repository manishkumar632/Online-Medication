import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MedSyncpro – Health & Wellness Store",
  description: "Your trusted online pharmacy for medicines, skincare, baby care, supplements and wellness products. Flat 20% off your first order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
