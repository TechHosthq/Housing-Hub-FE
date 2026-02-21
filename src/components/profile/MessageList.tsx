"use client";

import { Search, User, Send } from "lucide-react";
import { useState } from "react";

const MOCK_MESSAGES = [
    {
        id: 1,
        sender: "Spacehub Support",
        preview: "Last message preview...",
        time: "2 hours ago",
        unread: 1,
        isSupport: true,
        conversations: [
            {
                id: 1,
                text: "Thank you for joining SpaceHub. Here's everything you need to know to get started with finding your dream property. Our platform makes it easy to search, book inspections, and connect with verified property owners.",
                time: "10:34 am",
                isOutgoing: false
            },
            {
                id: 2,
                text: "Hi! Is this still available?",
                time: "10:34 am",
                isOutgoing: true
            }
        ]
    },
    {
        id: 2,
        sender: "Property Owner",
        preview: "Last message preview...",
        time: "1 day ago",
        unread: 0,
        isSupport: false,
        conversations: [
            {
                id: 1,
                text: "Hello, regarding the inspection tomorrow...",
                time: "09:00 am",
                isOutgoing: false
            }
        ]
    },
    {
        id: 3,
        sender: "Property Owner",
        preview: "Last message preview...",
        time: "1 day ago",
        unread: 0,
        isSupport: false,
        conversations: []
    },
    {
        id: 4,
        sender: "Property Owner",
        preview: "Last message preview...",
        time: "1 day ago",
        unread: 0,
        isSupport: false,
        conversations: []
    }
];

interface MessageListProps {
    viewMode: "list" | "chat";
    selectedId: number | null;
    onThreadSelect: (id: number) => void;
}

export default function MessageList({ viewMode, selectedId, onThreadSelect }: MessageListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");

    const filteredMessages = MOCK_MESSAGES.filter(msg =>
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeChat = MOCK_MESSAGES.find(m => m.id === selectedId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        setMessageInput("");
    };

    // --- SHARED COMPONENTS ---
    const ThreadList = () => (
        <div className={`bg-white rounded-[22px] border border-[#F2F2F2] p-6 shadow-sm h-fit ${viewMode === 'chat' ? 'w-[340px]' : 'flex-1'}`}>
            <h2 className="text-[18px] font-black text-[#1A1A1A] font-montserrat mb-6 ml-2">
                Message
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

            <div className="flex flex-col gap-1">
                {filteredMessages.map((msg) => (
                    <div
                        key={msg.id}
                        onClick={() => onThreadSelect(msg.id)}
                        className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer transition-all group relative border-l-4 ${selectedId === msg.id
                            ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-primary-dark"
                            : "border-transparent hover:bg-gray-50"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.isSupport ? "bg-[#E9F3FF] text-primary-dark" : "bg-gray-100 text-gray-400"}`}>
                            <User size={20} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h3 className="text-[13px] font-black text-[#1A1A1A] truncate pr-2">
                                    {msg.sender}
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 shrink-0">
                                    {msg.time}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-[#666666] truncate">
                                {msg.preview}
                            </p>
                        </div>

                        {msg.unread > 0 && selectedId !== msg.id && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 bg-primary-dark rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                {msg.unread}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // --- LIST MODE RENDER ---
    if (viewMode === "list") {
        return <ThreadList />;
    }

    // --- CHAT MODE RENDER (SPLIT VIEW) ---
    return (
        <div className="flex-1 flex gap-6 items-start h-[700px]">
            <ThreadList />

            <div className="flex-1 bg-white rounded-[22px] border border-[#F2F2F2] shadow-sm flex flex-col h-full overflow-hidden">
                {activeChat ? (
                    <>
                        <div className="px-8 py-5 border-b border-[#F2F2F2] flex items-center justify-between bg-white shrink-0">
                            <h2 className="text-[16px] font-black text-[#1A1A1A] font-montserrat">
                                {activeChat.sender}
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
                            {activeChat.conversations.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isOutgoing ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[70%] space-y-1`}>
                                        <div className={`px-5 py-4 rounded-[12px] text-[13px] leading-relaxed shadow-sm ${msg.isOutgoing
                                            ? "bg-primary-dark text-white"
                                            : "bg-white border border-[#F2F2F2] text-[#1A1A1A]"
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <div className={`flex items-center gap-1 text-[10px] font-bold text-gray-400 ${msg.isOutgoing ? "justify-end" : "justify-start"}`}>
                                            <span>{msg.time} .</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary-dark flex items-center justify-center text-white hover:bg-primary-dark/90 transition-all active:scale-95 shadow-md"
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
