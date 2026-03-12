import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw, Home, CheckCircle2, Globe, Lock } from 'lucide-react';
import api from '../api/axios';

const FlashcardView = () => {
    const { id } = useParams();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredCards, setMasteredCards] = useState(new Set());
    const [isPublic, setIsPublic] = useState(false);
    const [loggedProgress, setLoggedProgress] = useState(false);

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const { data } = await api.get('/ai/flashcards');
                const found = data.find(d => d._id === id);
                if (found) {
                    setDeck(found);
                    setIsPublic(found.isPublic || false);
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeck();
    }, [id]);

    useEffect(() => {
        if (deck && masteredCards.size === deck.cards.length && !loggedProgress) {
            api.post('/progress/session', { flashcardsReviewed: deck.cards.length }).catch(console.error);
            setLoggedProgress(true);
        }
    }, [masteredCards.size, deck, loggedProgress]);

    const togglePublish = async () => {
        try {
            const { data } = await api.post(`/community/decks/${id}/publish`);
            setIsPublic(data.isPublic);
        } catch (err) {
            console.error("Failed to publish", err);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (currentIndex < deck.cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    };

    const toggleMastered = (e) => {
        e.stopPropagation();
        setMasteredCards(prev => {
            const next = new Set(prev);
            if (next.has(currentIndex)) next.delete(currentIndex);
            else next.add(currentIndex);
            return next;
        });
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loader"></span></div>;
    if (!deck) return <div className="text-center p-20 text-red-500">Flashcards not found</div>;

    const progress = Math.round((masteredCards.size / deck.cards.length) * 100);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                    <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"><Home className="w-4 h-4" /> Dashboard</Link>
                    <span>/</span>
                    <Link to={`/document/${deck.documentId}`} className="hover:text-primary-600 dark:hover:text-primary-400">Document</Link>
                    <span>/</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium transition-colors">Flashcards</span>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                    <button
                        onClick={togglePublish}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border transition-colors text-sm font-semibold ${isPublic ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20' : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {isPublic ? <><Globe className="w-4 h-4" /> Public</> : <><Lock className="w-4 h-4" /> Private</>}
                    </button>
                    <div className="flex items-center gap-3 bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-colors">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Mastery: {progress}%</span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden transition-colors">
                            <div className="bg-primary-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Flashcard Arena */}
            <div className="relative h-[400px] w-full max-w-2xl mx-auto perspective-1000 mb-8">
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front of card */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden glass dark:glass-dark rounded-3xl p-10 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-200/60 dark:border-white/5 transition-colors"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="flex justify-between items-start mb-6 w-full">
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Card {currentIndex + 1} of {deck.cards.length}</span>
                            <button
                                onClick={toggleMastered}
                                className={`p-2 rounded-full transition-colors ${masteredCards.has(currentIndex) ? 'bg-green-50/80 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-500/20' : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50'}`}
                            >
                                <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white leading-tight transition-colors">
                                {deck.cards[currentIndex].front}
                            </h2>
                        </div>
                        <p className="text-center text-xs text-gray-400 dark:text-gray-600 font-semibold mt-6 uppercase tracking-widest transition-colors">Click to Reveal</p>
                    </div>

                    {/* Back of card */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-10 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-black dark:border-white transition-colors"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="flex justify-between items-start mb-6 w-full">
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Answer</span>
                        </div>
                        <div className="flex-1 flex items-start justify-center text-center overflow-y-auto px-2">
                            <p className="text-2xl md:text-3xl font-medium text-white/95 dark:text-gray-900/95 leading-relaxed tracking-tight">
                                {deck.cards[currentIndex].back}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-16 hidden md:block group z-10">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="bg-white/80 dark:bg-[#111]/80 backdrop-blur p-3.5 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all outline-none"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-16 hidden md:block group z-10">
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === deck.cards.length - 1}
                        className="bg-white/80 dark:bg-[#111]/80 backdrop-blur p-3.5 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all outline-none"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden justify-center items-center gap-6 mt-8 relative z-10">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="bg-white/80 dark:bg-[#111]/80 backdrop-blur p-3.5 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="text-gray-500 dark:text-gray-400 font-semibold transition-colors text-sm">{currentIndex + 1} / {deck.cards.length}</div>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === deck.cards.length - 1}
                    className="bg-white/80 dark:bg-[#111]/80 backdrop-blur p-3.5 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-30 transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Quick Restart */}
            <div className="flex justify-center mt-12">
                <button
                    onClick={() => { setCurrentIndex(0); setIsFlipped(false); setMasteredCards(new Set()); setLoggedProgress(false); }}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors text-sm"
                >
                    <RotateCcw className="w-4 h-4" /> Start Over
                </button>
            </div>
        </div>
    );
};

export default FlashcardView;
