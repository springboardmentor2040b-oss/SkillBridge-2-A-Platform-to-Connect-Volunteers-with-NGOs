import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Send, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/messages/conversations');
                setConversations(res.data.data);
            } catch (err) {
                console.error('Failed to fetch conversations', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchConversations();
    }, [user]);

    // Fetch messages when conversation selected + poll every 5s
    useEffect(() => {
        if (!selectedConv) return;
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/${selectedConv._id}`);
                setMessages(res.data.data);
            } catch (err) {
                console.error('Failed to fetch messages', err);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedConv]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConv) return;
        setSending(true);
        try {
            const res = await api.post(`/messages/${selectedConv._id}`, { content: newMessage });
            setMessages(prev => [...prev, res.data.data]);
            setNewMessage('');
            // Update last message in conversation list
            setConversations(prev => prev.map(c =>
                c._id === selectedConv._id
                    ? { ...c, lastMessage: { content: newMessage } }
                    : c
            ));
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getOtherPerson = (conv) => {
        const other = conv.participants?.find(p => p._id !== user?._id);
        return other?.ngoName || other?.name || 'Unknown';
    };

    const getInitial = (conv) => getOtherPerson(conv)?.charAt(0) || '?';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-[#2F5373] dark:text-white mb-6">Messages</h1>

                <div className="flex h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">

                    {/* LEFT: Conversation List */}
                    <div className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="font-semibold text-[#2F5373] dark:text-white text-sm">Conversations</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="space-y-3 p-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2" />
                                                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <MessageSquare className="w-10 h-10 text-gray-300 dark:text-slate-600 mb-3" />
                                    <p className="text-sm text-gray-400 dark:text-slate-500">No conversations yet</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Messages appear here when an NGO accepts your application</p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <button key={conv._id} onClick={() => setSelectedConv(conv)}
                                        className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-left ${selectedConv?._id === conv._id ? 'bg-[#f0f9ff] dark:bg-slate-700 border-l-4 border-[#2F5373] dark:border-[#6CBBA2]' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-[#e8f5f1] dark:bg-teal-900/40 flex items-center justify-center text-[#2F5373] dark:text-teal-300 font-bold flex-shrink-0">
                                            {getInitial(conv)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-[#2F5373] dark:text-white truncate">{getOtherPerson(conv)}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
                                                {conv.lastMessage?.content || 'No messages yet'}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                                                📌 {conv.opportunity?.title || ''}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Chat Window */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {!selectedConv ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <MessageSquare className="w-16 h-16 text-gray-200 dark:text-slate-600 mb-4" />
                                <p className="text-gray-400 dark:text-slate-500 font-medium">Select a conversation</p>
                                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Choose from the left to start chatting</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#e8f5f1] dark:bg-teal-900/40 flex items-center justify-center text-[#2F5373] dark:text-teal-300 font-bold flex-shrink-0">
                                        {getInitial(selectedConv)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#2F5373] dark:text-white text-sm">{getOtherPerson(selectedConv)}</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">📌 {selectedConv.opportunity?.title || 'Opportunity'}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.length === 0 ? (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-sm text-gray-400 dark:text-slate-500">No messages yet. Say hello! 👋</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                                            return (
                                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                        ? 'bg-[#2F5373] dark:bg-[#6CBBA2] text-white rounded-br-sm'
                                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-bl-sm'
                                                    }`}>
                                                        <p>{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${isMe ? 'text-blue-200 dark:text-teal-100' : 'text-gray-400 dark:text-slate-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2 items-end">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message... (Enter to send)"
                                        rows={1}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#6CBBA2] outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 resize-none text-sm"
                                    />
                                    <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                                        className="p-2.5 bg-[#2F5373] dark:bg-[#6CBBA2] text-white rounded-xl hover:bg-[#1a3b55] dark:hover:bg-[#5aaa91] disabled:opacity-50 transition flex-shrink-0">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;