import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { login, register, reset } from '../redux/slices/authSlice';
import { User, Mail, Lock, Briefcase, GraduationCap, X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', department: '', year: 'SY', role: 'participant'
    });
    const { name, email, password, confirmPassword, department, year, role } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
        dispatch(reset());
    }, [user, isError, message, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();

        console.log('📝 Form submission:', { name, email, department, year, role });

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!department) {
            alert('Please select a department');
            return;
        }

        // Role is now selected by user
        console.log('🚀 Dispatching registration for role:', role);
        dispatch(register({ name, email, password, department, year, role }));
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[var(--bg-color)] overflow-hidden py-20">
            {/* Animated Colorful Background Blobs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass w-full max-w-2xl p-8 md:p-12 relative z-10"
            >
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-primary-500/20 rotate-3">
                        <User className="text-white" size={32} />
                    </div>
                    <h2 className="text-4xl font-display font-black text-current mb-2 tracking-tight">Create Account</h2>
                    <p className="text-current opacity-60">Join the elite campus network.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup icon={User} name="name" value={name} onChange={handleChange} placeholder="Full Name" />
                        <SelectGroup icon={GraduationCap} name="department" value={department} onChange={handleChange}>
                            <option value="">Select Department</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                        </SelectGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectGroup icon={Briefcase} name="role" value={formData.role} onChange={handleChange}>
                            <option value="participant">Participant (Student)</option>
                            <option value="organizer">Organizer (Club Lead)</option>
                            <option value="admin">Administrator</option>
                        </SelectGroup>
                        <SelectGroup icon={GraduationCap} name="year" value={year} onChange={handleChange}>
                            <option value="FY">First Year</option>
                            <option value="SY">Second Year</option>
                            <option value="TY">Third Year</option>
                            <option value="Final Year">Final Year</option>
                        </SelectGroup>
                    </div>

                    {/* Role Confirmation Display */}
                    <div className="text-sm text-current opacity-70">
                        Selected Role: <span className="font-bold text-primary-500">
                            {role === 'participant' && 'Participant (Student)'}
                            {role === 'organizer' && 'Organizer (Club Lead)'}
                            {role === 'admin' && 'Administrator'}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup icon={Mail} name="email" value={email} onChange={handleChange} placeholder="Email Address" type="email" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup icon={Lock} name="password" value={password} onChange={handleChange} placeholder="Password" type="password" />
                        <InputGroup icon={Lock} name="confirmPassword" value={confirmPassword} onChange={handleChange} placeholder="Confirm" type="password" />
                    </div>

                    {isError && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2"
                        >
                            <X size={16} /> {message}
                        </motion.div>
                    )}

                    <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-lg font-bold flex justify-center items-center gap-2 group shadow-2xl">
                        {isLoading ? 'Processing...' : 'Secure Access'}
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-current opacity-50">
                    Already registered? <Link to="/login" className="text-primary-500 hover:text-current font-bold transition-colors">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

const InputGroup = ({ icon: Icon, fullWidth, ...props }) => (
    <div className={fullWidth ? 'col-span-full' : ''}>
        <div className="relative group">
            <Icon size={18} className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-500 transition-colors" />
            <input {...props} className="input-field pl-12" required />
        </div>
    </div>
);

const SelectGroup = ({ icon: Icon, children, ...props }) => (
    <div className="relative group">
        <Icon size={18} className="absolute left-4 top-4 text-current opacity-40 group-focus-within:text-primary-500 transition-colors" />
        <select {...props} className="input-field pl-12 appearance-none text-current">
            {children}
        </select>
    </div>
);

export default RegisterPage;
