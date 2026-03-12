import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-primary-500/30">
            {/* App Background */}
            <div className="fixed inset-0 -z-10 bg-[#f8f9fa] dark:bg-[#09090b] transition-colors duration-500">
                {/* Subtle accent glow — dark mode */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/[0.04] blur-[120px] rounded-full pointer-events-none hidden dark:block"></div>
                {/* Subtle accent — light mode */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-primary-400/[0.08] to-transparent blur-[100px] rounded-full mix-blend-multiply opacity-50 dark:hidden"></div>
            </div>

            <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-colors duration-500 bg-white/70 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/[0.06]">
                <div className="flex items-center gap-8 md:gap-12">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-2.5 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all group-hover:scale-105">
                            <BookOpen className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight hidden sm:block">
                            AI Study Assist
                        </span>
                    </Link>

                    {/* Core Nav Links */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-bold">
                        <Link to="/rooms" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Study Rooms</Link>
                        <Link to="/community" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Community Decks</Link>
                        <Link to="/progress" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Progress</Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <div className="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md">
                        <UserIcon className="w-5 h-5" />
                        <span>{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2.5 rounded-full transition-all text-sm font-semibold"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </nav>
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
