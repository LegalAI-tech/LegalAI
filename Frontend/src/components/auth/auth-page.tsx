"use client"

import LoginForm from "@/components/ui/login-form"

interface AuthPageProps {
  onAuthenticated: (user: { name: string; email: string }) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const handleLogin = (email: string, password: string) => {
    onAuthenticated({ name: "User", email })
  }

  return <LoginForm onAuthenticated={onAuthenticated} />
}