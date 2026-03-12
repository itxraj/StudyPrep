import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Send, Clock, ArrowLeft, Play, Pause, RotateCcw, Crown, MessageCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ActiveRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('work');

    const timerStateRef = useRef({ timeLeft, isRunning, mode });
    useEffect(() => {
        timerStateRef.current = { timeLeft, isRunning, mode };
    }, [timeLeft, isRunning, mode]);

    useEffect(() => {
        fetchRoomData();
    }, [roomId]);

    useEffect(() => {
        if (!socket || !user) return;

        socket.emit('join-room', { roomId, user: { _id: user._id, name: user.name } });

        socket.on('receive-message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on('timer-update', (state) => {
            setTimeLeft(state.timeLeft);
            setIsRunning(state.isRunning);
            setMode(state.mode);
        });

        socket.on('user-joined', (newUser) => {
            setRoom(prev => {
                if (!prev) return prev;
                if (prev.activeMembers.some(m => m._id === newUser._id)) return prev;
                return { ...prev, activeMembers: [...prev.activeMembers, newUser] };
            });
        });

        socket.on('user-left', (userId) => {
            setRoom(prev => {
                if (!prev) return prev;
                return { ...prev, activeMembers: prev.activeMembers.filter(m => m._id !== userId) };
            });
        });

        socket.on('request-timer-sync', () => {
            const current = timerStateRef.current;
            if (current.isRunning || current.timeLeft !== (current.mode === 'work' ? 25 * 60 : 5 * 60)) {
                socket.emit('timer-sync', { roomId, timerState: current });
            }
        });

        return () => {
            socket.emit('leave-room', { roomId, userId: user._id });
            socket.off('receive-message');
            socket.off('timer-update');
            socket.off('user-joined');
            socket.off('user-left');
            socket.off('request-timer-sync');
        };
    }, [socket, roomId, user]);

    // Timer Interval
    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            const newMode = mode === 'work' ? 'break' : 'work';
            const newTime = newMode === 'work' ? 25 * 60 : 5 * 60;
            if (mode === 'work') {
                api.post('/progress/session', { durationMinutes: 25 }).catch(console.error);
            }
            setMode(newMode);
            setTimeLeft(newTime);
            setIsRunning(false);
            if (socket) socket.emit('timer-sync', { roomId, timerState: { timeLeft: newTime, isRunning: false, mode: newMode } });
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode, socket, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchRoomData = async () => {
        try {
            const [roomRes, msgRes] = await Promise.all([
                api.get('/rooms'),
                api.get(`/rooms/${roomId}/messages`)
            ]);
            const currentRoom = roomRes.data.find(r => r._id === roomId);
            if (!currentRoom) {
                navigate('/rooms');
                return;
            }
            setRoom(currentRoom);
            setMessages(msgRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching room", error);
            navigate('/rooms');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msgData = {
            roomId,
            senderId: user._id,
            senderName: user.name,
            text: newMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, msgData]);
        setNewMessage('');

        if (socket) socket.emit('send-message', msgData);

        try {
            await api.post(`/rooms/${roomId}/messages`, { text: msgData.text });
        } catch (error) {
            console.error("Failed to save message", error);
        }
    };

    const toggleTimer = () => {
        const newState = !isRunning;
        setIsRunning(newState);
        if (socket) socket.emit('timer-sync', { roomId, timerState: { timeLeft, isRunning: newState, mode } });
    };

    const resetTimer = () => {
        const newTime = mode === 'work' ? 25 * 60 : 5 * 60;
        setTimeLeft(newTime);
        setIsRunning(false);
        if (socket) socket.emit('timer-sync', { roomId, timerState: { timeLeft: newTime, isRunning: false, mode } });
    };

    const handleLeave = async () => {
        try {
            await api.post(`/rooms/${roomId}/leave`);
            navigate('/rooms');
        } catch (error) {
            console.error("Error leaving", error);
        }
    };

    if (loading || !room) return <div className="flex justify-center p-20"><span className="loader"></span></div>;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Debug: log to find why isCreator fails
    console.log('DEBUG creator check:', {
        userId: user._id,
        roomCreatedBy: room.createdBy,
        roomCreatedByRaw: JSON.stringify(room.createdBy),
    });

    // If room has no createdBy (old rooms), everyone gets timer control
    const creatorId = typeof room.createdBy === 'string'
        ? room.createdBy
        : (room.createdBy?._id || null);
    const isCreator = !creatorId || String(user._id) === String(creatorId);
    const creatorName = room.createdBy?.name || 'Host';

    // Avatar color palette based on name hash
    const getAvatarColor = (name) => {
        const colors = [
            'from-violet-500 to-purple-600',
            'from-sky-500 to-blue-600',
            'from-emerald-500 to-teal-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
            'from-cyan-500 to-blue-500',
            'from-fuchsia-500 to-purple-600',
            'from-lime-500 to-green-600',
        ];
        let hash = 0;
        for (let i = 0; i < (name || '').length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Timer progress for the ring
    const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={handleLeave} className="p-2.5 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{room.name}</h1>
                        <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{room.subject}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold bg-white/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl">
                    <Users className="w-3.5 h-3.5" /> {room.activeMembers.length} online
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

                {/* Left Side: Timer & Members */}
                <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Pomodoro Timer */}
                    <div className="relative rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/[0.06]">
                        {/* Background glow */}
                        <div className={`absolute inset-0 ${mode === 'work' ? 'bg-gradient-to-br from-primary-500/5 via-transparent to-violet-500/5 dark:from-primary-500/10 dark:to-violet-500/10' : 'bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10'}`}></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-[#0f0f14]/80 backdrop-blur-xl"></div>

                        <div className="relative p-8 flex flex-col items-center justify-center">
                            {/* Top bar indicator */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/50 dark:bg-white/5 overflow-hidden rounded-full">
                                <div
                                    className={`h-full transition-all duration-1000 ease-linear rounded-full ${mode === 'work' ? 'bg-gradient-to-r from-primary-500 to-violet-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <Clock className={`w-4 h-4 ${mode === 'work' ? 'text-primary-500' : 'text-emerald-500'}`} />
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                                    {mode === 'work' ? 'Focus Session' : 'Break Time'}
                                </span>
                            </div>

                            <div className={`text-7xl font-black tracking-tighter mb-2 tabular-nums ${mode === 'work' ? 'text-gray-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {formatTime(timeLeft)}
                            </div>

                            {/* Creator controls or non-creator label */}
                            {isCreator ? (
                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        onClick={toggleTimer}
                                        className={`flex items-center gap-2 px-7 py-3 rounded-2xl font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg ${isRunning
                                            ? 'bg-gray-800 dark:bg-white/10 hover:bg-gray-900 dark:hover:bg-white/15 shadow-black/10'
                                            : mode === 'work'
                                                ? 'bg-gradient-to-r from-primary-600 to-violet-600 shadow-primary-600/25'
                                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-600/25'
                                        }`}
                                    >
                                        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        {isRunning ? 'Pause' : 'Start'}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200/50 dark:border-white/5"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-6 text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200/50 dark:border-white/5">
                                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                                    Controlled by {creatorName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Members */}
                    <div className="relative rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/[0.06] flex-1 max-h-[400px] flex flex-col">
                        <div className="absolute inset-0 bg-white/60 dark:bg-[#0f0f14]/80 backdrop-blur-xl"></div>
                        <div className="relative p-6 flex flex-col flex-1 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white">Active Members</h3>
                                <div className="bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" /> {room.activeMembers.length}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                                {room.activeMembers.map((member, idx) => {
                                    const isMemberCreator = creatorId && String(member._id) === String(creatorId);
                                    return (
                                        <div key={member._id || idx} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(member.name)} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                                {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-semibold text-gray-900 dark:text-white truncate flex items-center gap-2">
                                                    {member.name || 'Anonymous User'}
                                                    {isMemberCreator && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                                </div>
                                                <div className="text-xs text-emerald-500 flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Studying
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Chat Box */}
                <div className="lg:col-span-2 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200/50 dark:border-white/[0.06]">
                    {/* Background */}
                    <div className="absolute inset-0 bg-white/60 dark:bg-[#0f0f14]/80 backdrop-blur-xl"></div>

                    {/* Chat Header */}
                    <div className="relative z-10 px-6 py-4 border-b border-gray-200/40 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02]">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-primary-500" />
                            Room Chat
                        </h3>
                    </div>

                    {/* Messages Area */}
                    <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 space-y-1 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 space-y-3">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200/50 dark:border-white/5">
                                    <Send className="w-7 h-7 opacity-30" />
                                </div>
                                <p className="text-sm font-medium">No messages yet. Say hello!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isMe = msg.senderId === user._id;
                                const prevMsg = messages[index - 1];
                                const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
                                const showAvatar = !isSameSender;

                                return (
                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-0.5'}`}>
                                        {/* Left avatar for others */}
                                        {!isMe && (
                                            <div className="w-8 mr-2 flex-shrink-0 flex items-end">
                                                {showAvatar && (
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarColor(msg.senderName)} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                                                        {(msg.senderName || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                            {showAvatar && (
                                                <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-1 px-1 font-medium">
                                                    {isMe ? 'You' : msg.senderName} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                            <div className={`px-4 py-2.5 text-sm leading-relaxed ${isMe
                                                ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white rounded-2xl rounded-br-lg shadow-sm shadow-primary-600/10'
                                                : 'bg-gray-100/80 dark:bg-white/[0.05] text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-lg border border-gray-200/40 dark:border-white/[0.06]'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                        {/* Right avatar for me */}
                                        {isMe && (
                                            <div className="w-8 ml-2 flex-shrink-0 flex items-end">
                                                {showAvatar && (
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="relative z-10 px-4 py-3 border-t border-gray-200/40 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02]">
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-white/80 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:text-white text-sm transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-800 dark:disabled:to-gray-800 text-white p-3 rounded-xl transition-all shadow-sm disabled:shadow-none hover:shadow-md hover:shadow-primary-600/10"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveRoom;
