import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/05 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass p-12 max-w-lg w-full text-center relative z-10 border-red-500/20 shadow-2xl shadow-red-500/10"
            >
                <div className="w-24 h-24 bg-red-500/20 rounded-3xl mx-auto mb-8 flex items-center justify-center text-red-400 border border-red-500/30 animate-pulse">
                    <ShieldAlert size={48} />
                </div>

                <h1 className="text-5xl font-display font-black text-current mb-4 tracking-tighter uppercase">Access Denied</h1>
                <p className="text-current opacity-60 mb-10 leading-relaxed font-bold tracking-widest uppercase text-xs">
                    Your current clearance level is insufficient for this module.
                </p>

                <div className="flex flex-col gap-4">
                    <button onClick={() => navigate(-1)} className="btn-primary py-4 font-black flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 shadow-xl shadow-red-500/20">
                        <ArrowLeft size={18} /> Revert Connection
                    </button>
                    <button onClick={() => navigate('/')} className="btn-glass py-4 font-black flex justify-center items-center gap-2 border-[var(--border-color)] text-current opacity-60 hover:opacity-100">
                        <Home size={18} /> Surface Layer
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ForbiddenPage;
