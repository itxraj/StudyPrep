import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, BookOpen, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const StudyRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', subject: '' });
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/rooms', newRoom);
            navigate(`/rooms/${data._id}`);
        } catch (error) {
            console.error("Error creating room", error);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            await api.post(`/rooms/${roomId}/join`);
            navigate(`/rooms/${roomId}`);
        } catch (error) {
            console.error("Error joining room", error);
        }
    };

    const handleDeleteRoom = async (e, roomId) => {
        e.stopPropagation();
        if (!window.confirm('Delete this room? This cannot be undone.')) return;
        try {
            await api.delete(`/rooms/${roomId}`);
            setRooms(prev => prev.filter(r => r._id !== roomId));
        } catch (error) {
            console.error("Error deleting room", error);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loader"></span></div>;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Study Rooms</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Join a collaborative session or host your own.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-primary-600/20 transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5" /> Create Room
                </button>
            </div>

            {isCreating && (
                <div className="glass dark:glass-dark rounded-2xl p-6 mb-8 border border-primary-500/30">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Start a new session</h2>
                    <form onSubmit={handleCreateRoom} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Room Name (e.g., Late Night Calculus)"
                            required
                            className="flex-1 bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 dark:text-white"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            required
                            className="md:w-48 bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 dark:text-white"
                            value={newRoom.subject}
                            onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                        />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold px-4">
                                Cancel
                            </button>
                            <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-transform hover:scale-105">
                                Launch
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.length === 0 ? (
                    <div className="col-span-full text-center p-12 glass dark:glass-dark rounded-3xl border border-gray-200/50 dark:border-white/5">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold dark:text-white mb-2">No active rooms</h3>
                        <p className="text-gray-500 dark:text-gray-400">Be the first to create one!</p>
                    </div>
                ) : (
                    rooms.map(room => {
                        const roomCreatorId = typeof room.createdBy === 'string' ? room.createdBy : room.createdBy?._id;
                        const isOwner = user && String(user._id) === String(roomCreatorId || '');
                        return (
                            <div key={room._id} className="glass dark:glass-dark rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 hover:border-primary-500/50 transition-all flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{room.subject}</span>
                                        <h3 className="text-lg font-bold dark:text-white mt-1 group-hover:text-primary-500 transition-colors">{room.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full transition-colors">
                                            <Users className="w-3.5 h-3.5" /> {room.activeMembers.length}
                                        </div>
                                        <button
                                                onClick={(e) => handleDeleteRoom(e, room._id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                title="Delete room"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                    </div>
                                </div>
                                <div className="flex-1"></div>
                                <button
                                    onClick={() => handleJoinRoom(room._id)}
                                    className="w-full mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                                >
                                    Join Session
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default StudyRooms;
