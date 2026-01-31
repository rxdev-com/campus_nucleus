import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Calendar, Clock } from 'lucide-react';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users/favorites', config);
                setFavorites(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (user) fetchFavorites();
    }, [user]);

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[160px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <h1 className="text-7xl md:text-9xl font-display font-black mb-6 tracking-tighter text-current">
                            SAVED <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-500">SIGNALS</span>
                        </h1>
                        <p className="text-current opacity-60 max-w-2xl mx-auto text-xl font-medium italic border-l-2 border-primary-500/30 px-8">
                            “Your archived protocol interests.”
                        </p>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="py-40 text-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest italic opacity-50">No saved signals in your archive.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -10 }}
                                className="card-glass group overflow-hidden border-[var(--border-color)] hover:border-primary-500/30 transition-all duration-500"
                                onClick={() => navigate(`/events/${event._id}`)}
                            >
                                <div className="h-48 bg-gradient-to-br from-slate-900 to-primary-900/40 relative">
                                    <div className="absolute top-4 right-4 text-primary-500">
                                        <Heart fill="currentColor" size={24} />
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-current mb-3 uppercase tracking-tight line-clamp-1">{event.title}</h3>
                                    <p className="text-current opacity-40 text-sm mb-8 line-clamp-2 leading-relaxed italic">“{event.description}”</p>

                                    <div className="space-y-4 pt-6 border-t border-[var(--border-color)] text-[11px] font-bold text-current opacity-40 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary-500" />
                                            <span className="text-current">{new Date(event.timeStart).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-secondary-500" />
                                            <span className="text-current">{new Date(event.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
