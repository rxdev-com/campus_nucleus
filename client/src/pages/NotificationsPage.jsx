import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Calendar, Info, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const NotificationsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/notifications', config);
                setNotifications(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, config);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 max-w-4xl mx-auto">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-display font-black text-current mb-2 tracking-tight">Signal Feed</h1>
                    <p className="text-current opacity-60">Manage your system alerts and responses.</p>
                </div>
                <button
                    onClick={async () => {
                        if (!window.confirm('Erase all system signals?')) return;
                        try {
                            const config = { headers: { Authorization: `Bearer ${user.token}` } };
                            await axios.delete('http://localhost:5000/api/notifications', config);
                            setNotifications([]);
                        } catch (error) { console.error(error); }
                    }}
                    className="text-sm font-bold text-primary-400 hover:text-current transition-colors flex items-center gap-2"
                >
                    Clear All Signals
                </button>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-current flex items-center gap-4 py-20 justify-center">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold tracking-widest uppercase text-sm">Decoding Feed...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[var(--border-color)] rounded-3xl opacity-50">
                        <Bell size={48} className="mx-auto mb-4 text-current opacity-40" />
                        <p className="text-current opacity-60 font-medium">No signals detected in your network.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notifications.map((notif, index) => (
                            <motion.div
                                key={notif._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className={`card-glass p-5 flex gap-5 group transition-all duration-300 border-l-4 ${notif.read ? 'border-l-transparent' : 'border-l-primary-500'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${notif.type === 'error' ? 'bg-red-500/20 text-red-400' : notif.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-primary-500/20 text-primary-400'}`}>
                                    {notif.type === 'error' ? <AlertTriangle size={24} /> : notif.type === 'warning' ? <Info size={24} /> : <CheckCircle size={24} />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold ${notif.read ? 'text-current opacity-50' : 'text-current'}`}>{notif.title}</h3>
                                        <span className="text-[10px] uppercase font-bold text-current opacity-40 tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-current opacity-60 leading-relaxed mb-4">{notif.message}</p>

                                    <div className="flex gap-4">
                                        {!notif.read && (
                                            <button onClick={() => markAsRead(notif._id)} className="text-xs font-black text-primary-400 hover:text-current uppercase tracking-wider flex items-center gap-1">
                                                Mark Read <Check size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => notif.link && navigate(notif.link)}
                                            className="text-xs font-black text-current opacity-40 hover:text-current uppercase tracking-wider flex items-center gap-1 group/btn"
                                        >
                                            View Context <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                <button onClick={() => deleteNotification(notif._id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all self-start">
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
