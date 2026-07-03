'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiPlus, FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Ticket {
  id: number;
  subject: string;
  message: string;
  status: string;
  reply?: string;
  admin_id?: number;
  created_at: string;
  updated_at: string;
}

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [token]);

  const loadTickets = async () => {
    if (!token) return;
    try {
      const data = await api.getTickets(token);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    try {
      await api.createTicket(form, token);
      toast.success('Ticket created successfully');
      setForm({ subject: '', message: '' });
      setShowNew(false);
      loadTickets();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-500 mt-1">Get help from our support team</p>
          </div>
          <button
            onClick={() => setShowNew(!showNew)}
            className="btn btn-primary"
          >
            <FiPlus /> New Ticket
          </button>
        </div>

        {/* New Ticket Form */}
        {showNew && (
          <div className="card p-6 mb-6 animate-fade-in">
            <h3 className="font-semibold text-gray-900 mb-4">Create New Ticket</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="form-input"
                  placeholder="Brief description of your issue"
                  required
                  maxLength={300}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="form-input min-h-[120px] resize-y"
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowNew(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <div className="spinner w-5 h-5 border-white" /> : <><FiSend /> Submit</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner w-8 h-8"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No tickets yet</p>
            <p className="text-gray-400 text-sm mt-2">Create a ticket if you need help</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      ticket.status === 'open' ? 'bg-amber-500' :
                      ticket.status === 'replied' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ticket.created_at).toLocaleDateString()} • {ticket.status}
                      </p>
                    </div>
                  </div>
                  {expanded === ticket.id ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                </button>

                {expanded === ticket.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-fade-in">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Your Message:</p>
                      <p className="text-sm text-gray-600">{ticket.message}</p>
                    </div>

                    {ticket.reply && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-700 mb-2">Support Reply:</p>
                        <p className="text-sm text-blue-600">{ticket.reply}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Created: {new Date(ticket.created_at).toLocaleString()}
                      {ticket.updated_at !== ticket.created_at && ` • Updated: ${new Date(ticket.updated_at).toLocaleString()}`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
