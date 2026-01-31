import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { UserX, UserCheck, Search, Edit3 } from 'lucide-react';
import axios from 'axios';

const UserManagementPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/auth/users', config);
                setUsers(data);
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/auth/users/${userId}/role`, { role: newRole }, config);
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch {
            alert('Role update failed');
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.patch(`http://localhost:5000/api/auth/users/${userId}/status`, {}, config);
            setUsers(users.map(u => u._id === userId ? { ...u, isActive: data.isActive } : u));
        } catch {
            alert('Status toggle failed');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight">Authority Hub</h1>
                    <p className="text-current opacity-60">Manage citizenship and permissions across the nucleus.</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by identity or signal..."
                        className="input-field pl-12 bg-transparent border-[var(--border-color)] focus:border-primary-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="card-glass border-[var(--border-color)] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-[var(--border-color)] bg-current opacity-[0.02]">
                            <th className="p-6 text-xs font-black uppercase text-current opacity-60 tracking-[0.2em]">Identity</th>
                            <th className="p-6 text-xs font-black uppercase text-current opacity-60 tracking-[0.2em]">Department/Year</th>
                            <th className="p-6 text-xs font-black uppercase text-current opacity-60 tracking-[0.2em]">Current Role</th>
                            <th className="p-6 text-xs font-black uppercase text-current opacity-60 tracking-[0.2em]">Permission Level</th>
                            <th className="p-6 text-xs font-black uppercase text-current opacity-60 tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="relative z-10">
                        <AnimatePresence>
                            {loading ? (
                                <tr><td colSpan="5" className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest text-sm italic">Scanning network...</td></tr>
                            ) : filteredUsers.map((u, index) => (
                                <motion.tr
                                    key={u._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${!u.isActive ? 'opacity-50 grayscale' : ''}`}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-[var(--border-color)]">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-current font-bold">{u.name}</p>
                                                <p className="text-xs text-current opacity-50">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-current opacity-70 font-medium">{u.department || 'N/A'}</span>
                                            <span className="text-[10px] font-black text-current opacity-40 uppercase tracking-tighter">{u.year || 'No Year'}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-300' :
                                            u.role === 'organizer' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                                                'bg-primary-500/10 border-primary-500/20 text-primary-300'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="bg-[var(--input-bg)] border border-[var(--border-color)] text-current text-xs rounded-lg px-3 py-2 outline-none focus:border-primary-500"
                                        >
                                            <option value="participant">Participant</option>
                                            <option value="organizer">Organizer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                            <button
                                                onClick={() => handleToggleStatus(u._id)}
                                                className={`p-2 rounded-lg transition-colors border border-white/10 ${u.isActive ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-green-500/20 text-green-400'}`}
                                                title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                                            >
                                                {u.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 border border-white/10" title="Edit Metadata">
                                                <Edit3 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;
