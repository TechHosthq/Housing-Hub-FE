import Link from "next/link";

interface ListingSidebarProps {
    propertyId?: string;
}

export default function ListingSidebar({ propertyId }: ListingSidebarProps) {
    return (
        <div className="w-full lg:max-w-[280px] space-y-6">
            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-6 shadow-sm">
                <h3 className="text-[14px] font-black text-[#1A1A1A] font-montserrat mb-6">Listing Information</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#999999]">Property ID</span>
                        <span className="text-[11px] font-bold text-[#333333]">SPH-12024</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#999999]">Listed Date</span>
                        <span className="text-[11px] font-bold text-[#333333]">Dec 1, 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#999999]">Status</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#E9F3FF] text-[#0095FF] text-[9px] font-black uppercase">Available</span>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href={propertyId ? `/property/${propertyId}/inspection` : "#"}
                        className="block w-full text-center bg-primary-dark hover:bg-primary-dark/90 text-white py-3.5 rounded-full text-[12px] font-bold transition-all shadow-md"
                    >
                        Request Inspection
                    </Link>
                </div>
            </div>
        </div>
    );
}
