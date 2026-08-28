"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

const USE_CASES = [
  "Account Takeover",
  "Bot Detection",
  "Promo Abuse",
  "Location Spoofing",
  "Customer Verification",
  "Merchant Verification",
  "Mule Score",
  "Transaction Monitoring",
  "AML",
  "Unsure",
];

const COUNTRY_CODES = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+81", country: "JP" },
  { code: "+65", country: "SG" },
  { code: "+971", country: "UAE" },
  { code: "+55", country: "BR" },
  { code: "+52", country: "MX" },
  { code: "+86", country: "CN" },
  { code: "+82", country: "KR" },
  { code: "+31", country: "NL" },
  { code: "+34", country: "ES" },
  { code: "+39", country: "IT" },
  { code: "+46", country: "SE" },
  { code: "+41", country: "CH" },
  { code: "+62", country: "ID" },
  { code: "+60", country: "MY" },
];

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyEmail: "",
    countryCode: "+91",
    phone: "",
    jobTitle: "",
    useCase: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.useCase) newErrors.useCase = "Please select a use case";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyEmail: formData.companyEmail,
          phone: `${formData.countryCode} ${formData.phone}`,
          jobTitle: formData.jobTitle,
          useCase: formData.useCase,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: "Failed to submit. Please try again." });
      }
    } catch {
      setErrors({ submit: "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      companyEmail: "",
      countryCode: "+91",
      phone: "",
      jobTitle: "",
      useCase: "",
    });
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 rounded-lg border ${
      errors[field] ? "border-red-400 bg-red-50/50" : "border-gray-200 bg-white"
    } text-sm focus:outline-none focus:ring-2 focus:ring-[#253B80]/20 focus:border-[#253B80] transition-all`;

  const labelClass = "block text-xs font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3.5 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Schedule a Meeting</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Thank You!</h3>
            <p className="text-sm text-gray-600 mb-5 max-w-sm">
              Your demo request has been submitted successfully. Someone from our team will reach out to you soon.
            </p>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#253B80] text-white font-semibold text-sm hover:bg-[#1a2d5a] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 14 }}>
              <div>
                <label className={labelClass}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass("firstName")}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className={labelClass}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass("lastName")}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Company Email */}
            <div style={{ marginBottom: 14 }}>
              <label className={labelClass}>
                Company Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                className={inputClass("companyEmail")}
                placeholder="john@company.com"
              />
              {errors.companyEmail && <p className="text-xs text-red-500 mt-1">{errors.companyEmail}</p>}
            </div>

            {/* Phone with Country Code */}
            <div style={{ marginBottom: 14 }}>
              <label className={labelClass}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#253B80]/20 focus:border-[#253B80] transition-all min-w-[104px]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} {c.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`flex-1 ${inputClass("phone")}`}
                  placeholder="123 456 7890"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Job Title */}
            <div style={{ marginBottom: 14 }}>
              <label className={labelClass}>
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className={inputClass("jobTitle")}
                placeholder="Product Manager"
              />
              {errors.jobTitle && <p className="text-xs text-red-500 mt-1">{errors.jobTitle}</p>}
            </div>

            {/* Primary Use Case */}
            <div style={{ marginBottom: 18 }}>
              <label className={labelClass}>
                Primary Use Case <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                className={inputClass("useCase")}
              >
                <option value="">Select a use case</option>
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>
                    {uc}
                  </option>
                ))}
              </select>
              {errors.useCase && <p className="text-xs text-red-500 mt-1">{errors.useCase}</p>}
            </div>

            {errors.submit && (
              <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg mb-3">{errors.submit}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#253B80] to-[#1e3a6e] text-white font-semibold text-sm hover:from-[#1a2d5a] hover:to-[#152850] transition-all shadow-lg shadow-[#253B80]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Schedule Meeting"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
