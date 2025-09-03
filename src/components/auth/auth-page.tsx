"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

interface AuthPageProps {
  onAuthenticated: (user: { name: string; email: string }) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    let vantaEffect: any = null

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = src
        script.onload = () => resolve()
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const initVanta = async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        )
        await loadScript(
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"
        )

        setTimeout(() => {
          if ((window as any).VANTA) {
            vantaEffect = (window as any).VANTA.GLOBE({
              el: "#auth-vanta-bg",
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x3f82ff,
              size: 1.3,
            })
          }
        }, 100)
      } catch (error) {
        console.log("Vanta.js Globe not available, using fallback background")
      }
    }

    initVanta()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [])

  const handleLogin = (email: string, password: string) => {
    // Simulate successful login
    onAuthenticated({ name: "User", email })
  }

  const handleSignup = (name: string, email: string, password: string) => {
    // Simulate successful signup
    onAuthenticated({ name, email })
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Vanta.js 3D Background Container */}
      <div id="auth-vanta-bg" className="absolute inset-0 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm
              onToggleMode={() => setIsLogin(false)}
              onLogin={handleLogin}
            />
          ) : (
            <SignupForm
              onToggleMode={() => setIsLogin(true)}
              onSignup={handleSignup}
            />
          )}
        </div>
      </div>
    </div>
  )
}