'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAnySession, logoutAny } from '@/lib/auth';
import { CountrySelector } from '@/components/country-selector';
import { useDemoMode } from '@/lib/demo-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, ChevronLeft, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function VerificationPage() {
  const router = useRouter();
  const [session, setSession] = useState(getAnySession());
  const [mounted, setMounted] = useState(false);
  const { currentDemoData, selectedCountry, setSelectedCountry, isSuccessDemo } = useDemoMode();

  // Admin notification: "Device Signal Detected" with status transition
  const [toastVisible, setToastVisible] = useState(false);
  const [toastStatus, setToastStatus] = useState<'in-progress' | 'completed'>('in-progress');

  useEffect(() => {
    // Slide in after a brief delay on mount
    const showTimer = setTimeout(() => setToastVisible(true), 600);
    // Flip to "completed" after 2 seconds
    const flipTimer = setTimeout(() => setToastStatus('completed'), 2600);
    // Slide out and hide after 5 seconds total
    const hideTimer = setTimeout(() => setToastVisible(false), 5600);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(flipTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  
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

  // Update form data when demo mode OR country changes
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
    const currentSession = getAnySession();
    if (!currentSession) {
      router.push('/');
    } else {
      setSession(currentSession);
    }
  }, [router]);

  const handleLogout = () => {
    const path = logoutAny();
    router.push(path);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.agreeToTerms) {
      router.push('/dashboard/verification/id-upload');
    }
  };

  if (!mounted || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Notification: Device Signal Detected — slides down from below the sticky header */}
      <div
        aria-live="polite"
        className={`fixed right-4 z-[60] transition-all duration-500 ease-out ${
          toastVisible
            ? 'top-[70px] opacity-100'
            : 'top-[54px] opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white border border-border shadow-xl rounded-xl overflow-hidden w-72">
          {/* Header bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1b3d]">
            <Shield size={13} className="text-blue-300 flex-shrink-0" />
            <span className="text-xs font-semibold text-white tracking-wide uppercase">Admin Notification</span>
          </div>
          {/* Body */}
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {toastStatus === 'completed' ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : (
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Device Signal Detected</p>
              <div className={`flex items-center gap-1.5 mt-0.5 transition-all duration-400`}>
                {toastStatus === 'completed' ? (
                  <>
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                    <p className="text-xs text-green-700 font-medium">Risk Assessment Completed</p>
                  </>
                ) : (
                  <>
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                    <p className="text-xs text-amber-700 font-medium">Risk Assessment in progress...</p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">user@demo.com &middot; just now</p>
            </div>
          </div>
        </div>
      </div>

      {/* White Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity flex-shrink-0">
            <ChevronLeft size={20} className="text-foreground" />
            <svg height="22" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
              <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/>
              <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/>
              <path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/>
              <path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/>
              <path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.448 9.045 9.045 0 0 0-.277-.068z"/>
              <path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/>
            </svg>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-65px)] flex justify-center">

        {/* Form panel — full width, centered */}
        <div className="w-full max-w-2xl py-12 px-6 sm:px-10 overflow-y-auto">
          <div className="max-w-xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-block">
                <span className="text-primary font-semibold text-sm tracking-wide">ACCOUNT CREATION</span>
              </div>
              <CountrySelector />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground text-lg">
              Enter your personal information to start your identity verification journey with Bureau
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Fields */}
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Sample"
                    className="bg-white border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Middle Name</label>
                  <Input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="Specimen"
                    className="bg-white border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Specimen"
                    className="bg-white border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Email and Phone */}
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="sample@bureau.id"
                    className="bg-white border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+54 11 1234 5678"
                    className="bg-white border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* DOB, Gender, ID */}
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="bg-white border-border text-foreground"
                  />
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
                  <Input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="12.345.678"
                    className="bg-white border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="General Rodriguez Paz 83, Chacabuco"
                className="bg-white border-border text-foreground"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City</label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Buenos Aires"
                className="bg-white border-border text-foreground"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 border-border rounded accent-primary"
              />
              <label className="text-sm text-muted-foreground">
                I agree to Bureau's{' '}
                <a href="#" className="text-primary hover:underline">
                  terms of service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  privacy policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!formData.agreeToTerms}
              className="w-full bg-foreground hover:bg-foreground/90 text-background py-3 text-base rounded-lg font-medium"
            >
              Continue to Verification
            </Button>
          </form>
          </div>
        </div>
      </main>
    </div>
  );
}
