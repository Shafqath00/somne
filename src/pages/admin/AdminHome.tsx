/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getAllOrders, getAllProducts, getAllContactForms, getAllDiscounts, ContactForm } from '@/api/api';
import {
    Loader2, Package, ShoppingBag, MessageSquare, Ticket,
    Clock, CheckCircle, Truck, XCircle,
    ArrowRight, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    pendingInquiries: number;
    activeDiscounts: number;
}

interface Order {
    id: string;
    orderNumber?: number;
    createdAt: string;
    total: number;
    status: string;
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: any[];
}

export default function AdminHome() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        pendingInquiries: 0,
        activeDiscounts: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [recentInquiries, setRecentInquiries] = useState<ContactForm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [orders, products, forms, discounts] = await Promise.all([
                getAllOrders(false, 100).catch(() => []),
                getAllProducts().catch(() => []),
                getAllContactForms().catch(() => []),
                getAllDiscounts().catch(() => [])
            ]);

            setStats({
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
                totalProducts: products.length,
                pendingInquiries: forms.filter((f: ContactForm) => f.status === 'pending').length,
                activeDiscounts: discounts.filter((d: any) => d.active).length
            });

            // Get 5 most recent orders
            setRecentOrders(orders.slice(0, 5));
            // Get 5 most recent inquiries
            setRecentInquiries(forms.slice(0, 5));
        } catch (error) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock className="w-3.5 h-3.5" />;
            case 'Processing': return <Package className="w-3.5 h-3.5" />;
            case 'Shipped': return <Truck className="w-3.5 h-3.5" />;
            case 'Delivered': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'Cancelled': return <XCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    const getInquiryStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (createdAt: string | { _seconds: number; _nanoseconds: number }) => {
        if (typeof createdAt === 'object' && '_seconds' in createdAt) {
            return new Date(createdAt._seconds * 1000).toLocaleDateString();
        }
        return new Date(createdAt).toLocaleDateString();
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Somne</title>
            </Helmet>
            <Layout>
                <div className="bg-slate-50 min-h-screen py-8">
                    <div className="luxury-container">

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="font-serif text-3xl font-medium text-foreground">Admin Dashboard</h1>
                            <p className="text-muted-foreground mt-2">Overview of your store and customer inquiries</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Orders</span>
                                </div>
                                <p className="text-2xl font-semibold text-foreground">{stats.totalOrders}</p>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 font-semibold">£</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">Revenue</span>
                                </div>
                                <p className="text-2xl font-semibold text-foreground">£{stats.totalRevenue.toLocaleString()}</p>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <ShoppingBag className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Products</span>
                                </div>
                                <p className="text-2xl font-semibold text-foreground">{stats.totalProducts}</p>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Inquiries</span>
                                </div>
                                <p className="text-2xl font-semibold text-foreground">{stats.pendingInquiries}</p>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                                        <Ticket className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Discounts</span>
                                </div>
                                <p className="text-2xl font-semibold text-foreground">{stats.activeDiscounts}</p>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                            <Link to="/admin/orders" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-slate-600" />
                                        <span className="font-medium text-slate-800">Orders</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </Link>

                            <Link to="/admin" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5 text-slate-600" />
                                        <span className="font-medium text-slate-800">Products</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </Link>

                            <Link to="/admin/contact-forms" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-slate-600" />
                                        <span className="font-medium text-slate-800">Inquiries</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </Link>

                            <Link to="/admin/discount" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Ticket className="w-5 h-5 text-slate-600" />
                                        <span className="font-medium text-slate-800">Discounts</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </Link>

                            <Link to="/admin/add" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Plus className="w-5 h-5 text-slate-600" />
                                        <span className="font-medium text-slate-800">Add Product</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </Link>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Recent Orders */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h2 className="font-serif text-xl font-medium text-foreground">Recent Orders</h2>
                                        <p className="text-sm text-muted-foreground mt-1">Latest 5 orders</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/admin/orders">View All</Link>
                                    </Button>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-mono text-sm text-accent font-medium">
                                                            {order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}`}
                                                        </p>
                                                        <p className="text-sm text-foreground mt-1">
                                                            {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-foreground">£{order.total.toLocaleString()}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(order.status))}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <Package className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                                            <p>No orders yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Inquiries */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h2 className="font-serif text-xl font-medium text-foreground">Recent Inquiries</h2>
                                        <p className="text-sm text-muted-foreground mt-1">Latest contact form submissions</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/admin/contact-forms">View All</Link>
                                    </Button>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {recentInquiries.length > 0 ? (
                                        recentInquiries.map((form) => (
                                            <div key={form.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium text-sm text-foreground">{form.name}</p>
                                                        <p className="text-xs text-muted-foreground">{form.email}</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{formatDate(form.createdAt)}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{form.message}</p>
                                                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getInquiryStatusColor(form.status))}>
                                                    {form.status}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                                            <p>No inquiries yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
