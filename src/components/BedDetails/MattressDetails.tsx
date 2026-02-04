
export const MattressDetails = () => {
    return (
        <section className="bg-white">
            <div className="section-padding luxury-container">
                <h1 className="font-serif text-3xl md:text-4xl text-center font-bold text-foreground mb-12">Why Choose A Somne Mattress?</h1>
                <div className="space-y-12 md:space-y-20">
                    {/* Section 1: Text Left, Image Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-1">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Air Vents</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Built-in air vents help keep your mattress fresh and breathable, delivering a cooler and more comfortable sleep every night.</p>
                        </div>
                        <div className="rounded-xl flex items-center justify-center overflow-hidden aspect-video md:aspect-auto md:h-[300px] order-1 md:order-2">
                            <img src="/img/icons/AirVents.png" alt="Extra Storage Options" className="w-[250px] h-[250px] hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Section 2: Image Left, Text Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="rounded-xl flex items-center justify-center overflow-hidden aspect-video md:aspect-auto md:h-[300px] order-1 md:order-1">
                            <img src="/img/icons/FireRetardant.png" alt="Sustainably Sourced" className="w-[250px] h-[250px]  hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-2">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Fire Retardant</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Rest easy knowing your safety comes first with a fire-retardant mattress that meets strict safety standards for added peace of mind.</p>
                        </div>
                    </div>

                    {/* Section 3: Text Left, Image Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-1">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Hypoallergenic</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Create a healthier sleep environment with a hypoallergenic mattress designed to protect against allergens.</p>
                        </div>
                        <div className="rounded-xl flex items-center justify-center overflow-hidden aspect-video md:aspect-auto md:h-[300px] order-1 md:order-2">
                            <img src="/img/icons/Hypoallergenic.png" alt="Reinforced Base" className="w-[250px] h-[250px]  hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-[400px] order-1 md:order-1">
                            <img src="/img/img5.png" alt="Sustainably Sourced" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-2">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Memory Foam</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Enjoy exceptional comfort with memory foam that adapts to your body’s contours for a personalised sleep experience.</p>
                        </div>
                    </div> */}

                    {/* Section 3: Text Left, Image Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="rounded-xl flex items-center justify-center overflow-hidden aspect-video md:aspect-auto md:h-[300px] order-1 md:order-2">
                            <img src="/img/icons/Pocketsprings.png" alt="Reinforced Base" className="w-[250px] h-[250px]  hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-2">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Pocket Springs</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Individually encased pocket springs provide targeted support while reducing motion transfer for a peaceful, undisturbed sleep.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-1">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Made in the UK</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Sleep soundly on a UK-made mattress, handcrafted with care using the highest quality materials.</p>
                        </div>
                        <div className="rounded-xl flex items-center justify-center overflow-hidden aspect-video md:aspect-auto md:h-[300px] order-1 md:order-1">
                            <img src="/img/icons/uk.png" alt="Sustainably Sourced" className="w-[250px] h-[250px]  hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Section 3: Text Left, Image Right */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="flex flex-col gap-4 items-center justify-center text-center order-2 md:order-1">
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground max-w-[500px]">Hypoallergenic</h2>
                            <p className="text-sm md:text-base text-muted-foreground max-w-[450px] leading-relaxed">Create a healthier sleep environment with a hypoallergenic mattress designed to protect against allergens.</p>
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