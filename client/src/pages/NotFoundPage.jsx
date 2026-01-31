import React from 'react';
import { motion } from 'framer-motion';
import { Search, Home, RefreshCw, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/05 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass p-12 max-w-lg w-full text-center relative z-10"
            >
                <div className="w-24 h-24 bg-primary-500/10 rounded-3xl mx-auto mb-8 flex items-center justify-center text-primary-400 border border-primary-500/20 shadow-2xl">
                    <Map size={48} className="animate-bounce" />
                </div>

                <h1 className="text-8xl font-display font-black text-current mb-2 tracking-tighter">404</h1>
                <h2 className="text-2xl font-black text-current opacity-60 mb-4 uppercase tracking-widest">Protocol Lost</h2>
                <p className="text-current opacity-40 mb-10 text-sm font-bold leading-relaxed px-4">
                    The requested data node does not exist within the current campus grid.
                </p>

                <div className="flex flex-col gap-4">
                    <button onClick={() => navigate('/')} className="btn-primary py-4 font-black flex justify-center items-center gap-2 shadow-xl shadow-primary-500/20">
                        <Home size={18} /> Return Home
                    </button>
                    <button onClick={() => window.location.reload()} className="btn-glass py-4 font-black flex justify-center items-center gap-2 border-[var(--border-color)] text-current opacity-60 hover:opacity-100">
                        <RefreshCw size={18} /> Rescan Grid
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
