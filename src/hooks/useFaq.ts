import { useQuery } from '@tanstack/react-query';
import faqService from '@/services/faqService';

export const useFaqs = () => useQuery({
    queryKey: ['faqs'],
    queryFn: faqService.getFaqs,
});
