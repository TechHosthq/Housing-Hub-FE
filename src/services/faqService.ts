import apiClient from './apiClient';
import { FaqListResponse } from '@/types/faq';

const faqService = {
    getFaqs: async (): Promise<FaqListResponse> => {
        const response = await apiClient.get<FaqListResponse>('/api/v1/Faq');
        return response.data;
    },
};

export default faqService;
