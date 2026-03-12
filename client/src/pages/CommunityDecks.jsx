import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, BookOpen, Layers } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CommunityDecks = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        try {
            const { data } = await api.get('/community/decks');
            setDecks(data);
        } catch (error) {
            console.error("Error fetching decks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (deckId) => {
        try {
            await api.post(`/community/decks/${deckId}/like`);
            // Toggle like optimistically
            setDecks(decks.map(deck => {
                if (deck._id !== deckId) return deck;
                const alreadyLiked = deck.likes.includes(user._id);
                return {
                    ...deck,
                    likes: alreadyLiked
                        ? deck.likes.filter(id => id !== user._id)
                        : [...deck.likes, user._id]
                };
            }));
        } catch (error) {
            console.error("Error liking deck", error);
        }
    };

    const filteredDecks = decks.filter(deck => {
        const creatorName = deck.userId?.name || '';
        const firstCard = deck.cards?.[0]?.front || '';
        const term = searchTerm.toLowerCase();
        return creatorName.toLowerCase().includes(term) || firstCard.toLowerCase().includes(term);
    });

    if (loading) return <div className="flex justify-center p-20"><span className="loader"></span></div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Community Decks</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Discover and study what others are learning.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search topics or creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700 rounded-full pl-12 pr-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:text-white transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Decks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDecks.length === 0 ? (
                    <div className="col-span-full text-center p-12 glass dark:glass-dark rounded-3xl border border-gray-200/50 dark:border-white/5">
                        <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold dark:text-white mb-2">No decks found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    filteredDecks.map((deck) => {
                        const isLiked = deck.likes.includes(user?._id);
                        return (
                            <div key={deck._id} className="glass dark:glass-dark rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 hover:-translate-y-1 hover:shadow-xl hover:border-primary-500/30 transition-all flex flex-col group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5" />
                                        {deck.cards.length} Cards
                                    </div>
                                    <button
                                        onClick={() => handleLike(deck._id)}
                                        className={`p-2 rounded-full transition-all ${isLiked ? 'bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    </button>
                                </div>

                                <div className="flex-1 mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                                        {deck.cards[0]?.front || "Untitled Deck"}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">
                                        {deck.cards[0]?.back}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-white">
                                            {(deck.userId?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                                            {deck.userId?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/flashcards/${deck._id}`)}
                                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                    >
                                        Study <BookOpen className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CommunityDecks;
