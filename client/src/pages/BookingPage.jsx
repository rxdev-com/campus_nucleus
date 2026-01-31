import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar, Clock, MapPin, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingPage = () => {
    const [resources, setResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/resources');
                setResources(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchResources();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Construct ISO Dates
            const start = new Date(`${formData.date}T${formData.startTime}`);
            const end = new Date(`${formData.date}T${formData.endTime}`);

            await axios.post('http://localhost:5000/api/bookings', {
                resourceId: selectedResource._id,
                startTime: start,
                endTime: end
            }, config);

            setMessage('Booking Request Submitted Successfully!');
            setLoading(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Booking Failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 bg-transparent">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-display font-black text-current mb-2">Resource Allocation</h1>
                        <p className="text-current opacity-40">Secure campus infrastructure for your events.</p>
                    </motion.div>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Resource List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-1/3 space-y-4"
                    >
                        <h2 className="text-current font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                            Select Asset
                        </h2>
                        {resources.map((res, index) => (
                            <motion.div
                                key={res._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                                onClick={() => setSelectedResource(res)}
                                className={`card-glass p-4 cursor-pointer transition-all border-l-4 ${selectedResource?._id === res._id ? 'border-l-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10' : 'border-l-transparent hover:border-l-[var(--border-color)]'}`}
                            >
                                <h3 className="text-current font-bold text-lg">{res.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-current opacity-40 capitalize bg-[var(--input-bg)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">{res.type}</span>
                                    <span className="text-xs text-primary-500 font-bold">Cap: {res.capacity}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Booking Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full md:w-2/3"
                    >
                        {selectedResource ? (
                            <div className="card-glass p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                {selectedResource.name.toLowerCase().includes('auditorium') && (
                                    <div className="mb-6 rounded-2xl overflow-hidden h-48 border border-white/10">
                                        <img src="/images/auditorium.png" alt="Auditorium" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {selectedResource.name.toLowerCase().includes('ballroom') && (
                                    <div className="mb-6 rounded-2xl overflow-hidden h-48 border border-white/10">
                                        <img src="/images/ballroom.png" alt="Ballroom" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {selectedResource.name.toLowerCase().includes('seminar') && (
                                    <div className="mb-6 rounded-2xl overflow-hidden h-48 border border-white/10">
                                        <img src="/images/seminar.png" alt="Seminar" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <h2 className="text-2xl font-bold text-current mb-6 flex items-center gap-2 relative z-10">
                                    Book <span className="text-primary-500 underline decoration-primary-500/30">{selectedResource.name}</span>
                                </h2>

                                <form onSubmit={handleBook} className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-current opacity-40 text-sm font-medium ml-1">Event Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-3.5 text-primary-500" size={18} />
                                            <input
                                                type="date"
                                                required
                                                className="input-field pl-12"
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-current opacity-40 text-sm font-medium ml-1">Start Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 text-secondary-500" size={18} />
                                                <input
                                                    type="time"
                                                    required
                                                    className="input-field pl-12"
                                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-current opacity-40 text-sm font-medium ml-1">End Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 text-secondary-500" size={18} />
                                                <input
                                                    type="time"
                                                    required
                                                    className="input-field pl-12"
                                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`p-4 rounded-xl flex items-center gap-3 border ${message.includes('Success') ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}
                                        >
                                            {message.includes('Success') ? <Check /> : <AlertCircle />}
                                            {message}
                                        </motion.div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full flex justify-center py-4 text-lg"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Reservation'}
                                    </motion.button>
                                </form>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 border border-white/5 rounded-3xl p-10 border-dashed bg-white/5 min-h-[400px]">
                                <MapPin size={48} className="mb-4 opacity-50" />
                                <p className="text-lg font-medium">Select a resource from the list to proceed</p>
                                <p className="text-sm opacity-60">View capacity and details instantly</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
