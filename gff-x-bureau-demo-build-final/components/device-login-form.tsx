'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface DeviceLoginFormProps {
  onSuccess: (email: string) => void;
}

export function DeviceLoginForm({ onSuccess }: DeviceLoginFormProps) {
  const [email, setEmail] = useState('sample@bank.com');
  const [password, setPassword] = useState('sample');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate credentials
    if (email === 'sample@bank.com' && password === 'sample') {
      onSuccess(email);
    } else {
      setError('Invalid email or password');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="sample@bank.com"
          className="bg-white border-border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-white border-border pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Demo credentials: sample@bank.com / sample
      </p>
    </form>
  );
}
