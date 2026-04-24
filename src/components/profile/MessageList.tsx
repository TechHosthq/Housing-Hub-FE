"use client";

import { Search, User, Send, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
    viewMode: "list" | "chat";
    selectedId: string | null;
    onThreadSelect: (id: string) => void;
}

export default function MessageList({ viewMode, selectedId, onThreadSelect }: MessageListProps) {
    const { useConversations, useMessages, sendMessage, markAsRead } = useChat();
    const currentUser = useAuthStore((state) => state.user);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: convResponse, isLoading: isLoadingConvs } = useConversations();
    const { data: msgResponse, isLoading: isLoadingMsgs } = useMessages(selectedId);

    const conversations = convResponse?.data || [];
    const messages = msgResponse?.data?.items || [];

    useEffect(() => {
        if (selectedId) {
            markAsRead(selectedId);
        }
    }, [selectedId, markAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const filteredConversations = conversations.filter(conv =>
        conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeChat = conversations.find(c => c.id === selectedId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChat) return;

        sendMessage({
            recipientId: activeChat.participantId,
            content: messageInput
        });
        setMessageInput("");
    };

    const ThreadList = () => (
        <div className={`bg-white rounded-[22px] border border-[#F2F2F2] p-6 shadow-sm h-fit min-h-[500px] ${viewMode === 'chat' ? 'w-[340px] hidden md:block' : 'flex-1'}`}>
            <h2 className="text-[18px] font-black text-[#1A1A1A] font-montserrat mb-6 ml-2">
                Messages
            </h2>

            <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-5 py-3 rounded-full border border-[#F2F2F2] bg-white text-[12px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-primary-dark transition-all"
                />
            </div>

            {isLoadingConvs ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-primary-dark" />
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {filteredConversations.length === 0 ? (
                        <p className="text-center text-gray-400 text-xs py-10">No conversations found</p>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => onThreadSelect(conv.id)}
                                className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer transition-all group relative border-l-4 ${selectedId === conv.id
                                    ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-primary-dark"
                                    : "border-transparent hover:bg-gray-50"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-gray-400`}>
                                    <User size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="text-[13px] font-black text-[#1A1A1A] truncate pr-2">
                                            {conv.participantName || "Unknown User"}
                                        </h3>
                                        <span className="text-[10px] font-bold text-gray-400 shrink-0">
                                            {conv.lastMessageAt ? formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true }) : ""}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold text-[#666666] truncate">
                                        {conv.lastMessage}
                                    </p>
                                </div>

                                {conv.unreadCount > 0 && selectedId !== conv.id && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 bg-primary-dark rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    if (viewMode === "list") {
        return <ThreadList />;
    }

    return (
        <div className="flex-1 flex gap-6 items-start h-[700px]">
            <ThreadList />

            <div className="flex-1 bg-white rounded-[22px] border border-[#F2F2F2] shadow-sm flex flex-col h-full overflow-hidden">
                {activeChat ? (
                    <>
                        <div className="px-8 py-5 border-b border-[#F2F2F2] flex items-center justify-between bg-white shrink-0">
                            <h2 className="text-[16px] font-black text-[#1A1A1A] font-montserrat">
                                {activeChat.participantName || "Unknown User"}
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
                            {isLoadingMsgs ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="animate-spin text-primary-dark" />
                                </div>
                            ) : (
                                <>
                                    {[...messages].reverse().map((msg) => {
                                        const isOutgoing = msg.senderId === currentUser?.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`max-w-[70%] space-y-1`}>
                                                    <div className={`px-5 py-4 rounded-[12px] text-[13px] leading-relaxed shadow-sm ${isOutgoing
                                                        ? "bg-primary-dark text-white"
                                                        : "bg-white border border-[#F2F2F2] text-[#1A1A1A]"
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <div className={`flex items-center gap-1 text-[10px] font-bold text-gray-400 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                                        <span>{formatDistanceToNow(new Date(msg.dateCreated), { addSuffix: true })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className="p-8 bg-white border-t border-[#F2F2F2] shrink-0">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className="w-full pl-6 pr-16 py-4 rounded-xl border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-primary-dark transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary-dark flex items-center justify-center text-white hover:bg-primary-dark/90 transition-all active:scale-95 shadow-md disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
                        <div className="w-16 h-16 bg-[#E9F3FF] rounded-full flex items-center justify-center text-primary-dark mb-4">
                            <User size={28} />
                        </div>
                        <h3 className="text-[18px] font-black text-[#1A1A1A] font-montserrat mb-2">
                            Select a conversation
                        </h3>
                        <p className="text-[12px] text-[#666666] font-medium max-w-[240px]">
                            Choose a conversation from the left to start messaging
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
