import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, BrainCircuit, LibraryBig, ArrowRight, Home } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // To display document name, we could fetch from dashboard list or have a single doc endpoint.
                // Since we don't have a single doc endpoint, we fetch all and filter.
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

    if (loading) return <div className="flex justify-center p-20"><span className="loader"></span></div>;
    if (!document) return <div className="text-center p-20 text-red-500">Document not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">
                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"><Home className="w-4 h-4" /> Dashboard</Link>
                <span>/</span>
                <span className="truncate max-w-[200px] text-gray-800 dark:text-gray-200 font-medium transition-colors">{document.fileName}</span>
            </div>

            <div className="glass dark:glass-dark rounded-3xl p-8 flex items-start gap-6 relative overflow-hidden transition-colors border-gray-200/50 dark:border-white/10">
                <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-2xl flex-shrink-0 relative z-10 transition-colors border border-gray-200/50 dark:border-gray-700/50">
                    <FileText className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors tracking-tight">{document.fileName}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Uploaded {new Date(document.uploadDate).toLocaleDateString()}</p>
                </div>
            </div>

            {aiError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {aiError}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Quiz Section */}
                <div className="glass dark:glass-dark rounded-2xl p-6 flex flex-col h-full transition-colors border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-2.5 rounded-xl transition-colors border border-gray-200/50 dark:border-gray-700/50">
                            <BrainCircuit className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors tracking-tight">Quizzes</h2>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 mb-6 flex-1 transition-colors text-sm">
                        Test your knowledge. AI will generate multiple-choice questions based on this document's content.
                    </p>

                    {quizzes.length > 0 && (
                        <div className="space-y-3 mb-6">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider transition-colors">Previous Quizzes</p>
                            {quizzes.map((quiz, i) => (
                                <Link
                                    key={quiz._id}
                                    to={`/quiz/${quiz._id}`}
                                    className="flex justify-between items-center bg-transparent hover:bg-gray-50/80 dark:hover:bg-[#151515] p-3 rounded-xl border border-gray-200/60 dark:border-gray-800 transition-colors group"
                                >
                                    <span className="font-medium text-gray-800 dark:text-gray-300 transition-colors text-sm">Quiz #{quizzes.length - i}</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleGenerateQuiz}
                        disabled={generatingQuiz}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-2.5 px-4 rounded-full transition-all disabled:opacity-50 text-sm shadow-sm"
                    >
                        {generatingQuiz ? <span className="loader !w-4 !h-4 !border-[2px] !border-t-current !border-current/30"></span> : 'Generate New Quiz'}
                    </button>
                </div>

                {/* Flashcards Section */}
                <div className="glass dark:glass-dark rounded-2xl p-6 flex flex-col h-full transition-colors border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-2.5 rounded-xl transition-colors border border-gray-200/50 dark:border-gray-700/50">
                            <LibraryBig className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors tracking-tight">Flashcards</h2>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 mb-6 flex-1 transition-colors text-sm">
                        Memorize key concepts. AI will extract important terms and definitions for active recall.
                    </p>

                    {flashcards.length > 0 && (
                        <div className="space-y-3 mb-6">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider transition-colors">Previous Decks</p>
                            {flashcards.map((deck, i) => (
                                <Link
                                    key={deck._id}
                                    to={`/flashcards/${deck._id}`}
                                    className="flex justify-between items-center bg-transparent hover:bg-gray-50/80 dark:hover:bg-[#151515] p-3 rounded-xl border border-gray-200/60 dark:border-gray-800 transition-colors group"
                                >
                                    <span className="font-medium text-gray-800 dark:text-gray-300 transition-colors text-sm">Deck #{flashcards.length - i}</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleGenerateFlashcards}
                        disabled={generatingCards}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-2.5 px-4 rounded-full transition-all disabled:opacity-50 text-sm shadow-sm"
                    >
                        {generatingCards ? <span className="loader !w-4 !h-4 !border-[2px] !border-t-current !border-current/30"></span> : 'Generate Flashcards'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentView;
