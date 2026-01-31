import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResourceAvailability = ({ resourceId, date, onSlotSelect }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!resourceId || !date) return;

        const fetchBookings = async () => {
            setLoading(true);
            try {
                // Assuming backend route to get bookings for a resource on a specific date
                const { data } = await axios.get(`http://localhost:5000/api/bookings/resource/${resourceId}?date=${date}`);
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [resourceId, date]);

    // Generate time slots (e.g., 9 AM to 6 PM)
    const timeSlots = [];
    for (let i = 9; i <= 18; i++) {
        timeSlots.push(`${i}:00`);
        timeSlots.push(`${i}:30`);
    }

    const isSlotBooked = (time) => {
        // Simple logic: check if time falls within any booking
        // This requires parsing the time string and comparing with booking start/end dates
        // For MVP, we'll do a simplified check assumes bookings align with slots
        // Real implementation need Date comparison
        return false; // dynamic implementation needed based on backend response format
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10 mt-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary-500" />
                Resource Availability
            </h3>

            {loading ? (
                <div className="text-center py-4 text-gray-400 text-sm">Checking Matrix...</div>
            ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {timeSlots.map(time => {
                        // Demo logic: Since we don't have real booking dates comparison yet, randomize for visual
                        // In production, use `isSlotBooked(time)`
                        const booked = bookings.some(b => {
                            const bookStart = new Date(b.startTime).getHours();
                            const slotHour = parseInt(time.split(':')[0]);
                            return bookStart === slotHour;
                        });

                        return (
                            <motion.button
                                key={time}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => !booked && onSlotSelect && onSlotSelect(time)}
                                className={`p-2 rounded-lg text-xs font-bold border transition-all ${booked
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400 cursor-not-allowed'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                    }`}
                            >
                                {time}
                            </motion.button>
                        );
                    })}
                </div>
            )}
            <div className="flex gap-4 mt-4 text-[10px] uppercase font-bold tracking-wider">
                <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>
                <span className="flex items-center gap-1 text-red-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> Booked</span>
            </div>
        </div>
    );
};

export default ResourceAvailability;
