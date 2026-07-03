'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import {
  FiUsers, FiCode, FiGrid, FiDollarSign, FiCheckCircle,
  FiClock, FiShield, FiTrendingUp, FiUserCheck,
  FiUserX, FiPlus, FiArchive, FiRefreshCw,
  FiMessageSquare, FiSend, FiX, FiBarChart2, FiActivity,
  FiLayers, FiUserPlus,
} from 'react-icons/fi';

type Tab = 'overview' | 'users' | 'services' | 'projects' | 'milestones' | 'tickets' | 'analytics';

export default function AdminPage() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (token) loadDashboard();
  }, [token]);

  const loadDashboard = async () => {
    if (!token) return;
    try {
      const data = await api.admin.getDashboard(token);
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!token) return;
    const data = await api.admin.getUsers(token);
    setUsers(data.users || []);
  };

  const loadServices = async () => {
    if (!token) return;
    const data = await api.admin.getServices(token);
    setServices(data.services || []);
  };

  const loadProjects = async () => {
    if (!token) return;
    const data = await api.admin.getProjects(token);
    setProjects(data.projects || []);
  };

  const loadTickets = async () => {
    if (!token) return;
    const data = await api.admin.getTickets(token);
    setTickets(data.tickets || []);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) loadUsers();
    if (tab === 'services' && services.length === 0) loadServices();
    if (tab === 'projects' && projects.length === 0) loadProjects();
    if (tab === 'tickets' && tickets.length === 0) loadTickets();
  };

  const handleToggleUser = async (userId: number) => {
    if (!token) return;
    try {
      await api.admin.toggleUserStatus(userId, token);
      toast.success('User status updated');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleVerifyMilestone = async (milestoneId: number, action: 'confirm' | 'reject', reason?: string) => {
    if (!token) return;
    try {
      await api.admin.verifyMilestone(milestoneId, { action, reason }, token);
      toast.success(`Milestone ${action}ed`);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'services', label: 'Services', icon: FiCode },
    { id: 'projects', label: 'Projects', icon: FiGrid },
    { id: 'milestones', label: 'Milestones', icon: FiLayers },
    { id: 'tickets', label: 'Tickets', icon: FiMessageSquare },
    { id: 'analytics', label: 'Analytics', icon: FiActivity },
  ];

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner w-8 h-8"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiShield className="text-purple-600" /> Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage Services, Projects & Clients</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab data={dashboard} />}
          {activeTab === 'users' && <UsersTab users={users} onToggle={handleToggleUser} onRefresh={loadUsers} />}
          {activeTab === 'services' && <ServicesTab services={services} token={token!} onRefresh={loadServices} />}
          {activeTab === 'projects' && <ProjectsTab projects={projects} token={token!} onRefresh={loadProjects} />}
          {activeTab === 'milestones' && <MilestonesTab projects={projects} token={token!} onVerify={handleVerifyMilestone} onRefresh={loadProjects} />}
          {activeTab === 'tickets' && <TicketsTab tickets={tickets} token={token!} onRefresh={loadTickets} />}
          {activeTab === 'analytics' && <AnalyticsTab token={token!} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// ==================== Overview Tab ====================
function OverviewTab({ data }: { data: any }) {
  const stats = data?.stats;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Total Users" value={stats?.total_users || 0} color="blue" />
        <StatCard icon={FiCode} label="Active Services" value={stats?.active_services || 0} color="green" />
        <StatCard icon={FiGrid} label="Total Projects" value={stats?.total_projects || 0} color="purple" />
        <StatCard icon={FiClock} label="Pending Milestones" value={stats?.pending_milestones || 0} color="amber" />
        <StatCard icon={FiUserPlus} label="Brief Submissions" value={stats?.brief_projects || 0} color="orange" />
        <StatCard icon={FiCheckCircle} label="Active Projects" value={stats?.active_projects || 0} color="emerald" />
        <StatCard icon={FiActivity} label="Visits Today" value={stats?.visits_today || 0} color="indigo" />
        <StatCard icon={FiTrendingUp} label="Revenue Items" value={data?.revenue?.length || 0} color="teal" />
      </div>

      {/* Recent Projects */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_projects?.map((p: any) => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-3">{p.user?.name || p.full_name}</td>
                  <td className="py-3">{p.service?.title}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      p.status === 'active' ? 'badge-success' :
                      p.status === 'brief' || p.status === 'proposal' ? 'badge-warning' :
                      p.status === 'completed' ? 'badge-info' : 'badge-danger'
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.recent_projects || data.recent_projects.length === 0) && (
            <p className="text-center text-gray-400 py-4">No recent projects</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    orange: 'bg-orange-100 text-orange-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ==================== Users Tab ====================
function UsersTab({ users, onToggle, onRefresh }: { users: any[]; onToggle: (id: number) => void; onRefresh: () => void }) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">User Management</h3>
        <button onClick={onRefresh} className="btn btn-secondary btn-sm"><FiRefreshCw size={14} /> Refresh</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Phone</th>
              <th className="pb-3 font-medium">Country</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 text-gray-600">{u.email}</td>
                <td className="py-3 text-gray-600">{u.phone || '-'}</td>
                <td className="py-3 text-gray-600">{u.country}</td>
                <td className="py-3">
                  <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggle(u.id)}
                      className={`btn btn-sm ${u.is_active ? 'btn-secondary' : 'btn-success'}`}
                      title={u.is_active ? 'Suspend' : 'Activate'}
                    >
                      {u.is_active ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== Services Tab ====================
function ServicesTab({ services, token, onRefresh }: { services: any[]; token: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'web', image_path: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.admin.updateService(editing.id, form, token);
        toast.success('Service updated');
      } else {
        await api.admin.createService(form, token);
        toast.success('Service created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', category: 'web', image_path: '' });
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await api.admin.archiveService(id, token);
      toast.success('Service archived');
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleUnarchive = async (id: number) => {
    try {
      await api.admin.unarchiveService(id, token);
      toast.success('Service restored');
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Service Management</h3>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn btn-primary btn-sm">
          <FiPlus /> New Service
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 mb-4">{editing ? 'Edit Service' : 'Create Service'}</h4>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">Title</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input" required />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input min-h-[80px]" />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="form-input">
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Apps</option>
                <option value="api">API & Integration</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="security">Cybersecurity</option>
                <option value="audit">Code Audit & QA</option>
                <option value="architecture">Architecture Design</option>
              </select>
            </div>
            <div>
              <label className="form-label">Image Path</label>
              <input type="text" value={form.image_path} onChange={e => setForm({...form, image_path: e.target.value})} className="form-input" placeholder="/images/service.png" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <div key={service.id} className="card p-5">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{service.title}</h4>
              <span className={`badge ${service.is_archived ? 'badge-danger' : 'badge-success'}`}>
                {service.is_archived ? 'Archived' : 'Active'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{service.category}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => service.is_archived ? handleUnarchive(service.id) : handleArchive(service.id)}
                className="btn btn-sm btn-secondary">
                {service.is_archived ? <FiRefreshCw size={14} /> : <FiArchive size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Projects Tab ====================
function ProjectsTab({ projects, token, onRefresh }: { projects: any[]; token: string; onRefresh: () => void }) {
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({ status: '', developer_id: '' });

  const filtered = filterStatus ? projects.filter((p: any) => p.status === filterStatus) : projects;

  const handleStatusUpdate = async (projectId: number) => {
    try {
      await api.admin.updateProjectStatus(projectId, {
        status: statusForm.status,
        developer_id: statusForm.developer_id ? parseInt(statusForm.developer_id) : undefined,
      }, token);
      toast.success('Project updated');
      setSelectedProject(null);
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Project Management</h3>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input w-auto">
          <option value="">All Status</option>
          <option value="brief">Brief Submitted</option>
          <option value="proposal">Proposal Sent</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="pb-3 font-medium">Client</th>
              <th className="pb-3 font-medium">Service</th>
              <th className="pb-3 font-medium">Tier</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Budget</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 font-medium">{p.full_name || p.user?.name}</td>
                <td className="py-3">{p.service?.title}</td>
                <td className="py-3 capitalize">{p.tier}</td>
                <td className="py-3">
                  <span className={`badge ${
                    p.status === 'active' ? 'badge-success' :
                    p.status === 'brief' || p.status === 'proposal' ? 'badge-warning' :
                    p.status === 'completed' ? 'badge-info' : 'badge-danger'
                  }`}>{p.status}</span>
                </td>
                <td className="py-3 text-gray-600">{p.budget_range || '-'}</td>
                <td className="py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="py-3">
                  <button onClick={() => {
                    setSelectedProject(p);
                    setStatusForm({ status: p.status, developer_id: p.developer_id || '' });
                  }} className="btn btn-sm btn-primary">
                    <FiUserPlus size={14} /> Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Manage Project</h3>
              <button onClick={() => setSelectedProject(null)}><FiX /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Service:</strong> {selectedProject.service?.title}<br />
              <strong>Client:</strong> {selectedProject.full_name} ({selectedProject.email})<br />
              <strong>WhatsApp:</strong> {selectedProject.phone}
            </p>
            <div className="mb-4">
              <label className="form-label">Project Status</label>
              <select
                value={statusForm.status}
                onChange={e => setStatusForm({...statusForm, status: e.target.value})}
                className="form-input"
              >
                <option value="brief">Brief Submitted</option>
                <option value="proposal">Proposal Sent</option>
                <option value="active">Active (In Progress)</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Developer ID (optional)</label>
              <input
                type="number"
                value={statusForm.developer_id}
                onChange={e => setStatusForm({...statusForm, developer_id: e.target.value})}
                className="form-input"
                placeholder="Assign developer user ID"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleStatusUpdate(selectedProject.id)} className="btn btn-primary flex-1">
                Update Project
              </button>
              <button onClick={() => setSelectedProject(null)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Milestones Tab ====================
function MilestonesTab({ projects, token, onVerify, onRefresh }: {
  projects: any[]; token: string;
  onVerify: (id: number, action: 'confirm' | 'reject', reason?: string) => void;
  onRefresh: () => void;
}) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', amount: 0, currency: 'RWF', deadline: '' });

  // Collect all milestones from all projects
  const allMilestones = projects.flatMap(p =>
    (p.milestones || []).map((ms: any) => ({ ...ms, project: p }))
  ).filter((ms: any) => ms.status === 'pending' || ms.status === 'paid');

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await api.admin.createMilestone(selectedProject.id, {
        title: form.title,
        description: form.description,
        amount: form.amount,
        currency: form.currency,
        deadline: form.deadline || undefined,
      }, token);
      toast.success('Milestone created');
      setShowForm(false);
      setForm({ title: '', description: '', amount: 0, currency: 'RWF', deadline: '' });
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Pending Milestones */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Pending Milestone Payments ({allMilestones.length})</h3>
        {allMilestones.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No pending milestones</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Milestone</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allMilestones.map((ms: any) => (
                  <tr key={ms.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{ms.project?.service?.title}</td>
                    <td className="py-3 font-medium">{ms.title}</td>
                    <td className="py-3">{ms.amount?.toLocaleString()} {ms.currency}</td>
                    <td className="py-3">
                      <span className={`badge ${ms.status === 'paid' ? 'badge-info' : 'badge-warning'}`}>{ms.status}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => onVerify(ms.id, 'confirm')} className="btn btn-sm btn-success">
                          <FiCheckCircle size={14} /> Confirm
                        </button>
                        <button onClick={() => onVerify(ms.id, 'reject', 'Payment not received')} className="btn btn-sm btn-danger">
                          <FiX size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Milestone */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Create Milestone</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            <FiPlus /> New Milestone
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateMilestone} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">Project</label>
              <select
                value={selectedProject?.id || ''}
                onChange={e => setSelectedProject(projects.find(p => p.id === parseInt(e.target.value)))}
                className="form-input"
                required
              >
                <option value="">-- Select project --</option>
                {projects.filter((p: any) => p.status === 'active' || p.status === 'proposal').map((p: any) => (
                  <option key={p.id} value={p.id}>{p.service?.title} — {p.full_name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Title</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input" required />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input min-h-[60px]" />
            </div>
            <div>
              <label className="form-label">Amount</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value)})} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="form-input">
                <option value="RWF">RWF</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="form-input" />
            </div>
            <div className="flex justify-end gap-3 md:col-span-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Create Milestone</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ==================== Tickets Tab ====================
function TicketsTab({ tickets, token, onRefresh }: { tickets: any[]; token: string; onRefresh: () => void }) {
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = async (id: number) => {
    try {
      await api.admin.replyTicket(id, { reply: replyText }, token);
      toast.success('Reply sent');
      setReplyId(null);
      setReplyText('');
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleClose = async (id: number) => {
    try {
      await api.admin.closeTicket(id, token);
      toast.success('Ticket closed');
      onRefresh();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="font-semibold text-gray-900 mb-4">Support Tickets</h3>
      <div className="space-y-4">
        {tickets.map((ticket: any) => (
          <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  From: {ticket.user?.name || 'Unknown'} • {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${
                  ticket.status === 'open' ? 'badge-warning' :
                  ticket.status === 'replied' ? 'badge-info' : 'badge-success'
                }`}>{ticket.status}</span>
                {ticket.status !== 'closed' && (
                  <button onClick={() => handleClose(ticket.id)} className="btn btn-sm btn-secondary">
                    <FiX size={14} /> Close
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{ticket.message}</p>

            {ticket.reply && (
              <div className="bg-blue-50 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-700 font-medium mb-1">Admin Reply:</p>
                <p className="text-sm text-blue-600">{ticket.reply}</p>
              </div>
            )}

            {ticket.status !== 'closed' && replyId === ticket.id ? (
              <div className="mt-3">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="form-input min-h-[80px]"
                  placeholder="Type your reply..."
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleReply(ticket.id)} className="btn btn-primary btn-sm"><FiSend /> Send</button>
                  <button onClick={() => { setReplyId(null); setReplyText(''); }} className="btn btn-secondary btn-sm">Cancel</button>
                </div>
              </div>
            ) : ticket.status !== 'closed' && (
              <button onClick={() => { setReplyId(ticket.id); setReplyText(''); }} className="btn btn-sm btn-secondary mt-3">
                <FiMessageSquare size={14} /> Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Analytics Tab ====================
function AnalyticsTab({ token }: { token: string }) {
  const [visits, setVisits] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [token]);

  const loadAnalytics = async () => {
    try {
      const [v, r] = await Promise.all([
        api.admin.getVisits(token),
        api.admin.getRevenue(token),
      ]);
      setVisits(v);
      setRevenue(r);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="spinner w-8 h-8" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visits */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiActivity className="text-blue-600" /> Site Visits
        </h3>
        <p className="text-3xl font-bold text-gray-900 mb-4">{visits?.total_visits || 0} total visits</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Visits</th>
              </tr>
            </thead>
            <tbody>
              {visits?.daily_visits?.map((d: any) => (
                <tr key={d.date} className="border-b border-gray-100">
                  <td className="py-2">{d.date}</td>
                  <td className="py-2 font-medium">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiDollarSign className="text-green-600" /> Revenue Report
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total RWF</p>
            <p className="text-2xl font-bold text-gray-900">{revenue?.total_rwf?.toLocaleString() || 0} FRW</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total USDT</p>
            <p className="text-2xl font-bold text-gray-900">${revenue?.total_usdt || 0} USDT</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Milestone</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Currency</th>
              </tr>
            </thead>
            <tbody>
              {revenue?.revenue?.map((r: any, i: number) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2">{r.date}</td>
                  <td className="py-2">{r.service}</td>
                  <td className="py-2">{r.milestone}</td>
                  <td className="py-2 font-medium">{r.amount?.toLocaleString()}</td>
                  <td className="py-2">{r.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
