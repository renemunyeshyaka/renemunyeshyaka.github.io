const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { method = 'GET', headers = {}, body, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE}/api${endpoint}`;
  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

async function uploadFile(endpoint: string, formData: FormData, token: string) {
  const url = `${API_BASE}/api${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; phone?: string; country?: string; whatsapp?: string }) =>
    request('/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string; remember_device?: boolean }) =>
    request('/auth/login', { method: 'POST', body: data }),

  verifyOTP: (data: { email: string; code: string; device_token?: string }) =>
    request('/auth/otp/verify', { method: 'POST', body: data }),

  resendActivation: (email: string) =>
    request('/auth/resend-activation', { method: 'POST', body: { email } }),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: (data: { token: string; new_password: string }) =>
    request('/auth/reset-password', { method: 'POST', body: data }),

  // Profile
  getProfile: (token: string) =>
    request('/profile', { token }),

  updateProfile: (data: { name?: string; phone?: string; whatsapp?: string }, token: string) =>
    request('/profile', { method: 'PUT', body: data, token }),

  // Services (replaces Courses)
  getServices: (search?: string) =>
    request(`/services${search ? `?search=${search}` : ''}`),

  getService: (id: number) =>
    request(`/services/${id}`),

  // Projects (replaces Enrollments)
  submitBrief: (data: {
    service_id: number;
    tier: string;
    full_name: string;
    email: string;
    phone: string;
    description: string;
    budget_range?: string;
  }, token: string) =>
    request('/projects/brief', { method: 'POST', body: data, token }),

  getProjects: (token: string) =>
    request('/projects', { token }),

  getProject: (id: number, token: string) =>
    request(`/projects/${id}`, { token }),

  uploadProjectDocument: (projectId: number, formData: FormData, token: string) =>
    uploadFile(`/projects/${projectId}/document`, formData, token),

  // Dashboard (now returns projects + milestones data)
  getDashboard: (token: string) =>
    request('/dashboard', { token }),

  // Tickets
  createTicket: (data: { subject: string; message: string; project_id?: number }, token: string) =>
    request('/tickets', { method: 'POST', body: data, token }),

  getTickets: (token: string) =>
    request('/tickets', { token }),

  getTicket: (id: number, token: string) =>
    request(`/tickets/${id}`, { token }),

  // Payments
  payMilestone: (token: string, milestoneId: number) =>
    request(`/milestones/${milestoneId}/pay`, { method: 'POST', token }),

  // Visits
  trackVisit: (page: string) =>
    request('/visits/track', { method: 'POST', body: { page } }),

  // Admin — refactored for Services Portal
  admin: {
    getDashboard: (token: string) =>
      request('/admin/dashboard', { token }),

    // Users
    getUsers: (token: string, params?: string) =>
      request(`/admin/users${params ? `?${params}` : ''}`, { token }),

    getUser: (id: number, token: string) =>
      request(`/admin/users/${id}`, { token }),

    toggleUserStatus: (id: number, token: string) =>
      request(`/admin/users/${id}/toggle-status`, { method: 'PUT', token }),

    toggleHighValue: (id: number, token: string) =>
      request(`/admin/users/${id}/toggle-high-value`, { method: 'PUT', token }),

    deleteUser: (id: number, token: string) =>
      request(`/admin/users/${id}`, { method: 'DELETE', token }),

    // Services (replaces Courses)
    getServices: (token: string, params?: string) =>
      request(`/admin/services${params ? `?${params}` : ''}`, { token }),

    createService: (data: { title: string; description?: string; category: string; image_path?: string }, token: string) =>
      request('/admin/services', { method: 'POST', body: data, token }),

    updateService: (id: number, data: { title?: string; description?: string; category?: string; image_path?: string }, token: string) =>
      request(`/admin/services/${id}`, { method: 'PUT', body: data, token }),

    archiveService: (id: number, token: string) =>
      request(`/admin/services/${id}/archive`, { method: 'PUT', token }),

    unarchiveService: (id: number, token: string) =>
      request(`/admin/services/${id}/unarchive`, { method: 'PUT', token }),

    // Projects (replaces Enrollments)
    getProjects: (token: string, params?: string) =>
      request(`/admin/projects${params ? `?${params}` : ''}`, { token }),

    updateProjectStatus: (id: number, data: { status: string; developer_id?: number }, token: string) =>
      request(`/admin/projects/${id}/status`, { method: 'PUT', body: data, token }),

    // Milestones (replaces Payments)
    createMilestone: (projectId: number, data: { title: string; description?: string; amount: number; currency: string; deadline?: string }, token: string) =>
      request(`/admin/projects/${projectId}/milestones`, { method: 'POST', body: data, token }),

    getMilestones: (projectId: number, token: string) =>
      request(`/admin/projects/${projectId}/milestones`, { token }),

    verifyMilestone: (id: number, data: { action: 'confirm' | 'reject'; reason?: string }, token: string) =>
      request(`/admin/milestones/${id}/verify`, { method: 'PUT', body: data, token }),

    signOffMilestone: (id: number, token: string) =>
      request(`/admin/milestones/${id}/sign-off`, { method: 'PUT', token }),

    // Tickets
    getTickets: (token: string, params?: string) =>
      request(`/admin/tickets${params ? `?${params}` : ''}`, { token }),

    replyTicket: (id: number, data: { reply: string }, token: string) =>
      request(`/admin/tickets/${id}/reply`, { method: 'POST', body: data, token }),

    closeTicket: (id: number, token: string) =>
      request(`/admin/tickets/${id}/close`, { method: 'PUT', token }),

    // Analytics
    getVisits: (token: string, since?: string) =>
      request(`/admin/analytics/visits${since ? `?since=${since}` : ''}`, { token }),

    getRevenue: (token: string, since?: string) =>
      request(`/admin/analytics/revenue${since ? `?since=${since}` : ''}`, { token }),

    getActivity: (token: string) =>
      request('/admin/analytics/activity', { token }),
  },
};
