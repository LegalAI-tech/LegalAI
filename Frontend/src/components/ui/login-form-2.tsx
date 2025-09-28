'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LoginForm2Props {
  onAuthenticated?: (user: { name: string; email: string }) => void;
}

export default function LoginForm2({ onAuthenticated }: LoginForm2Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAuthenticated && email && password) {
      onAuthenticated({ name: "User", email });
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Dark Dotted Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
          backgroundImage: 
            `radial-gradient(circle, rgba(156,163,175,0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(107,114,128,0.3) 1px, transparent 1px)`,
          backgroundSize: "20px 20px, 40px 40px",
          backgroundPosition: "0 0, 10px 10px",
          }}
      />
      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2">
        <motion.div
          className="hidden flex-1 items-center justify-center space-y-8 p-8 text-center md:flex"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="space-y-6"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                LegalAI
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                Transform your legal intelligence with AI-powered solutions
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="flex flex-1 items-center justify-center p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Card className="border-border/70 bg-card/20 w-full max-w-md shadow-[0_10px_26px_#e0e0e0a1] backdrop-blur-lg dark:shadow-none">
              <CardContent className="space-y-6 p-8">
                {/* Logo and Header */}
                <motion.div
                  className="space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold tracking-tight md:text-4xl">
                      Welcome Back
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Sign in to access your AI-powered legal assistant and streamline your legal queries.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                  >
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
                  >
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="border-border border"
                      required
                    />
                  </motion.div>

                  {/* Continue Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                      disabled={!email || !password}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-border w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card text-muted-foreground px-2">
                      OR
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="secondary"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/95 w-full shadow-[0_4px_16px_var(--border)] duration-300 dark:shadow-[0_4px_14px_var(--muted-foreground)]"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>

                    <span className="ml-2">Sign in with Google</span>
                  </Button>
                </motion.div>

                {/* Terms */}
                <motion.p
                  className="text-muted-foreground mt-2 text-center text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
                >
                  By signing in you agree to LegalAI's{' '}
                  <Link
                    prefetch={false}
                    href="#"
                    className="text-muted-foreground hover:text-primary underline"
                  >
                    terms of service
                  </Link>{' '}
                  and{' '}
                  <Link
                    prefetch={false}
                    href="#"
                    className="text-muted-foreground hover:text-primary underline"
                  >
                    privacy policy
                  </Link>
                  .
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
