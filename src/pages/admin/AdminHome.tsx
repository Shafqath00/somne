/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getAllOrders, getAllProducts, getAllContactForms, getAllDiscounts, ContactForm } from '@/api/api';
import {
    Loader2, Package, ShoppingBag, MessageSquare, Ticket,
    Clock, CheckCircle, Truck, XCircle,
    ArrowRight, Plus, TrendingUp, DollarSign, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

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
    createdAt: string | { _seconds: number; _nanoseconds: number };
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

    // Chart Data States
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);

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

            processChartData(orders, products);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const processChartData = (orders: Order[], products: any[]) => {
        // 1. Revenue Over Time (Last 30 Days)
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const revenueMap: { [key: string]: number } = {};
        last30Days.forEach(date => revenueMap[date] = 0);

        orders.forEach(order => {
            const orderDate = new Date(
                typeof order.createdAt === 'object' && '_seconds' in order.createdAt
                    ? order.createdAt._seconds * 1000
                    : order.createdAt
            ).toISOString().split('T')[0];

            if (revenueMap[orderDate] !== undefined) {
                revenueMap[orderDate] += order.total || 0;
            }
        });

        const revData = Object.keys(revenueMap).map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: revenueMap[date]
        }));
        setRevenueData(revData);

        // 2. Top Selling Products
        const productSales: { [key: string]: number } = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                if (item.name) {
                    productSales[item.name] = (productSales[item.name] || 0) + (item.quantity || 1);
                }
            });
        });

        const topProds = Object.entries(productSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
        setTopProducts(topProds);

        // 3. Category Distribution
        const catMap: { [key: string]: number } = {};
        products.forEach(p => {
            const cat = p.categoryId || 'Other';
            catMap[cat] = (catMap[cat] || 0) + 1;
        });

        const catData = Object.entries(catMap)
            .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
        setCategoryData(catData);
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Somne</title>
            </Helmet>
            <AdminLayout>
                <div className="bg-slate-50 min-h-screen py-8">
                    <div className="luxury-container">

                        {/* Header */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-serif text-3xl font-medium text-foreground">Admin Dashboard</h1>
                                <p className="text-muted-foreground mt-2">Overview of your store performance</p>
                            </div>
                            <Button onClick={() => fetchDashboardData()} variant="outline" size="sm">
                                <Activity className="w-4 h-4 mr-2" /> Refresh Data
                            </Button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                            <StatsCard
                                title="Total Revenue"
                                value={`£${stats.totalRevenue.toLocaleString()}`}
                                icon={DollarSign}
                                color="text-green-600"
                                bg="bg-green-50"
                            />
                            <StatsCard
                                title="Total Orders"
                                value={stats.totalOrders}
                                icon={ShoppingBag}
                                color="text-blue-600"
                                bg="bg-blue-50"
                            />
                            <StatsCard
                                title="Products"
                                value={stats.totalProducts}
                                icon={Package}
                                color="text-purple-600"
                                bg="bg-purple-50"
                            />
                            <StatsCard
                                title="Inquiries"
                                value={stats.pendingInquiries}
                                icon={MessageSquare}
                                color="text-orange-600"
                                bg="bg-orange-50"
                            />
                            <StatsCard
                                title="Discounts"
                                value={stats.activeDiscounts}
                                icon={Ticket}
                                color="text-pink-600"
                                bg="bg-pink-50"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Revenue Chart */}
                            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="font-serif text-lg font-medium mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-accent" />
                                    Revenue Overview
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#133a54" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#133a54" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#64748B' }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#64748B' }}
                                                tickFormatter={(value) => `£${value}`}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '12px' }}
                                                formatter={(value: number) => [`£${value.toLocaleString()}`, 'Revenue']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#133a54"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Top Products */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="font-serif text-lg font-medium mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-accent" />
                                    Top Selling Products
                                </h3>
                                <div className="space-y-6">
                                    {topProducts.length > 0 ? (
                                        topProducts.map((product, index) => (
                                            <div key={index} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-medium text-slate-600 text-xs">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]" title={product.name}>
                                                        {product.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-accent rounded-full"
                                                            style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-500">{product.sales} sold</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">No sales data yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Row */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            <Link to="/admin/orders" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-slate-600" />
                                        <span className="font-medium text-slate-800">Orders</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </Link>
                            {/* ... more links can go here if needed, keeping it clean for now */}
                            <Link to="/admin/products" className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
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

                        {/* Recent Activity Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h2 className="font-serif text-lg font-medium text-foreground">Recent Orders</h2>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild className="text-xs hover:bg-white">
                                        <Link to="/admin/orders">View All</Link>
                                    </Button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-foreground">
                                                                {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-foreground">£{order.total.toLocaleString()}</p>
                                                        <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1", getStatusColor(order.status))}>
                                                            {order.status}
                                                        </div>
                                                    </div>
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
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h2 className="font-serif text-lg font-medium text-foreground">Recent Inquiries</h2>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild className="text-xs hover:bg-white">
                                        <Link to="/admin/contact-forms">View All</Link>
                                    </Button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentInquiries.length > 0 ? (
                                        recentInquiries.map((form) => (
                                            <div key={form.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                                                            <MessageSquare className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-foreground">{form.name}</p>
                                                            <p className="text-xs text-muted-foreground">{form.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                                                        {formatDate(form.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 line-clamp-2 pl-[52px]">{form.message}</p>
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
            </AdminLayout>
        </>
    );
}

function StatsCard({ title, value, icon: Icon, color, bg }: { title: string, value: string | number, icon: any, color: string, bg: string }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bg)}>
                    <Icon className={cn("w-5 h-5", color)} />
                </div>
                <span className="text-sm text-muted-foreground">{title}</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
    );
}
