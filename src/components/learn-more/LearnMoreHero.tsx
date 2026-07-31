export default function LearnMoreHero() {
    return (
        <section className="relative h-[280px] flex items-center justify-center pt-14 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(7, 53, 139, 0.6), rgba(7, 53, 139, 0.6)), url("/images/hero-bg.png")',
                }}
            />
            <div className="relative z-10 text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" style={{ color: "#fff" }}>
                    List With Confidence
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                    Everything you need to know about listing your property on Housing Hub
                </p>
            </div>
        </section>
    );
}
