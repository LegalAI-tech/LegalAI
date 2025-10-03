"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BounceLoader from "@/components/ui/bounce-loader";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AIPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (you can implement proper authentication check here)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to auth if not authenticated
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/home");
      setIsTransitioning(false);
    }, 800);
  };

  if (!user && !isTransitioning) {
    return <div>Loading...</div>;
  }

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

      {/* Main AI interface */}
      {!isTransitioning && user && (
        <ChatInterface user={user} onLogout={handleLogout} />
      )}
    </>
  );
}