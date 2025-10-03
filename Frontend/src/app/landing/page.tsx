"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BounceLoader from "@/components/ui/bounce-loader";

export default function LandingRedirect() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(true);

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        setIsNavigating(true);
        
        await router.replace("/home");
    
        setTimeout(() => {
          setIsNavigating(false);
        }, 100);
      } catch (error) {
        console.error("Navigation error:", error);
        setIsNavigating(false);
      }
    };

    handleNavigation();
  }, [router]);

  if (isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <BounceLoader />
      </div>
    );
  }

  return null;
}