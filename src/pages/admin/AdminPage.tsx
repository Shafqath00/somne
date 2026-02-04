/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminProductCard } from '@/components/products/adminProduct';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/api/api';
import { Plus, Loader2, Box, Layers, BedDouble, Archive } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

    const { data: products = [], isLoading: loading } = useQuery({
        queryKey: ['admin-products', activeTab],
        queryFn: () => getAllProducts(TABS.find(t => t.id === activeTab)?.filter),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Bed Showroom</title>
            </Helmet>
            <Layout>
                <div className="min-h-screen bg-slate-50/50">
                    <div className='luxury-container section-padding'>

                        {/* Header */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-slate-200'>
                            <div>
                                <h1 className="font-serif text-3xl font-bold text-slate-900">Product Management</h1>
                                <p className="text-slate-500 mt-1">Manage your inventory, prices, and product details</p>
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Button asChild variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all bg-white mr-2">
                                    <Link to="/admin/orders">
                                        <Box className="w-4 h-4 mr-2" />
                                        View Orders
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all bg-white mr-2">
                                    <Link to="/admin/discount">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Discount Code
                                    </Link>
                                </Button>
                                <Button asChild variant="luxury" size="lg" className="shadow-lg hover:shadow-xl transition-all">
                                    <Link to="/admin/add">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Product
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                                        activeTab === tab.id
                                            ? "text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabBg"
                                            className="absolute inset-0 bg-slate-900"
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

                        {/* Content */}
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-32">
                                <Loader2 className="w-10 h-10 animate-spin text-slate-300 mb-4" />
                                <p className="text-slate-400 font-medium">Loading products...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-12"
                                >
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <h2 className="text-xl font-medium text-slate-800">
                                                {TABS.find(t => t.id === activeTab)?.label}
                                            </h2>
                                            <div className="h-px flex-1 bg-slate-200"></div>
                                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
                                                {products.length} Items
                                            </span>
                                        </div>

                                        {products.length > 0 ? (
                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                                {products.map((product: any) => (
                                                    <AdminProductCard key={product.id} product={product} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <Box className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 mb-1">No products found</h3>
                                                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                                    There are no products in this category yet.
                                                </p>
                                                <Button asChild variant="outline">
                                                    <Link to="/admin/add">
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Product
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}