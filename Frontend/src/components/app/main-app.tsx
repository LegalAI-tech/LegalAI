"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import {
  Features,
  Testimonial,
  Pricing,
  CallToAction,
} from "@/components/landing/sections";
import { Footer } from "@/components/landing/footer";
import { AuthPage } from "@/components/auth/auth-page";
import { ChatInterface } from "@/components/chat/chat-interface";
import BounceLoader from "@/components/ui/bounce-loader";

type AppState = "landing" | "auth" | "chat";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export function MainApp() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGetStarted = () => {
    //console.log("Get Started clicked - navigating to auth");
    setIsTransitioning(true);
    setTimeout(() => {
      setAppState("auth");
      setIsTransitioning(false);
    }, 800);
  };

  const handleAuthenticated = (userData: User) => {
    //console.log("User authenticated:", userData);
    setIsTransitioning(true);
    setTimeout(() => {
      setUser(userData);
      setAppState("chat");
      setIsTransitioning(false);
    }, 800);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setIsTransitioning(true);
    setTimeout(() => {
      setUser(null);
      setAppState("landing");
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center bg-background z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <BounceLoader />
        </motion.div>
      )}

      {!isTransitioning && appState === "landing" && (
        <motion.div
          key="landing"
          className="min-h-screen bg-background scroll-smooth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Navbar />
          <main className="scroll-container">
            <Hero onGetStarted={handleGetStarted} />
            <Features />
            <Testimonial />
            <Pricing />
            <CallToAction />
          </main>
          <Footer />
        </motion.div>
      )}

      {!isTransitioning && appState === "auth" && (
        <motion.div
          key="auth"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AuthPage onAuthenticated={handleAuthenticated} />
        </motion.div>
      )}

      {!isTransitioning && appState === "chat" && (
        <motion.div
          key="chat"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {user ? (
            <ChatInterface user={user} onLogout={handleLogout} />
          ) : (
            <AuthPage onAuthenticated={handleAuthenticated} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
