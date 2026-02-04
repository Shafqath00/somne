/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminProductCard } from '@/components/products/adminProduct';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/api/api';
import { Plus, Loader2, Box } from 'lucide-react';

export default function AdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Bed Showroom</title>
            </Helmet>
            <Layout>
                <div className="min-h-screen bg-white">
                    <div className='luxury-container section-padding'>

                        {/* Header */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-slate-200'>
                            <div>
                                <h1 className="font-serif text-3xl font-bold text-slate-900">Product Management</h1>
                                <p className="text-slate-500 mt-1">Manage your inventory, prices, and product details</p>
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl rounded-lg transition-all mr-2">
                                    <Link to="/admin/orders">
                                        <Box className="w-4 h-4 mr-2" />
                                        View Orders
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl rounded-lg transition-all mr-2">
                                    <Link to="/admin/discount">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Discount Code
                                    </Link>
                                </Button>
                                <Button asChild variant="luxury" size="lg" className="shadow-lg hover:shadow-xl rounded-lg transition-all">
                                    <Link to="/admin/add">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Product
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {Object.entries(
                                    products.reduce((acc, product) => {
                                        const category = product.categoryId || 'Uncategorized';
                                        if (!acc[category]) acc[category] = [];
                                        acc[category].push(product);
                                        return acc;
                                    }, {} as Record<string, any[]>)
                                ).map(([category, categoryProducts]: [string, any[]]) => (
                                    <div key={category} id={category} className="scroll-mt-24">
                                        <div className="flex items-center gap-4 mb-6">
                                            <h2 className="text-2xl font-serif font-semibold text-slate-800 capitalize">
                                                {category === 'mattresses' ? 'Mattresses' :
                                                    category === 'beds' ? 'Luxury Beds' :
                                                        category === 'accessories' ? 'Accessories' :
                                                            category === 'headboards' ? 'Headboards' :
                                                                category}
                                            </h2>
                                            <div className="h-px flex-1 bg-slate-200"></div>
                                            <span className="text-sm font-medium text-slate-400">
                                                {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
                                            </span>
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                            {categoryProducts.map((product) => (
                                                <AdminProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {products.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
                                        <p className="text-slate-500">No products found. Add your first product to get started.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}