import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Search, Filter, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [festEvents, setFestEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events?keyword=${searchTerm}`);
                const allEvents = Array.isArray(data) ? data : (data.events || []);
                setEvents(allEvents.filter(e => !e.isFest));
                setFestEvents(allEvents.filter(e => e.isFest));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchEvents();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-transparent relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[160px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-secondary-900/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-7xl md:text-9xl font-display font-black mb-6 tracking-tighter text-current">
                            SIGNAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-300 to-indigo-500">FEED</span>
                        </h1>
                        <p className="text-current opacity-60 max-w-2xl mx-auto text-xl font-medium italic border-l-2 border-primary-500/30 px-8">
                            “The Core of Campus Operations.” <br />
                            <span className="text-sm font-bold uppercase tracking-widest opacity-40 not-italic">Synchronize with active deployments and network seminars.</span>
                        </p>
                    </motion.div>
                </header>

                {festEvents.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                                <Sparkles className="text-amber-400" /> Fest Highlights
                            </h2>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-10 snap-x hide-scrollbar">
                            {festEvents.map((fest) => (
                                <motion.div
                                    key={fest._id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/events/${fest._id}`)}
                                    className="min-w-[350px] md:min-w-[450px] aspect-video rounded-[2.5rem] overflow-hidden relative group cursor-pointer border border-white/10 snap-start shadow-2xl"
                                >
                                    <img src={fest.bannerImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">FEST</span>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">{fest.festName}</span>
                                    </div>
                                    <div className="absolute bottom-8 left-8">
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{fest.title}</h3>
                                        <p className="text-white/60 text-sm font-bold uppercase tracking-widest flex items-center gap-2"><Flame size={14} className="text-amber-400" /> Starting {new Date(fest.timeStart).toLocaleDateString()}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <Calendar className="text-primary-500" /> Events Feed
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between"
                >
                    <div className="relative w-full md:w-[450px] group">
                        <Search className="absolute left-6 top-5 text-current opacity-40 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Rescan network protocols..."
                            className="input-field pl-16 py-5 text-lg shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="btn-glass px-8 py-5 flex items-center gap-2 border-white/10 hover:border-primary-500/30 text-xs font-black uppercase tracking-widest transition-all">
                            <Filter size={16} /> Matrix Filter
                        </button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 font-black uppercase tracking-[0.5em] text-sm italic">Syncing Data Stream...</span>
                    </div>
                ) : events.length === 0 ? (
                    <div className="py-40 text-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest italic opacity-50">No signals detected in the current grid.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -10 }}
                                className="card-glass group overflow-hidden border-white/5 hover:border-primary-500/30 transition-all duration-500 shadow-2xl hover:shadow-primary-500/10 relative"
                            >
                                <button
                                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            // Assume user is logged in for now, otherwise this might fail
                                            // In a real app we'd check redux auth state
                                            const token = JSON.parse(localStorage.getItem('user'))?.token;
                                            if (!token) {
                                                alert('Please login to wishlist');
                                                return;
                                            }
                                            const config = { headers: { Authorization: `Bearer ${token}` } };
                                            await axios.post(`http://localhost:5000/api/users/favorite/${event._id}`, {}, config);
                                            // UI Feedback - could update local state or just alert for MVP
                                            alert('Wishlist updated!');
                                        } catch (err) {
                                            alert('Failed to update wishlist');
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart hover:fill-red-500 hover:text-red-500 transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                </button>
                                <div className="h-48 bg-gradient-to-br from-slate-900 via-primary-900/20 to-slate-950 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/events/${event._id}`)}>
                                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="px-6 py-2 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full scale-90 group-hover:scale-100 transition-transform">
                                            Access Intellectual Data
                                        </span>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black text-primary-300 uppercase tracking-widest">
                                            {event.organizerClub?.name || 'Authorized'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8" onClick={() => navigate(`/events/${event._id}`)}>
                                    <h3 className="text-2xl font-black text-current mb-3 group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-1">{event.title}</h3>
                                    <p className="text-current opacity-40 text-sm mb-8 line-clamp-2 leading-relaxed italic">“{event.description}”</p>

                                    <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                                        <div className="flex items-center justify-between text-[11px] font-bold text-current opacity-40 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-primary-500" />
                                                <span className="text-current">{new Date(event.timeStart).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-secondary-500" />
                                                <span className="text-current">{new Date(event.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <MapPin size={16} className="text-gray-600" />
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
