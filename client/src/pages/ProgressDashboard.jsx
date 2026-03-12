import { useState, useEffect } from 'react';
import { Flame, Clock, BrainCircuit, Layers, Target, Trophy } from 'lucide-react';
import api from '../api/axios';

const ProgressDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const { data } = await api.get('/progress');
            setStats(data);
        } catch (error) {
            console.error("Error fetching progress", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) return <div className="flex justify-center p-20"><span className="loader"></span></div>;

    const { goals, streak, today } = stats;

    const computePercent = (current, target) => {
        const percent = Math.round((current / target) * 100);
        return percent > 100 ? 100 : percent;
    };

    const ProgressCard = ({ title, current, target, unit, icon: Icon, colorClass, bgClass, ringColor }) => {
        const percent = computePercent(current, target);

        return (
            <div className="glass dark:glass-dark rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 relative overflow-hidden group">
                {/* Background Glow */}
                <div className={`absolute -right-10 -top-10 w-40 h-40 ${bgClass} rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity`}></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-5 h-5 ${colorClass}`} />
                            <h3 className="font-bold text-gray-500 dark:text-gray-400">{title}</h3>
                        </div>
                        <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            {current} <span className="text-xl text-gray-400 font-medium">/ {target} {unit}</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{percent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${ringColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Your Progress</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Track your daily study goals and build consistency.</p>
                </div>

                {/* Streak Badge */}
                <div className="glass dark:glass-dark px-6 py-4 rounded-2xl flex items-center gap-4 border border-orange-500/30">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Current Streak</p>
                        <p className="text-2xl font-black dark:text-white flex items-baseline gap-1">
                            {streak} <span className="text-sm font-medium text-gray-400">Days</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Daily Goals Grid */}
            <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" /> Daily Goals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <ProgressCard
                    title="Study Time"
                    current={today.studyMinutes}
                    target={goals.studyMinutes}
                    unit="min"
                    icon={Clock}
                    colorClass="text-blue-500"
                    bgClass="bg-blue-500"
                    ringColor="bg-blue-500"
                />
                <ProgressCard
                    title="Flashcards Reviewed"
                    current={today.flashcardsReviewed}
                    target={goals.flashcards}
                    unit="cards"
                    icon={Layers}
                    colorClass="text-purple-500"
                    bgClass="bg-purple-500"
                    ringColor="bg-purple-500"
                />
                <ProgressCard
                    title="Quizzes Completed"
                    current={today.quizzesCompleted}
                    target={goals.quizzes}
                    unit="quiz"
                    icon={BrainCircuit}
                    colorClass="text-green-500"
                    bgClass="bg-green-500"
                    ringColor="bg-green-500"
                />
            </div>

            {/* Motivation Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-primary-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full mix-blend-screen"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">You're on fire!</h3>
                        <p className="text-primary-100 text-lg max-w-xl">
                            Consistency is the key to mastery. Keep up the momentum and hit your daily goals to level up your knowledge.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressDashboard;
