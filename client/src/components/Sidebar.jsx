import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    BarChart2,
    Server,
    Globe,
    PlusSquare,
    Bookmark,
    Bell,
    Layers
} from 'lucide-react';

const Sidebar = ({ user }) => {
    const location = useLocation();

    if (!user) return null;

    const menuItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard' },
            { icon: Users, label: 'User Authority', path: '/admin/users' },
            { icon: Globe, label: 'Club Registry', path: '/admin/clubs' },
            { icon: Layers, label: 'Protocol Oversight', path: '/admin/events' },
            { icon: Server, label: 'Asset Management', path: '/admin/resources' },
            { icon: BarChart2, label: 'Nexus Analytics', path: '/admin/analytics' },
        ],
        organizer: [
            { icon: LayoutDashboard, label: 'Organizer Hub', path: '/dashboard' },
            { icon: PlusSquare, label: 'New Protocol', path: '/events/create' },
            { icon: Calendar, label: 'Manage Events', path: '/my-events' },
            { icon: Server, label: 'Book Resources', path: '/bookings' },
            { icon: Globe, label: 'My Clubs', path: '/my-clubs' },
        ],
        participant: [
            { icon: LayoutDashboard, label: 'Student Hub', path: '/dashboard' },
            { icon: Calendar, label: 'Activity Feed', path: '/events' },
            { icon: Bookmark, label: 'Saved Protocols', path: '/favorites' },
            { icon: Layers, label: 'Registered', path: '/my-events' },
            { icon: Globe, label: 'Clubs', path: '/my-clubs' },
        ]
    };

    const activeItems = menuItems[user.role] || [];

    return (
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-[var(--bg-color)]/50 backdrop-blur-xl border-r border-[var(--border-color)] z-40 hidden lg:block overflow-y-auto">
            <div className="p-6 space-y-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-6 px-4">Navigation Matrix</p>
                    <nav className="space-y-1">
                        {activeItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                                        : 'text-current opacity-60 hover:opacity-100 hover:bg-[var(--input-bg)]'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive ? 'text-primary-500' : 'group-hover:text-primary-400 transition-colors'} />
                                    <span className="text-sm font-black tracking-tight uppercase">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-8 border-t border-[var(--border-color)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-current opacity-40 mb-6 px-4">System</p>
                    <nav className="space-y-1">
                        <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-current opacity-60 hover:opacity-100 transition-all rounded-xl hover:bg-[var(--input-bg)]">
                            <Bell size={20} />
                            <span className="text-sm font-black tracking-tight uppercase">Signals</span>
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-current opacity-60 hover:opacity-100 transition-all rounded-xl hover:bg-[var(--input-bg)]">
                            <Settings size={20} />
                            <span className="text-sm font-black tracking-tight uppercase">Config</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* User Badge at bottom */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-xs">
                        {user.role.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xs font-black text-current leading-none">{user.name.split(' ')[0]}</p>
                        <p className="text-[8px] font-bold text-primary-500 uppercase tracking-widest">{user.role} active</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
