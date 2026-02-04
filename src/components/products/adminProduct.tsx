import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye,SquarePen  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

export function AdminProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const navigate = useNavigate();
    // const [activeImage, setActiveImage] = useState(product.images[0]);

    // const handleAddToCart = () => {
    //     if (product.sizes.length > 0) {
    //         addItem(product, 1, product.sizes[0], product.colors?.[0], product.storageOptions?.[0]);
    //         toast.success(`${product.name} added to bag`);
    //     }
    // };

    const formatPrice = (price: number) => `£${price}`;

    return (
        <div className="group bg-card border border-border hover-lift">
            {/* Image */}
            <Link to={`/product/${product.name}`} className="block relative overflow-hidden image-zoom">
                <div className="aspect-[4/3]">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                </div>
                {product.bestseller && (
                    <span className="absolute top-4 left-4 bg-accent text-foreground px-3 py-1 text-xs font-sans tracking-wide uppercase">
                        Bestseller
                    </span>
                )}
                {/* Quick actions overlay */}
                {/* <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                   
                </div> */}
            </Link>

            {/* Content */}
            <div className="p-5">
                <Link to={`/product/${product.name}`}>
                    <h3 className="font-serif text-lg font-medium text-foreground mb-1 hover:text-accent transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="font-sans text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.shortDescription}
                </p>


                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-sans text-lg font-medium text-foreground">
                            From {formatPrice(product.price)}
                        </span>
                    </div>
                </div>

                <div className='flex gap-2'>
                    <Button variant="luxuryOutline" size="sm" asChild className='w-full' >
                        <Link to={`/product/${product.name}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                        </Link>
                    </Button>
                    <Button variant="hero" size="sm" onClick={() => { navigate(`/admin/edit/${product.name}`) }} className='w-full'>

                        <SquarePen className="w-4 h-4 mr-1" />
                        Edit
                    </Button>

                </div>

            </div>
        </div>
    );
}
