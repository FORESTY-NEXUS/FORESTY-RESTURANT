'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function DeliveryAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'delivery' });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/riders');
      setAgents(data);
    } catch (err) {
      toast.error('Failed to fetch delivery agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      toast.success('Agent created successfully');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'delivery' });
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create agent');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Agent deleted successfully');
      fetchAgents();
    } catch (err) {
      toast.error('Failed to delete agent');
    }
  };

  if (loading) return <p>Loading agents...</p>;

  return (
    <div className="reveal visible">
      <div className="flex justify-between mb-[30px] items-center">
        <h2 className="text-[1.5rem]">Management: Delivery Agents</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary py-[10px] px-[20px] rounded-[12px] flex items-center">
          <Plus size={18} className="mr-2" /> Add New Agent
        </button>
      </div>

      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[20px] overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr className="bg-white/5 border-b border-[var(--glass-border)]">
              <th className="p-[20px]">Name</th>
              <th className="p-[20px]">Email</th>
              <th className="p-[20px]">Status</th>
              <th className="p-[20px]">Last Login</th>
              <th className="p-[20px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id} className="border-b border-[var(--glass-border)]">
                <td className="p-[20px] font-semibold">{agent.name}</td>
                <td className="p-[20px] opacity-70">{agent.email}</td>
                <td className="p-[20px]">
                  <span className={`px-3 py-1 rounded-[50px] text-xs font-bold ${agent.isActive !== false ? 'bg-[#2ecc7120] text-[#2ecc71] border border-[#2ecc7140]' : 'bg-[#e74c3c20] text-[#e74c3c] border border-[#e74c3c40]'}`}>
                    {agent.isActive !== false ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-[20px] text-sm opacity-50">
                  {agent.lastLogin ? new Date(agent.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="p-[20px]">
                  <button onClick={() => handleDelete(agent._id)} className="p-2 rounded-lg border border-[var(--glass-border)] bg-[#e74c3c1a] text-[#e74c3c] cursor-pointer hover:bg-[#e74c3c33] transition-colors" title="Delete Agent">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && <p className="text-center p-[40px] opacity-50">No delivery agents found.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[20px] p-[20px] md:p-[40px] w-[95%] md:w-full max-w-[400px]">
            <h3 className="mb-[25px]">Add New Delivery Agent</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
              <div className="nav-search w-full rounded-[10px]">
                <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="nav-search w-full rounded-[10px]">
                <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="nav-search w-full rounded-[10px]">
                <input type="password" placeholder="Password" value={formData.password} minLength={6} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              
              <div className="flex gap-[10px] mt-[10px]">
                <button type="submit" className="btn-primary flex-1 justify-center"><Check size={18} className="mr-2" /> Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center"><X size={18} className="mr-2" /> Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
