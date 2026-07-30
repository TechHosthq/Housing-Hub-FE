export interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

export interface FaqListResponse {
    data: FaqItem[];
    isSuccessful: boolean;
}
