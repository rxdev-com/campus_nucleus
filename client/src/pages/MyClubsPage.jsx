import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Search, Plus, Check, X, ArrowRight, User, Globe, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyClubsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/clubs');
                setClubs(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const handleJoin = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/clubs/${id}/join`, {}, config);
            setClubs(clubs.map(c => c._id === id ? { ...c, members: [...(c.members || []), user._id] } : c));
        } catch (error) {
            alert(error.response?.data?.message || 'Join failed');
        }
    };

    const handleLeave = async (id) => {
        if (!window.confirm('Leave this society?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/clubs/${id}/leave`, config);
            setClubs(clubs.map(c => c._id === id ? { ...c, members: c.members.filter(m => m !== user._id) } : c));
        } catch (error) {
            alert('Leave failed');
        }
    };

    const filteredClubs = clubs.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isMember = (club) => club.members?.includes(user?._id);

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-6xl font-display font-black text-current mb-2 tracking-tighter">The Registry</h1>
                    <p className="text-current opacity-60">Join elite campus societies and govern your memberships.</p>
                </motion.div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-purple-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Scan for societies..."
                        className="input-field pl-12 bg-transparent border-[var(--border-color)] focus:border-purple-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center uppercase font-black text-gray-500 tracking-[0.3em] animate-pulse">Syncing Social Layer...</div>
                ) : (
                    <AnimatePresence>
                        {filteredClubs.map((club, idx) => (
                            <motion.div
                                key={club._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`card-glass p-8 group transition-all duration-500 hover:-translate-y-2 border-white/5 ${isMember(club) ? 'border-purple-500/30 bg-purple-500/5' : 'hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${isMember(club) ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-lg shadow-purple-500/20' : 'bg-current opacity-[0.05] text-current opacity-60 border-[var(--border-color)]'}`}>
                                        <Shield size={32} />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-current opacity-40">Founded by</span>
                                        <span className="text-xs text-current font-bold">{club.leadOrganizer?.name || 'Authorized Lead'}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-current mb-4 group-hover:text-purple-300 transition-colors uppercase tracking-tight">{club.name}</h3>
                                <p className="text-sm text-current opacity-60 leading-relaxed mb-8 h-20 line-clamp-3">{club.description}</p>

                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--border-color)]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-current opacity-40">Members</span>
                                        <span className="text-current font-bold">{club.members?.length || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-current opacity-40">Status</span>
                                        <span className={isMember(club) ? "text-purple-400 font-bold" : "text-current opacity-40 font-bold"}>{isMember(club) ? 'ENROLLED' : 'DISCONNECTED'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {isMember(club) ? (
                                        <button
                                            onClick={() => handleLeave(club._id)}
                                            className="flex-1 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Eject Policy
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleJoin(club._id)}
                                            className="flex-1 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 flex justify-center items-center gap-2 group/btn"
                                        >
                                            Connect Signal <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
                                        </button>
                                    )}
                                    <button className="p-4 bg-current opacity-[0.05] hover:opacity-10 rounded-xl text-current opacity-60 border border-[var(--border-color)] transition-all">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default MyClubsPage;
