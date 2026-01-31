import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-[var(--bg-color)] font-sans text-current relative transition-colors duration-500">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob 
                    ${user?.role === 'admin' ? 'bg-red-500' : user?.role === 'organizer' ? 'bg-secondary-500' : 'bg-primary-500'}`}></div>
                <div className={`absolute top-40 -right-20 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000
                    ${user?.role === 'admin' ? 'bg-orange-500' : user?.role === 'organizer' ? 'bg-blue-500' : 'bg-secondary-500'}`}></div>
                <div className={`absolute -bottom-40 left-20 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000
                    ${user?.role === 'admin' ? 'bg-purple-900' : user?.role === 'organizer' ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.2]"></div>
            </div>

            <Header />

            <div className="flex pt-20">
                {user && <Sidebar user={user} />}

                <main className={`relative z-10 flex-1 transition-all duration-300 ${user ? 'lg:pl-64' : ''}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;
