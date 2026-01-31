import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, ChevronRight, Filter, Search, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyRegisteredEventsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/events/joined', config);
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchMyEvents();
    }, [user]);

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-10">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tighter">My Registry</h1>
                    <p className="text-current opacity-60">Chronicle of your campus involvement and upcoming deployments.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-glass px-6 py-3 border-[var(--border-color)] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Filter size={16} /> Filter Date
                    </button>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center uppercase font-black text-gray-500 tracking-[0.3em] animate-pulse">Syncing Event Logs...</div>
                ) : events.length === 0 ? (
                    <div className="col-span-full text-center py-20 border-2 border-dashed border-[var(--border-color)] rounded-3xl opacity-50">
                        <Bookmark size={48} className="mx-auto mb-4 text-current opacity-40" />
                        <p className="text-current font-bold uppercase tracking-widest text-sm">No active protocols detected.</p>
                        <button onClick={() => navigate('/events')} className="mt-6 text-primary-400 font-black text-xs uppercase hover:text-current transition-colors">Explore Feed</button>
                    </div>
                ) : (
                    <AnimatePresence>
                        {events.map((event, idx) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/events/${event._id}`)}
                                className="card-glass p-8 group cursor-pointer border-white/5 hover:border-primary-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-300">
                                        Confirmed Identity
                                    </span>
                                    <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-current mb-4 group-hover:text-primary-300 transition-colors uppercase tracking-tight">{event.title}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs font-bold text-current opacity-40 border-l-2 border-primary-500/30 pl-4">
                                        <Calendar size={14} /> {new Date(event.timeStart).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-current opacity-40 border-l-2 border-secondary-500/30 pl-4">
                                        <Clock size={14} /> {new Date(event.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-current opacity-40 border-l-2 border-[var(--border-color)] pl-4">
                                        <MapPin size={14} /> {event.venue}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-color)]">
                                    <div className="w-8 h-8 rounded-full bg-current opacity-[0.05] border border-[var(--border-color)] flex items-center justify-center text-[10px] text-current font-black">
                                        {event.organizerClub?.name?.charAt(0)}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-current opacity-40">
                                        Unit: <span className="text-current opacity-80">{event.organizerClub?.name}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default MyRegisteredEventsPage;
