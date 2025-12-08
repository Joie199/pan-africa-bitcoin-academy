'use client';

import { useState } from "react";

export default function SubmitBlogPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cohort: "",
    title: "",
    category: "",
    content: "",
    bio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In production, this would submit to your backend or email service
    // For now, we'll use a form service like Google Forms or Tally
    const formUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";
    
    // Simulate submission
    setTimeout(() => {
      alert("Thank you for your submission! We'll review it and get back to you within 5-7 business days.");
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        cohort: "",
        title: "",
        category: "",
        content: "",
        bio: "",
      });
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative z-10 w-full bg-black/95">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Submit Your Blog Post
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
              Share your Bitcoin story, ideas, and insights with the community.
            </p>
          </div>

          {/* Submission Form */}
          <div className="rounded-xl border border-cyan-400/25 bg-black/80 p-8 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-cyan-200">Author Information</h2>
                
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
                      className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="Your name as it should appear"
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
                      className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Cohort <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cohort}
                    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                    className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="e.g., Cohort 1 - January 2025"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Short Bio (optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="A brief introduction about yourself (1-2 sentences)"
                  />
                </div>
              </div>

              {/* Blog Post Information */}
              <div className="space-y-4 border-t border-cyan-400/10 pt-6">
                <h2 className="text-xl font-semibold text-cyan-200">Blog Post Details</h2>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="Your blog post title"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-950 text-zinc-400">Select a category</option>
                    <option value="Use Cases" className="bg-zinc-950 text-zinc-50">Use Cases</option>
                    <option value="Development" className="bg-zinc-950 text-zinc-50">Development</option>
                    <option value="Community" className="bg-zinc-950 text-zinc-50">Community</option>
                    <option value="Technology" className="bg-zinc-950 text-zinc-50">Technology</option>
                    <option value="Education" className="bg-zinc-950 text-zinc-50">Education</option>
                    <option value="Other" className="bg-zinc-950 text-zinc-50">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Content <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full rounded-lg border border-cyan-400/20 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-50 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 font-mono"
                    placeholder="Write your blog post here (minimum 500 words, maximum 2000 words)..."
                  />
                  <p className="mt-2 text-xs text-zinc-400">
                    Word count: {formData.content.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              </div>

              {/* Guidelines Reminder */}
              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-xs text-zinc-400">
                  <span className="font-semibold text-orange-300">Remember:</span> Your content should be original, educational, and respectful. 
                  We'll review your submission and get back to you within 5-7 business days.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 via-orange-400 to-purple-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(34,211,238,0.4)] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Blog Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

