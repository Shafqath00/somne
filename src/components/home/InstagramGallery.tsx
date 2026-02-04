import { Instagram } from 'lucide-react';
import categoryUpholstered from '@/assets/category-upholstered.jpg';
import categoryDivan from '@/assets/category-divan.jpg';
import categoryOttoman from '@/assets/category-ottoman.jpg';
import categoryMattress from '@/assets/category-mattress.jpg';
import categoryHeadboard from '@/assets/category-headboard.jpg';
import heroBedroom from '@/assets/hero-bedroom.jpg';

const instagramImages = [
    { src: heroBedroom, alt: 'Luxury navy bedroom' },
    { src: categoryUpholstered, alt: 'Upholstered bed' },
    { src: categoryDivan, alt: 'Divan bed' },
    { src: categoryOttoman, alt: 'Ottoman bed' },
    { src: categoryMattress, alt: 'Premium mattress' },
    { src: categoryHeadboard, alt: 'Tufted headboard' },
];

export function InstagramGallery() {
    return (
        <section className="section-padding bg-background">
            <div className="luxury-container">
                <div className="text-center mb-12">
                    <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
                        @BedShowroom
                    </span>
                    <h2 className="luxury-heading text-foreground mb-4">
                        Follow Our Journey
                    </h2>
                    <p className="luxury-body">
                        Get inspired by our customers and discover styling tips
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {instagramImages.map((image, index) => (
                        <a
                            key={index}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden image-zoom"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="w-8 h-8 text-cream" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
