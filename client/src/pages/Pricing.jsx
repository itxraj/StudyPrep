import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, Check, X, Sparkles, Zap, Crown,
    ArrowRight, ChevronLeft
} from 'lucide-react';

const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] },
    }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const plans = [
    {
        id: 'free',
        name: 'Starter',
        price: '0',
        period: 'forever',
        description: 'Try it out — no commitment',
        icon: Sparkles,
        color: 'gray',
        features: [
            { text: '1 AI Quiz', included: true },
            { text: '1 Flashcard Deck', included: true },
            { text: 'Study Rooms', included: true },
            { text: 'Community Decks', included: true },
            { text: 'Progress Tracking', included: true },
            { text: 'Priority AI Generation', included: false },
            { text: 'Unlimited Documents', included: false },
        ],
        cta: 'Current Plan',
        disabled: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '299',
        period: '/month',
        description: 'For serious students',
        icon: Zap,
        color: 'indigo',
        popular: true,
        features: [
            { text: '25 AI Quizzes / month', included: true },
            { text: '25 Flashcard Decks / month', included: true },
            { text: 'Study Rooms', included: true },
            { text: 'Community Decks', included: true },
            { text: 'Progress Tracking', included: true },
            { text: 'Priority AI Generation', included: true },
            { text: 'Unlimited Documents', included: true },
        ],
        cta: 'Get Pro',
        disabled: false,
    },
    {
        id: 'unlimited',
        name: 'Unlimited',
        price: '799',
        period: '/month',
        description: 'No limits, ever',
        icon: Crown,
        color: 'violet',
        features: [
            { text: 'Unlimited AI Quizzes', included: true },
            { text: 'Unlimited Flashcard Decks', included: true },
            { text: 'Study Rooms', included: true },
            { text: 'Community Decks', included: true },
            { text: 'Progress Tracking', included: true },
            { text: 'Priority AI Generation', included: true },
            { text: 'Unlimited Documents', included: true },
        ],
        cta: 'Go Unlimited',
        disabled: false,
    },
];

const Pricing = () => {
    const [toast, setToast] = useState('');

    const handleBuy = (planName) => {
        setToast(`${planName} — coming soon! Payment integration is on the way.`);
        setTimeout(() => setToast(''), 4000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-30 bg-[#06060a]" />
            <div
                className="fixed inset-0 -z-20 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />
            <div className="fixed top-[-15%] left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[700px] bg-indigo-600/[0.06] rounded-full blur-[180px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[10%] -z-10 w-[400px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#06060a]/70 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link to="/landing" className="flex items-center gap-2.5">
                        <div className="bg-indigo-600 rounded-lg p-2">
                            <BookOpen className="text-white w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-sm tracking-tight">AI Study Assist</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors text-white">
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="pt-20 pb-4 px-6">
                <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible" variants={stagger}>
                    <motion.div variants={fade} custom={0}>
                        <Link to="/landing" className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors mb-6">
                            <ChevronLeft className="w-3 h-3" /> Back to home
                        </Link>
                    </motion.div>
                    <motion.h1 variants={fade} custom={1} className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                        Pick a plan that fits your study load
                    </motion.h1>
                    <motion.p variants={fade} custom={2} className="text-gray-500 max-w-md mx-auto">
                        Start free. Upgrade when you need more AI generations.
                    </motion.p>
                </motion.div>
            </section>

            {/* Cards */}
            <section className="py-12 px-6">
                <motion.div
                    className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                >
                    {plans.map((plan, idx) => {
                        const isPopular = plan.popular;
                        return (
                            <motion.div
                                key={plan.id}
                                variants={fade}
                                custom={idx + 3}
                                className="relative group"
                            >
                                {/* Popular badge */}
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-indigo-600/30">
                                        Most Popular
                                    </div>
                                )}

                                {/* Card glow for popular */}
                                {isPopular && (
                                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-indigo-500/30 via-indigo-500/10 to-transparent opacity-100 blur-sm pointer-events-none" />
                                )}

                                <div className={`
                                    relative h-full flex flex-col rounded-2xl p-6 transition-all duration-300
                                    ${isPopular
                                        ? 'bg-white/[0.07] border-2 border-indigo-500/30'
                                        : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                                    }
                                `}>
                                    {/* Plan header */}
                                    <div className="mb-6">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center mb-4
                                            ${plan.color === 'indigo' ? 'bg-indigo-500/15 border border-indigo-500/20' : ''}
                                            ${plan.color === 'violet' ? 'bg-violet-500/15 border border-violet-500/20' : ''}
                                            ${plan.color === 'gray' ? 'bg-white/[0.06] border border-white/[0.1]' : ''}
                                        `}>
                                            <plan.icon className={`w-5 h-5 ${
                                                plan.color === 'indigo' ? 'text-indigo-400' :
                                                plan.color === 'violet' ? 'text-violet-400' :
                                                'text-gray-400'
                                            }`} />
                                        </div>
                                        <h3 className="text-base font-bold text-white mb-0.5">{plan.name}</h3>
                                        <p className="text-xs text-gray-600">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs text-gray-500 font-medium">₹</span>
                                            <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                                            <span className="text-sm text-gray-600 font-medium">{plan.period}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.features.map((f) => (
                                            <li key={f.text} className="flex items-start gap-2.5">
                                                {f.included ? (
                                                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                ) : (
                                                    <X className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                                                )}
                                                <span className={`text-sm ${f.included ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {f.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <button
                                        onClick={() => !plan.disabled && handleBuy(plan.name)}
                                        disabled={plan.disabled}
                                        className={`
                                            w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
                                            ${plan.disabled
                                                ? 'bg-white/[0.04] text-gray-600 cursor-default border border-white/[0.06]'
                                                : isPopular
                                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98]'
                                                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-white/[0.2] active:scale-[0.98]'
                                            }
                                        `}
                                    >
                                        {plan.cta}
                                        {!plan.disabled && <ArrowRight className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* FAQ-style note */}
            <section className="pb-20 px-6">
                <motion.div
                    className="max-w-2xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                >
                    <motion.p variants={fade} className="text-sm text-gray-600">
                        All plans include access to Study Rooms, Community Decks, and Progress Tracking.
                        <br />
                        Upgrade or downgrade anytime — no lock-in.
                    </motion.p>
                </motion.div>
            </section>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Pricing;
