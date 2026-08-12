/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminProductCard } from '@/components/products/adminProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllProducts, bulkUpdateProductStatus } from '@/api/api';
import { Plus, Loader2, Box, Layers, BedDouble, Archive, EyeOff, Eye, Upload, Package, Search } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminEmptyState, AdminPageHeader, AdminPageShell, AdminPanel } from '@/components/admin/AdminUI';

const TABS = [
    { id: 'divan-beds', label: 'Divan Beds', icon: BedDouble, filter: { category: 'beds', subcategory: 'divan-beds' } },
    { id: 'upholstered-beds', label: 'Upholstered Beds', icon: BedDouble, filter: { category: 'beds', subcategory: 'upholstered-beds' } },
    { id: 'ottoman-divan-beds', label: 'Ottoman Divan', icon: Archive, filter: { category: 'beds', subcategory: 'ottoman-divan-beds' } },
    { id: 'ottoman-upholstered-beds', label: 'Ottoman Upholstered', icon: Archive, filter: { category: 'beds', subcategory: 'upholstered-ottoman-bed' } },
    { id: 'mattresses', label: 'Mattresses', icon: Layers, filter: { category: 'mattresses' } },
    { id: 'headboards', label: 'Headboards', icon: Box, filter: { category: 'headboards' } },
    { id: 'all', label: 'All Products', icon: Box, filter: {} }
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('divan-beds');
    const [search, setSearch] = useState('');

    const { data: products = [], isLoading: loading } = useQuery({
        queryKey: ['admin-products', activeTab],
        queryFn: () => getAllProducts(TABS.find(t => t.id === activeTab)?.filter),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const queryClient = useQueryClient();
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return products;
        return products.filter((product: any) =>
            product.name?.toLowerCase().includes(query) ||
            product.shortDescription?.toLowerCase().includes(query) ||
            product.categoryId?.toLowerCase().includes(query) ||
            product.subcategoryId?.toLowerCase().includes(query)
        );
    }, [products, search]);

    const handleBulkToggle = async (active: boolean) => {
        const tab = TABS.find(t => t.id === activeTab);
        if (!tab || !tab.filter || Object.keys(tab.filter).length === 0) return;
        
        setIsBulkUpdating(true);
        try {
            await bulkUpdateProductStatus(tab.filter, active);
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        } catch (error) {
            console.error("Bulk update failed", error);
        } finally {
            setIsBulkUpdating(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Bed Showroom</title>
            </Helmet>
            <AdminLayout>
                <AdminPageShell>
                    <AdminPageHeader
                        title="Product Management"
                        description="Manage inventory, product visibility, pricing, and merchandising from one place."
                        icon={Package}
                        actions={
                            <>
                                <Button asChild>
                                    <Link to="/admin/add">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Product
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="bg-white">
                                    <Link to="/admin/products/bulk-upload">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Bulk Upload
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                        {/* Tabs */}
                        <AdminPanel className="p-2">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative flex shrink-0 items-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                                        activeTab === tab.id
                                            ? "text-white"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                    )}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabBg"
                                            className="absolute inset-0 bg-slate-950"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                        </AdminPanel>

                        {/* Content */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-32">
                                <Loader2 className="mb-4 h-10 w-10 animate-spin text-slate-300" />
                                <p className="font-medium text-slate-500">Loading products...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <AdminPanel>
                                            <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h2 className="text-lg font-semibold text-slate-950">
                                                            {TABS.find(t => t.id === activeTab)?.label}
                                                        </h2>
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                            {filteredProducts.length} of {products.length} items
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-slate-600">Search, review, and update products in this category.</p>
                                                </div>

                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                    <div className="relative w-full sm:w-72">
                                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            value={search}
                                                            onChange={(event) => setSearch(event.target.value)}
                                                            placeholder="Search products..."
                                                            className="bg-white pl-9"
                                                        />
                                                    </div>
                                                    {activeTab !== 'all' && products.length > 0 && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleBulkToggle(true)}
                                                                disabled={isBulkUpdating}
                                                                className="h-9 bg-white text-xs text-slate-600"
                                                            >
                                                                <Eye className="w-3 h-3 mr-1" />
                                                                Enable All
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleBulkToggle(false)}
                                                                disabled={isBulkUpdating}
                                                                className="h-9 border-red-200 bg-white text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                <EyeOff className="w-3 h-3 mr-1" />
                                                                Disable All
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </AdminPanel>
                                        </div>

                                        {filteredProducts.length > 0 ? (
                                            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                                                {filteredProducts.map((product: any) => (
                                                    <AdminProductCard key={product.id} product={product} />
                                                ))}
                                            </div>
                                        ) : (
                                            <AdminEmptyState
                                                icon={Box}
                                                title="No products found"
                                                description={search ? "No products match your search in this category." : "There are no products in this category yet."}
                                                action={
                                                    <Button asChild variant="outline" className="bg-white">
                                                    <Link to="/admin/add">
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Product
                                                    </Link>
                                                </Button>
                                                }
                                            />
                                        )}
                                </motion.div>
                            </AnimatePresence>
                        )}
                </AdminPageShell>
            </AdminLayout>
        </>
    );
}
