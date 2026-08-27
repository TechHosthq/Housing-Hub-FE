"use client";

import { ArrowLeft, ChevronDown, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import KYCSuccessModal from "./KYCSuccessModal";
import { useKYCStore } from "@/store/useKYCStore";
import { useCustomer } from "@/hooks/useCustomer";
import { useAuthStore } from "@/store/useAuthStore";

// Same ceiling and reasoning as AddPropertyForm: uploads pass through API Gateway
// and Lambda, which caps request payloads at 6MB — less once multipart and base64
// overhead are counted. Over that, API Gateway rejects the request before the
// function is invoked, so nothing reaches CloudWatch and the browser reports a
// bare network failure. Checking here turns that into something readable.
//
// Note the backend's own DocumentMaxBytes is 15MB and the label here used to
// claim 8MB. Neither is achievable through this stack; the honest number is this
// one, until uploads move to direct-to-S3 presigned URLs.
const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
const ALLOWED_DOCUMENT_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

const formatMegabytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

export default function SubmitIDForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUser = useAuthStore((state) => state.user);
    const { formData: storeData, clearFormData } = useKYCStore();
    const { submitKyc, isSubmittingKyc, uploadDocument, isUploadingDocument } = useCustomer();
    
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    // An opaque private-object reference returned by the upload endpoint, not a URL.
    const [docRef, setDocRef] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        docNumber: "",
        docType: "1" // 1 for NIN, etc.
    });

    const isFormValid =
        formData.docNumber.length === 11 && // NIN is usually 11
        formData.docType &&
        docRef;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "docNumber" && /[^0-9]/.test(value)) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");

        const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
            setError(`We can't read ${extension || "that"} files. Please upload a PDF, JPG, PNG or WEBP.`);
            return;
        }

        if (file.size > MAX_DOCUMENT_BYTES) {
            setError(
                `That file is ${formatMegabytes(file.size)}. Please upload one under ${formatMegabytes(MAX_DOCUMENT_BYTES)} — ` +
                `try a photo of the document rather than a full scan.`
            );
            return;
        }

        try {
            const response = await uploadDocument(file);

            // The API returns a private object reference, not a public URL. It is
            // opaque to us and is only accepted back by submitKyc for this same user.
            if (response.isSuccessful && response.data) {
                setUploadedFileName(file.name);
                setDocRef(response.data);
                return;
            }

            // Previously this fell through to a literal "uploaded_url_placeholder",
            // so a failed upload still looked successful and submitted garbage.
            setUploadedFileName("");
            setDocRef("");
            setError(response.message || "Could not upload the document. Please try again.");
        } catch (err) {
            setUploadedFileName("");
            setDocRef("");
            // Logged, not shown. The bare copy below sent us to CloudWatch to find
            // out that the request had never arrived; the status code belongs in
            // the console where it can be read.
            console.error("KYC document upload failed", err);
            setError("We couldn't upload that document. Please try again in a moment.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!isFormValid || !currentUser?.id) return;

        submitKyc({
            customerId: currentUser.id,
            dateOfBirth: storeData.dateOfBirth ? new Date(storeData.dateOfBirth).toISOString() : null,
            nationalIdNumber: formData.docNumber,
            idType: parseInt(formData.docType),
            idDocumentUrl: docRef,
            jobTitle: storeData.jobTitle || null,
            companyName: storeData.companyName || null,
            industry: storeData.industry || null,
        }, {
            onSuccess: (response) => {
                if (response.isSuccessful) {
                    setShowModal(true);
                    clearFormData();
                    setTimeout(() => {
                        router.push("/dashboard?kyc=submitted");
                    }, 3000);
                } else {
                    setError(response.message || response.errors?.[0]?.errorMessage || "Failed to submit KYC");
                }
            },
            onError: (err: any) => {
                setError(err?.response?.data?.message || err?.message || "An unexpected error occurred");
            }
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <KYCSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />

            <Link
                href="/kyc/personal-info"
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-[17px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-14">
                Submit ID Information
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-8">
                {error && (
                    <div className="px-4 py-3 text-[13px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-2xl text-center font-semibold">
                        {error}
                    </div>
                )}
                
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                        Document Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="docNumber"
                        value={formData.docNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your document number"
                        className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                        Choose Document Type<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="docType"
                            value={formData.docType}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm appearance-none bg-white dark:bg-gray-900"
                        >
                            <option value="1">National Identity Number (NIN)</option>
                            <option value="2">Government Issued ID Card</option>
                            <option value="3">International Passport</option>
                            <option value="4">Driver's License</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                        Upload Document<span className="text-red-500">*</span>
                    </label>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {isUploadingDocument ? (
                        <div className="border border-dashed border-gray-100 dark:border-gray-800 rounded-[22px] bg-white dark:bg-gray-900 p-12 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-primary-dark" size={24} />
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2">Uploading...</span>
                        </div>
                    ) : !uploadedFileName ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dashed border-gray-100 dark:border-gray-800 rounded-[22px] bg-white dark:bg-gray-900 p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-dark transition-all"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary-dark transition-colors">
                                <UploadCloud size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2">Upload Document</span>
                            <p className="text-[10px] text-gray-300 mt-1">PDF, JPG, PNG or WEBP, max 4MB</p>
                        </div>
                    ) : (
                        <div className="bg-[#E9F3FF] rounded-[15px] p-6 flex items-center justify-between border border-[#E9F3FF]">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[#1A1A1A] dark:text-gray-100">{uploadedFileName}</span>
                                <span className="text-[9px] text-[#666666] dark:text-gray-400 mt-0.5">Uploaded successfully</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setUploadedFileName(null); setDocRef(null); }}
                                className="text-[11px] font-bold text-[#0095FF] hover:underline"
                            >
                                Replace
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmittingKyc}
                        className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 ${isFormValid && !isSubmittingKyc
                            ? "bg-primary-dark text-white shadow-lg hover:bg-primary-dark/90"
                            : "bg-[#022352] text-[#BDBDBD] cursor-not-allowed opacity-80"
                            }`}
                    >
                        {isSubmittingKyc && <Loader2 className="animate-spin" size={18} />}
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
