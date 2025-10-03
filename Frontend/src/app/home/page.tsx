"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features, Testimonial, Pricing, CallToAction } from "@/components/landing/sections";
import { Footer } from "@/components/landing/footer";
import BounceLoader from "@/components/ui/bounce-loader";

export default function LandingPage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGetStarted = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/auth");
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <>
      {/* Bounce Loader during transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center bg-background z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BounceLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main landing content */}
      {!isTransitioning && (
        <div className="min-h-screen bg-background scroll-smooth">
          <Navbar animate={true} />
          <main className="scroll-container">
            <section id="home">
              <Hero onGetStarted={handleGetStarted} />
            </section>
            <section id="features">
              <Features />
            </section>
            <section id="testimonial">
              <Testimonial />
            </section>
            <section id="pricing">
              <Pricing />
            </section>
            <section id="cta">
              <CallToAction />
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}