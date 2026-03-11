import { useState } from 'react';
import { X, UploadCloud, FileText } from 'lucide-react';
import api from '../api/axios';

const UploadModal = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        const selected = e.dataTransfer.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setError('');
        } else {
            setError('Please drop a valid PDF file.');
        }
    }

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Optionally redirect to the document view directly
            onSuccess(data.documentId);
        } catch (err) {
            setError(err.response?.data?.message || 'Error parsing PDF. Make sure it contains text.');
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in transition-colors">
            <div
                className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-900/50 transition-colors">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">Upload Study Material</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 transition-colors">
                            {error}
                        </div>
                    )}

                    {!file ? (
                        <div
                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all cursor-pointer group"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="bg-primary-100 dark:bg-primary-900/40 p-4 rounded-full inline-block mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">PDF documents only (max 10MB recommended)</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-dark-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between transition-colors">
                            <div className="flex items-center gap-4 truncate">
                                <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-xl flex-shrink-0 transition-colors">
                                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="truncate">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate transition-colors">{file.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 transition-colors"
                                disabled={isUploading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors flex items-center justify-center min-w-[120px]"
                        >
                            {isUploading ? <span className="loader !w-5 !h-5 !border-[2px] !border-t-white !border-white/30 truncate block"></span> : 'Process PDF'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
