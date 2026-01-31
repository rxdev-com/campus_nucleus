import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, reset } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isSuccess) {
            alert('Password reset successfully!');
            navigate('/login');
        }
        dispatch(reset());
    }, [isSuccess, isError, message, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        dispatch(resetPassword({ token, password }));
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[var(--bg-color)] overflow-hidden py-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass w-full max-w-md p-8 md:p-10 relative z-10 border-[var(--border-color)]"
            >
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-primary-500/30 shadow-xl shadow-primary-500/10">
                        <Lock className="text-primary-500" size={32} />
                    </div>
                    <h2 className="text-3xl font-display font-black text-current mb-2 uppercase tracking-tighter">Set New Password</h2>
                    <p className="text-current opacity-60 font-medium">Enter your new secure password below.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-12 bg-transparent border-[var(--border-color)]"
                            placeholder="New Password"
                        />
                    </div>

                    <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field pl-12 bg-transparent border-[var(--border-color)]"
                            placeholder="Confirm New Password"
                        />
                    </div>

                    {isError && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm">
                            <XCircle size={16} /> {message}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 font-bold flex justify-center items-center gap-2 group">
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
