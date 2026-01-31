import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    Plus,
    Clock,
    CheckCircle,
    FileText,
    XCircle,
    Users,
    Layers,
    Calendar,
    Briefcase,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrganizerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/events/my', config);
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchMyEvents();
    }, [user]);

    const drafts = events.filter(e => e.status === 'draft');
    const pending = events.filter(e => e.status === 'submitted');
    const published = events.filter(e => e.status === 'published');
    const rejected = events.filter(e => e.status === 'rejected');

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-secondary-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Briefcase size={14} /> Protocol Officer Session
                    </div>
                    <h1 className="text-5xl font-display font-black text-current mb-3 tracking-tighter uppercase leading-[0.9]">
                        Organizer <span className="text-secondary-500">Hub</span>
                    </h1>
                    <p className="text-current opacity-60 font-medium">
                        Managing operations for <span className="text-secondary-500 font-bold">{user.managedClubs?.length || 0} registered societies</span>.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/events/create')}
                    className="btn-primary px-8 py-4 font-black flex items-center gap-2 shadow-2xl shadow-primary-500/20 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    NEW PROTOCOL
                </button>
            </header>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <MetricCard label="Active Drafts" count={drafts.length} color="gray" icon={FileText} />
                <MetricCard label="Awaiting Approval" count={pending.length} color="amber" icon={Clock} />
                <MetricCard label="Published Live" count={published.length} color="green" icon={CheckCircle} />
                <MetricCard label="Needs Attention" count={rejected.length} color="red" icon={XCircle} />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Protocol Pipeline */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Drafts Section */}
                    <section>
                        <h2 className="text-2xl font-black text-current mb-6 flex items-center gap-3 uppercase tracking-tighter">
                            <Layers className="text-current opacity-40" /> Active Drafts
                        </h2>
                        {drafts.length === 0 ? (
                            <div className="p-12 card-glass border-dashed text-center opacity-40 italic rounded-[2rem]">
                                No protocols in development phase.
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {drafts.map(event => (
                                    <motion.div key={event._id} whileHover={{ y: -5 }} className="card-glass p-8 border-t-4 border-t-gray-500">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-black text-current leading-tight">{event.title}</h3>
                                            <span className="text-[10px] font-bold opacity-30">DRAFT</span>
                                        </div>
                                        <p className="text-sm text-current opacity-60 mb-6 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Calendar size={14} />
                                                <span className="text-[10px] font-bold">{new Date(event.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <button onClick={() => navigate(`/events/${event._id}/edit`)} className="text-xs font-black text-primary-500 hover:text-current transition-colors flex items-center gap-1 uppercase tracking-widest">
                                                RESUME <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Pending Section */}
                    {pending.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-current mb-6 flex items-center gap-3 uppercase tracking-tighter">
                                <Clock className="text-amber-500" /> Under Review
                            </h2>
                            <div className="space-y-4">
                                {pending.map(event => (
                                    <div key={event._id} className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex justify-between items-center group hover:bg-amber-500/10 transition-all">
                                        <div>
                                            <h3 className="text-lg font-black text-current">{event.title}</h3>
                                            <p className="text-xs text-amber-500/70 font-bold uppercase tracking-widest">Submitted to Administration</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold opacity-40 italic">Queued since {new Date(event.updatedAt).toLocaleDateString()}</span>
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Rejected Section */}
                    {rejected.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-current mb-6 flex items-center gap-3 uppercase tracking-tighter">
                                <AlertCircle className="text-red-500" /> Needs Attention
                            </h2>
                            <div className="space-y-6">
                                {rejected.map(event => (
                                    <div key={event._id} className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] group hover:bg-red-500/10 transition-all">
                                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                            <div>
                                                <h3 className="text-xl font-black text-current mb-2">{event.title}</h3>
                                                <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">Protocol Denied by Administration</p>
                                            </div>
                                            <button onClick={() => navigate(`/events/${event._id}/edit`)} className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all">
                                                Repair Protocol
                                            </button>
                                        </div>
                                        {event.eventLifecycle?.slice(-1)[0]?.comment && (
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm opacity-60 italic relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                                " {event.eventLifecycle.slice(-1)[0].comment} "
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Component */}
                <div className="space-y-8">
                    <section className="card-glass p-8 bg-primary-500/5 border-primary-500/20">
                        <h3 className="text-lg font-black text-current mb-4 uppercase tracking-tighter">Internal Assets</h3>
                        <p className="text-sm text-current opacity-60 mb-6 leading-relaxed">
                            Reserve campus labs, auditoriums, and equipment for your upcoming protocols.
                        </p>
                        <Link to="/bookings" className="btn-glass w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
                            Access Inventory <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </section>

                    <section className="card-glass p-8">
                        <h3 className="text-lg font-black text-current mb-4 uppercase tracking-tighter">Club Authority</h3>
                        <div className="space-y-4">
                            {user.managedClubs?.map((club, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-[var(--input-bg)] rounded-xl border border-[var(--border-color)]">
                                    <div className="w-10 h-10 rounded-lg bg-secondary-500/10 flex items-center justify-center text-secondary-500">
                                        <Users size={18} />
                                    </div>
                                    <span className="text-xs font-black text-current uppercase tracking-tight">{club.name || 'Scientific Society'}</span>
                                </div>
                            )) || <p className="text-xs opacity-40 italic">No clubs assigned.</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, count, color, icon: Icon }) => {
    const variants = {
        gray: 'bg-gray-500/10 text-gray-500',
        amber: 'bg-amber-500/10 text-amber-500',
        green: 'bg-green-500/10 text-green-500',
        red: 'bg-red-500/10 text-red-500'
    };

    return (
        <div className="card-glass p-6 text-center group hover:border-current/20 transition-all">
            <div className={`p-3 rounded-2xl w-fit mx-auto mb-3 ${variants[color]}`}>
                <Icon size={20} />
            </div>
            <h4 className="text-3xl font-black text-current mb-1">{count}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-current opacity-40">{label}</p>
        </div>
    );
};

export default OrganizerDashboard;
