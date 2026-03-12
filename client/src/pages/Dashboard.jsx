import { useState, useEffect } from 'react';
import { Upload, FileText, BrainCircuit, LibraryBig, Plus } from 'lucide-react';
import api from '../api/axios';
import UploadModal from '../components/UploadModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const fetchDocuments = async () => {
        try {
            const { data } = await api.get('/upload');
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">

            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Your Study Hub</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage your materials and AI-generated study sessions.</p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-5 py-2.5 rounded-full shadow-lg dark:shadow-white/10 transition-all hover:scale-105 active:scale-95 font-semibold text-sm"
                >
                    <Plus className="w-5 h-5" />
                    New Document
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200/80 dark:border-white/[0.08] p-5 flex items-center gap-4 transition-colors">
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-2.5 rounded-xl border border-blue-100 dark:border-blue-500/20">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{documents.length}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Documents</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200/80 dark:border-white/[0.08] p-5 flex items-center gap-4 transition-colors">
                    <div className="bg-green-50 dark:bg-green-500/10 p-2.5 rounded-xl border border-green-100 dark:border-green-500/20">
                        <BrainCircuit className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">--</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Quizzes Taken</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200/80 dark:border-white/[0.08] p-5 flex items-center gap-4 transition-colors">
                    <div className="bg-purple-50 dark:bg-purple-500/10 p-2.5 rounded-xl border border-purple-100 dark:border-purple-500/20">
                        <LibraryBig className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">--</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Flashcards Mastered</p>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 transition-colors">Recent Documents</h2>
                {loading ? (
                    <div className="flex justify-center p-12"><span className="loader"></span></div>
                ) : documents.length === 0 ? (
                    <div className="bg-white dark:bg-[#111] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
                        <div className="bg-gray-50 dark:bg-white/[0.04] p-5 rounded-full">
                            <Upload className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No documents yet</h3>
                        <p className="text-gray-400 dark:text-gray-500 max-w-sm text-sm">Upload your first PDF to start generating quizzes and flashcards.</p>
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="mt-2 text-primary-600 font-semibold hover:underline"
                        >
                            Upload PDF
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div key={doc._id} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200/80 dark:border-white/[0.08] p-5 hover:border-gray-300 dark:hover:border-white/[0.15] transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
                                <Link to={`/document/${doc._id}`} className="absolute inset-0 z-0"></Link>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="bg-gray-100/80 dark:bg-gray-800/80 p-3 rounded-xl flex-shrink-0 transition-colors border border-gray-200/50 dark:border-gray-700/50 group-hover:bg-white dark:group-hover:bg-gray-800">
                                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 transition-colors">
                                        {new Date(doc.uploadDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mb-4 flex-1 transition-colors relative z-10 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                    {doc.fileName}
                                </h3>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60 transition-colors relative z-10">
                                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        Open Document →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isUploadOpen && (
                <UploadModal
                    onClose={() => setIsUploadOpen(false)}
                    onSuccess={() => {
                        setIsUploadOpen(false);
                        fetchDocuments();
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
