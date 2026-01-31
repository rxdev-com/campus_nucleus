import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter, Trash2, Edit, CheckCircle, XCircle, Clock, FileText, ChevronRight, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllEventsManagementPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/events/all', config);
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this event protocol from the database?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/events/${id}`, config);
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            alert('Deletion failed');
        }
    };

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'published': return 'bg-green-500/10 text-green-300 border-green-500/20';
            case 'submitted': return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-300 border-red-500/20';
            case 'draft': return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
            default: return 'bg-primary-500/10 text-primary-300 border-primary-500/20';
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight">Protocol Registry</h1>
                    <p className="text-current opacity-60">Oversee all events, deployments, and historical records.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search protocol title..."
                            className="input-field pl-12 bg-transparent border-[var(--border-color)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'draft', 'submitted', 'published', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${filterStatus === status ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full py-20 text-center uppercase font-black text-gray-500 tracking-[0.3em] animate-pulse italic">Accessing archive layer...</div>
                    ) : filteredEvents.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                            className="card-glass p-6 group transition-all border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-primary-500/5"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(event.status)}`}>
                                    {event.status}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => navigate(`/events/${event._id}`)} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5">
                                        <FileText size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(event._id)} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-white/5">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-current mb-2 line-clamp-1 group-hover:text-primary-300 transition-colors uppercase tracking-tight">{event.title}</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-current opacity-40 mb-6">
                                <Clock size={14} className="text-primary-500 opacity-50" />
                                {new Date(event.timeStart).toLocaleDateString()}
                                <span className="mx-1 opacity-20">|</span>
                                <span className="text-current opacity-60">{event.organizerClub?.name || 'External'}</span>
                            </div>

                            <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-current opacity-40">
                                <span>Creator: <span className="text-current opacity-80">{event.createdBy?.name || 'System'}</span></span>
                                <button onClick={() => navigate(`/events/${event._id}`)} className="flex items-center gap-1 text-primary-400 hover:text-white transition-colors group/btn">
                                    Full Intel <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AllEventsManagementPage;
