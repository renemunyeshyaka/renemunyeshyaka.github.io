'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { FiSearch, FiCode, FiSmartphone, FiServer, FiCloud, FiShield, FiCheckCircle, FiArrowRight, FiStar } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_path: string;
  category: string;
  is_archived: boolean;
  created_at: string;
}

const categoryIcons: Record<string, IconType> = {
  web: FiCode,
  mobile: FiSmartphone,
  api: FiServer,
  devops: FiCloud,
  security: FiShield,
  audit: FiCheckCircle,
  architecture: FiStar,
};

const categoryLabels: Record<string, string> = {
  web: 'Web Development',
  mobile: 'Mobile Apps',
  api: 'API & Integration',
  devops: 'DevOps & Cloud',
  security: 'Cybersecurity',
  audit: 'Code Audit & QA',
  architecture: 'Architecture Design',
};

const categoryColors: Record<string, string> = {
  web: 'from-blue-500 to-indigo-600',
  mobile: 'from-green-500 to-teal-600',
  api: 'from-purple-500 to-pink-600',
  devops: 'from-orange-500 to-red-600',
  security: 'from-red-500 to-rose-600',
  audit: 'from-amber-500 to-yellow-600',
  architecture: 'from-cyan-500 to-blue-600',
};

export default function ServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async (query?: string) => {
    try {
      const data = await api.getServices(query);
      setServices(data.services || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s =>
    (!activeCategory || s.category === activeCategory) &&
    (!search || s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  const categories = Object.keys(categoryLabels);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional software development services — from concept to deployment.
          Choose a service and tell us about your project.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="form-input pl-12 py-3"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !activeCategory ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Services
        </button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat] || FiCode;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon size={16} />
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* Service Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16">
          <FiCode className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No services found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const Icon = categoryIcons[service.category] || FiCode;
            const gradient = categoryColors[service.category] || 'from-blue-500 to-purple-600';
            return (
              <div key={service.id} className="card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
                <div className={`h-48 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
                  <Icon className="text-white/20" size={72} />
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                      {categoryLabels[service.category] || service.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-4">{service.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Package Tiers */}
                  <div className="grid grid-cols-3 gap-1 mb-5">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700">Basic</p>
                      <p className="text-xs text-gray-400 mt-0.5">Essential</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-700">Standard</p>
                      <p className="text-xs text-blue-400 mt-0.5">Popular</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700">Enterprise</p>
                      <p className="text-xs text-purple-400 mt-0.5">Full Suite</p>
                    </div>
                  </div>

                  <Link
                    href={token ? `/enroll?service=${service.id}` : `/register?service=${service.id}`}
                    className="btn btn-primary w-full justify-center group-hover:shadow-lg transition-shadow"
                  >
                    {token ? 'Start a Project' : 'Register to Start'} <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
