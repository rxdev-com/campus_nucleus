import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ParticipantDashboard from '../pages/ParticipantDashboard';
import OrganizerDashboard from '../components/dashboards/OrganizerDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] bg-grid-pattern relative">
            {/* Background ambient light */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10">
                {user.role === 'admin' && <AdminDashboard user={user} />}
                {user.role === 'organizer' && <OrganizerDashboard user={user} />}
                {user.role === 'participant' && <ParticipantDashboard user={user} />}
            </div>
        </div>
    );
};

export default DashboardPage;
