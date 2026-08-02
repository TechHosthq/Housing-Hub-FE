export default function LearnMoreSteps() {
    const steps = [
        {
            title: "List Your Property",
            description: "Add photos, details, and pricing in minutes. Save your listing as a draft or publish it right away."
        },
        {
            title: "Get Verified Inspection Requests",
            description: "Verified renters and buyers browse your listing and request inspections at times that work for you."
        },
        {
            title: "Manage Everything in One Place",
            description: "Approve, decline, or reschedule inspection requests, and message prospective tenants directly in-app."
        },
        {
            title: "Close With Confidence",
            description: "Track every inspection and listing update in real time, from the first request to the final decision."
        }
    ];

    return (
        <section className="py-24 px-8 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-[#1A1A1A] dark:text-gray-100 mb-16 text-center tracking-tight">How Listing Works</h2>

                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-white dark:bg-gray-900 rounded-[17px] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-[#0B2545] hover:bg-[#f0f6ff] dark:hover:bg-gray-800 transition-all duration-300">
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#3b82f6] font-bold text-2xl border border-blue-100">
                                {index + 1}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className="font-semibold text-[#1A1A1A] dark:text-gray-100 mb-1.5 text-xl tracking-tight">{step.title}</h3>
                                <p className="text-gray-500 dark:text-gray-500 font-medium text-base leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
