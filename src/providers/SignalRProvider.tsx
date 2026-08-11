"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection, isRealtimeEnabled } from "@/lib/signalr";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationSoundStore } from "@/store/useNotificationSoundStore";
import { playNotificationAudio, registerNotificationAudioUnlock } from "@/lib/notificationAudio";

const playNotificationSound = () => {
    if (!useNotificationSoundStore.getState().isSoundEnabled) return;
    playNotificationAudio();
};

const ChatConnectionContext = createContext<HubConnection | null>(null);

export const useChatConnection = () => useContext(ChatConnectionContext);

export default function SignalRProvider({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const queryClient = useQueryClient();
    const [chatConnection, setChatConnection] = useState<HubConnection | null>(null);
    const connectionsRef = useRef<{ chat: HubConnection; notification: HubConnection } | null>(null);

    useEffect(() => {
        return registerNotificationAudioUnlock();
    }, []);

    useEffect(() => {
        // The hubs are not mapped when the API runs on Lambda, so negotiate returns
        // 404 and the connection can never succeed. Chat and notifications poll
        // instead (see useChat / useNotification), so skipping the attempt loses no
        // functionality — it only removes a guaranteed-failing request and a console
        // error on every authenticated page load. See lib/signalr.ts.
        if (!isAuthenticated || !isRealtimeEnabled) {
            connectionsRef.current?.chat.stop();
            connectionsRef.current?.notification.stop();
            connectionsRef.current = null;
            setChatConnection(null);
            return;
        }

        const chat = createHubConnection("/hubs/chat");
        const notification = createHubConnection("/hubs/notifications");

        const invalidateNotifications = () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        };
        const invalidateConversations = () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        };
        const invalidateMessages = () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        };

        notification.on("ReceiveNotification", () => {
            invalidateNotifications();
            playNotificationSound();
        });

        chat.on("ReceiveMessage", () => {
            invalidateMessages();
            invalidateConversations();
            playNotificationSound();
        });
        chat.on("NewMessageInConversation", () => {
            invalidateMessages();
            invalidateConversations();
            playNotificationSound();
        });
        chat.on("ConversationUpdated", invalidateConversations);
        chat.on("MessagesRead", invalidateConversations);

        chat.start().then(() => setChatConnection(chat)).catch(() => {});
        notification.start().catch(() => {});

        connectionsRef.current = { chat, notification };

        return () => {
            chat.stop();
            notification.stop();
            connectionsRef.current = null;
            setChatConnection(null);
        };
    }, [isAuthenticated, queryClient]);

    return (
        <ChatConnectionContext.Provider value={chatConnection}>
            {children}
        </ChatConnectionContext.Provider>
    );
}
