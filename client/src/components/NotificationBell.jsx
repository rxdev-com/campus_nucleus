import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user || !user.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/notifications', config);
                setNotifications(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
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

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-current opacity-60 hover:opacity-100 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900"></span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-md"
                    >
                        <div className="p-3 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--input-bg)]/30">
                            <h3 className="font-bold text-current text-sm">Notifications</h3>
                            <span className="text-[10px] uppercase font-black opacity-40">{unreadCount} unread</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n._id}
                                        className={`p-4 border-b border-[var(--border-color)] hover:bg-[var(--input-bg)]/50 transition-colors cursor-pointer ${!n.read ? 'bg-[var(--input-bg)]/20' : ''}`}
                                        onClick={() => markAsRead(n._id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                {n.type === 'success' && <CheckCircle size={16} className="text-green-400" />}
                                                {n.type === 'error' && <XCircle size={16} className="text-red-400" />}
                                                {n.type === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                                                {n.type === 'info' && <Info size={16} className="text-blue-400" />}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-black tracking-tight ${!n.read ? 'text-current' : 'text-current opacity-40'}`}>{n.title}</h4>
                                                <p className="text-xs text-current opacity-60 mt-1 font-medium">{n.message}</p>
                                                <p className="text-[10px] text-current opacity-40 font-bold uppercase mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
