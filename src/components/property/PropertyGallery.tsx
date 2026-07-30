"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
    images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="space-y-4">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden group">
                <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="absolute inset-0 w-full h-full cursor-zoom-in"
                >
                    <Image
                        src={images[activeIndex]}
                        alt="Property"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </button>

                {/* Navigation Arrows */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-primary-dark hover:bg-white transition-all shadow-md"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-primary-dark hover:bg-white transition-all shadow-md"
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
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeIndex === idx ? "border-primary-dark" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                    >
                        <Image src={img} alt={`Thumbnail ${idx}`} fill sizes="160px" className="object-cover" />
                    </button>
                ))}
            </div>

            {isPreviewOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </>
                    )}
                    <div className="relative w-[90vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[activeIndex]}
                            alt="Property preview"
                            fill
                            sizes="90vw"
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
