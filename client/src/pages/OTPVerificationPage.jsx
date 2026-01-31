import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, resetPassword, reset } from '../redux/slices/authSlice';

const OTPVerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const email = location.state?.email;

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: OTP, 2: New Password

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (isSuccess && step === 1) {
            setStep(2);
            dispatch(reset());
        }
        if (isSuccess && step === 2) {
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [isSuccess, step, dispatch, navigate]);

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        dispatch(verifyOTP({ email, otp }));
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        dispatch(resetPassword({ email, otp, password }));
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[var(--bg-color)] overflow-hidden py-20">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass w-full max-w-md p-8 md:p-10 relative z-10"
            >
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-current opacity-40 hover:text-current mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back
                </button>

                {step === 1 ? (
                    <>
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-500">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-3xl font-display font-black text-current mb-2 uppercase tracking-tighter">Enter Code</h2>
                            <p className="text-current opacity-60 text-sm">We've sent a 6-digit verification signal to <br /><span className="text-current font-black">{email}</span></p>
                        </div>

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="input-field text-center text-2xl tracking-[0.5em] font-black"
                                    placeholder="000000"
                                />
                            </div>

                            {isError && (
                                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                                    {message}
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 font-bold flex justify-center items-center gap-2 group">
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-secondary-500/10 border border-secondary-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-secondary-500">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-3xl font-display font-black text-current mb-2 uppercase tracking-tighter">New Key</h2>
                            <p className="text-current opacity-60 text-sm">Set a new secure access key for your node.</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-4">
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
                                        placeholder="Confirm Password"
                                    />
                                </div>
                            </div>

                            {isError && (
                                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                                    {message}
                                </div>
                            )}

                            {isSuccess ? (
                                <div className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center font-bold">
                                    Access Restored! Redirecting to login...
                                </div>
                            ) : (
                                <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 font-bold flex justify-center items-center gap-2 group">
                                    {isLoading ? 'Updating...' : 'Restore Access'}
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default OTPVerificationPage;
