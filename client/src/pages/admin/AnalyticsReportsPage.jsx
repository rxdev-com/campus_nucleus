import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Calendar, Download, Filter, PieChart, Activity, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const AnalyticsReportsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/analytics', config);
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-current opacity-40 font-black uppercase tracking-[0.3em]">Processing Big Data...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight">Intelligence Dashboard</h1>
                    <p className="text-current opacity-40">Real-time metrics, growth trends, and engagement telemetry.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-glass px-6 py-3 flex items-center gap-2 border-[var(--border-color)] hover:border-primary-500/50">
                        <Filter size={18} /> Time Filter
                    </button>
                    <button className="btn-primary px-8 py-3 flex items-center gap-2 font-black shadow-xl shadow-primary-500/20">
                        <Download size={18} /> Export Intel (CSV)
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KPICard label="Total Citizens" value={data.counts.users} trend="+12%" icon={Users} color="text-primary-400" bg="bg-primary-500/10" />
                <KPICard label="Active Protocols" value={data.counts.events} trend="+5.4%" icon={Calendar} color="text-secondary-400" bg="bg-secondary-500/10" />
                <KPICard label="Nodes Occupied" value={data.counts.bookings} trend="-2%" icon={Activity} color="text-green-400" bg="bg-green-500/10" trendDown />
                <KPICard label="Founded Units" value={data.counts.clubs} trend="+1" icon={BarChart2} color="text-amber-400" bg="bg-amber-500/10" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Distribution Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-8">
                    <h3 className="text-xl font-black text-current mb-8 border-b border-[var(--border-color)] pb-4 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="text-secondary-500" size={20} /> Deployment Distribution
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <Pie
                            data={{
                                labels: data.eventsByStatus.map(s => s._id.toUpperCase()),
                                datasets: [{
                                    data: data.eventsByStatus.map(s => s.count),
                                    backgroundColor: ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
                                    borderWidth: 0,
                                }]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            font: { size: 10, weight: 'bold' },
                                            usePointStyle: true
                                        }
                                    }
                                },
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </motion.div>

                {/* Top Engagement */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-8">
                    <h3 className="text-xl font-black text-current mb-8 border-b border-[var(--border-color)] pb-4 uppercase tracking-widest flex items-center gap-2">
                        <Star className="text-amber-500" size={20} /> High Engagement Nodes
                    </h3>
                    <div className="space-y-4 max-h-[256px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.topEvents.map((e, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-[var(--input-bg)] rounded-2xl border border-[var(--border-color)] hover:border-primary-500/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--bg-color)] rounded-xl flex items-center justify-center text-primary-500 font-bold border border-[var(--border-color)] group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="text-current font-bold text-sm truncate max-w-[150px]">{e.title}</p>
                                        <p className="text-[10px] text-current opacity-40 uppercase font-black tracking-widest">{e.club}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary-500 font-black text-lg leading-none">{e.participantCount}</p>
                                    <p className="text-[9px] text-current opacity-40 uppercase font-bold">Interests</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Registration Trends */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-8">
                <h3 className="text-xl font-black text-current mb-8 border-b border-[var(--border-color)] pb-4 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="text-green-500" size={20} /> Network Growth Signatures (7D)
                </h3>
                <div className="h-64">
                    <Line
                        data={{
                            labels: data.registrationTrends.map(t => t._id.split('-').slice(1).join('/')),
                            datasets: [{
                                label: 'New Citizens',
                                data: data.registrationTrends.map(t => t.count),
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: '#3b82f6',
                                borderWidth: 3
                            }]
                        }}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                    ticks: { color: 'rgba(255, 255, 255, 0.3)' }
                                },
                                x: {
                                    grid: { display: false },
                                    ticks: { color: 'rgba(255, 255, 255, 0.3)' }
                                }
                            },
                            plugins: {
                                legend: { display: false }
                            },
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

const KPICard = ({ label, value, trend, icon: Icon, color, bg, trendDown }) => (
    <motion.div whileHover={{ y: -5 }} className="card-glass p-6 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${bg} ${color} shadow-lg transition-transform group-hover:scale-110`}>
                <Icon size={24} />
            </div>
            <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${trendDown ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {trendDown ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />} {trend}
            </div>
        </div>
        <h4 className="text-3xl font-black text-current mb-1 tracking-tight">{value}</h4>
        <p className="text-[10px] font-black text-current opacity-40 uppercase tracking-[0.2em]">{label}</p>
    </motion.div>
);


export default AnalyticsReportsPage;
