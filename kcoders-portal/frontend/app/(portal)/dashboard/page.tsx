'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  FiGrid, FiCode, FiCheckCircle, FiClock, FiAlertCircle,
  FiUser, FiMail, FiPhone, FiMapPin, FiArrowRight, FiPlus,
  FiLayers, FiTrendingUp,
} from 'react-icons/fi';

interface DashboardData {
  profile: any;
  stats: any;
  recent_projects: any[];
  expiring_milestones: any[];
  tickets: any[];
}

const statusColors: Record<string, string> = {
  brief: 'badge-warning',
  proposal: 'badge-info',
  active: 'badge-success',
  completed: 'badge-info',
  cancelled: 'badge-danger',
};

const statusLabels: Record<string, string> = {
  brief: 'Brief Submitted',
  proposal: 'Proposal Sent',
  active: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const milestoneStatusColors: Record<string, string> = {
  pending: 'badge-warning',
  paid: 'badge-info',
  confirmed: 'badge-success',
  completed: 'badge-info',
};

export default function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const loadDashboard = async () => {
    if (!token) return;
    try {
      const result = await api.getDashboard(token);
      setData(result);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner w-8 h-8"></div>
        </div>
      </ProtectedRoute>
    );
  }

  const { profile, stats, recent_projects, expiring_milestones, tickets } = data || {};

  // Get profile from first project's user or from a separate profile fetch
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (token) {
      api.getProfile(token).then(d => setProfileData(d)).catch(() => {});
    }
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {(profileData?.name || profile?.name || 'Client')?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Track your projects and milestones</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <FiCode className="text-blue-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">{stats?.total_projects || 0}</span>
            </div>
            <p className="text-sm text-gray-500">Total Projects</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="text-green-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">{stats?.active_projects || 0}</span>
            </div>
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="text-amber-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">{stats?.pending_briefs || 0}</span>
            </div>
            <p className="text-sm text-gray-500">Pending Briefs</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <FiTrendingUp className="text-purple-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">{stats?.completed || 0}</span>
            </div>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left - Profile & Quick Actions */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" /> Profile
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUser size={14} /> {profileData?.name || profile?.name}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail size={14} /> {profileData?.email || profile?.email}
                </div>
                {(profileData?.phone || profile?.phone) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiPhone size={14} /> {profileData?.phone || profile?.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin size={14} /> {profileData?.country === 'RW' ? 'Rwanda' : profileData?.country || 'N/A'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/services" className="flex items-center justify-between p-3 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium">
                  Browse Services <FiArrowRight />
                </Link>
                <Link href="/enroll" className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors text-sm font-medium">
                  New Project <FiPlus />
                </Link>
                <Link href="/tickets" className="flex items-center justify-between p-3 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium">
                  Support Tickets <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Projects & Milestones */}
          <div className="md:col-span-2 space-y-6">
            {/* Expiring Milestones */}
            {expiring_milestones && expiring_milestones.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <FiAlertCircle /> Pending Milestones ({expiring_milestones.length})
                </h3>
                <div className="space-y-2">
                  {expiring_milestones.map((ms: any) => (
                    <div key={ms.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ms.project?.service?.title} — {ms.title}</p>
                        <p className="text-xs text-gray-500">Amount: {ms.amount?.toLocaleString()} {ms.currency}</p>
                      </div>
                      {ms.deadline && (
                        <span className={`countdown-timer ${new Date(ms.deadline).getTime() - Date.now() < 1800000 ? 'text-red-600' : ''}`}>
                          <FiClock size={14} />
                          {Math.ceil((new Date(ms.deadline).getTime() - Date.now()) / 3600000)}h remaining
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Projects */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Your Projects</h3>
                <Link href="/enroll" className="text-sm text-blue-600 hover:text-blue-700 font-medium">New +</Link>
              </div>
              {(!recent_projects || recent_projects.length === 0) ? (
                <div className="text-center py-8">
                  <FiCode className="mx-auto text-gray-300 mb-3" size={36} />
                  <p className="text-gray-500 text-sm">No projects yet</p>
                  <Link href="/services" className="btn btn-primary btn-sm mt-3">Browse Services</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recent_projects?.map((project: any) => (
                    <div key={project.id} className="border border-gray-100 rounded-lg overflow-hidden">
                      {/* Project Header */}
                      <div className="p-4 bg-gray-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {project.service?.title || 'Project'} — {project.tier?.charAt(0).toUpperCase() + project.tier?.slice(1)} Tier
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {project.full_name} • {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`badge ${statusColors[project.status] || 'badge-warning'}`}>
                          {statusLabels[project.status] || project.status}
                        </span>
                      </div>

                      {/* Milestones */}
                      {project.milestones?.length > 0 && (
                        <div className="px-4 pb-4 pt-2">
                          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                            <FiLayers size={12} /> Milestones
                          </p>
                          <div className="space-y-1.5">
                            {project.milestones.map((ms: any) => (
                              <div key={ms.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    ms.status === 'completed' ? 'bg-green-500' :
                                    ms.status === 'confirmed' ? 'bg-blue-500' :
                                    ms.status === 'paid' ? 'bg-amber-500' : 'bg-gray-300'
                                  }`} />
                                  <span className="text-gray-700">{ms.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">{ms.amount?.toLocaleString()} {ms.currency}</span>
                                  <span className={`badge ${milestoneStatusColors[ms.status] || 'badge-warning'} text-[10px] px-1.5 py-0.5`}>
                                    {ms.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Tickets */}
            {tickets && tickets.length > 0 && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Support Tickets</h3>
                  <Link href="/tickets" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                </div>
                <div className="space-y-2">
                  {tickets.map((ticket: any) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <p className="text-sm text-gray-900 truncate">{ticket.subject}</p>
                      <span className={`badge ${
                        ticket.status === 'open' ? 'badge-warning' :
                        ticket.status === 'replied' ? 'badge-info' : 'badge-success'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
