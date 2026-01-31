import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Activity,
    Calendar,
    MapPin,
    Users,
    Share2,
    Heart,
    ChevronLeft,
    Clock,
    Tag,
    AlertCircle,
    CheckCircle,
    History,
    MessageSquare,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`, config);
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, user]);

    const handleJoin = async () => {
        setJoining(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/events/${id}/join`, {}, config);
            setEvent(prev => ({ ...prev, participants: [...prev.participants, user._id] }));
            setJoining(false);
        } catch (error) {
            alert('Failed to join');
            setJoining(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;
    if (!event) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest opacity-40">Protocol Data Not Found</div>;

    const isJoined = event.participants?.includes(user._id);

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            {/* Hero Image Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
                    className="w-full h-full object-cover"
                    alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-black/30" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-10 p-4 bg-[var(--input-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl text-current hover:bg-[var(--accent-color)] hover:text-white transition-all z-20 shadow-2xl"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 -mt-32 relative z-10 pb-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-12">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20">
                                    {event.status === 'published' ? 'Live Protocol' : 'Under Review'}
                                </span>
                                <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">ID: {event._id.slice(-8)}</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-black text-current mb-8 leading-none tracking-tighter uppercase">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap gap-8 py-8 border-y border-[var(--border-color)]">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[var(--input-bg)] rounded-xl text-primary-500"><Calendar size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-40">Date & Time</p>
                                        <p className="font-bold text-sm tracking-tight">{new Date(event.timeStart).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[var(--input-bg)] rounded-xl text-secondary-500"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-40">Location</p>
                                        <p className="font-bold text-sm tracking-tight">{event.venue}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[var(--input-bg)] rounded-xl text-indigo-500"><Users size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-40">Capacity</p>
                                        <p className="font-bold text-sm tracking-tight">{event.participants?.length || 0} Joined</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12">
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Protocol Description</h3>
                                <p className="text-current opacity-70 leading-relaxed text-lg max-w-3xl whitespace-pre-wrap font-medium">
                                    {event.description}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-12">
                                {event.tags?.map((tag, i) => (
                                    <span key={i} className="px-4 py-2 bg-[var(--input-bg)] rounded-xl text-[10px] font-bold text-current opacity-60 flex items-center gap-2">
                                        <Tag size={12} /> {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="space-y-8">
                        <section className="card-glass p-8 sticky top-28">
                            <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-primary-500" /> Actions
                            </h3>

                            {isJoined ? (
                                <div className="w-full py-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center gap-3 text-green-500 mb-6">
                                    <CheckCircle size={32} />
                                    <p className="font-black text-xs uppercase tracking-widest">Enrolled in Protocol</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    disabled={joining}
                                    className="btn-primary w-full py-5 font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-primary-500/20 mb-6 group"
                                >
                                    {joining ? 'Processing...' : (
                                        <>INITIALIZE ENROLLMENT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            )}

                            <button className="btn-glass w-full py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-current hover:text-[var(--bg-color)] transition-all">
                                <Share2 size={16} /> Broadcast Signal
                            </button>

                            {/* Lifecycle Visual */}
                            {event.eventLifecycle && event.eventLifecycle.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 flex items-center gap-2 text-center justify-center">
                                        <History size={14} /> Lifecycle Log
                                    </h3>
                                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                                        {event.eventLifecycle.map((step, idx) => (
                                            <div key={idx} className="relative pl-10">
                                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[var(--bg-color)] flex items-center justify-center shadow-lg ${step.status === 'published' ? 'bg-green-500' :
                                                    step.status === 'rejected' ? 'bg-red-500' :
                                                        step.status === 'submitted' ? 'bg-amber-500' : 'bg-primary-500'
                                                    }`}>
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-current opacity-80">{step.status}</span>
                                                    <span className="text-[8px] opacity-40 font-bold mb-2">{new Date(step.changedAt).toLocaleString()}</span>
                                                    {step.comment && (
                                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] opacity-60 italic leading-relaxed">
                                                            <MessageSquare size={10} className="inline mr-1 opacity-40" /> {step.comment}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                                <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest text-center">Organizing Unit</p>
                                <div className="flex items-center gap-4 p-4 bg-[var(--input-bg)] rounded-3xl border border-[var(--border-color)] group hover:border-primary-500/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg-color)] overflow-hidden ring-2 ring-primary-500/20 group-hover:scale-105 transition-transform border border-[var(--border-color)]">
                                        <img src={event.organizerClub?.logoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-current leading-tight">{event.organizerClub?.name || 'Scientific Society'}</p>
                                        <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest">Authorized Club</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
