"use client";

interface DeleteListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteListingModal({ isOpen, onClose, onConfirm }: DeleteListingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[24px] w-full max-w-[500px] p-12 overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center">
                    {/* Content */}
                    <h2 className="text-[32px] font-black text-[#1A1A1A] font-montserrat mb-6">
                        Delete Listing
                    </h2>

                    <p className="text-[16px] font-bold text-gray-400 leading-relaxed max-w-[380px] mb-12">
                        Deleting this listing means your are permanently removing this property
                        from the platform.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-5 rounded-[40px] border border-gray-100 bg-white text-gray-400 font-black text-[18px] font-montserrat hover:bg-gray-50 transition-all shadow-sm transform active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-5 rounded-[40px] border border-[#FF4D4D] bg-white text-[#FF4D4D] font-black text-[18px] font-montserrat hover:bg-red-50 transition-all shadow-sm transform active:scale-[0.98]"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
