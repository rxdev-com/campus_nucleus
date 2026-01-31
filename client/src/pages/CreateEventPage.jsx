import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ChevronRight, ChevronLeft, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';
import ResourceAvailability from '../components/ResourceAvailability';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    // Edit Mode Logic
    const { id } = useParams(); // If ID exists, we are editing
    const isEdit = !!id;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // We would fetch clubs here for 'organizerClub' but for MVP we assume user's first managed club or hardcode
    // Actually, let's fetch user profile to get managed clubs
    const [myClubs, setMyClubs] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        organizerClub: '',
        timeStart: '',
        timeEnd: '',
        venue: '',
        budget: '',
    });

    useEffect(() => {
        if (!user || user.role !== 'organizer') navigate('/login');

        const fetchClubs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/clubs/my-managed', config);
                setMyClubs(data);
                if (data.length > 0 && !isEdit) {
                    setFormData(prev => ({ ...prev, organizerClub: data[0]._id }));
                }
            } catch (error) {
                console.error("Failed to fetch clubs", error);
            }
        };

        const fetchEventForEdit = async () => {
            if (!isEdit) return;
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
                // Format dates for input (datetime-local expects YYYY-MM-DDTHH:MM)
                const formatDate = (dateStr) => {
                    const d = new Date(dateStr);
                    return d.toISOString().slice(0, 16);
                };

                setFormData({
                    title: data.title,
                    description: data.description,
                    organizerClub: data.organizerClub?._id || data.organizerClub,
                    timeStart: formatDate(data.timeStart),
                    timeEnd: formatDate(data.timeEnd),
                    venue: data.venue,
                    budget: data.budget,
                    _coOrganizersString: data.coOrganizerClubs?.map(c => typeof c === 'string' ? c : c._id).join(', ') || ''
                });
            } catch (error) {
                console.error("Failed to fetch event", error);
            }
        };

        if (user) {
            fetchClubs();
            fetchEventForEdit();
        }
    }, [user, navigate, id, isEdit]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle co-organizers as comma separated string for MVP
    const handleCoOrganizersChange = (e) => {
        const value = e.target.value;
        // logic to split by comma and clean would happen on submit ideally, or we store as string and process later
        // For now let's just store as string and assume backend expects array?
        // Backend expects array of IDs. We need to process this.
        setFormData({ ...formData, _coOrganizersString: value });
    };

    const handleSubmit = async (isDraft = true) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Process co-organizers
            let coOrganizerClubs = [];
            if (formData._coOrganizersString) {
                coOrganizerClubs = formData._coOrganizersString.split(',').map(id => id.trim()).filter(id => id);
            }

            const eventData = {
                ...formData,
                coOrganizerClubs
            };

            let data;
            if (isEdit) {
                const res = await axios.put(`http://localhost:5000/api/events/${id}`, eventData, config);
                data = res.data;
            } else {
                const res = await axios.post('http://localhost:5000/api/events', eventData, config);
                data = res.data;
            }

            if (!isDraft) {
                await axios.patch(`http://localhost:5000/api/events/${data._id || id}/submit`, {}, config);
            }

            navigate('/dashboard');
        } catch (error) {
            alert('Failed to save protocol: ' + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 bg-grid-pattern pt-28 pb-10 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">{isEdit ? 'Upgrade Protocol' : 'Initialize New Protocol'}</h1>
                    <p className="text-gray-400">Step {step} of 3</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary-500' : 'bg-white/10'}`}></div>
                    ))}
                </div>

                <div className="card-glass p-8 md:p-10 relative">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText /> Event Details</h2>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Event Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Hackathon 2026" />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[120px]" placeholder="Detailed protocol description..." />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Organizer Club</label>
                                {myClubs.length > 0 ? (
                                    <select name="organizerClub" value={formData.organizerClub} onChange={handleChange} className="input-field bg-slate-800">
                                        {myClubs.map(club => (
                                            <option key={club._id} value={club._id}>{club.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="text-amber-400 text-sm">You do not manage any clubs. You cannot create events.</div>
                                )}
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Co-Organizer Club IDs (Optional)</label>
                                <input name="_coOrganizersString" onChange={handleCoOrganizersChange} className="input-field" placeholder="Comma separated IDs..." />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar /> Logistics & Resource</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm mb-1 block">Start Time</label>
                                    <input type="datetime-local" name="timeStart" value={formData.timeStart} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }} />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm mb-1 block">End Time</label>
                                    <input type="datetime-local" name="timeEnd" value={formData.timeEnd} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }} />
                                </div>
                            </div>

                            {/* Resource Selection */}
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Select Venue / Resource</label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-4 text-gray-500" />
                                        <select
                                            name="venue"
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            className="input-field pl-12 appearance-none text-current"
                                        >
                                            <option value="">Select a Resource...</option>
                                            {/* Ideally we fetch these from /api/resources */}
                                            <option value="Auditorium A">Auditorium A</option>
                                            <option value="Conference Hall">Conference Hall</option>
                                            <option value="Lab 101">Lab 101</option>
                                            <option value="Sports Ground">Sports Ground</option>
                                        </select>
                                    </div>

                                    {/* Availability Visualization */}
                                    {formData.venue && formData.timeStart && (
                                        <div className="border-t border-white/10 pt-4">
                                            {/* We pass a mock ID for now or map name to ID if we had the resource list with IDs */}
                                            {/* For MVP demo, lets pretend venue name connects to an ID or the component accepts name if we modify it. */}
                                            {/* Actually, component takes ID. Let's pass a dummy or implement basic logic. */}
                                            <p className="text-xs text-primary-400 mb-2 font-bold uppercase tracking-wider">Availability for {formData.venue}</p>
                                            {/* We will need to import ResourceAvailability at the top. */}
                                            <ResourceAvailability
                                                resourceId={`mock_id_for_${formData.venue}`} // In real app, this would be actual ID
                                                date={formData.timeStart.split('T')[0]}
                                                onSlotSelect={(time) => {
                                                    // Optional: auto-adjust start time?
                                                    console.log("Selected slot", time);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><DollarSign /> Budgeting</h2>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Proposed Budget (INR)</label>
                                <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="input-field" placeholder="0.00" />
                            </div>

                            <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-200 text-sm">
                                <h4 className="font-bold mb-1">Review Protocol</h4>
                                <ul className="list-disc list-inside opacity-80 space-y-1">
                                    <li>Title: {formData.title}</li>
                                    <li>Venue: {formData.venue}</li>
                                    <li>Budget: ₹{formData.budget}</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="btn-glass px-6 flex items-center gap-2">
                                <ChevronLeft size={18} /> Back
                            </button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <button onClick={() => setStep(step + 1)} className="btn-primary px-6 flex items-center gap-2">
                                Next Step <ChevronRight size={18} />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => handleSubmit(true)} disabled={loading} className="btn-glass px-6">
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </button>
                                <button onClick={() => handleSubmit(false)} disabled={loading} className="btn-primary px-8">
                                    {loading ? 'Processing...' : 'Submit Protocol'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPage;
