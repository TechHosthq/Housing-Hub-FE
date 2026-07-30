"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFaqs } from "@/hooks/useFaq";
import { FaqItem } from "@/types/faq";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpenByDefault?: boolean;
}

const FAQItem = ({ question, answer, isOpenByDefault = false }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(isOpenByDefault);

    return (
        <div className="border-b border-[#E2E8F0] py-6">
            <button
                className="flex w-full items-center justify-between text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-[#1A1A1A] text-xl font-montserrat tracking-tight">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="text-[#1A1A1A]" size={20} />
                ) : (
                    <ChevronDown className="text-[#1A1A1A]" size={20} />
                )}
            </button>
            <div
                className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <p className="text-[#4A5568] text-base leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const groupByCategory = (items: FaqItem[]) => {
    const order: string[] = [];
    const grouped = new Map<string, FaqItem[]>();

    for (const item of items) {
        if (!grouped.has(item.category)) {
            grouped.set(item.category, []);
            order.push(item.category);
        }
        grouped.get(item.category)!.push(item);
    }

    return order.map((category) => ({ category, items: grouped.get(category)! }));
};

const FAQSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
    </div>
);

export default function FAQAccordion() {
    const { data, isLoading, isError } = useFaqs();
    const categories = groupByCategory(data?.data ?? []);

    return (
        <div className="max-w-[798px] mx-auto px-4 py-14 bg-white">
            {isLoading ? (
                <FAQSkeleton />
            ) : isError || categories.length === 0 ? (
                <p className="text-[#4A5568] text-base text-center">
                    Unable to load FAQs right now — please try again later.
                </p>
            ) : (
                <div className="space-y-10">
                    {categories.map(({ category, items }, categoryIndex) => (
                        <div key={category}>
                            <h2 className="text-[#1A1A1A] text-2xl font-bold font-montserrat mb-2">
                                {category}
                            </h2>
                            <div className="space-y-4">
                                {items.map((item, itemIndex) => (
                                    <FAQItem
                                        key={item.id}
                                        question={item.question}
                                        answer={item.answer}
                                        isOpenByDefault={categoryIndex === 0 && itemIndex === 0}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
