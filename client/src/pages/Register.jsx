import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, BookOpen, BrainCircuit, LibraryBig, Users, ArrowRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register({ name, email, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const highlights = [
        { icon: BrainCircuit, text: 'AI-Generated Quizzes & Flashcards' },
        { icon: LibraryBig, text: 'Smart Spaced Repetition' },
        { icon: Users, text: 'Collaborative Study Rooms' },
    ];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row relative">
            {/* Global gradient background */}
            <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />
            {/* Floating blur shapes */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[15%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[140px] animate-float" />
                <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-blue-500/15 rounded-full blur-[120px] animate-float-delayed" />
                <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[130px]" />
            </div>

            {/* ─── Left Branding Panel ─── */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12">
                {/* Top: Logo */}
                <div className="relative z-10">
                    <Link to="/landing" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2.5 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all group-hover:scale-105">
                            <BookOpen className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">AI Study Assist</span>
                    </Link>
                </div>

                {/* Center: Headline */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                        Your AI-Powered{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                            Study Companion
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed mb-10">
                        Transform lecture notes into quizzes, flashcards, and study sessions — all powered by artificial intelligence.
                    </p>

                    <div className="space-y-4">
                        {highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                                    <h.icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-gray-300 font-medium">{h.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom: Social proof */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#302b63] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {String.fromCharCode(65 + i)}
                            </div>
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm">Trusted by <strong className="text-gray-300">2,000+</strong> students</span>
                </div>
            </div>

            {/* ─── Right Form Panel ─── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2.5 shadow-lg shadow-purple-500/20">
                            <BookOpen className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">AI Study Assist</span>
                    </div>

                    {/* Glass form card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl shadow-black/10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create your account</h2>
                            <p className="text-gray-400">Start unlocking your AI study companion</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 backdrop-blur-md text-red-300 p-4 rounded-xl mb-6 text-sm flex items-center border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300 block">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        id="register-name"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300 block">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        id="register-email"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300 block">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        id="register-password"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                id="register-submit"
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                            >
                                {isLoading ? (
                                    <span className="loader !w-5 !h-5 !border-[2px] !border-t-white !border-white/30 truncate block"></span>
                                ) : (
                                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link to="/landing" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                            ← Back to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
