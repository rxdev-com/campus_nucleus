import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Shield, User, Save } from 'lucide-react';
import axios from 'axios';

const ClubManagementPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [clubs, setClubs] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', description: '', leadOrganizerId: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [clubsRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/clubs'),
                    axios.get('http://localhost:5000/api/auth/users', config)
                ]);
                setClubs(clubsRes.data);
                // Filter users who can be organizers
                setOrganizers(usersRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleEdit = (club) => {
        setEditingId(club._id);
        setEditForm({
            name: club.name,
            description: club.description,
            leadOrganizerId: club.leadOrganizer?._id || club.leadOrganizer
        });
        setShowAddForm(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/clubs/${editingId}`, editForm, config);
            // Refresh clubs list
            const updated = await axios.get('http://localhost:5000/api/clubs');
            setClubs(updated.data);
            setEditingId(null);
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Dissolve this club? All data will be archived.')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/clubs/${id}`, config);
            setClubs(clubs.filter(c => c._id !== id));
        } catch (error) {
            alert('Deletion failed');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!editForm.name || !editForm.description || !editForm.leadOrganizerId) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/clubs', editForm, config);
            const updated = await axios.get('http://localhost:5000/api/clubs');
            setClubs(updated.data);
            setShowAddForm(false);
            setEditForm({ name: '', description: '', leadOrganizerId: '' });
        } catch (error) {
            alert('Addition failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight">Organization Deck</h1>
                    <p className="text-current opacity-60">Manage clubs, committees, and coordination leads.</p>
                </div>
                <button
                    onClick={() => { setShowAddForm(true); setEditingId(null); setEditForm({ name: '', description: '', leadOrganizerId: '' }); }}
                    className="btn-primary flex items-center gap-2 px-8 py-4 font-black shadow-xl shadow-primary-500/20"
                >
                    <Plus size={20} /> Establish Club
                </button>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <AnimatePresence>
                    {(showAddForm || editingId) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="lg:col-span-1"
                        >
                            <div className="card-glass p-8 sticky top-28 border-secondary-500/20 shadow-2xl shadow-secondary-500/10">
                                <h2 className="text-2xl font-black text-current mb-8 flex items-center gap-3">
                                    {editingId ? <Edit2 className="text-amber-400" /> : <Plus className="text-secondary-400" />}
                                    {editingId ? 'Edit Profile' : 'New Foundation'}
                                </h2>
                                <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Club Identity</label>
                                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field bg-transparent border-[var(--border-color)]" placeholder="e.g. Coding Club" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Lead Organizer</label>
                                        <select
                                            value={editForm.leadOrganizerId}
                                            onChange={(e) => setEditForm({ ...editForm, leadOrganizerId: e.target.value })}
                                            className="input-field bg-transparent border-[var(--border-color)] text-current"
                                            required
                                        >
                                            <option value="">Select Identity...</option>
                                            {organizers.map(o => (
                                                <option key={o._id} value={o._id}>{o.name} ({o.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Mission Description</label>
                                        <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="input-field bg-transparent border-[var(--border-color)] min-h-[120px]" placeholder="Brief mission statement..." required />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="submit" className="flex-1 btn-primary py-4 font-black flex justify-center items-center gap-2 bg-gradient-to-r from-secondary-600 to-indigo-600">
                                            <Save size={18} /> {editingId ? 'Sync Updates' : 'Establish'}
                                        </button>
                                        <button onClick={() => { setEditingId(null); setShowAddForm(false); }} type="button" className="btn-glass px-6 border-white/10">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List Section */}
                <div className={`${(showAddForm || editingId) ? 'lg:col-span-2' : 'lg:col-span-3'} grid md:grid-cols-2 gap-6`}>
                    {loading ? (
                        <div className="col-span-full text-center py-20 uppercase font-black tracking-widest text-gray-500 italic animate-pulse">Syncing organization layer...</div>
                    ) : clubs.map((club, index) => (
                        <motion.div
                            key={club._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card-glass p-8 group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border-white/5 hover:border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    <Shield size={32} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(club)} className="p-2 bg-white/5 hover:bg-amber-500/20 text-gray-500 hover:text-amber-400 rounded-xl transition-all border border-white/5">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(club._id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-xl transition-all border border-white/5">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-current mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">{club.name}</h3>
                            <div className="flex items-center gap-3 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 pb-6 border-b border-[var(--border-color)]">
                                <User size={14} />
                                Lead: <span className="text-current">{club.leadOrganizer?.name || 'Unassigned'}</span>
                            </div>

                            <p className="text-current opacity-60 text-sm leading-relaxed line-clamp-3">{club.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClubManagementPage;
