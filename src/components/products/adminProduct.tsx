import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { updateProduct } from '@/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ProductCardProps {
    product: Product;
}

export function AdminProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['trending-products'] });
            toast.success("Product updated successfully");
            setLoading(false);
        },
        onError: () => {
            toast.error("Failed to update product");
            setLoading(false);
        }
    });

    const updateProductStatus = (field: 'bestseller' | 'featured', value: boolean) => {
        setLoading(true);
        updateMutation.mutate({
            id: product.id,
            [field]: value
        });
    };

    const formatPrice = (price: number) => `£${price}`;

    return (
        <div className="group bg-card border border-border hover-lift transition-all duration-300">
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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="font-sans text-lg font-medium text-foreground">
                            From {formatPrice(product.price)}
                        </span>
                    </div>
                </div>

                {/* Quick Toggles */}
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant={product.bestseller ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateProductStatus('bestseller', !product.bestseller)}
                        className={`flex-1 text-xs h-8 ${product.bestseller ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        disabled={loading}
                    >
                        <Star className={`w-3 h-3 mr-1 ${product.bestseller ? 'fill-current' : ''}`} />
                        {product.bestseller ? 'Trending' : 'Promote'}
                    </Button>
                    <Button
                        variant={product.featured ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => updateProductStatus('featured', !product.featured)}
                        className="flex-1 text-xs h-8"
                        disabled={loading}
                    >
                        {product.featured ? 'Featured' : 'Feature'}
                    </Button>
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
