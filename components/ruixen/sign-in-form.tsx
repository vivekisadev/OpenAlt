"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, Loader2 } from "lucide-react";
import PasswordInput from "@/components/ui/password-input";

interface SignInFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDemoLogin: () => void;
  onToggleMode: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onDemoLogin,
  onToggleMode,
  isLoading,
  error
}: SignInFormProps) {
  return (
    <div className="dark contents">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-white/10 pt-10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <CardContent className="p-8 flex flex-col gap-6">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-3 h-12 bg-white/5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all hover:bg-white/10">
                <Mail className="h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"

                  className="border-0 shadow-none focus-visible:ring-0 text-white placeholder:text-gray-600 bg-transparent h-full px-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline">Forgot?</button>
              </div>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                showStrength={false}
                required
              />
            </div>

            <div className="flex items-center space-x-2 my-1">
              <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white" />
              <Label htmlFor="remember" className="text-sm font-normal text-gray-400">Remember me</Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          {/* Social / Demo */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0A0A0A] px-2 text-gray-500 font-medium">Or continue with</span></div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            onClick={onDemoLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Demo User Access
          </Button>

          {/* Signup */}
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <button onClick={onToggleMode} className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all">
              Sign Up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
