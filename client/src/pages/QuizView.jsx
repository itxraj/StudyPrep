import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw, Home } from 'lucide-react';
import api from '../api/axios';

const QuizView = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await api.get('/ai/quizzes');
                const found = data.find(q => q._id === id);
                if (found) setQuiz(found);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        let timer;
        if (!loading && !isFinished) {
            timer = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [loading, isFinished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (option) => {
        if (selectedAnswers[currentQuestionIdx]) return; // prevent changing answer after selection
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: option }));

        const isCorrect = option === quiz.questions[currentQuestionIdx].correctAnswer;
        if (isCorrect) setScore(prev => prev + 1);
    };

    const handleNext = () => {
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});
        setIsFinished(false);
        setScore(0);
        setTimeElapsed(0);
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loader"></span></div>;
    if (!quiz) return <div className="text-center p-20 text-red-500">Quiz not found</div>;

    const currentQ = quiz.questions[currentQuestionIdx];
    const hasAnsweredCurrent = !!selectedAnswers[currentQuestionIdx];

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">
                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"><Home className="w-4 h-4" /> Dashboard</Link>
                <span>/</span>
                <Link to={`/document/${quiz.documentId}`} className="hover:text-primary-600 dark:hover:text-primary-400">Document</Link>
                <span>/</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium transition-colors">Quiz Session</span>
            </div>

            {!isFinished ? (
                <div className="glass dark:glass-dark rounded-2xl p-6 md:p-8 relative overflow-hidden transition-colors border-gray-200/50 dark:border-white/5">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800/60 pb-4 transition-colors">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 px-3 py-1.5 rounded-full transition-colors text-sm">
                            Question {currentQuestionIdx + 1} of {quiz.questions.length}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium transition-colors text-sm">
                            <Clock className="w-4 h-4" />
                            {formatTime(timeElapsed)}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-8 overflow-hidden transition-colors">
                        <div
                            className="bg-primary-500 h-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIdx) / quiz.questions.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Question block */}
                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug transition-colors tracking-tight">
                            {currentQ.question}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        {currentQ.options.map((option, idx) => {
                            const isSelected = selectedAnswers[currentQuestionIdx] === option;
                            const isCorrect = option === currentQ.correctAnswer;

                            let optionStyle = "border-gray-200/60 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-[#151515] text-gray-800 dark:text-gray-300 bg-transparent";
                            if (hasAnsweredCurrent) {
                                if (isCorrect) optionStyle = "border-green-500/50 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/10 text-green-800 dark:text-green-400";
                                else if (isSelected && !isCorrect) optionStyle = "border-red-500/50 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/10 text-red-800 dark:text-red-400";
                                else optionStyle = "border-gray-200/60 dark:border-gray-800 opacity-50 bg-transparent";
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={hasAnsweredCurrent}
                                    onClick={() => handleSelectOption(option)}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-medium flex justify-between items-center ${optionStyle}`}
                                >
                                    <span>{option}</span>
                                    {hasAnsweredCurrent && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {hasAnsweredCurrent && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation Box */}
                    {hasAnsweredCurrent && currentQ.explanation && (
                        <div className="mt-8 p-5 rounded-2xl bg-gray-50/80 dark:bg-[#111] border border-gray-200/60 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 transition-colors">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2 transition-colors">Explanation</p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors">{currentQ.explanation}</p>
                        </div>
                    )}

                    {/* Next Button */}
                    {hasAnsweredCurrent && (
                        <div className="mt-8 flex justify-end animate-in fade-in">
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-2.5 px-6 rounded-full shadow-sm dark:shadow-white/10 transition-transform hover:-translate-y-0.5"
                            >
                                {currentQuestionIdx < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass dark:glass-dark rounded-2xl border-gray-200/50 dark:border-white/5 p-10 text-center animate-in zoom-in-95 duration-500 flex flex-col items-center transition-colors">
                    <div className="w-32 h-32 rounded-full border-[6px] border-primary-100 dark:border-gray-800 flex items-center justify-center mb-6 relative transition-colors">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-primary-50 dark:text-gray-900" />
                            <circle
                                cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="transparent"
                                className="text-primary-500 transition-all duration-1000 ease-out glow-accent"
                                strokeDasharray={2 * Math.PI * 56}
                                strokeDashoffset={(2 * Math.PI * 56) * (1 - score / quiz.questions.length)}
                            />
                        </svg>
                        <div className="text-3xl font-black text-gray-900 dark:text-white transition-colors tracking-tight">
                            {Math.round((score / quiz.questions.length) * 100)}%
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors tracking-tight">Quiz Completed!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm transition-colors">
                        You scored {score} out of {quiz.questions.length} in {formatTime(timeElapsed)}. Great job!
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold shadow-sm py-2.5 px-6 rounded-full transition-colors border border-gray-200/50 dark:border-gray-700/50"
                        >
                            <RotateCcw className="w-4 h-4" /> Retake
                        </button>
                        <Link
                            to={`/document/${quiz.documentId}`}
                            className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold py-2.5 px-6 rounded-full transition-colors shadow-sm dark:shadow-white/10"
                        >
                            <Home className="w-4 h-4" /> Back to Document
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizView;
