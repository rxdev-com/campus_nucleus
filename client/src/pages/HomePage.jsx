import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Calendar, Users, Shield, Zap, ChevronRight, Layout,
    Cpu, Globe, Sparkles, TrendingUp, Award, ArrowUpRight,
    Activity, Layers, Command
} from 'lucide-react';

const HomePage = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="min-h-screen bg-transparent text-current overflow-hidden relative selection:bg-indigo-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 container mx-auto z-10">
                <div className="flex flex-col items-center text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
                        <span className="relative px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                            NUCLEUS OF COLLEGE LIFE
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-7xl md:text-9xl font-display font-black mb-6 leading-[0.85] tracking-tighter"
                    >
                        THE
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
                            NUCLEUS
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-current opacity-70 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        Your ultimate gateway to campus vibrant life.
                        <br className="hidden md:block" />
                        Explore clubs, join fests, and create memories that last forever.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 mb-20"
                    >
                        <Link to="/register" className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl overflow-hidden shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                                Explore Now <ArrowUpRight size={18} />
                            </span>
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 text-current font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                            Member Login
                        </Link>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl mb-32 group"
                    >
                        <img
                            src="/assets/college_hero.png"
                            alt="College Life"
                            className="w-full h-auto object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-left">
                            <div className="text-4xl font-black text-white uppercase tracking-tighter">Campus Beat</div>
                            <div className="text-white/60 font-medium">Capture the pulse of student activities</div>
                        </div>
                    </motion.div>

                    {/* Floating UI Elements */}
                    <motion.div style={{ y: y1 }} className="absolute top-10 right-0 lg:right-20 hidden md:block z-20">
                        <FloatingCard icon={Activity} label="Campus Pulse" value="Vibrant" color="text-green-400" />
                    </motion.div>
                    <motion.div style={{ y: y2 }} className="absolute bottom-40 left-0 lg:left-20 hidden md:block z-20">
                        <FloatingCard icon={Users} label="Total Members" value="5,000+" color="text-indigo-400" />
                    </motion.div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="container mx-auto px-4 py-32 relative z-10">
                <div className="grid md:grid-cols-3 gap-6">
                    <BentoCard
                        title="Event Protocol"
                        desc="Advanced lifecycle management for campus events."
                        icon={Calendar}
                        className="md:col-span-2"
                        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000"
                    />
                    <BentoCard
                        title="Resource Matrix"
                        desc="Smart allocation of venous assets."
                        icon={Layout}
                        className="md:col-span-1 bg-gradient-to-br from-indigo-900/50 to-purple-900/50"
                    />
                    <BentoCard
                        title="Authority Hub"
                        desc="RBAC governance levels."
                        icon={Shield}
                        className="md:col-span-1 bg-gradient-to-br from-cyan-900/50 to-blue-900/50"
                    />
                    <BentoCard
                        title="Neural Analytics"
                        desc="Real-time data processing and insights."
                        icon={TrendingUp}
                        className="md:col-span-2"
                        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-4 py-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <Stat number="50+" label="Active Units" />
                        <Stat number="1.2k" label="Daily Users" />
                        <Stat number="99.9%" label="Uptime" />
                        <Stat number="24/7" label="Support" />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FloatingCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 animate-float-complex hover:scale-105 transition-transform cursor-default">
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-50">{label}</div>
            <div className="font-bold text-lg">{value}</div>
        </div>
    </div>
);

const BentoCard = ({ title, desc, icon: Icon, className, image }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`glass-panel p-8 rounded-3xl relative overflow-hidden group ${className}`}
    >
        {image && (
            <>
                <div className="absolute inset-0">
                    <img src={image} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </>
        )}

        <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 group-hover:bg-white/20 transition-colors">
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{title}</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    </motion.div>
);

const Stat = ({ number, label }) => (
    <div className="text-center group cursor-default">
        <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 group-hover:scale-110 transition-transform duration-300 display-font">
            {number}
        </div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-current opacity-40 group-hover:opacity-100 transition-opacity">
            {label}
        </div>
    </div>
);

export default HomePage;
