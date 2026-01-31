import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Users,
    ChevronLeft,
    Globe,
    Calendar,
    ArrowRight,
    Star,
    Trophy,
    Shield,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const ClubDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [club, setClub] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [clubRes, eventsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/clubs/${id}`, config),
                    axios.get(`http://localhost:5000/api/events?club=${id}`, config)
                ]);
                setClub(clubRes.data);
                setEvents(eventsRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchClubData();
    }, [id, user]);

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary-500"></div></div>;
    if (!club) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest opacity-40">Club Registry Not Found</div>;

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            {/* Header / Banner */}
            <div className="relative h-[45vh] bg-[var(--input-bg)] overflow-hidden border-b border-[var(--border-color)]">
                {club.bannerUrl ? (
                    <img src={club.bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-[0.05] bg-grid-pattern"></div>
                        <div className="absolute -top-40 -left-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
                    </>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/20 to-transparent"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-10 p-4 bg-[var(--bg-color)]/20 backdrop-blur-xl border border-white/10 rounded-2xl text-current hover:bg-white/20 transition-all z-20 shadow-xl"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-40 h-40 rounded-[2.5rem] bg-[var(--input-bg)] border-4 border-white shadow-2xl overflow-hidden shrink-0">
                            <img src={club.logoUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400"} className="w-full h-full object-cover" alt="" />
                        </motion.div>
                        <div className="text-center md:text-left pb-4">
                            <h1 className="text-5xl md:text-7xl font-display font-black text-current tracking-tighter uppercase leading-none mb-4">{club.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/10">Official Branch</span>
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/10">{club.members?.length || 0} Members</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-20 relative -mt-5 z-20">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Sidebar: Club Info */}
                    <div className="space-y-8">
                        <section className="card-glass p-8">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">Leader Protocol</h3>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black">
                                    {club.leadOrganizer?.name?.charAt(0) || 'O'}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-current leading-tight">{club.leadOrganizer?.name || 'Authorized Lead'}</p>
                                    <p className="text-[10px] opacity-40 font-bold uppercase">Organizer</p>
                                </div>
                            </div>

                            {club.leadership && club.leadership.length > 0 && (
                                <div className="space-y-6 pt-4 border-t border-white/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Core Team</h4>
                                    <div className="space-y-4">
                                        {club.leadership.map((member, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-primary-400">
                                                    {member.user?.name?.charAt(0) || 'M'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-current">{member.user?.name || 'Authorized Member'}</p>
                                                    <p className="text-[8px] opacity-40 font-black uppercase tracking-wider">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 space-y-4 pt-6 border-t border-white/10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Channels</h4>
                                {club.socialMedia?.instagram && <a href={club.socialMedia.instagram} className="flex items-center gap-3 text-xs font-bold text-current opacity-60 hover:opacity-100 transition-opacity"><Globe size={16} /> Instagram</a>}
                                {club.socialMedia?.linkedin && <a href={club.socialMedia.linkedin} className="flex items-center gap-3 text-xs font-bold text-current opacity-60 hover:opacity-100 transition-opacity"><Globe size={16} /> LinkedIn</a>}
                                <a href={`mailto:${club.leadOrganizer?.email}`} className="flex items-center gap-3 text-xs font-bold text-current opacity-60 hover:opacity-100 transition-opacity"><Mail size={16} /> Signal Lead</a>
                            </div>
                        </section>

                        <section className="card-glass p-8 bg-indigo-500/5 border-indigo-500/20">
                            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Faculty Overseer</h3>
                            <p className="text-lg font-black text-current mb-1 uppercase tracking-tighter">{club.facultyCoordinator?.name || 'Directorate'}</p>
                            <p className="text-[9px] opacity-40 font-black uppercase tracking-widest">{club.facultyCoordinator?.email || 'OFFICIAL_CREDENTIALS_RESERVED'}</p>
                        </section>

                        <section className="card-glass p-8 bg-secondary-500/5 border-secondary-500/20">
                            <div className="flex items-center gap-3 mb-4 text-secondary-500">
                                <Shield size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">Active Standing</span>
                            </div>
                            <p className="text-2xl font-black text-current mb-1 uppercase tracking-tighter">Verified</p>
                            <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest">Last audit: Jan 2026</p>
                        </section>
                    </div>

                    {/* Main Section */}
                    <div className="lg:col-span-3 space-y-16">
                        {/* About */}
                        <section>
                            <h2 className="text-3xl font-black text-current mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                <Star className="text-secondary-500" /> Mission Dossier
                            </h2>
                            <p className="text-xl text-current opacity-70 leading-relaxed font-medium max-w-4xl">
                                {club.description}
                                {"\n\n"}
                                We are committed to fostering a culture of technical excellence and creative exploration within the campus ecosystem. Our members collaborate on high-impact protocols that bridge the gap between academic theory and industry reality.
                            </p>
                        </section>

                        {/* Event Feed */}
                        <section>
                            <div className="flex justify-between items-end mb-10">
                                <h2 className="text-3xl font-black text-current flex items-center gap-4 uppercase tracking-tighter">
                                    <Calendar className="text-primary-500" /> Recent Operations
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {events.length > 0 ? events.map(event => (
                                    <div
                                        key={event._id}
                                        onClick={() => navigate(`/events/${event._id}`)}
                                        className="card-glass p-6 group cursor-pointer hover:border-primary-500/30 transition-all"
                                    >
                                        <div className="h-40 bg-[var(--bg-color)] rounded-2xl mb-6 overflow-hidden relative border border-[var(--border-color)]">
                                            <img src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-2 py-0.5 bg-primary-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary-500/20">ACTIVE</span>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-current mb-2 leading-tight uppercase group-hover:text-primary-400 transition-colors">{event.title}</h4>
                                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-6">{new Date(event.timeStart).toLocaleDateString()}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">View Protocol</span>
                                            <ArrowRight size={16} className="text-primary-500 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 p-20 card-glass border-dashed border-2 text-center opacity-30 italic rounded-[3rem]">
                                        No active protocols reported in this sector.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetailsPage;
