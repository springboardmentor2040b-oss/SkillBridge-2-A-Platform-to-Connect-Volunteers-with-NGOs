import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Send, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const Messages = () => {
    const { user } = useContext(AuthContext);
    console.log("USER OBJECT:", user);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConv) return;
        setSending(true);

        try {
            const res = await api.post(`/messages/${selectedConv._id}`, {
                content: newMessage,
            });

            setMessages(prev => [...prev, res.data.data]);
            setNewMessage('');

            setConversations(prev =>
                prev.map(c =>
                    c._id === selectedConv._id
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

    const other = conv.participants?.find(
        p => String(p._id) !== String(loggedInId)
    );

    return other?.ngoName || other?.name || 'Unknown';
};

    const getInitial = (conv) =>
        getOtherPerson(conv)?.charAt(0) || '?';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-[#2F5373] dark:text-white mb-6">
                    Messages
                </h1>

                <div className="flex h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow border overflow-hidden">

                    {/* LEFT SIDE */}
                    <div className="w-72 border-r dark:border-slate-700 flex flex-col">
                        <div className="p-4 border-b dark:border-slate-700">
                            <h2 className="font-semibold text-sm text-[#2F5373] dark:text-white">
                                Conversations
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {conversations.map((conv) => (
                                <button
                                    key={conv._id}
                                    onClick={() => setSelectedConv(conv)}
                                    className={`w-full flex items-center gap-3 p-4 text-left transition
                                    ${selectedConv?._id === conv._id
                                            ? 'bg-[#e8f5f1] border-l-4 border-[#6CBBA2]'
                                            : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#e8f5f1] flex items-center justify-center text-[#2F5373] font-bold">
                                        {getInitial(conv)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {getOtherPerson(conv)}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {conv.lastMessage?.content}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-1 flex flex-col">

                        {!selectedConv ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                Select a conversation
                            </div>
                        ) : (
                            <>
                                {/* CHAT HEADER */}
                                <div className="p-4 border-b dark:border-slate-700 font-semibold">
                                    {getOtherPerson(selectedConv)}
                                </div>

                                {/* CHAT BODY */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900">

                                    {messages.map((msg) => {
    const senderId =
        typeof msg.sender === "object"
            ? msg.sender?._id
            : msg.sender;

    const loggedInId = user?._id || user?.id;
    const isMe = String(senderId) === String(loggedInId);

    return (
        <div
            key={msg._id}
            className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`
                    max-w-[70%]
                    px-4 py-2
                    rounded-2xl
                    text-sm
                    shadow-sm
                    break-words
                    ${
                        isMe
                            ? "bg-[#6CBBA2] text-white rounded-br-none"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none"
                    }
                `}
            >
                <p>{msg.content}</p>

                <p
                    className={`text-[10px] mt-1 text-right ${
                        isMe
                            ? "text-teal-100"
                            : "text-gray-400"
                    }`}
                >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
})}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* INPUT */}
                                <div className="p-4 border-t dark:border-slate-700 flex gap-2">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#6CBBA2] outline-none text-sm"
                                    />

                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !newMessage.trim()}
                                        className="p-3 bg-[#6CBBA2] text-white rounded-xl hover:bg-[#5aaa91] transition disabled:opacity-50"
                                    >
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