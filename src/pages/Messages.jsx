import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Send } from 'lucide-react';
import api from '../utils/api';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [unreadConvIds, setUnreadConvIds] = useState(new Set());
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/messages/conversations');
                const convs = res.data.data;
                setConversations(convs);
                // Mark convs with unread messages
                const loggedInId = user?._id || user?.id;
                const unread = new Set();
                convs.forEach(conv => {
                    const lastMsg = conv.lastMessage;
                    if (lastMsg && !lastMsg.read && String(lastMsg.sender) !== String(loggedInId)) {
                        unread.add(conv._id);
                    }
                });
                setUnreadConvIds(unread);
            } catch (err) {
                console.error('Failed to fetch conversations', err);
            }
        };
        if (user) fetchConversations();
    }, [user]);

    useEffect(() => {
        if (!selectedConv) return;
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/${selectedConv._id}`);
                setMessages(res.data.data);
                // Clear unread for this conv when opened
                setUnreadConvIds(prev => {
                    const next = new Set(prev);
                    next.delete(selectedConv._id);
                    return next;
                });
            } catch (err) {
                console.error('Failed to fetch messages', err);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedConv]);

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
            setConversations(prev =>
                prev.map(c => c._id === selectedConv._id
                    ? { ...c, lastMessage: { content: newMessage } }
                    : c
                )
            );
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
        const loggedInId = user?._id || user?.id;
        const other = conv.participants?.find(p => String(p._id) !== String(loggedInId));
        return other?.ngoName || other?.name || 'Unknown';
    };

    const getInitial = (conv) => getOtherPerson(conv)?.charAt(0) || '?';

    // Group conversations by opportunity title
    const groupedConversations = conversations.reduce((groups, conv) => {
        const title = conv.opportunity?.title || 'Other';
        if (!groups[title]) groups[title] = [];
        groups[title].push(conv);
        return groups;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-[#2F5373] dark:text-white mb-6">Messages</h1>

                <div className="flex h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">

                    {/* LEFT SIDE */}
                    <div className="w-72 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-800">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <h2 className="font-semibold text-sm text-[#2F5373] dark:text-white">Conversations</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <p className="text-sm text-gray-400 dark:text-slate-500">No conversations yet</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Appears when an NGO accepts your application</p>
                                </div>
                            ) : (
                                Object.entries(groupedConversations).map(([title, convs]) => (
                                    <div key={title}>
                                        {/* Group Header */}
                                        <div className="px-4 py-2 bg-[#2F5373] dark:bg-slate-900 flex items-center gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white uppercase tracking-wider truncate">{title}</p>
                                            </div>
                                            <span className="text-xs text-teal-300 font-medium flex-shrink-0">{convs.length} chat{convs.length > 1 ? 's' : ''}</span>
                                        </div>

                                        {convs.map((conv) => {
                                            const isUnread = unreadConvIds.has(conv._id);
                                            const isSelected = selectedConv?._id === conv._id;
                                            return (
                                                <button key={conv._id} onClick={() => setSelectedConv(conv)}
                                                    className={`w-full flex items-center gap-3 p-4 text-left transition border-l-4 ${
                                                        isSelected
                                                            ? 'bg-[#e8f5f1] dark:bg-slate-700 border-[#6CBBA2]'
                                                            : isUnread
                                                                ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                                                                : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'
                                                    }`}>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm ${
                                                        isUnread
                                                            ? 'bg-[#6CBBA2] text-white'
                                                            : 'bg-[#e8f5f1] dark:bg-teal-900/40 text-[#2F5373] dark:text-teal-300'
                                                    }`}>
                                                        {getInitial(conv)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <p className={`text-sm truncate ${isUnread ? 'font-bold text-[#2F5373] dark:text-white' : 'font-semibold text-[#2F5373] dark:text-white'}`}>
                                                                {getOtherPerson(conv)}
                                                            </p>
                                                            {isUnread && (
                                                                <span className="w-2 h-2 rounded-full bg-[#6CBBA2] flex-shrink-0"></span>
                                                            )}
                                                        </div>
                                                        <p className={`text-xs truncate mt-0.5 ${isUnread ? 'text-gray-700 dark:text-slate-200 font-medium' : 'text-gray-400 dark:text-slate-500'}`}>
                                                            {conv.lastMessage?.content}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {!selectedConv ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-slate-500">
                                Select a conversation
                            </div>
                        ) : (
                            <>
                                {/* CHAT HEADER */}
                                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                    <p className="text-xs font-semibold text-[#6CBBA2] dark:text-teal-400 uppercase tracking-wide">
                                        {selectedConv.opportunity?.title || ''}
                                    </p>
                                    <p className="font-bold text-[#2F5373] dark:text-white mt-0.5">
                                        {getOtherPerson(selectedConv)}
                                    </p>
                                </div>

                                {/* CHAT BODY */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
                                    {messages.map((msg) => {
                                        const senderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
                                        const loggedInId = user?._id || user?.id;
                                        const isMe = String(senderId) === String(loggedInId);
                                        return (
                                            <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                                                    isMe
                                                        ? 'bg-[#6CBBA2] text-white rounded-br-none'
                                                        : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-600'
                                                }`}>
                                                    <p>{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-teal-100' : 'text-gray-400 dark:text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* INPUT */}
                                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2 bg-white dark:bg-slate-800">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#6CBBA2] outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                                    />
                                    <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                                        className="p-3 bg-[#6CBBA2] text-white rounded-xl hover:bg-[#5aaa91] transition disabled:opacity-50">
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