import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ChevronRight, ArrowLeft, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, reset } from '../redux/slices/authSlice';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isSuccess) {
            navigate('/verify-otp', { state: { email } });
        }
    }, [isSuccess, navigate, email]);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[var(--bg-color)] overflow-hidden py-20">
            {/* Vibrant Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]"></div>

            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass w-full max-w-md p-8 md:p-10 relative z-10 border-[var(--border-color)]"
            >
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-current opacity-40 hover:text-current mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back
                </button>

                {!isSuccess ? (
                    <>
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-primary-500/30 shadow-xl shadow-primary-500/10 -rotate-3">
                                <Key className="text-primary-500" size={32} />
                            </div>
                            <h2 className="text-3xl font-display font-black text-current mb-2 uppercase tracking-tighter">Lost Access?</h2>
                            <p className="text-current opacity-60 font-medium">Enter your email and we'll send a recovery link.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12 bg-transparent border-[var(--border-color)]"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {isError && (
                                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                    {message}
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 font-bold flex justify-center items-center gap-2 group">
                                {isLoading ? 'Sending...' : 'Send Recovery Link'}
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-10 animate-fade-in">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mx-auto mb-6 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/10">
                            <Mail size={40} />
                        </div>
                        <h2 className="text-3xl font-display font-black text-current mb-4 uppercase tracking-tighter">Check Your Inbox</h2>
                        <p className="text-current opacity-60 mb-8 font-medium">A recovery signal has been sent to <span className="text-current font-black">{email}</span>.</p>
                        <Link to="/login" className="btn-glass px-8 py-3 uppercase text-xs font-black tracking-widest border-[var(--border-color)]">Return to Sign In</Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
