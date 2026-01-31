import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset, googleLogin } from '../redux/slices/authSlice';
import { Lock, Mail, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
        dispatch(reset());
    }, [user, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[var(--bg-color)] overflow-hidden">
            {/* Vibrant Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass w-full max-w-md p-8 md:p-12 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary-500/30 rotate-6 group hover:rotate-12 transition-transform">
                        <Lock className="text-white group-hover:scale-110 transition-transform" size={40} />
                    </div>
                    <h1 className="text-4xl font-display font-black text-current mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-current opacity-60">Access the campus core system.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-current opacity-50 text-xs font-black ml-1 uppercase tracking-[0.2em]">Access Identifier</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12"
                                placeholder="name@campus.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-current opacity-50 text-xs font-black uppercase tracking-[0.2em]">Security Key</label>
                            <Link to="/forgot-password" virtual="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-current transition-colors">Lost Access?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-secondary-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {isError && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm flex items-center gap-2"
                        >
                            <X size={16} /> {message}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4 text-lg font-bold flex justify-center items-center gap-2 group shadow-xl"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </form>

                <div className="my-8 flex items-center gap-4 text-current opacity-20">
                    <div className="h-px flex-1 bg-current"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Node</span>
                    <div className="h-px flex-1 bg-current"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            dispatch(googleLogin(credentialResponse.credential));
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        theme={theme === 'dark' ? 'filled_black' : 'outline'}
                        shape="pill"
                        size="large"
                        text="continue_with"
                    />
                </div>

                <div className="mt-10 text-center text-sm text-current opacity-50">
                    New to the system? <Link to="/register" className="text-primary-500 hover:text-current font-bold transition-colors">Initialize Account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
