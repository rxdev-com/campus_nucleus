import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, Star, Zap, Clock, ArrowRight, CheckCircle, Activity, Layout, Heart, Globe, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ParticipantDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ upcoming: [], joined: 0, points: 450 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [myEventsRes, allEventsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/events/my', config),
                    axios.get('http://localhost:5000/api/events?limit=2', config)
                ]);
                setStats(prev => ({
                    ...prev,
                    joined: myEventsRes.data.length,
                    upcoming: allEventsRes.data || []
                }));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20 shadow-sm shadow-primary-500/10">
                            Student Life
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            <Sparkles size={12} /> Pro-Member
                        </span>
                    </div>
                    <h1 className="text-6xl font-display font-black text-current mb-2 tracking-tighter leading-none">
                        Student <span className="text-secondary-400">Hub</span>
                    </h1>
                    <p className="text-current opacity-60 font-medium">Welcome back, <span className="text-primary-400 font-bold">{user.name}</span>. Your campus journey is live and active.</p>
                </motion.div>
                <Link to="/events" className="btn-primary px-8 py-4 font-black flex items-center gap-2 shadow-2xl shadow-primary-500/20 group">
                    EXPLORE FEED <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <ParticipantStatCard label="Activity Points" value={stats.points} icon={Zap} color="primary" subtext="Top 10% in CSE Dept" />
                <ParticipantStatCard label="Events Joined" value={stats.joined} icon={Calendar} color="secondary" sublink="/my-events" sublinkText="View History" />
                <ParticipantStatCard label="Clubs Active" value="4" icon={Globe} color="current" sublink="/my-clubs" sublinkText="My Societies" />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content: Recommendations */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl font-black text-current flex items-center gap-4 uppercase tracking-tighter">
                        <Star className="text-amber-400 fill-amber-400" /> Curated Protocol Feed
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {stats.upcoming.length > 0 ? stats.upcoming.map((event, i) => (
                            <RecommendationCard
                                key={event._id}
                                id={event._id}
                                title={event.title}
                                club={event.organizerClub?.name || 'Authorized Club'}
                                time={new Date(event.timeStart).toLocaleString()}
                                img={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                                onClick={() => navigate(`/events/${event._id}`)}
                            />
                        )) : (
                            <div className="col-span-2 p-10 card-glass border-dashed text-center opacity-40">
                                No new protocols detected.
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Panel: Signals */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-current flex items-center gap-4 uppercase tracking-tighter">
                        <Layout className="text-current opacity-40" /> Signal Feed
                    </h2>
                    <div className="space-y-4">
                        <SignalItem text="Your request for Coding Club has been approved." time="2h ago" type="success" />
                        <SignalItem text="New Event: AI Hackathon 2026 is now live." time="5h ago" type="info" />
                        <SignalItem text="Reminder: Music Fest starts in 2 days." time="1d ago" type="warning" />
                        <Link to="/notifications" className="block text-center py-4 text-[10px] font-black uppercase text-primary-400 tracking-[0.3em] hover:text-current transition-colors border border-dashed border-[var(--border-color)] rounded-2xl">
                            Enter Signal Matrix
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ParticipantStatCard = ({ label, value, icon: Icon, color, subtext, sublink, sublinkText }) => (
    <div className="card-glass p-8 relative overflow-hidden group hover:border-current/20 transition-all">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700`}>
            <Icon size={100} />
        </div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${color === 'primary' ? 'text-primary-400' : color === 'secondary' ? 'text-secondary-400' : 'text-current opacity-50'}`}>
            {label}
        </p>
        <h3 className="text-5xl font-black text-current mb-4">{value}</h3>
        {subtext && (
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                <CheckCircle size={14} /> {subtext}
            </div>
        )}
        {sublink && (
            <Link to={sublink} className="text-xs font-bold text-current opacity-60 hover:opacity-100 hover:underline flex items-center gap-1 transition-all">
                {sublinkText} <ArrowRight size={14} />
            </Link>
        )}
    </div>
);

const RecommendationCard = ({ title, club, time, img, onClick }) => (
    <motion.div
        whileHover={{ y: -8 }}
        onClick={onClick}
        className="card-glass p-6 group cursor-pointer border-transparent hover:border-primary-500/30 transition-all bg-[var(--card-bg)] shadow-xl shadow-black/5"
    >
        <div className="h-48 bg-[var(--bg-color)] rounded-3xl mb-6 overflow-hidden relative shadow-lg border border-[var(--border-color)]">
            <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" alt="Event" />
            <div className="absolute top-4 left-4">
                <button className="p-2 bg-[var(--bg-color)]/30 backdrop-blur-md rounded-xl text-current hover:text-red-500 transition-colors">
                    <Heart size={18} />
                </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 bg-primary-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xl shadow-primary-500/20">
                    Featured
                </span>
            </div>
        </div>
        <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">{club}</p>
        <h4 className="text-xl font-black text-current mb-3 group-hover:text-primary-500 transition-colors leading-tight">{title}</h4>
        <div className="flex items-center gap-3 text-xs text-current opacity-40 font-bold uppercase tracking-widest bg-[var(--input-bg)] w-fit px-3 py-1 rounded-lg">
            <Clock size={14} /> {time}
        </div>
    </motion.div>
);

const SignalItem = ({ text, time, type }) => {
    const borders = {
        success: 'border-l-green-400',
        info: 'border-l-blue-400',
        warning: 'border-l-amber-400',
        error: 'border-l-red-400'
    };
    return (
        <div className={`p-4 bg-[var(--input-bg)]/50 border border-[var(--border-color)] border-l-4 ${borders[type]} rounded-2xl hover:bg-opacity-80 transition-colors cursor-pointer group`}>
            <p className="text-sm text-current opacity-80 mb-2 leading-tight group-hover:opacity-100 transition-opacity font-medium">{text}</p>
            <p className="text-[9px] font-black text-current opacity-30 uppercase tracking-[0.2em]">{time}</p>
        </div>
    );
};

export default ParticipantDashboard;
