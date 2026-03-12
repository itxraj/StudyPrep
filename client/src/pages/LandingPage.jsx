import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Upload, BrainCircuit, LibraryBig, Users,
    BarChart3, ArrowRight, FileText, Sparkles, Globe,
    MessageSquare, ChevronRight
} from 'lucide-react';

/* ─── Animation ─── */
const fade = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] },
    }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ─── GlassCard ─── */
const GlassCard = ({ children, className = '', ...props }) => (
    <div className={`bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl transition-all duration-300 ${className}`} {...props}>
        {children}
    </div>
);

/* ─── How the app actually works ─── */
const workflow = [
    {
        step: '01',
        icon: Upload,
        title: 'Drop a PDF',
        body: 'Upload your lecture notes, textbook chapter, or any study material. We handle PDFs of any size.',
    },
    {
        step: '02',
        icon: Sparkles,
        title: 'AI does the work',
        body: 'Our AI reads your document and generates a quiz with multiple-choice questions (including explanations) and a flashcard deck.',
    },
    {
        step: '03',
        icon: BrainCircuit,
        title: 'Study with purpose',
        body: 'Take timed quizzes, flip through flashcards, mark cards as mastered, and track your progress over time.',
    },
];

/* ─── Real features that exist in the app ─── */
const capabilities = [
    {
        icon: FileText,
        title: 'PDF to study material',
        body: 'Upload any PDF and get a quiz + flashcard deck generated from it automatically.',
    },
    {
        icon: BrainCircuit,
        title: 'Timed quizzes',
        body: 'Multiple-choice questions with instant feedback, explanations, and a scored results screen.',
    },
    {
        icon: LibraryBig,
        title: 'Flashcards with mastery',
        body: '3D-flip cards. Mark each one as mastered and track your completion percentage.',
    },
    {
        icon: Users,
        title: 'Study rooms',
        body: 'Create or join rooms with real-time chat. Study alongside others and stay accountable.',
    },
    {
        icon: Globe,
        title: 'Community decks',
        body: 'Publish your flashcard decks for others to use, or browse and like decks shared by the community.',
    },
    {
        icon: BarChart3,
        title: 'Progress tracking',
        body: 'See how many quizzes you\'ve completed, flashcards reviewed, and study sessions logged.',
    },
];

/* ─── Interactive demo tabs ─── */
const demoTabs = [
    {
        id: 'quiz',
        label: 'Quiz',
        icon: BrainCircuit,
        content: {
            question: 'What is the time complexity of binary search?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correct: 1,
        },
    },
    {
        id: 'flashcard',
        label: 'Flashcard',
        icon: LibraryBig,
        content: {
            front: 'What is Big-O notation?',
            back: 'A mathematical notation describing the upper bound of an algorithm\'s growth rate as input size increases.',
        },
    },
    {
        id: 'room',
        label: 'Study Room',
        icon: MessageSquare,
        content: {
            name: 'CS 101 — Exam Prep',
            participants: 4,
            messages: [
                { user: 'Alex', text: 'Does anyone understand recursion?' },
                { user: 'Sam', text: 'Think of it as a function calling itself with a smaller problem.' },
            ],
        },
    },
];

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState('quiz');
    const [flipped, setFlipped] = useState(false);
    const [selected, setSelected] = useState(null);

    const tab = demoTabs.find((t) => t.id === activeTab);

    return (
        <div className="min-h-screen text-white font-sans relative overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-20 bg-[#0b0b1a]" />
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[5%] w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[150px] animate-float" />
                <div className="absolute bottom-[-5%] right-[5%] w-[400px] h-[400px] bg-purple-600/[0.06] rounded-full blur-[130px] animate-float-delayed" />
            </div>

            {/* ═══ Navbar ═══ */}
            <nav className="sticky top-0 z-50 bg-[#0b0b1a]/60 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link to="/landing" className="flex items-center gap-2.5">
                        <div className="bg-indigo-600 rounded-lg p-2">
                            <BookOpen className="text-white w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">AI Study Assist</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ Hero ═══ */}
            <section className="pt-24 sm:pt-32 pb-20 px-6">
                <motion.div className="max-w-3xl mx-auto" initial="hidden" animate="visible" variants={stagger}>
                    <motion.p variants={fade} custom={0} className="text-indigo-400 text-sm font-medium mb-4 tracking-wide">
                        Open-source study tool
                    </motion.p>
                    <motion.h1 variants={fade} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-5">
                        Upload a PDF.
                        <br />
                        <span className="text-gray-500">Get quizzes and flashcards.</span>
                    </motion.h1>
                    <motion.p variants={fade} custom={2} className="text-gray-500 text-lg max-w-xl mb-8 leading-relaxed">
                        Drop your lecture notes in and the AI creates study material you can actually use — quizzes with explanations, flashcards you can flip, and progress you can track.
                    </motion.p>
                    <motion.div variants={fade} custom={3} className="flex flex-wrap gap-3">
                        <Link to="/register" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                            Get started <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a href="#how" className="inline-flex items-center gap-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-6 py-3 rounded-lg transition-all text-sm">
                            See how it works
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ Interactive Demo ═══ */}
            <section className="pb-28 px-6">
                <motion.div className="max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
                    <motion.div variants={fade}>
                        {/* Tab switcher */}
                        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-4 w-fit">
                            {demoTabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => { setActiveTab(t.id); setFlipped(false); setSelected(null); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <t.icon className="w-4 h-4" />
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Demo card */}
                        <GlassCard className="p-6 sm:p-8 min-h-[280px] relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {/* Quiz demo */}
                                    {activeTab === 'quiz' && (
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
                                                <span className="bg-white/[0.06] px-2 py-0.5 rounded">Question 1 of 10</span>
                                                <span>0:42</span>
                                            </div>
                                            <p className="text-lg font-semibold mb-6">{tab.content.question}</p>
                                            <div className="space-y-2">
                                                {tab.content.options.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelected(i)}
                                                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                                            selected === null
                                                                ? 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                                                                : i === tab.content.correct
                                                                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                                                    : selected === i
                                                                        ? 'border-red-500/40 bg-red-500/10 text-red-400'
                                                                        : 'border-white/5 opacity-40'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                            {selected !== null && (
                                                <p className="text-xs text-gray-500 mt-4 bg-white/[0.03] p-3 rounded-lg border border-white/[0.06]">
                                                    <span className="text-gray-400 font-medium">Explanation:</span> Binary search halves the search space each iteration, giving O(log n) time complexity.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Flashcard demo */}
                                    {activeTab === 'flashcard' && (
                                        <div
                                            onClick={() => setFlipped(!flipped)}
                                            className="cursor-pointer select-none min-h-[200px] flex flex-col items-center justify-center text-center"
                                        >
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">
                                                {flipped ? 'Answer' : 'Card 1 of 12 — click to flip'}
                                            </p>
                                            <p className="text-xl sm:text-2xl font-bold max-w-md leading-snug">
                                                {flipped ? tab.content.back : tab.content.front}
                                            </p>
                                        </div>
                                    )}

                                    {/* Study room demo */}
                                    {activeTab === 'room' && (
                                        <div>
                                            <div className="flex items-center justify-between mb-5">
                                                <div>
                                                    <p className="font-semibold">{tab.content.name}</p>
                                                    <p className="text-xs text-gray-500">{tab.content.participants} participants</p>
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {['A', 'S', 'J', 'M'].map((l, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-[#0b0b1a] flex items-center justify-center text-[10px] font-bold">{l}</div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                                                {tab.content.messages.map((m, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{m.user[0]}</div>
                                                        <div>
                                                            <span className="text-xs text-indigo-400 font-medium">{m.user}</span>
                                                            <p className="text-sm text-gray-300">{m.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="mt-2 pt-3 border-t border-white/[0.06]">
                                                    <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-500">Type a message...</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ How it works ═══ */}
            <section id="how" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
                        <motion.p variants={fade} className="text-indigo-400 text-sm font-medium mb-3">How it works</motion.p>
                        <motion.h2 variants={fade} className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-12">Three steps, no setup.</motion.h2>

                        <div className="space-y-6">
                            {workflow.map((w, i) => (
                                <motion.div key={w.step} variants={fade} custom={i}>
                                    <GlassCard className="p-6 flex items-start gap-5 group hover:bg-white/[0.1] hover:border-white/[0.18]">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-colors">
                                            <w.icon className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1">Step {w.step}</p>
                                            <h3 className="font-bold mb-1">{w.title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">{w.body}</p>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ What you get ═══ */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.p variants={fade} className="text-indigo-400 text-sm font-medium mb-3">What you get</motion.p>
                        <motion.h2 variants={fade} className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-12">The full toolkit, no upsells.</motion.h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {capabilities.map((c, i) => (
                                <motion.div key={c.title} variants={fade} custom={i}>
                                    <GlassCard className="p-6 h-full hover:bg-white/[0.1] hover:border-white/[0.18] group">
                                        <c.icon className="w-5 h-5 text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors" />
                                        <h3 className="font-bold text-sm mb-1.5">{c.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{c.body}</p>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="py-24 px-6">
                <motion.div className="max-w-2xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
                    <motion.h2 variants={fade} className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                        Stop re-reading your notes.
                    </motion.h2>
                    <motion.p variants={fade} className="text-gray-500 mb-8 max-w-lg mx-auto">
                        Upload a PDF, get a quiz and a flashcard deck, track what you actually know. That's it.
                    </motion.p>
                    <motion.div variants={fade}>
                        <Link to="/register" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                            Create an account <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="border-t border-white/[0.06] px-6 py-8">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-indigo-600 rounded-lg p-1.5">
                            <BookOpen className="text-white w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-sm">AI Study Assist</span>
                    </div>
                    <p className="text-gray-600 text-xs">Built as a learning project. Not affiliated with any institution.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
