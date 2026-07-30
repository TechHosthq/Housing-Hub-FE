import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { API_BASE_URL } from '@/services/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

export const createHubConnection = (hubPath: string): HubConnection => {
    return new HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}${hubPath}`, {
            accessTokenFactory: () => useAuthStore.getState().token || '',
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();
};
