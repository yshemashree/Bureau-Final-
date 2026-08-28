'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useDemoMode } from '@/lib/demo-context';

const COUNTRIES = [
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IN', name: 'India' },
  { code: 'IT', name: 'Italy' },
  { code: 'KE', name: 'Kenya' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TH', name: 'Thailand' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
];

interface CountrySelectorProps {
  onCountryChange?: (country: string) => void;
  className?: string;
}

export function CountrySelector({ onCountryChange, className = '' }: CountrySelectorProps) {
  const { selectedCountry, setSelectedCountry } = useDemoMode();

  const handleChange = (value: string) => {
    setSelectedCountry(value);
    onCountryChange?.(value);
  };

  const countryName = COUNTRIES.find((c) => c.code === selectedCountry)?.name || 'United States';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 bg-primary/8 border border-primary/30 rounded-xl px-3 py-1.5 hover:border-primary/60 transition-colors">
        <Globe size={16} className="text-primary flex-shrink-0" />
        <Select value={selectedCountry} onValueChange={handleChange}>
          <SelectTrigger className="w-36 sm:w-44 border-0 bg-transparent text-foreground font-medium p-0 h-auto focus:ring-0 shadow-none text-sm">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground max-h-72">
            {COUNTRIES.map((country) => (
              <SelectItem
                key={country.code}
                value={country.code}
                className="data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:font-semibold data-[state=checked]:text-primary"
              >
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
