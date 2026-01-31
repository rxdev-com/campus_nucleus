import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import {
    LogOut,
    Menu,
    Zap,
    Shield,
    Briefcase,
    Sparkles,
    Activity,
    Sun,
    Moon
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    // Role-specific Header Configurations
    const roleConfig = {
        admin: {
            label: 'COMMAND CONSOLE',
            icon: Shield,
            colorClass: 'from-red-500 to-orange-500',
            badge: 'ROOT ACCESS',
            badgeColor: 'bg-red-500/10 text-red-500'
        },
        organizer: {
            label: 'PROTOCOL HUB',
            icon: Briefcase,
            colorClass: 'from-secondary-500 to-blue-500',
            badge: 'DELEGATE',
            badgeColor: 'bg-secondary-500/10 text-secondary-500'
        },
        participant: {
            label: 'STUDENT NEXUS',
            icon: Sparkles,
            colorClass: 'from-primary-500 to-indigo-500',
            badge: 'ACTIVE NODE',
            badgeColor: 'bg-primary-500/10 text-primary-500'
        },
        guest: {
            label: 'CAMPUS NUCLEUS',
            icon: Zap,
            colorClass: 'from-primary-500 to-secondary-500',
            badge: 'GUEST',
            badgeColor: 'bg-gray-500/10 text-gray-400'
        }
    };

    const currentConfig = user ? (roleConfig[user.role] || roleConfig.guest) : roleConfig.guest;
    const Icon = currentConfig.icon;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || user ? 'bg-[var(--bg-color)]/80 backdrop-blur-lg border-b border-[var(--border-color)] py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">

                {/* Brand / Role Identity */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className={`w-10 h-10 bg-gradient-to-br ${currentConfig.colorClass} rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform`}>
                        <Icon size={20} fill={user ? "currentColor" : "none"} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-display font-black tracking-tight text-current leading-none">
                            {user ? currentConfig.label : (
                                <>Campus<span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentConfig.colorClass}`}>Nucleus</span></>
                            )}
                        </span>
                        {user && (
                            <span className={`text-[8px] font-black uppercase tracking-[0.4em] mt-1 ${currentConfig.badgeColor.split(' ')[1]}`}>
                                {currentConfig.badge}
                            </span>
                        )}
                    </div>
                </Link>

                {/* Navigation Matrix */}
                <nav className="flex items-center gap-4 md:gap-8">
                    {!user ? (
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/events" className="text-xs font-black uppercase tracking-widest text-current opacity-70 hover:opacity-100 transition-colors">Protocols</Link>
                            <Link to="/bookings" className="text-xs font-black uppercase tracking-widest text-current opacity-70 hover:opacity-100 transition-colors">Resources</Link>
                            <div className="h-4 w-px bg-[var(--border-color)] mx-2"></div>
                            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-current opacity-60 hover:opacity-100 transition-colors">Log In</Link>
                            <Link to="/register" className="btn-primary text-[10px] font-black uppercase tracking-widest px-6 py-2.5 shadow-xl">Initialize</Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 md:gap-8">
                            {/* Operational Signals */}
                            <div className="flex items-center gap-3 pr-4 md:pr-8 border-r border-[var(--border-color)]">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-current opacity-60 hover:opacity-100 hover:bg-[var(--input-bg)] rounded-xl transition-all"
                                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                                <NotificationBell user={user} />
                                {user.role === 'admin' && (
                                    <Link to="/admin/analytics" className="p-2 text-current opacity-60 hover:opacity-100 transition-all hover:bg-[var(--input-bg)] rounded-xl lg:hidden">
                                        <Activity size={18} />
                                    </Link>
                                )}
                            </div>

                            {/* Personnel Profile */}
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer group">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-xs font-black text-current leading-none mb-1 group-hover:text-primary-400 transition-colors uppercase">{user.name}</div>
                                        <div className={`text-[8px] font-bold uppercase tracking-[0.2em] opacity-60`}>Session Active</div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden font-black text-current text-xs ring-2 ring-transparent group-hover:ring-${user.role === 'admin' ? 'red' : 'primary'}-500/20 transition-all shadow-inner`}>
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : user.name.charAt(0)}
                                    </div>
                                </Link>

                                <button
                                    onClick={onLogout}
                                    className="p-2 text-current opacity-40 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                    title="Terminate Session"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Trigger (Optional if needed, but sidebar handles most now) */}
                    <button className="md:hidden p-2 text-current opacity-60 lg:hidden">
                        <Menu size={20} />
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
