'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authenticateUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

function AdminLoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const [email, setEmail] = useState('global@bureau.id');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      await authenticateUser(email, password);
      router.push(redirectUrl || '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <div className="flex-1 flex flex-col p-6 lg:p-12 min-h-screen">
        <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              Client Admin Portal
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Bureau admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-foreground text-sm font-medium">
                Email address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@bureau.id"
                disabled={isLoading}
                className="h-11 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-foreground text-sm font-medium">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  disabled={isLoading}
                  className="h-11 pr-10 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-primary text-sm hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 font-semibold">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="rounded-lg border border-border bg-white p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Demo credentials</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground font-mono">global@bureau.id</span>
                <span className="text-foreground font-mono">User@123</span>
              </div>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminLoginPageInner />
    </Suspense>
  );
}
