import type { Metadata } from "next";
import {
  Montserrat,
  Playfair_Display,
  Source_Code_Pro,
} from "next/font/google";
// @ts-expect-error: Allow importing global CSS without type declarations
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LegalAI",
  description:
    "Transform complex legal questions into clear, actionable insights with our AI-powered legal assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="metallic-scrollbar">
      <body className={`${montserrat.variable} ${playfairDisplay.variable} ${sourceCodePro.variable} antialiased metallic-scrollbar`} >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
