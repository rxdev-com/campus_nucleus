import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Lock, Save, Shield, Bell, Moon, Sun, Monitor, Check, Globe, Info } from 'lucide-react';
import axios from 'axios';

import { updateProfile, reset } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { theme, setTheme } = useTheme();
    const { user, isSuccess, isError, message } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        department: user?.department || '',
        year: user?.year || '',
        avatarUrl: user?.avatarUrl || '',
        bio: user?.bio || '',
        socialLinks: {
            github: user?.socialLinks?.github || '',
            linkedin: user?.socialLinks?.linkedin || '',
            twitter: user?.socialLinks?.twitter || '',
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (isSuccess) {
            setStatus({ type: 'success', message: 'Identity parameters synchronized!' });
            dispatch(reset());
        }
        if (isError) {
            setStatus({ type: 'error', message: message });
            dispatch(reset());
        }
    }, [isSuccess, isError, message, dispatch]);

    const handleChange = (e) => {
        if (e.target.name.startsWith('social_')) {
            const platform = e.target.name.split('_')[1];
            setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, [platform]: e.target.value }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            setStatus({ type: 'loading', message: 'Uploading identity visual...' });
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/upload', formDataUpload, config);
            setFormData({ ...formData, avatarUrl: `http://localhost:5000${data.url}` });
            setStatus({ type: 'success', message: 'Visual uploaded! Sync metadata to save.' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Upload failed.' });
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Syncing profile with the nucleus...' });
        dispatch(updateProfile(formData));
    };

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-5xl mx-auto">
            <header className="mb-12">
                <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight uppercase">Control Center</h1>
                <p className="text-current opacity-60">Configure your campus presence and system credentials.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    <NavItem icon={User} label="General Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <NavItem icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                    <NavItem icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                    <NavItem icon={Monitor} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-8">
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-current mb-8 flex items-center gap-2">
                                <User className="text-primary-400" /> Identity Matrix
                            </h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                {/* Profile Picture Section */}
                                <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-current opacity-[0.02] rounded-2xl border border-[var(--border-color)]">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-2xl bg-[var(--input-bg)] flex items-center justify-center text-3xl font-black text-current border-2 border-primary-500 overflow-hidden shadow-2xl shadow-primary-500/20">
                                            {formData.avatarUrl ? (
                                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : user?.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-50 ml-1">Avatar Signal (Local File or URL)</label>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input
                                                type="file"
                                                id="avatar-upload"
                                                className="hidden"
                                                onChange={handleUpload}
                                            />
                                            <label htmlFor="avatar-upload" className="btn-glass px-6 py-3 text-[10px] font-black cursor-pointer border-current opacity-30 hover:opacity-100 uppercase tracking-widest whitespace-nowrap text-center">
                                                Select File
                                            </label>
                                            <div className="flex-1 relative">
                                                <input
                                                    name="avatarUrl"
                                                    value={formData.avatarUrl}
                                                    onChange={handleChange}
                                                    className="input-field w-full"
                                                    placeholder="Or paste URL here..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Full Identity</label>
                                        <input name="name" value={formData.name} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Unit / Department</label>
                                        <input name="department" value={formData.department} onChange={handleChange} className="input-field" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Biographical Protocol</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="input-field min-h-[100px]"
                                        placeholder="A short briefing about your campus mission..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Cycle Year</label>
                                        <select name="year" value={formData.year} onChange={handleChange} className="input-field bg-[var(--input-bg)] text-current">
                                            <option value="FY">First Year</option>
                                            <option value="SY">Second Year</option>
                                            <option value="TY">Third Year</option>
                                            <option value="Final Year">Final Year</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Social Links Section */}
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-current opacity-40 flex items-center gap-2">
                                        <Globe size={14} /> Social Frequency
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <input name="social_github" value={formData.socialLinks.github} onChange={handleChange} className="input-field pl-12 text-xs" placeholder="GitHub" />
                                            <div className="absolute left-4 top-4 text-current opacity-40"><Globe size={16} /></div>
                                        </div>
                                        <div className="relative">
                                            <input name="social_linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} className="input-field pl-12 text-xs" placeholder="LinkedIn" />
                                            <div className="absolute left-4 top-4 text-current opacity-40"><Globe size={16} /></div>
                                        </div>
                                        <div className="relative">
                                            <input name="social_twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="input-field pl-12 text-xs" placeholder="Twitter" />
                                            <div className="absolute left-4 top-4 text-current opacity-40"><Globe size={16} /></div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-black shadow-2xl shadow-primary-500/20 uppercase text-xs tracking-widest">
                                    <Save size={18} /> Sync Metadata
                                </button>
                                {status.message && (
                                    <p className={`text-center text-[10px] font-black uppercase tracking-widest p-3 rounded-lg ${status.type === 'error' ? 'bg-red-500/10 text-red-400' : status.type === 'loading' ? 'bg-primary-500/10 text-primary-400 animate-pulse' : 'bg-green-500/10 text-green-400'}`}>
                                        {status.message}
                                    </p>
                                )}
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-current mb-8 flex items-center gap-2">
                                <Lock className="text-amber-400" /> Security Protocol
                            </h2>
                            <div className="space-y-6 text-sm">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Current Validation Password</label>
                                    <input type="password" name="currentPassword" onChange={handleChange} className="input-field" placeholder="••••••••" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">New Access Signal</label>
                                        <input type="password" name="newPassword" onChange={handleChange} className="input-field" placeholder="New Password" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-current opacity-40 ml-1">Re-Verify Signal</label>
                                        <input type="password" name="confirmPassword" onChange={handleChange} className="input-field" placeholder="Confirm Password" />
                                    </div>
                                </div>
                                <button className="btn-glass w-full py-4 font-black border-current opacity-20 hover:opacity-100 uppercase text-xs tracking-[0.3em]">
                                    Push Security Update
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center card-glass">
                            <Bell className="mx-auto text-primary-500/40 mb-4 animate-bounce" size={48} />
                            <p className="text-current opacity-40 font-black uppercase tracking-widest text-sm">Notification Engine Active</p>
                        </motion.div>
                    )}

                    {activeTab === 'appearance' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass p-8">
                            <h2 className="text-2xl font-bold text-current mb-8 flex items-center gap-2">
                                <Monitor className="text-indigo-400" /> System Appearance
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all text-left overflow-hidden group ${theme === 'dark' ? 'border-primary-500 bg-primary-500/10' : 'border-[var(--border-color)] bg-transparent hover:border-primary-500/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-primary-500 text-white' : 'bg-[var(--input-bg)] text-current opacity-40'}`}>
                                            <Moon size={24} />
                                        </div>
                                        {theme === 'dark' && <Check size={20} className="text-primary-500" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-current mb-1">Vibrant Dark</h3>
                                    <p className="text-xs text-current opacity-50">Premium slate-950 core with neon primary accents. Optimized for low-light environments.</p>

                                    {/* Preview Dots */}
                                    <div className="flex gap-2 mt-4">
                                        <div className="w-4 h-4 rounded-full bg-slate-950 border border-white/10"></div>
                                        <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                                        <div className="w-4 h-4 rounded-full bg-secondary-500"></div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setTheme('light')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all text-left overflow-hidden group ${theme === 'light' ? 'border-[#ff4d4d] bg-[#ff4d4d]/5' : 'border-[var(--border-color)] bg-transparent hover:border-[#ff4d4d]/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl ${theme === 'light' ? 'bg-[#ff4d4d] text-white' : 'bg-[var(--input-bg)] text-current opacity-40'}`}>
                                            <Sun size={24} />
                                        </div>
                                        {theme === 'light' && <Check size={20} className="text-[#ff4d4d]" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Premium Light</h3>
                                    <p className="text-xs text-gray-500">Warm white surface with Zomato-inspired red accents. Clean, vibrant, and highly readable.</p>

                                    {/* Preview Dots */}
                                    <div className="flex gap-2 mt-4">
                                        <div className="w-4 h-4 rounded-full bg-white border border-black/5"></div>
                                        <div className={`w-4 h-4 rounded-full bg-[#ff4d4d]`}></div>
                                        <div className={`w-4 h-4 rounded-full bg-[#ff8c42]`}></div>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-10 p-6 bg-current opacity-[0.02] rounded-2xl border border-[var(--border-color)] italic text-xs text-current opacity-50 flex items-center gap-3">
                                <Info size={16} className="text-secondary-500 shrink-0" />
                                Appearance updates are applied immediately across all synchronized client nodes in the nucleus.
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold uppercase text-[10px] tracking-widest ${active ? 'bg-primary-500 text-white shadow-lg' : 'text-current opacity-40 hover:bg-white/5 hover:opacity-100'}`}>
        <Icon size={20} />
        {label}
    </button>
);

export default SettingsPage;
