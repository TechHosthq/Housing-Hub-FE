import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { API_BASE_URL } from '@/services/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Whether the deployed API actually serves SignalR hubs.
 *
 * IT DOES NOT IN PRODUCTION, AND THAT IS DELIBERATE.
 *
 * The API runs on Lambda behind an API Gateway REST API, which has no persistent
 * connection to hold a WebSocket open. So `Program.cs` maps the hubs only when
 * `isLambda` is false — meaning `/hubs/chat/negotiate` genuinely does not exist in
 * the deployed environment and correctly returns 404.
 *
 * Attempting the connection anyway cost a failed request per authenticated page
 * load and a red error in every user's console, for a feature that was never going
 * to work there. Chat and notifications already fall back to polling
 * (`refetchInterval` in useChat and useNotification), so nothing is lost by not
 * trying — the only thing that changes is the noise.
 *
 * Set `NEXT_PUBLIC_ENABLE_REALTIME=true` when running the API locally with
 * `dotnet run`, where the hubs are mapped and real-time works properly. Turning it
 * on against Lambda will simply reproduce the 404.
 *
 * The real fix is moving off API Gateway REST to something that supports
 * WebSockets, or to a managed service like Azure SignalR — at which point this flag
 * becomes true in production and the polling can go.
 */
export const isRealtimeEnabled = process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true';

export const createHubConnection = (hubPath: string): HubConnection => {
    return new HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}${hubPath}`, {
            accessTokenFactory: () => useAuthStore.getState().token || '',
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();
};
