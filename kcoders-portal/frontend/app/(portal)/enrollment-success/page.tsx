'use client';

import Link from 'next/link';
import { FiCheckCircle, FiMail, FiArrowRight, FiClock } from 'react-icons/fi';

export default function BriefSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-green-600" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Brief Submitted! 🎉</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for reaching out! We've received your project brief and will review it shortly.
          You'll receive a proposal with milestone breakdown and pricing in your email.
        </p>

        <div className="card p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</span>
              <span>Our team reviews your project requirements</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</span>
              <span>We send a <strong>proposal</strong> with milestone breakdown, timeline, and pricing</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</span>
              <span>You review and accept the proposal to get started</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">4</span>
              <span>Milestone-based work begins — each milestone paid before work starts</span>
            </li>
          </ol>

          <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-3 mt-4">
            <FiClock className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-800">
              Each milestone has a <strong>2-hour payment window</strong>. Payments via Mobile Money to <strong>+250 788 620 201</strong>.
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard <FiArrowRight />
          </Link>
          <a href="mailto:info@kcoders.org" className="btn btn-secondary">
            <FiMail /> Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
