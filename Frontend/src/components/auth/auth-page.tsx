"use client"

import { useState } from "react"
import LoginForm2 from "@/components/ui/login-form-2"

interface AuthPageProps {
  onAuthenticated: (user: { name: string; email: string }) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const handleLogin = (email: string, password: string) => {
    // Simulate successful login
    onAuthenticated({ name: "User", email })
  }

  return <LoginForm2 onAuthenticated={onAuthenticated} />
}