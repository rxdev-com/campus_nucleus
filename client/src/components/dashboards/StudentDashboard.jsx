import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/events');
                setEvents(data.events);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events", error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="p-4 md:p-8 pt-28 max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200 mb-2">My Feed</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-white font-medium">{user.name}</span>.</p>
                </motion.div>
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                    <input type="text" placeholder="Search events..." className="input-field pl-12 w-full md:w-80 bg-slate-800/80 border-white/10 focus:border-primary-500/50" />
                </div>
            </header>

            {loading ? (
                <div className="text-white flex items-center gap-4">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading data stream...
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="card-glass group hover:shadow-primary-500/20"
                        >
                            <div className="h-48 bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay"></div>
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
                                        {event.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                                    <p className="text-primary-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
                                        {event.organizerClub?.name || 'Campus Event'}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">{event.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{event.description}</p>

                                <div className="space-y-3 text-sm text-gray-400 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                                            <Clock size={16} />
                                        </div>
                                        <span>{new Date(event.timeStart).toLocaleDateString()} @ {new Date(event.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary-500/10 rounded-lg text-secondary-400">
                                            <MapPin size={16} />
                                        </div>
                                        <span>{event.venue}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/events/${event._id}`)}
                                    className="btn-glass w-full text-sm py-3 border-white/10 hover:bg-white/10 hover:border-white/20"
                                >
                                    Register Interest
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
