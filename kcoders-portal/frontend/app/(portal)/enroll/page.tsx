'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiInfo, FiCode, FiSend } from 'react-icons/fi';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
}

export default function ProjectBriefPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="spinner w-8 h-8"></div></div>}>
      <ProjectBriefPage />
    </Suspense>
  );
}

const TIERS = [
  { value: 'basic', label: 'Basic', desc: 'Essential features' },
  { value: 'standard', label: 'Standard', desc: 'Full implementation + support' },
  { value: 'enterprise', label: 'Enterprise', desc: 'Complete solution + SLA' },
];

const BUDGET_RANGES = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
  'Not sure',
];

function ProjectBriefPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    service_id: searchParams.get('service') || '',
    tier: 'standard',
    full_name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    description: '',
    budget_range: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data.services || []);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_id) {
      toast.error('Please select a service');
      return;
    }
    if (!token) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitBrief({
        service_id: parseInt(form.service_id),
        tier: form.tier,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        description: form.description,
        budget_range: form.budget_range,
      }, token);

      toast.success('Project brief submitted! We\'ll review and send a proposal.');
      router.push('/enrollment-success');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  const selectedService = services.find(s => s.id === parseInt(form.service_id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Start a Project</h1>
        <p className="text-gray-600">Tell us about your project and we'll send you a tailored proposal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Service Selection */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h2>
              <select
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                className="form-input"
                required
              >
                <option value="">-- Choose a service --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              {selectedService && (
                <p className="text-sm text-gray-500 mt-2">{selectedService.description}</p>
              )}
            </div>

            {/* Package Tier */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Package Tier</h2>
              <div className="grid grid-cols-3 gap-3">
                {TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setForm({ ...form, tier: tier.value })}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      form.tier === tier.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{tier.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="form-input pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">WhatsApp Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="form-input pl-10"
                      placeholder="+250 7XX XXX XXX"
                      required
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className="form-label">Project Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="form-input min-h-[140px] resize-y"
                    placeholder="Describe your project in detail — what do you need built? Any specific features, timeline, or requirements?"
                    required
                  />
                </div>

                {/* Budget Range */}
                <div>
                  <label className="form-label">Budget Range</label>
                  <select
                    value={form.budget_range}
                    onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
                    className="form-input"
                  >
                    <option value="">-- Select budget range --</option>
                    {BUDGET_RANGES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Brief Summary</h3>

              {selectedService && (
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Service:</span>
                    <p className="font-medium text-gray-900">{selectedService.title}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Tier:</span>
                    <p className="font-medium text-gray-900 capitalize">{form.tier}</p>
                  </div>
                  {form.budget_range && (
                    <div className="text-sm">
                      <span className="text-gray-500">Budget:</span>
                      <p className="font-medium text-gray-900">{form.budget_range}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <div className="flex items-start gap-2">
                  <FiInfo className="text-amber-500 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-amber-800">
                    After submission, we'll review your brief and send a proposal with milestone breakdown and pricing.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !form.service_id}
                className="btn btn-primary w-full justify-center mt-5"
              >
                {submitting ? <div className="spinner w-5 h-5 border-white" /> : <><FiSend /> Submit Brief</>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
