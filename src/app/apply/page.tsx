'use client';

import { useState } from "react";

const cohorts = [
  {
    id: 1,
    name: "Cohort 1 - January 2025",
    startDate: "January 15, 2025",
    endDate: "March 15, 2025",
    seats: 20,
    available: 8,
    level: "Beginner",
    duration: "8 weeks",
  },
  {
    id: 2,
    name: "Cohort 2 - March 2025",
    startDate: "March 1, 2025",
    endDate: "April 26, 2025",
    seats: 25,
    available: 15,
    level: "Intermediate",
    duration: "8 weeks",
  },
  {
    id: 3,
    name: "Cohort 3 - May 2025",
    startDate: "May 5, 2025",
    endDate: "June 30, 2025",
    seats: 30,
    available: 30,
    level: "Beginner",
    duration: "8 weeks",
  },
];

const africanCountries = [
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Côte d'Ivoire", code: "+225", flag: "🇨🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Eswatini", code: "+268", flag: "🇸🇿" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Cabo Verde", code: "+238", flag: "🇨🇻" },
  { name: "São Tomé and Príncipe", code: "+239", flag: "🇸🇹" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
];

export default function ApplyPage() {
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    experienceLevel: "",
    preferredCohort: "",
  });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    const countryData = africanCountries.find((c) => c.name === country);
    // Update form data with country
    setFormData({ ...formData, country });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and spaces
    const cleanedValue = value.replace(/[^\d\s]/g, "");
    setPhoneNumber(cleanedValue);
    
    // Combine with country code for form data
    const countryData = africanCountries.find((c) => c.name === selectedCountry);
    const fullPhone = countryData ? `${countryData.code} ${cleanedValue}`.trim() : cleanedValue;
    setFormData({ ...formData, phone: fullPhone });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The phone number is already combined in formData.phone via handlePhoneChange
    const finalFormData = {
      ...formData,
      country: selectedCountry,
    };
    
    // In production, this would submit to Google Forms or your backend
    const formUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";
    window.open(formUrl, "_blank");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative z-10 w-full bg-black/95">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Join Our Next Cohort
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400 sm:text-xl">
              Apply to join our Bitcoin Academy and start your journey toward financial sovereignty.
            </p>
          </div>

      <div className="space-y-12">
        {/* Cohort Details */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-50">Upcoming Cohorts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cohorts.map((cohort) => (
              <div
                key={cohort.id}
                className={`rounded-xl border p-6 transition ${
                  selectedCohort === cohort.id
                    ? "border-orange-400/50 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                    : "border-cyan-400/25 bg-black/80 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-50">{cohort.name}</h3>
                  <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-medium text-cyan-300">
                    {cohort.level}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-zinc-300">
                  <p><span className="font-medium text-zinc-400">Start:</span> {cohort.startDate}</p>
                  <p><span className="font-medium text-zinc-400">End:</span> {cohort.endDate}</p>
                  <p><span className="font-medium text-zinc-400">Duration:</span> {cohort.duration}</p>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-cyan-400/20 bg-zinc-900/50 p-2">
                    <span className="text-xs text-zinc-400">Seats Available</span>
                    <span className={`font-semibold ${cohort.available > 0 ? "text-orange-400" : "text-red-400"}`}>
                      {cohort.available} / {cohort.seats}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCohort(cohort.id)}
                  className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    selectedCohort === cohort.id
                      ? "bg-orange-400 text-black"
                      : "bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30"
                  }`}
                >
                  {selectedCohort === cohort.id ? "Selected" : "Select This Cohort"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Form */}
        <section className="rounded-xl border border-cyan-400/25 bg-black/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
          <h2 className="mb-6 text-xl font-semibold text-cyan-200">Application Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Country <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer"
              >
                <option value="" className="bg-zinc-950 text-zinc-400">Select your country</option>
                {africanCountries.map((country) => (
                  <option key={country.name} value={country.name} className="bg-zinc-950 text-zinc-50">
                    {country.flag} {country.name} {country.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Phone <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <div className="flex h-9 items-center rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 text-sm text-zinc-400">
                    {selectedCountry
                      ? africanCountries.find((c) => c.name === selectedCountry)?.code || "+"
                      : "+"}
                  </div>
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="flex-1 rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="1234567890"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {selectedCountry
                  ? `Country code ${africanCountries.find((c) => c.name === selectedCountry)?.code} will be added automatically`
                  : "Select your country first to auto-fill the country code"}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Lagos"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Experience Level <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer"
              >
                <option value="" className="bg-zinc-950 text-zinc-400">Select your level</option>
                <option value="beginner" className="bg-zinc-950 text-zinc-50">Beginner - New to Bitcoin</option>
                <option value="intermediate" className="bg-zinc-950 text-zinc-50">Intermediate - Some knowledge</option>
                <option value="advanced" className="bg-zinc-950 text-zinc-50">Advanced - Experienced user</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Preferred Cohort <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.preferredCohort}
                onChange={(e) => setFormData({ ...formData, preferredCohort: e.target.value })}
                className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer"
              >
                <option value="" className="bg-zinc-950 text-zinc-400">Select a cohort</option>
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id} className="bg-zinc-950 text-zinc-50">
                    {cohort.name} ({cohort.available} seats available)
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <p className="text-xs text-zinc-400">
                <span className="font-semibold text-orange-300">Note:</span> After submitting, you'll be redirected to complete your application. We'll review and get back to you within 3-5 business days.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-400 to-cyan-400 px-6 py-3 text-base font-semibold text-black transition hover:brightness-110"
              >
                Register
              </button>
            </div>
          </form>
        </section>
      </div>
        </div>
      </div>
    </div>
  );
}

