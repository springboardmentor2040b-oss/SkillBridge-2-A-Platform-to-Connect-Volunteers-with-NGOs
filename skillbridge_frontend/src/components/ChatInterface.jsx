import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Search, Send } from 'lucide-react';

import api from '../services/api';
import Card from './common/Card';

const buildOpportunityLabel = (titles = []) => {
    if (!titles.length) return '';
    if (titles.length === 1) return titles[0];
    return `${titles[0]} +${titles.length - 1} more`;
};

const ChatInterface = ({ currentUser, initialPartner }) => {
    const [conversations, setConversations] = useState([]);
    const [applicationPartners, setApplicationPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [opportunityFilter, setOpportunityFilter] = useState('all');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const lastFetchedPartnerIdRef = useRef(null);
    const selectedPartnerIdRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const fallbackSyncIntervalRef = useRef(null);
    const reconnectAttemptRef = useRef(0);
    const heartbeatIntervalRef = useRef(null);
    const isNgo = currentUser?.role === 'ngo';

    const selectedPartnerId = selectedPartner?.partner_id || selectedPartner?.id;
    selectedPartnerIdRef.current = selectedPartnerId;

    const fetchConversations = async () => {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
        return res.data;
    };

    const fetchApplicationPartners = async () => {
        if (!isNgo) {
            setApplicationPartners([]);
            return [];
        }

        const res = await api.get('/applications/ngo');
        const partnerMap = new Map();

        (res.data || []).forEach((app) => {
            if (!app.volunteer_id) return;

            const existing = partnerMap.get(app.volunteer_id) || {
                partner_id: app.volunteer_id,
                partner_name: app.volunteer_name || app.volunteer_email || 'Volunteer',
                partner_role: 'volunteer',
                opportunity_ids: [],
                opportunity_titles: [],
                last_message: '',
                last_message_at: null,
            };

            if (app.opportunity_id && !existing.opportunity_ids.includes(app.opportunity_id)) {
                existing.opportunity_ids.push(app.opportunity_id);
            }
            if (app.opportunity_title && !existing.opportunity_titles.includes(app.opportunity_title)) {
                existing.opportunity_titles.push(app.opportunity_title);
            }

            partnerMap.set(app.volunteer_id, existing);
        });

        const partners = Array.from(partnerMap.values()).map((partner) => ({
            ...partner,
            opportunity_label: buildOpportunityLabel(partner.opportunity_titles),
        }));

        setApplicationPartners(partners);
        return partners;
    };

    const fetchMessages = async (partnerId, { silent = false } = {}) => {
        if (!partnerId) {
            setMessages([]);
            lastFetchedPartnerIdRef.current = null;
            return;
        }
        const isPartnerChanged = lastFetchedPartnerIdRef.current !== partnerId;
        if (!silent || isPartnerChanged) setLoadingMessages(true);
        try {
            const res = await api.get(`/messages/with/${partnerId}`);
            setMessages(res.data);
            lastFetchedPartnerIdRef.current = partnerId;
        } catch (err) {
            console.error('Error loading messages', err);
        } finally {
            if (!silent || isPartnerChanged) setLoadingMessages(false);
        }
    };

    const normalizedConversations = useMemo(() => {
        const merged = new Map();

        applicationPartners.forEach((partner) => {
            merged.set(partner.partner_id, partner);
        });

        conversations.forEach((conversation) => {
            const existing = merged.get(conversation.partner_id);
            merged.set(conversation.partner_id, {
                ...existing,
                ...conversation,
                partner_name: conversation.partner_name || existing?.partner_name || 'Unknown',
                partner_role: conversation.partner_role || existing?.partner_role || 'unknown',
                opportunity_ids: existing?.opportunity_ids || [],
                opportunity_titles: existing?.opportunity_titles || [],
                opportunity_label: existing?.opportunity_label || '',
            });
        });

        if (initialPartner?.id) {
            const existing = merged.get(initialPartner.id);
            const opportunityIds = [...(existing?.opportunity_ids || [])];
            const opportunityTitles = [...(existing?.opportunity_titles || [])];

            if (initialPartner.opportunity_id && !opportunityIds.includes(initialPartner.opportunity_id)) {
                opportunityIds.push(initialPartner.opportunity_id);
            }
            if (initialPartner.opportunity_title && !opportunityTitles.includes(initialPartner.opportunity_title)) {
                opportunityTitles.push(initialPartner.opportunity_title);
            }

            merged.set(initialPartner.id, {
                ...existing,
                partner_id: initialPartner.id,
                partner_name: initialPartner.name || existing?.partner_name || 'Unknown',
                partner_role: existing?.partner_role || 'unknown',
                opportunity_ids: opportunityIds,
                opportunity_titles: opportunityTitles,
                opportunity_label: buildOpportunityLabel(opportunityTitles),
            });
        }

        return Array.from(merged.values()).sort((a, b) => {
            if (!a.last_message_at && !b.last_message_at) {
                return (a.partner_name || '').localeCompare(b.partner_name || '');
            }
            if (!a.last_message_at) return 1;
            if (!b.last_message_at) return -1;
            return new Date(b.last_message_at) - new Date(a.last_message_at);
        });
    }, [applicationPartners, conversations, initialPartner]);

    const opportunityOptions = useMemo(() => {
        if (!isNgo) return [];

        const optionMap = new Map();
        applicationPartners.forEach((partner) => {
            (partner.opportunity_ids || []).forEach((opportunityId, index) => {
                const opportunityTitle = partner.opportunity_titles?.[index];
                if (!opportunityId || optionMap.has(opportunityId)) return;
                optionMap.set(opportunityId, opportunityTitle || 'Untitled opportunity');
            });
        });

        return Array.from(optionMap.entries())
            .map(([id, title]) => ({ id, title }))
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [applicationPartners, isNgo]);

    const filteredConversations = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return normalizedConversations.filter((c) => {
            const matchesOpportunity =
                !isNgo ||
                opportunityFilter === 'all' ||
                (c.opportunity_ids || []).includes(opportunityFilter);

            if (!matchesOpportunity) return false;
            if (!q) return true;

            return (
                (c.partner_name || '').toLowerCase().includes(q) ||
                (c.last_message || '').toLowerCase().includes(q) ||
                (c.opportunity_titles || []).some((title) => title.toLowerCase().includes(q))
            );
        });
    }, [isNgo, normalizedConversations, opportunityFilter, searchTerm]);

    useEffect(() => {
        const load = async () => {
            try {
                const [list] = await Promise.all([
                    fetchConversations(),
                    fetchApplicationPartners(),
                ]);
                if (list.length > 0 && !initialPartner?.id) {
                    setSelectedPartner((prev) => prev || list[0]);
                }
            } catch (err) {
                console.error('Error loading conversations', err);
            } finally {
                setLoadingConversations(false);
            }
        };
        load();
    }, [initialPartner?.id, isNgo]);

    useEffect(() => {
        if (initialPartner?.id) {
            setSelectedPartner({
                partner_id: initialPartner.id,
                partner_name: initialPartner.name,
                opportunity_id: initialPartner.opportunity_id,
                opportunity_title: initialPartner.opportunity_title,
            });
            setShowThreadOnMobile(true);
        }
    }, [initialPartner]);

    useEffect(() => {
        if (selectedPartnerId || filteredConversations.length === 0) return;
        setSelectedPartner(filteredConversations[0]);
    }, [filteredConversations, selectedPartnerId]);

    useEffect(() => {
        if (!selectedPartnerId) return;
        const stillVisible = filteredConversations.some((conversation) => conversation.partner_id === selectedPartnerId);
        if (stillVisible) return;
        setSelectedPartner(filteredConversations[0] || null);
    }, [filteredConversations, selectedPartnerId]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !currentUser?.id) return;

        let disposed = false;
        let ws = null;
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${protocol}://localhost:8000/ws/chat?token=${encodeURIComponent(token)}`;

        const stopFallbackSync = () => {
            if (fallbackSyncIntervalRef.current) {
                clearInterval(fallbackSyncIntervalRef.current);
                fallbackSyncIntervalRef.current = null;
            }
        };

        const stopHeartbeat = () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
        };

        const startFallbackSync = () => {
            if (fallbackSyncIntervalRef.current) return;
            fallbackSyncIntervalRef.current = setInterval(async () => {
                try {
                    await fetchConversations();
                    if (selectedPartnerIdRef.current) {
                        await fetchMessages(selectedPartnerIdRef.current, { silent: true });
                    }
                } catch (err) {
                    console.error('Fallback sync failed', err);
                }
            }, 15000);
        };

        const scheduleReconnect = () => {
            if (disposed || reconnectTimeoutRef.current) return;
            const delay = Math.min(10000, 1000 * (2 ** reconnectAttemptRef.current));
            reconnectAttemptRef.current += 1;
            reconnectTimeoutRef.current = setTimeout(() => {
                reconnectTimeoutRef.current = null;
                connect();
            }, delay);
        };

        const connect = () => {
            if (disposed) return;
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                setWsConnected(true);
                reconnectAttemptRef.current = 0;
                stopFallbackSync();
                stopHeartbeat();
                heartbeatIntervalRef.current = setInterval(() => {
                    if (ws && ws.readyState === WebSocket.OPEN) ws.send('ping');
                }, 20000);
                fetchConversations();
                if (selectedPartnerIdRef.current) {
                    fetchMessages(selectedPartnerIdRef.current, { silent: true });
                }
            };

            ws.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    if (payload.type === 'pong') return;
                    if (payload.type !== 'message') return;
                    const msg = payload.data;
                    const partnerId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
                    const partnerName = msg.sender_id === currentUser.id ? msg.receiver_name : msg.sender_name;

                    setConversations((prev) => {
                        const existing = prev.find((c) => c.partner_id === partnerId);
                        const updated = {
                            partner_id: partnerId,
                            partner_name: partnerName,
                            partner_role: existing?.partner_role || 'unknown',
                            opportunity_ids: existing?.opportunity_ids || [],
                            opportunity_titles: existing?.opportunity_titles || [],
                            opportunity_label: existing?.opportunity_label || '',
                            last_message: msg.content,
                            last_message_at: msg.created_at,
                        };
                        if (!existing) return [updated, ...prev];
                        return [updated, ...prev.filter((c) => c.partner_id !== partnerId)];
                    });

                    if (selectedPartnerIdRef.current === partnerId) {
                        setMessages((prev) => {
                            if (prev.some((item) => item.id === msg.id)) return prev;
                            return [...prev, msg];
                        });
                    }
                } catch (err) {
                    console.error('Invalid websocket payload', err);
                }
            };

            ws.onclose = () => {
                setWsConnected(false);
                stopHeartbeat();
                startFallbackSync();
                scheduleReconnect();
            };

            ws.onerror = () => {
                ws.close();
            };
        };

        connect();

        return () => {
            disposed = true;
            setWsConnected(false);
            stopHeartbeat();
            stopFallbackSync();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (ws) ws.close();
        };
    }, [currentUser?.id]);

    useEffect(() => {
        fetchMessages(selectedPartnerId);
    }, [selectedPartnerId]);

    useEffect(() => {
        if (!wsConnected || !selectedPartnerId) return;
        const interval = setInterval(async () => {
            try {
                await fetchMessages(selectedPartnerId, { silent: true });
            } catch (err) {
                console.error('Soft refresh failed', err);
            }
        }, 45000);
        return () => clearInterval(interval);
    }, [wsConnected, selectedPartnerId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!selectedPartnerId || !messageText.trim()) return;
        const text = messageText.trim();
        const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const activeOpportunityId =
            selectedPartner?.opportunity_id ||
            (opportunityFilter !== 'all' ? opportunityFilter : undefined) ||
            selectedPartner?.opportunity_ids?.[0];
        const optimisticMsg = {
            id: tempId,
            sender_id: currentUser?.id,
            receiver_id: selectedPartnerId,
            content: text,
            opportunity_id: activeOpportunityId,
            created_at: new Date().toISOString(),
            sender_name: currentUser?.name || 'You',
            receiver_name: selectedPartner?.partner_name || selectedPartner?.name || 'Partner',
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setConversations((prev) => {
            const updated = {
                partner_id: selectedPartnerId,
                partner_name: selectedPartner?.partner_name || selectedPartner?.name || 'Unknown',
                partner_role: selectedPartner?.partner_role || 'unknown',
                opportunity_ids: selectedPartner?.opportunity_ids || [],
                opportunity_titles: selectedPartner?.opportunity_titles || [],
                opportunity_label: selectedPartner?.opportunity_label || '',
                last_message: text,
                last_message_at: optimisticMsg.created_at,
            };
            return [updated, ...prev.filter((c) => c.partner_id !== selectedPartnerId)];
        });
        setMessageText('');
        setSending(true);
        try {
            const res = await api.post('/messages/', {
                receiver_id: selectedPartnerId,
                content: text,
                opportunity_id: activeOpportunityId,
            });
            const msg = res.data;
            setMessages((prev) => {
                const withoutTemp = prev.filter((item) => item.id !== tempId);
                if (withoutTemp.some((item) => item.id === msg.id)) return withoutTemp;
                return [...withoutTemp, msg];
            });
            setConversations((prev) => {
                const updated = {
                    partner_id: selectedPartnerId,
                    partner_name: selectedPartner?.partner_name || selectedPartner?.name || 'Unknown',
                    partner_role: selectedPartner?.partner_role || 'unknown',
                    opportunity_ids: selectedPartner?.opportunity_ids || [],
                    opportunity_titles: selectedPartner?.opportunity_titles || [],
                    opportunity_label: selectedPartner?.opportunity_label || '',
                    last_message: msg.content,
                    last_message_at: msg.created_at,
                };
                return [updated, ...prev.filter((c) => c.partner_id !== selectedPartnerId)];
            });
        } catch (err) {
            setMessages((prev) => prev.filter((item) => item.id !== tempId));
            console.error('Error sending message', err);
        } finally {
            setSending(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const selectConversation = (conversation) => {
        setSelectedPartner(conversation);
        setShowThreadOnMobile(true);
    };

    return (
        <Card title="Messages" className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border border-slate-200 rounded-xl min-h-[500px]">
                <div className={`${showThreadOnMobile ? 'hidden md:block' : 'block'} border-r border-slate-200 bg-white`}>
                    <div className="p-3 border-b border-slate-200">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        {isNgo && opportunityOptions.length > 0 && (
                            <select
                                value={opportunityFilter}
                                onChange={(e) => setOpportunityFilter(e.target.value)}
                                className="mt-3 w-full px-3 py-2 text-sm rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">All opportunities</option>
                                {opportunityOptions.map((opportunity) => (
                                    <option key={opportunity.id} value={opportunity.id}>
                                        {opportunity.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="max-h-[445px] overflow-y-auto p-2">
                        {loadingConversations ? (
                            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-blue-600" size={20} /></div>
                        ) : filteredConversations.length === 0 ? (
                            <p className="text-xs text-slate-500 p-3">No conversations found.</p>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.partner_id}
                                    type="button"
                                    onClick={() => selectConversation(conv)}
                                    className={`w-full text-left p-3 rounded-lg mb-2 border transition ${
                                        selectedPartnerId === conv.partner_id
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{conv.partner_name}</p>
                                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatTimestamp(conv.last_message_at)}</span>
                                    </div>
                                    {isNgo && conv.opportunity_label && (
                                        <p className="text-[11px] text-blue-600 truncate mt-1">Applied for {conv.opportunity_label}</p>
                                    )}
                                    <p className="text-xs text-slate-500 truncate mt-1">{conv.last_message || 'Start conversation'}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className={`${showThreadOnMobile ? 'flex' : 'hidden md:flex'} flex-col bg-slate-50`}>
                    {!selectedPartnerId ? (
                        <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
                            Select a conversation to start chatting.
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowThreadOnMobile(false)}
                                    className="md:hidden p-1 rounded hover:bg-slate-100"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-800">{selectedPartner?.partner_name || selectedPartner?.name}</p>
                                    {isNgo && (selectedPartner?.opportunity_title || selectedPartner?.opportunity_label) && (
                                        <span className="text-[11px] text-blue-600">
                                            {selectedPartner?.opportunity_title || selectedPartner?.opportunity_label}
                                        </span>
                                    )}
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${wsConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        {wsConnected ? 'Live' : 'Syncing'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px]">
                                {loadingMessages ? (
                                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={20} /></div>
                                ) : messages.length === 0 ? (
                                    <p className="text-xs text-slate-500 text-center py-10">No messages yet.</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                                                msg.sender_id === currentUser?.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white border border-slate-200 text-slate-800'
                                            }`}>
                                                <p>{msg.content}</p>
                                                <p className={`text-[10px] mt-1 ${msg.sender_id === currentUser?.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {formatTimestamp(msg.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !messageText.trim()}
                                    className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-1"
                                >
                                    <Send size={14} />
                                    Send
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ChatInterface;
