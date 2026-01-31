import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Shield,
    Book,
    Globe,
    BarChart2,
    Server,
    Clock,
    Check,
    X,
    AlertTriangle,
    Activity,
    Users,
    TrendingUp,
    Zap,
    MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionModal, setRejectionModal] = useState({ show: false, eventId: null });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [analyticsRes, pendingRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/analytics', config),
                    axios.get('http://localhost:5000/api/events/pending', config)
                ]);
                setStats(analyticsRes.data);
                setPendingEvents(pendingRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [user]);

    const handleAction = async (id, status, reason = '') => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.patch(`http://localhost:5000/api/events/${id}/status`, {
                status,
                rejectionReason: reason
            }, config);
            setPendingEvents(pendingEvents.filter(e => e._id !== id));
            setRejectionModal({ show: false, eventId: null });
            setRejectionReason('');
        } catch (error) {
            alert('Action failed');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-12">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-2 text-primary-500 font-black text-xs uppercase tracking-[0.4em]">
                        <Shield size={14} /> Security Level: Root
                    </div>
                    <h1 className="text-6xl font-display font-black text-current mb-4 tracking-tighter uppercase leading-[0.9]">
                        Command <span className="text-primary-500">Console</span>
                    </h1>
                    <p className="text-current opacity-60 max-w-2xl font-medium">
                        Oversight of campus protocols, resource allocation, and authority management. All operations are logged.
                    </p>
                </motion.div>
            </header>

            {/* Real-time Stats Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatBox label="Active Personnel" value={stats?.counts?.users || '-'} icon={Users} trend="+12" color="blue" />
                <StatBox label="Live Protocols" value={stats?.counts?.events || '-'} icon={Zap} trend="+3" color="amber" />
                <StatBox label="Asset Reservations" value={stats?.counts?.bookings || '-'} icon={Server} trend="-2" color="purple" />
                <StatBox label="Organization Units" value={stats?.counts?.clubs || '-'} icon={Globe} trend="+1" color="green" />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Column 1: Pending Approvals (Priority) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black text-current flex items-center gap-3 uppercase tracking-tighter">
                            <Clock className="text-amber-500" /> Pending Approvals
                        </h2>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full">
                            {pendingEvents.length} Signals
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2].map(i => <div key={i} className="h-40 bg-[var(--input-bg)] animate-pulse rounded-3xl" />)}
                        </div>
                    ) : pendingEvents.length === 0 ? (
                        <div className="p-20 card-glass border-dashed text-center opacity-40 italic">
                            System state: Stable. No pending requests.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pendingEvents.map(event => (
                                <motion.div key={event._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                                    <div className="card-glass p-8 relative z-10">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-2 py-0.5 bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] font-black uppercase text-secondary-500">Event Protocol</span>
                                                    <span className="text-[10px] font-bold text-current opacity-40">ID: {event._id.slice(-8)}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-current mb-2 leading-tight">{event.title}</h3>
                                                <p className="text-sm text-primary-500 font-bold uppercase tracking-widest mb-4">Origin: {event.organizerClub?.name}</p>
                                                <p className="text-current opacity-60 text-sm line-clamp-2 max-w-xl">{event.description}</p>
                                            </div>
                                            <div className="flex flex-col gap-3 min-w-[160px]">
                                                <button onClick={() => handleAction(event._id, 'published')} className="w-full py-3 bg-primary-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary-600 transition font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20">
                                                    <Check size={16} /> Authorize
                                                </button>
                                                <button onClick={() => navigate(`/events/${event._id}`)} className="w-full py-2 bg-current opacity-[0.05] hover:opacity-100 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                                    View Details
                                                </button>
                                                <button onClick={() => setRejectionModal({ show: true, eventId: event._id })} className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition font-black text-xs uppercase tracking-widest border border-red-500/20">
                                                    <X size={16} /> Deny Access
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: System Health & Activity */}
                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-black text-current flex items-center gap-3 uppercase tracking-tighter mb-6">
                            <Activity className="text-primary-500" /> Protocol Velocity
                        </h2>
                        <div className="card-glass p-6 space-y-6">
                            {stats?.registrationTrends?.map((trend, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-current opacity-40">{trend._id}</span>
                                    <div className="flex-1 mx-4 h-1.5 bg-[var(--input-bg)] rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(trend.count / 10) * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-current">{trend.count}</span>
                                </div>
                            ))}
                            {!stats?.registrationTrends && <p className="text-xs opacity-50 italic">Sampling telemetry...</p>}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-current flex items-center gap-3 uppercase tracking-tighter mb-6">
                            <TrendingUp className="text-secondary-500" /> High Yield Units
                        </h2>
                        <div className="space-y-4">
                            {stats?.topEvents?.map((event, i) => (
                                <div key={i} className="p-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl flex items-center justify-between group hover:border-secondary-500/30 transition-all">
                                    <div>
                                        <p className="text-xs font-black text-current line-clamp-1">{event.title}</p>
                                        <p className="text-[10px] text-secondary-500 font-bold uppercase">{event.club}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-current">{event.participantCount}</p>
                                        <p className="text-[8px] opacity-40 font-bold uppercase">Nodes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectionModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setRejectionModal({ show: false, eventId: null })}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[var(--bg-color)] border border-[var(--border-color)] p-8 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-3xl"
                    >
                        <h3 className="text-2xl font-black text-current mb-2 uppercase tracking-tight">Security Intercept</h3>
                        <p className="text-current opacity-60 text-sm mb-8">Please provide a reason for denying this protocol deployment. The organizer will receive this signal.</p>

                        <textarea
                            className="input-field min-h-[150px] mb-6"
                            placeholder="Reason for rejection (e.g., Conflict with main auditorium booking, missing faculty signature...)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setRejectionModal({ show: false, eventId: null })}
                                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={() => handleAction(rejectionModal.eventId, 'rejected', rejectionReason)}
                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
                            >
                                Confirm Deny
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const StatBox = ({ label, value, icon: Icon, trend, color }) => {
    const colorClasses = {
        blue: 'text-blue-500 bg-blue-500/10',
        amber: 'text-amber-500 bg-amber-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
        green: 'text-green-500 bg-green-500/10'
    };

    return (
        <div className="card-glass p-6 relative overflow-hidden group">
            <div className={`p-3 rounded-xl w-fit mb-4 ${colorClasses[color]}`}>
                <Icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 mb-1">{label}</p>
            <div className="flex items-end gap-3">
                <h3 className="text-3xl font-black text-current">{value}</h3>
                <span className={`text-[10px] font-bold mb-1 ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {trend}
                </span>
            </div>
            <div className={`absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700`}>
                <Icon size={80} />
            </div>
        </div>
    );
};

export default AdminDashboard;
