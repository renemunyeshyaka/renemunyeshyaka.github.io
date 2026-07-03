'use client';

import Link from 'next/link';
import { FiArrowRight, FiCode, FiShield, FiStar, FiSmartphone, FiServer, FiCloud, FiExternalLink, FiGithub, FiUser } from 'react-icons/fi';

const services = [
  { icon: FiCode, title: 'Web Development', desc: 'Full-stack web apps — React, Go, Spring Boot', color: 'from-blue-500 to-indigo-600' },
  { icon: FiSmartphone, title: 'Mobile Apps', desc: 'Cross-platform mobile apps with React Native', color: 'from-green-500 to-teal-600' },
  { icon: FiServer, title: 'API & Integration', desc: 'REST APIs, third-party integrations, microservices', color: 'from-purple-500 to-pink-600' },
  { icon: FiCloud, title: 'DevOps & Cloud', desc: 'CI/CD, Docker/K8s, AWS/Azure setup', color: 'from-orange-500 to-red-600' },
  { icon: FiShield, title: 'Cybersecurity', desc: 'Security audits, pentesting, secure architecture', color: 'from-red-500 to-rose-600' },
  { icon: FiStar, title: 'Architecture Design', desc: 'System design, DB modeling, scalability planning', color: 'from-cyan-500 to-blue-600' },
];

const projects = [
  { name: 'Pay Gateway System', desc: 'Payment gateway integration system', cat: 'Backend' },
  { name: 'Automated Evaluation System', desc: 'Auto-grading & assessment platform', cat: 'Full Stack' },
  { name: 'Scan and Pay', desc: 'QR-based mobile payment solution', cat: 'Frontend' },
  { name: 'eLearnPro', desc: 'E-learning management platform', cat: 'Full Stack' },
  { name: 'Swedish Open University', desc: 'University portal & course management', cat: 'Full Stack' },
  { name: 'Net Attack Simulator', desc: 'Network security attack simulation tool', cat: 'Security' },
  { name: 'Face Recognition Attendance', desc: 'AI-powered attendance system', cat: 'AI/ML' },
  { name: 'QR Code Generator', desc: 'Custom QR code generation API', cat: 'Full Stack' },
  { name: 'Cybersecurity Aptitude Test', desc: 'Security skills assessment platform', cat: 'Security' },
  { name: 'TrusterLabs', desc: 'Trust & safety verification platform', cat: 'Full Stack' },
  { name: 'DeepSeek OCR', desc: 'AI document text extraction', cat: 'AI/ML' },
  { name: 'OPDERwanda', desc: 'Rwanda ops & logistics platform', cat: 'Full Stack' },
  { name: 'EMEA NetAcad Cup', desc: 'Networking competition platform', cat: 'Full Stack' },
  { name: 'Awesome AI Apps', desc: 'Curated AI application showcase', cat: 'AI/ML' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              👨‍💻 By Jean René MUNYESHYAKA
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight">
              Build Your Vision with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">Kcoders</span>
            </h1>
            <p className="text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto">
              Full-stack engineer building custom web, mobile, API, and cloud solutions.
              From concept to deployment with transparent milestone-based pricing.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/courses" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl">
                Browse Services <FiArrowRight />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                Get Started
              </Link>
              <a href="/portfolio/index.html" className="inline-flex items-center gap-2 text-blue-300 px-5 py-3 rounded-xl font-medium hover:text-white transition-all">
                <FiExternalLink /> Portfolio
              </a>
              <a href="https://github.com/renemunyeshyaka" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-300 px-5 py-3 rounded-xl font-medium hover:text-white transition-all">
                <FiGithub /> GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </section>

      {/* Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Projects</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Software projects built by Jean René —{' '}
              <a href="https://github.com/renemunyeshyaka" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                view on GitHub <FiExternalLink className="inline" size={14} />
              </a>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => {
              const catColors: Record<string, string> = {
                'Full Stack': 'bg-blue-100 text-blue-700',
                'Backend': 'bg-green-100 text-green-700',
                'Frontend': 'bg-amber-100 text-amber-700',
                'Security': 'bg-red-100 text-red-700',
                'AI/ML': 'bg-purple-100 text-purple-700',
              };
              return (
                <a key={p.name} href={`https://github.com/renemunyeshyaka/${p.name.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="group card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 block">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    <FiGithub className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" size={16} />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{p.desc}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${catColors[p.cat] || 'bg-gray-100 text-gray-600'}`}>
                    {p.cat}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Each service available in Basic, Standard, or Enterprise tiers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="group card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{s.desc}</p>
                  <div className="flex gap-1.5">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Basic</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Standard</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Enterprise</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500">Simple, transparent process from idea to delivery</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Submit Brief', desc: 'Tell us about your project — service, requirements, and budget' },
              { step: '2', title: 'Get Proposal', desc: 'We review and send a proposal with milestones, timeline, and pricing' },
              { step: '3', title: 'Milestone Payments', desc: 'Pay per milestone via Mobile Money (+250 788 620 201) with 2-hour windows' },
              { step: '4', title: 'Delivery & Sign-off', desc: 'Work delivered, reviewed, and signed off — milestone by milestone' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Sign in to submit a project brief, track milestones, and manage your projects
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl">
              Get Started <FiArrowRight />
            </Link>
            <Link href="/courses" className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
              View Services
            </Link>
            <a href="/portfolio/index.html"
              className="inline-flex items-center gap-2 text-blue-300 px-6 py-3.5 rounded-xl font-medium hover:text-white transition-all">
              <FiExternalLink /> Full Portfolio
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
