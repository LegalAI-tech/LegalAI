"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 ease-in-out ${
        isScrolled
          ? "backdrop-blur-xl bg-white/10 dark:bg-black/20 border-b border-white/20 dark:border-white/10 shadow-2xl shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              LegalAI
            </Link>
          </div>

          {/* Navigation Links */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex space-x-8">
              <NavigationMenuItem>
                <Link
                  href="#home"
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="#features"
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Features
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="#testimonial"
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Testimonial
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="#pricing"
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
