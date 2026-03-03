import PropertyCard from "./PropertyCard";
import { Property } from "@/types";

interface PropertyGridProps {
    title: string;
    properties: Property[];
}

export default function PropertyGrid({ title, properties }: PropertyGridProps) {
    return (
        <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-12 tracking-tight">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </section>
    );
}
