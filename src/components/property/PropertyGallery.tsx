"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
    images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="space-y-4">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden group">
                <Image
                    src={images[activeIndex]}
                    alt="Property"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Navigation Arrows */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#002D6B] hover:bg-white transition-all shadow-md"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#002D6B] hover:bg-white transition-all shadow-md"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeIndex === idx ? "border-[#002D6B]" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                    >
                        <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
