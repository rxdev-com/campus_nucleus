import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Briefcase, GraduationCap, Shield, Calendar, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useSelector((state) => state.auth);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (id) {
                try {
                    const config = { headers: { Authorization: `Bearer ${authUser.token}` } };
                    const { data } = await axios.get(`http://localhost:5000/api/users/${id}`, config);
                    setProfileUser(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setProfileUser(authUser);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id, authUser]);

    if (loading) return <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-current italic">Syncing Profile...</div>;
    if (!profileUser) return <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">User Not Found</div>;

    const isOwnProfile = !id || id === authUser?._id;
    const displayUser = profileUser;

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-[var(--bg-color)] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-glass overflow-hidden border-[var(--border-color)] shadow-2xl"
                >
                    {/* Cover Area */}
                    <div className="h-64 bg-gradient-to-br from-primary-500/20 via-primary-500/5 to-transparent relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--bg-color)] to-transparent"></div>

                        {/* Profile Photo */}
                        <div className="absolute -bottom-16 left-12">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                                className="w-40 h-40 rounded-3xl bg-[var(--input-bg)] border-4 border-[var(--bg-color)] shadow-2xl overflow-hidden flex items-center justify-center text-5xl font-black text-current"
                            >
                                {displayUser.avatarUrl ? (
                                    <img src={displayUser.avatarUrl} alt={displayUser.name} className="w-full h-full object-cover" />
                                ) : displayUser.name.charAt(0)}
                            </motion.div>
                        </div>
                    </div>

                    <div className="pt-24 pb-12 px-12">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h1 className="text-5xl font-display font-black text-current tracking-tighter uppercase">{displayUser.name}</h1>
                                    <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg text-primary-400 text-[10px] font-black uppercase tracking-widest">
                                        {displayUser.role}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-current opacity-50 text-xs font-bold uppercase tracking-widest mt-4">
                                    <span className="flex items-center gap-2 bg-current opacity-[0.05] px-3 py-1.5 rounded-lg border border-white/10"><Mail size={14} className="text-primary-400" /> {displayUser.email}</span>
                                    <span className="flex items-center gap-2 bg-current opacity-[0.05] px-3 py-1.5 rounded-lg border border-white/10"><GraduationCap size={14} className="text-indigo-400" /> {displayUser.department || 'General Registry'}</span>
                                    {displayUser.enrollmentId && <span className="flex items-center gap-2 bg-current opacity-[0.05] px-3 py-1.5 rounded-lg border border-white/10"><Shield size={14} className="text-amber-400" /> {displayUser.enrollmentId}</span>}
                                    {displayUser.contact && <span className="flex items-center gap-2 bg-current opacity-[0.05] px-3 py-1.5 rounded-lg border border-white/10"><Globe size={14} className="text-green-400" /> {displayUser.contact}</span>}
                                </div>

                                {displayUser.bio && (
                                    <p className="mt-8 text-current opacity-60 leading-relaxed max-w-2xl italic border-l-2 border-primary-500/30 pl-6">
                                        “{displayUser.bio}”
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 min-w-[200px]">
                                {isOwnProfile ? (
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="btn-primary py-4 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20"
                                    >
                                        Modify Identity
                                    </button>
                                ) : (
                                    <button
                                        className="btn-primary py-4 font-black text-xs uppercase tracking-widest border border-white/10 hover:border-primary-500/30"
                                        onClick={() => alert('Interaction logged. Signal broadcast to buddy.')}
                                    >
                                        Connect with Buddy
                                    </button>
                                )}
                                <div className="flex justify-center gap-4">
                                    {displayUser.socialLinks?.github && <a href={displayUser.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 bg-current opacity-[0.05] hover:opacity-100 rounded-xl text-current transition-all"><Globe size={20} /></a>}
                                    {displayUser.socialLinks?.linkedin && <a href={displayUser.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-current opacity-[0.05] hover:opacity-100 rounded-xl text-current transition-all"><Globe size={20} /></a>}
                                    {displayUser.socialLinks?.twitter && <a href={displayUser.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 bg-current opacity-[0.05] hover:opacity-100 rounded-xl text-current transition-all"><Globe size={20} /></a>}
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-[var(--border-color)]">
                            <ProfileStat label="Cycle Year" value={displayUser.year || 'N/A'} icon={Calendar} color="text-amber-400" />
                            <ProfileStat label="Deployments" value={displayUser.managedClubs?.length || 0} icon={Briefcase} color="text-primary-400" />
                            <ProfileStat label="Active Links" value={displayUser.joinedClubs?.length || 0} icon={Users} color="text-indigo-400" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const ProfileStat = ({ label, value, icon: Icon, color }) => (
    <div className="bg-current opacity-[0.03] p-6 rounded-2xl border border-[var(--border-color)] hover:border-primary-500/30 transition-all group text-center">
        <div className={`p-3 rounded-xl bg-[var(--input-bg)] mb-4 inline-block ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
        </div>
        <p className="text-[10px] font-black uppercase text-current opacity-40 tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black text-current uppercase">{value}</p>
    </div>
);

// Re-used motion component logic below

const ProfileItem = ({ icon: Icon, label, value, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay || 0 }}
        className="flex items-center gap-4 p-4 bg-current opacity-[0.03] rounded-xl border border-[var(--border-color)] hover:bg-current hover:opacity-[0.05] transition-colors"
    >
        <div className="p-2 bg-[var(--input-bg)] rounded-lg text-primary-400">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-current opacity-40 uppercase font-bold">{label}</p>
            <p className="text-current font-medium">{value}</p>
        </div>
    </motion.div>
);

export default ProfilePage;
