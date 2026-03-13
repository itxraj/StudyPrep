import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const TAGLINES = [
    'Upload a PDF, get a quiz.',
    'Flip through AI flashcards.',
    'Study with friends in real time.',
    'Track what you actually know.',
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [taglineIdx, setTaglineIdx] = useState(0);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIdx((i) => (i + 1) % TAGLINES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* ── Layered background ── */}
            <div className="fixed inset-0 -z-30 bg-[#06060a]" />

            {/* Grid pattern */}
            <div
                className="fixed inset-0 -z-20 opacity-[0.035]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Accent glow */}
            <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[600px] bg-indigo-600/[0.08] rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[10%] -z-10 w-[400px] h-[400px] bg-violet-600/[0.05] rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[380px] relative z-10">
                {/* Logo + rotating tagline */}
                <div className="mb-10 text-center">
                    <Link to="/landing" className="inline-flex items-center gap-2.5 mb-5 group">
                        <div className="bg-indigo-600 rounded-xl p-2.5 shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-600/40 transition-shadow">
                            <BookOpen className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-white tracking-tight">AI Study Assist</span>
                    </Link>
                    <div className="h-6 relative overflow-hidden">
                        {TAGLINES.map((t, i) => (
                            <p
                                key={t}
                                className="absolute inset-x-0 text-sm text-gray-500 transition-all duration-500"
                                style={{
                                    opacity: i === taglineIdx ? 1 : 0,
                                    transform: i === taglineIdx ? 'translateY(0)' : 'translateY(12px)',
                                }}
                            >
                                {t}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Form card with glow border */}
                <div className="relative group">
                    {/* Animated glow behind card */}
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none" />

                    <div className="relative bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-7">
                        <h1 className="text-lg font-bold text-white tracking-tight mb-1">Sign in</h1>
                        <p className="text-gray-600 text-sm mb-6">Welcome back to your study hub</p>

                        {error && (
                            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-5 text-sm border border-red-500/15">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="text-xs font-medium text-gray-400 block mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        id="login-email"
                                        className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-700 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="login-password" className="text-xs font-medium text-gray-400 block mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                    <input
                                        type="password"
                                        required
                                        id="login-password"
                                        className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-700 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                id="login-submit"
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
                            >
                                {isLoading ? (
                                    <span className="loader !w-4 !h-4 !border-[2px] !border-t-white !border-white/30 block"></span>
                                ) : (
                                    <>Continue <ArrowRight className="w-3.5 h-3.5" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                            <p className="text-sm text-gray-600">
                                No account?{' '}
                                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer link */}
                <div className="mt-8 text-center">
                    <Link to="/landing" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
                        ← studyassist.app
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
