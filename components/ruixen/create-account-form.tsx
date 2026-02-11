"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, User, Lock, Loader2 } from "lucide-react";
import PasswordInput from "@/components/ui/password-input";

interface CreateAccountFormProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function CreateAccountForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onToggleMode,
  isLoading,
  error
}: CreateAccountFormProps) {
  return (
    <div className="dark contents">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <CardContent className="p-8 flex flex-col gap-6">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-gray-400 text-sm">Join the largest open source directory</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-gray-300 font-medium">Username</Label>
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-3 h-12 bg-white/5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all hover:bg-white/10">
                <User className="w-4 h-4 text-gray-500" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0 text-white placeholder:text-gray-600 bg-transparent h-full px-0"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-3 h-12 bg-white/5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all hover:bg-white/10">
                <Mail className="w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0 text-white placeholder:text-gray-600 bg-transparent h-full px-0"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {/* Password */}
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              required
            />

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all mt-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Started"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-gray-500">
            By continuing, you agree to our{" "}
            <span className="font-medium text-indigo-400 hover:underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-medium text-indigo-400 hover:underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400 mt-2 pt-4 border-t border-white/10">
            Already have an account?{" "}
            <button onClick={onToggleMode} className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all">
              Sign In
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
