"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onGetStarted?: () => void
}

export function Hero({ onGetStarted }: HeroProps = {}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const simplifiedRef = useRef<HTMLSpanElement>(null);

  console.log("Hero component rendered with onGetStarted:", typeof onGetStarted);

  useEffect(() => {
    // Only run animations if elements exist
    if (!titleRef.current || !buttonRef.current || !simplifiedRef.current)
      return;

    // Initialize Vanta.js Globe background
    let vantaEffect: any = null;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Load Three.js and Vanta Globe scripts
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"
        );

        // Wait a bit for scripts to be ready
        setTimeout(() => {
          if ((window as any).VANTA) {
            vantaEffect = (window as any).VANTA.GLOBE({
              el: "#vanta-bg",
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x3f82ff,
              size: 1.3,
            });
          }
        }, 100);
      } catch (error) {
        console.log("Vanta.js Globe not available, using fallback background");
      }
    };

    initVanta();

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, buttonRef.current], {
        y: 50,
        opacity: 0,
      });

      // Create animation timeline
      const tl = gsap.timeline({
        delay: 0.5,
      });

      // Animate elements with stagger
      tl.to([titleRef.current, buttonRef.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Shimmer effect for "Simplified" text
      gsap.to(simplifiedRef.current, {
        backgroundPosition: "-200% center",
        duration: 6,
        ease: "power2.inOut",
        repeat: -1,
      });
    });

    return () => {
      ctx.revert();
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
    >
      {/* Vanta.js 3D Background Container */}
      <div id="vanta-bg" className="absolute inset-0 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl w-full">
          <div className="max-w-2xl">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 text-left"
            >
              Your Legal Queries{" "}
              <span
                ref={simplifiedRef}
                className="inline-block relative bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-[length:200%_100%] bg-clip-text text-transparent"
                style={{
                  backgroundPosition: "200% center",
                }}
              >
                Simplified
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed text-left">
              Transform your legal practice with AI-powered solutions.
              Streamline document analysis, generate contracts, and get instant
              legal insights.
            </p>

            <div ref={buttonRef} className="flex items-start">
              <Button
                size="lg"
                onClick={() => {
                  console.log("Button clicked, onGetStarted:", onGetStarted);
                  if (onGetStarted) {
                    onGetStarted();
                  } else {
                    console.log("onGetStarted is not defined");
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 min-w-[200px]"
              >
                Get Started 
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
