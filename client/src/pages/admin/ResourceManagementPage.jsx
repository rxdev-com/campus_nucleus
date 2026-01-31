import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Edit2, Check, X, Box, Type, Users, Save } from 'lucide-react';
import axios from 'axios';

const ResourceManagementPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', type: 'room', capacity: 0, location: '', description: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/resources');
                setResources(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const handleEdit = (res) => {
        setEditingId(res._id);
        setEditForm({ ...res });
        setShowAddForm(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/resources/${editingId}`, editForm, config);
            setResources(resources.map(r => r._id === editingId ? data : r));
            setEditingId(null);
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Eject this resource from the system?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/resources/${id}`, config);
            setResources(resources.filter(r => r._id !== id));
        } catch (error) {
            alert('Deletion failed');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/resources', editForm, config);
            setResources([...resources, data]);
            setShowAddForm(false);
            setEditForm({ name: '', type: 'room', capacity: 0, location: '', description: '' });
        } catch (error) {
            alert('Addition failed');
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between underline items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight underline decoration-primary-500/50">Asset Matrix</h1>
                    <p className="text-current opacity-60">Manage hardware, rooms, and infrastructure nodes.</p>
                </div>
                <button
                    onClick={() => { setShowAddForm(true); setEditingId(null); setEditForm({ name: '', type: 'room', capacity: 0, location: '', description: '' }); }}
                    className="btn-primary flex items-center gap-2 px-8 py-4 font-black shadow-xl shadow-primary-500/20"
                >
                    <Plus size={20} /> Initialize Asset
                </button>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Add/Edit Section */}
                <AnimatePresence>
                    {(showAddForm || editingId) && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card-glass p-8 h-fit border-primary-500/20 shadow-2xl shadow-primary-500/10"
                        >
                            <h2 className="text-2xl font-black text-current mb-8 flex items-center gap-3">
                                {editingId ? <Edit2 className="text-amber-400" /> : <Plus className="text-primary-400" />}
                                {editingId ? 'Modify Record' : 'Deploy New Asset'}
                            </h2>
                            <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Identity Name</label>
                                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field bg-transparent border-[var(--border-color)]" placeholder="e.g. Main Auditorium" required />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Class Type</label>
                                        <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="input-field bg-transparent border-[var(--border-color)] text-current">
                                            <option value="room">Room</option>
                                            <option value="hall">Great Hall</option>
                                            <option value="equipment">Hardware/Equipment</option>
                                            <option value="other">Misc Node</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Node Capacity</label>
                                        <input type="number" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })} className="input-field bg-transparent border-[var(--border-color)]" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Grid Location</label>
                                    <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="input-field bg-transparent border-[var(--border-color)]" placeholder="Room 402, Building 7" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Protocol Description</label>
                                    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="input-field bg-transparent border-[var(--border-color)] min-h-[100px]" placeholder="Available features, limitations..." />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="flex-1 btn-primary py-4 font-black flex justify-center items-center gap-2">
                                        <Save size={18} /> {editingId ? 'Push Update' : 'Initialize'}
                                    </button>
                                    <button onClick={() => { setEditingId(null); setShowAddForm(false); }} type="button" className="btn-glass px-6 border-white/10">
                                        Abort
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List Section */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-gray-500 py-20 text-center uppercase font-black tracking-widest animate-pulse italic">Scanning physical layer...</div>
                    ) : resources.map((res, index) => (
                        <motion.div
                            key={res._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`card-glass p-6 group transition-all duration-300 border-l-4 ${editingId === res._id ? 'border-primary-500 bg-primary-500/5' : 'border-l-transparent hover:border-l-white/20'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 bg-current opacity-[0.05] rounded-2xl flex items-center justify-center text-primary-400 border border-[var(--border-color)] shadow-lg group-hover:scale-110 transition-transform">
                                        <Box size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-current mb-1 tracking-tight group-hover:text-primary-300 transition-colors">{res.name}</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-current opacity-40">
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {res.location}</span>
                                            <span className="flex items-center gap-1"><Users size={12} /> {res.capacity} Max</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(res)} className="p-2 bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 rounded-lg transition-colors border border-white/5">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(res._id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-white/5">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-current opacity-50 line-clamp-2 leading-relaxed italic">{res.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourceManagementPage;
