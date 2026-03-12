import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    FileText, BrainCircuit, LibraryBig, ArrowRight, Home,
    Sparkles, Clock, Layers, ChevronRight, Trash2
} from 'lucide-react';
import api from '../api/axios';

const DocumentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingQuiz, setGeneratingQuiz] = useState(false);
    const [generatingCards, setGeneratingCards] = useState(false);
    const [aiError, setAiError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const docsRes = await api.get('/upload');
                const doc = docsRes.data.find(d => d._id === id);
                if (doc) setDocument(doc);
                else setAiError("Document not found");

                const [quizRes, cardsRes] = await Promise.all([
                    api.get('/ai/quizzes'),
                    api.get('/ai/flashcards')
                ]);

                setQuizzes(quizRes.data.filter(q => q.documentId === id));
                setFlashcards(cardsRes.data.filter(c => c.documentId === id));
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleGenerateQuiz = async () => {
        setGeneratingQuiz(true);
        setAiError('');
        try {
            const { data } = await api.post('/ai/quiz', { documentId: id, numQuestions: 5 });
            setQuizzes([data, ...quizzes]);
            navigate(`/quiz/${data._id}`);
        } catch (error) {
            setAiError(error.response?.data?.message || 'Error generating quiz');
        } finally {
            setGeneratingQuiz(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        setGeneratingCards(true);
        setAiError('');
        try {
            const { data } = await api.post('/ai/flashcards', { documentId: id, numCards: 5 });
            setFlashcards([data, ...flashcards]);
            navigate(`/flashcards/${data._id}`);
        } catch (error) {
            setAiError(error.response?.data?.message || 'Error generating flashcards');
        } finally {
            setGeneratingCards(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this document and all its quizzes/flashcards?')) return;
        setDeleting(true);
        try {
            await api.delete(`/upload/${id}`);
            navigate('/');
        } catch (error) {
            console.error("Error deleting document:", error);
            setDeleting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loader"></span></div>;
    if (!document) return <div className="text-center p-20 text-red-500 dark:text-red-400">Document not found</div>;

    const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);
    const totalCards = flashcards.reduce((sum, d) => sum + (d.cards?.length || 0), 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors">
                    <Home className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="truncate max-w-[250px] text-gray-700 dark:text-gray-200 font-medium">{document.fileName}</span>
            </nav>

            {/* Document Header */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200/80 dark:border-white/[0.08] p-6 sm:p-8">
                <div className="flex items-start gap-5">
                    <div className="bg-gray-100 dark:bg-white/[0.06] p-3.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] flex-shrink-0">
                        <FileText className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 truncate">
                            {document.fileName}
                        </h1>
                        <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Uploaded {new Date(document.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all flex-shrink-0 disabled:opacity-50"
                        title="Delete document"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Quick stats */}
                <div className="flex gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-500 dark:text-gray-400">
                            <strong className="text-gray-800 dark:text-gray-200">{quizzes.length}</strong> {quizzes.length === 1 ? 'quiz' : 'quizzes'} · {totalQuestions} questions
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-gray-500 dark:text-gray-400">
                            <strong className="text-gray-800 dark:text-gray-200">{flashcards.length}</strong> {flashcards.length === 1 ? 'deck' : 'decks'} · {totalCards} cards
                        </span>
                    </div>
                </div>
            </div>

            {/* Error */}
            {aiError && (
                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-500/20 text-sm">
                    {aiError}
                </div>
            )}

            {/* Generate buttons */}
            <div className="grid sm:grid-cols-2 gap-3">
                <button
                    onClick={handleGenerateQuiz}
                    disabled={generatingQuiz}
                    className="flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200/80 dark:border-white/[0.08] hover:border-blue-300 dark:hover:border-blue-500/30 rounded-xl p-4 transition-all group disabled:opacity-50 text-left"
                >
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-2.5 rounded-lg border border-blue-100 dark:border-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                        {generatingQuiz
                            ? <span className="loader !w-5 !h-5 !border-[2px] !border-t-blue-500 !border-blue-200 dark:!border-blue-500/30 block"></span>
                            : <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        }
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">Generate Quiz</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">5 AI-generated questions</p>
                    </div>
                </button>
                <button
                    onClick={handleGenerateFlashcards}
                    disabled={generatingCards}
                    className="flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200/80 dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-500/30 rounded-xl p-4 transition-all group disabled:opacity-50 text-left"
                >
                    <div className="bg-purple-50 dark:bg-purple-500/10 p-2.5 rounded-lg border border-purple-100 dark:border-purple-500/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors">
                        {generatingCards
                            ? <span className="loader !w-5 !h-5 !border-[2px] !border-t-purple-500 !border-purple-200 dark:!border-purple-500/30 block"></span>
                            : <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        }
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">Generate Flashcards</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">5 AI-generated cards</p>
                    </div>
                </button>
            </div>

            {/* Quizzes + Flashcards lists */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Quizzes */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <BrainCircuit className="w-4 h-4 text-blue-500" />
                        <h2 className="font-bold text-sm text-gray-900 dark:text-white">Quizzes</h2>
                    </div>
                    {quizzes.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-xl p-6 text-center">
                            <p className="text-sm text-gray-400 dark:text-gray-500">No quizzes yet. Generate one above.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {quizzes.map((quiz, i) => (
                                <Link
                                    key={quiz._id}
                                    to={`/quiz/${quiz._id}`}
                                    className="flex items-center justify-between bg-white dark:bg-[#111] border border-gray-200/80 dark:border-white/[0.08] hover:border-blue-200 dark:hover:border-blue-500/20 rounded-xl px-4 py-3 transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                                            {quizzes.length - i}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                Quiz #{quizzes.length - i}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {quiz.questions?.length || 0} questions
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Flashcards */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <LibraryBig className="w-4 h-4 text-purple-500" />
                        <h2 className="font-bold text-sm text-gray-900 dark:text-white">Flashcard Decks</h2>
                    </div>
                    {flashcards.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-xl p-6 text-center">
                            <p className="text-sm text-gray-400 dark:text-gray-500">No decks yet. Generate one above.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {flashcards.map((deck, i) => (
                                <Link
                                    key={deck._id}
                                    to={`/flashcards/${deck._id}`}
                                    className="flex items-center justify-between bg-white dark:bg-[#111] border border-gray-200/80 dark:border-white/[0.08] hover:border-purple-200 dark:hover:border-purple-500/20 rounded-xl px-4 py-3 transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                                            {flashcards.length - i}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                Deck #{flashcards.length - i}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {deck.cards?.length || 0} cards
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentView;
