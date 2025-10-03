"use client";

import { AuthPage } from "@/components/auth/auth-page";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BounceLoader from "@/components/ui/bounce-loader";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AuthenticationPage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAuthenticated = (userData: User) => {
    setIsTransitioning(true);
    setTimeout(() => {
      // Store user data (you can use a more sophisticated auth system here)
      localStorage.setItem("user", JSON.stringify(userData));
      // Redirect to AI page
      router.push("/ai");
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

      {/* Auth form */}
      {!isTransitioning && (
        <AuthPage onAuthenticated={handleAuthenticated} />
      )}
    </>
  );
}