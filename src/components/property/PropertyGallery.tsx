"use client";

import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { PropertyFile, PropertyFileType } from "@/types/property";

interface PropertyGalleryProps {
    files: PropertyFile[];
}

export default function PropertyGallery({ files }: PropertyGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const nextImage = () => setActiveIndex((prev) => (prev + 1) % files.length);
    const prevImage = () => setActiveIndex((prev) => (prev - 1 + files.length) % files.length);

    const activeFile = files[activeIndex];
    const isActiveVideo = activeFile?.type === PropertyFileType.Video;

    return (
        <div className="space-y-4">
            {/* Featured Media */}
            <div className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden group bg-black">
                {isActiveVideo ? (
                    <video
                        key={activeFile.fileUrl}
                        src={activeFile.fileUrl || undefined}
                        controls
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="absolute inset-0 w-full h-full cursor-zoom-in"
                    >
                        <Image
                            src={activeFile.fileUrl || ""}
                            alt="Property"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 800px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </button>
                )}

                {/* Navigation Arrows */}
                {files.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-primary-dark hover:bg-white transition-all shadow-md z-10"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-primary-dark hover:bg-white transition-all shadow-md z-10"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
                {files.map((file, idx) => {
                    const isVideo = file.type === PropertyFileType.Video;
                    return (
                        <button
                            key={file.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all bg-black ${activeIndex === idx ? "border-primary-dark" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            {isVideo ? (
                                <>
                                    <video src={file.fileUrl || undefined} muted preload="metadata" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <Play size={18} className="text-white" fill="white" />
                                    </div>
                                </>
                            ) : (
                                <Image src={file.fileUrl || ""} alt={`Thumbnail ${idx}`} fill sizes="160px" className="object-cover" />
                            )}
                        </button>
                    );
                })}
            </div>

            {isPreviewOpen && !isActiveVideo && (
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
                    {files.length > 1 && (
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
                            src={activeFile.fileUrl || ""}
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
