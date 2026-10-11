import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Images, Star, Eye, EyeOff, SquarePen, Palette, Trash2, Bookmark } from 'lucide-react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { deleteProduct, updateProduct } from '@/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ProductCardProps {
    product: Product;
}

export function AdminProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const productPath = `/product/${encodeURIComponent(product.slug || product.name)}`;
    const editPath = `/admin/edit/${encodeURIComponent(product.id)}`;
    const coverImage =
        product.coverImage ||
        product.image ||
        product.images?.[0] ||
        product.colors?.find((c) => c.isDefault)?.image ||
        product.colors?.[0]?.image ||
        '/placeholder.jpg';

    const mainImageCount = product.images?.length || 0;
    const variantImageCount =
        product.colors?.reduce(
            (total, color) => total + (color.image ? 1 : 0) + (color.productImages?.length || 0),
            0,
        ) || 0;

    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['trending-products'] });
            toast.success('Product updated successfully');
            setLoading(false);
        },
        onError: () => {
            toast.error('Failed to update product');
            setLoading(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['trending-products'] });
            toast.success('Product deleted successfully');
            setLoading(false);
        },
        onError: () => {
            toast.error('Failed to delete product');
            setLoading(false);
        },
    });

    const updateProductStatus = (field: 'bestseller' | 'featured' | 'active', value: boolean) => {
        setLoading(true);
        updateMutation.mutate({ id: product.id, [field]: value });
    };

    const handleDeleteProduct = () => {
        const confirmed = window.confirm(`Delete "${product.name}"? This removes it from the catalog.`);
        if (!confirmed) return;
        setLoading(true);
        deleteMutation.mutate(product.id);
    };

    const formatPrice = (price: number) => `£${Number(price || 0).toLocaleString()}`;

    const isHidden = product.active === false;

    return (
        <div className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">

            {/* ── Image ────────────────────────────────────────── */}
            <Link to={productPath} className="relative block overflow-hidden bg-slate-100">
                {/* Trending badge */}
                {product.bestseller && (
                    <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        Trending
                    </span>
                )}

                {/* Hidden overlay */}
                {isHidden && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 backdrop-grayscale">
                        <span className="rounded border border-red-200 bg-red-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
                            Hidden
                        </span>
                    </div>
                )}

                <div className={`aspect-[4/3] ${isHidden ? 'opacity-75 grayscale-[50%]' : ''}`}>
                    <img
                        src={coverImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </Link>

            {/* ── Body ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 p-4">

                {/* Name + visibility badge */}
                <div className="flex items-start justify-between gap-2">
                    <Link to={productPath} className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[14px] font-medium leading-snug tracking-tight text-slate-900 transition-colors hover:text-slate-600">
                            {product.name}
                        </h3>
                    </Link>
                    <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                            isHidden
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        }`}
                    >
                        {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {isHidden ? 'Hidden' : 'Visible'}
                    </span>
                </div>

                {/* Description */}
                {/* <p className="line-clamp-2 min-h-[36px] text-[12px] leading-relaxed text-slate-500">
                    {product.shortDescription || 'No short description added.'}
                </p> */}

                {/* Meta badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        <Images className="h-3 w-3" />
                        {mainImageCount} main
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        <Palette className="h-3 w-3" />
                        {variantImageCount} variant
                    </span>
                    {product.featured && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            <Bookmark className="h-3 w-3" />
                            Featured
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="">
                    {/* <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Price</p> */}
                    <p className=" text-[17px] font-semibold text-slate-900">
                        From {formatPrice(product.price)}
                    </p>
                </div>

                {/* Toggle buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                    <button
                        onClick={() => updateProductStatus('bestseller', !product.bestseller)}
                        disabled={loading}
                        className={`inline-flex h-8 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors disabled:opacity-50 ${
                            product.bestseller
                                ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Star className={`h-3 w-3 ${product.bestseller ? 'fill-amber-500 text-amber-500' : ''}`} />
                        {product.bestseller ? 'Trending' : 'Promote'}
                    </button>

                    <button
                        onClick={() => updateProductStatus('featured', !product.featured)}
                        disabled={loading}
                        className={`inline-flex h-8 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors disabled:opacity-50 ${
                            product.featured
                                ? 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Bookmark className={`h-3 w-3 ${product.featured ? 'fill-blue-500 text-blue-500' : ''}`} />
                        {product.featured ? 'Featured' : 'Feature'}
                    </button>

                    <button
                        onClick={() => updateProductStatus('active', isHidden)}
                        disabled={loading}
                        className={`inline-flex h-8 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors disabled:opacity-50 ${
                            isHidden
                                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                    >
                        {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {isHidden ? 'Hidden' : 'Visible'}
                    </button>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-1.5 border-t border-slate-100 pt-3">
                    <Link
                        to={productPath}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        View
                    </Link>

                    <button
                        onClick={() => navigate(editPath)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-[12px] font-medium text-blue-700 transition-colors hover:bg-blue-100"
                    >
                        <SquarePen className="h-3.5 w-3.5" />
                        Edit
                    </button>

                    <button
                        onClick={handleDeleteProduct}
                        disabled={loading}
                        title="Delete product"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>

            </div>
        </div>
    );
}