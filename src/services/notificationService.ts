import apiClient from './apiClient';
import { ApiResponse, PaginatedResponse } from '@/types/auth';
import { Notification, NotificationQueryParams } from '@/types/notification';

const notificationService = {
    getNotifications: async (params: NotificationQueryParams): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>('/api/v1/Notification', { params });
        return response.data;
    },

    getUnreadCount: async (): Promise<ApiResponse<number>> => {
        const response = await apiClient.get<ApiResponse<number>>('/api/v1/Notification/unread-count');
        return response.data;
    },

    markAsRead: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.put<ApiResponse<boolean>>(`/api/v1/Notification/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.put<ApiResponse<boolean>>('/api/v1/Notification/read-all');
        return response.data;
    }
};

export default notificationService;
