"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
                <span className="text-[#1A1A1A] text-xl font-bold font-montserrat tracking-tight">
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
                    <span className="font-bold text-[#1A1A1A]">Yes.</span> {answer}
                </p>
            </div>
        </div>
    );
};

export default function FAQAccordion() {
    const faqs = [
        {
            question: "How Do I Verify My Property?",
            answer: "You won't be charged if you cancel before the trial ends.",
            isOpenByDefault: true,
        },
        {
            question: "Can I Cancel During The Trial?",
            answer: "You won't be charged if you cancel before the trial ends.",
        },
        {
            question: "Can I Cancel During The Trial?",
            answer: "You won't be charged if you cancel before the trial ends.",
        },
        {
            question: "Can I Cancel During The Trial?",
            answer: "You won't be charged if you cancel before the trial ends.",
        },
    ];

    return (
        <div className="max-w-[798px] mx-auto px-4 py-14 bg-white">
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpenByDefault={faq.isOpenByDefault}
                    />
                ))}
            </div>
        </div>
    );
}
