
export const HeadBoardDetails = () => {
    return (
        <section className="bg-white">
            <div className="section-padding luxury-container">
                <h1 className="font-serif text-3xl md:text-4xl text-center font-bold text-foreground mb-12">Why Choose A Somne Headboard?</h1>
                <div className="space-y-12 md:space-y-24">
                    {/* Section 1: Text Left, Image Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-1">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Designed for Comfort</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Our upholstered headboards are designed with your comfort in mind, providing excellent head and neck support whether you're resting, reading, or watching a movie.</p>
                        </div>
                        <div className="rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-[400px] order-1 md:order-2">
                            <img src="/img/mattressbg.jpeg" alt="Extra Storage Options" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Section 2: Image Left, Text Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-[400px] order-1 md:order-1">
                            <img src="/img/img5.png" alt="Sustainably Sourced" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-2">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Sustainably Sourced & Handcrafted in the UK</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Somne beds are expertly handcrafted in the UK using the finest solid hardwood sourced from sustainable forests. Built for lasting strength and exceptional support, each bed reflects our commitment to superior craftsmanship and responsible luxury.</p>
                        </div>
                    </div>

                    {/* Section 3: Text Left, Image Right */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-1">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Engineered for Exceptional Strength with a Reinforced Base</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Selecting the right bed base is essential for superior comfort and support. Our reinforced base is expertly designed to handle extreme weight up to 100 stone, making it ideal for couples or families, while the standard base comfortably supports up to 50 stone—without compromising on stability or elegance.</p>
                        </div>
                        <div className="rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-[400px] order-1 md:order-2">
                            <img src="/img/img6.png" alt="Reinforced Base" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
};