'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMerchantSession, logoutMerchant } from '@/lib/auth';
import { CountrySelector } from '@/components/country-selector';
import { useDemoMode } from '@/lib/demo-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, ChevronLeft, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

type KybConfig = 'director-kyb-sg' | 'director-kyb-reg-default';

const KYB_OPTIONS: { id: KybConfig; title: string; subtitle: string; tags: string[]; icon: React.ReactNode }[] = [
  {
    id: 'director-kyb-sg',
    title: 'Director Check + KYB — Singapore',
    subtitle: 'Singapore-specific KYB flow using ACRA registry and director verification.',
    tags: ['Director Check', 'KYB', 'Singapore'],
    icon: <MapPin size={20} className="text-[#253B80]" />,
  },
  {
    id: 'director-kyb-reg-default',
    title: 'Director Check + KYB (Registration Number)',
    subtitle: 'Runs as per current platform configuration with registration number lookup.',
    tags: ['Director Check', 'KYB', 'Default Config'],
    icon: <Building2 size={20} className="text-emerald-600" />,
  },
];

export default function MerchantOnboardingPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getMerchantSession>>(null);
  const [mounted, setMounted] = useState(false);
  const { currentDemoData, setSelectedCountry } = useDemoMode();
  const [step, setStep] = useState<0 | 1>(0);
  const [kybConfig, setKybConfig] = useState<KybConfig | null>(null);

  const handleContinueFromConfig = () => {
    if (!kybConfig) return;
    sessionStorage.setItem('merchant-kyb-config', kybConfig);
    if (kybConfig === 'director-kyb-sg') {
      setSelectedCountry('SG');
    }
    setStep(1);
  };

  const [formData, setFormData] = useState({
    firstName: currentDemoData.firstName,
    middleName: currentDemoData.middleName,
    lastName: currentDemoData.lastName,
    email: currentDemoData.email,
    phone: currentDemoData.phone,
    dob: currentDemoData.dob,
    gender: currentDemoData.gender,
    idNumber: currentDemoData.idNumber,
    address: currentDemoData.address,
    city: currentDemoData.city,
    agreeToTerms: false,
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      firstName: currentDemoData.firstName,
      middleName: currentDemoData.middleName,
      lastName: currentDemoData.lastName,
      email: currentDemoData.email,
      phone: currentDemoData.phone,
      dob: currentDemoData.dob,
      gender: currentDemoData.gender,
      idNumber: currentDemoData.idNumber,
      address: currentDemoData.address,
      city: currentDemoData.city,
    }));
  }, [currentDemoData]);

  useEffect(() => {
    setMounted(true);
    const s = getMerchantSession();
    if (!s) {
      router.push('/merchant/login');
    } else {
      setSession(s);
    }
  }, [router]);

  const handleLogout = () => {
    logoutMerchant();
    router.push('/merchant/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.agreeToTerms) {
      router.push('/merchant/onboarding/id-upload');
    }
  };

  if (!mounted || !session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-75 transition-opacity flex-shrink-0">
            <ChevronLeft size={20} className="text-foreground" />
            <svg height="22" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal"><path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/><path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/><path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/><path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/><path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.448 9.045 9.045 0 0 0-.277-.068z"/><path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/></svg>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-65px)] flex justify-center">
        <div className="w-full max-w-2xl py-12 px-6 sm:px-10 overflow-y-auto">
          <div className="max-w-xl mx-auto">

            {/* Header label + country — always visible */}
            <div className="flex items-start justify-between mb-6">
              <span className="text-amber-600 font-semibold text-sm tracking-wide">MERCHANT ONBOARDING</span>
              <CountrySelector />
            </div>

            {step === 0 ? (
              /* ── Step 0: KYB Configuration Selector ── */
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Select Verification Config</h1>
                <p className="text-muted-foreground mb-6">Choose the KYB check type to run for this merchant onboarding.</p>

                <div className="rounded-xl border border-border bg-amber-50/60 p-5 mb-8 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">
                    Bureau&apos;s Merchant Onboarding solution delivers instant business verification &mdash; no more waiting days or weeks for manual registry checks. Verify the business entity, UBOs, and directors through one automated workflow covering registry lookups, identity checks, and AML screening.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    One single API and SDK covers business registry verification across 200+ countries, UBO identification, director KYC, and AML/sanctions screening. Bureau&apos;s White-Label UI Platform launches the full journey under your brand &mdash; in minutes, not months.
                  </p>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  {KYB_OPTIONS.map(opt => {
                    const selected = kybConfig === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setKybConfig(opt.id)}
                        className={`w-full text-left rounded-xl border-2 p-5 transition-all focus:outline-none ${
                          selected
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-border bg-white hover:border-amber-300 hover:bg-amber-50/40'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selected ? 'bg-amber-100' : 'bg-muted'
                          }`}>
                            {opt.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                              {selected && <CheckCircle2 size={18} className="text-amber-500 flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.subtitle}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {opt.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  disabled={!kybConfig}
                  onClick={handleContinueFromConfig}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-40"
                >
                  Continue
                </Button>
              </div>
            ) : (
              /* ── Step 1+: Personal Details form ── */
              <div>
            {/* Step progress */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">1</div>
                <span className="text-xs font-semibold text-amber-600">Personal Details</span>
              </div>
              <div className="h-px flex-1 bg-border" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-border text-muted-foreground text-xs font-bold flex items-center justify-center">2</div>
                <span className="text-xs text-muted-foreground">ID & Business</span>
              </div>
              <div className="h-px flex-1 bg-border" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-border text-muted-foreground text-xs font-bold flex items-center justify-center">3</div>
                <span className="text-xs text-muted-foreground">Review</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-2 mt-6">Personal Details</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Enter your personal information as the authorised business representative.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <Input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Sample" className="bg-white border-border text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Middle Name</label>
                  <Input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Specimen" className="bg-white border-border text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <Input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Specimen" className="bg-white border-border text-foreground" />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="sample@bureau.id" className="bg-white border-border text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+54 11 1234 5678" className="bg-white border-border text-foreground" />
                </div>
              </div>

              {/* DOB, Gender, ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <Input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="bg-white border-border text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ID Number</label>
                  <Input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="12.345.678" className="bg-white border-border text-foreground" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <Input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="General Rodriguez Paz 83" className="bg-white border-border text-foreground" />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <Input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Buenos Aires" className="bg-white border-border text-foreground" />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 border-border rounded accent-amber-500"
                />
                <label className="text-sm text-muted-foreground">
                  I agree to Bureau's{' '}
                  <a href="#" className="text-amber-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={!formData.agreeToTerms}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-40"
              >
                Continue to ID & Business Verification
              </Button>
            </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
