/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getAllOrders, updateOrderStatus } from '@/api/api';
import { Loader2, Package, Truck, CheckCircle, Clock, XCircle, Search, Eye, AlertTriangle, ArrowRight, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Order {
    id: string;
    orderNumber?: number; // Add friendly ID
    createdAt: string;
    total: number;
    status: string;
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
    };
    items: any[];
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Status Confirmation State
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Status Confirmation State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ id: string, status: string } | null>(null);
    const [updating, setUpdating] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredOrders(orders);
        } else {
            const lowerSearch = search.toLowerCase();
            setFilteredOrders(orders.filter(order =>
                order.id.toLowerCase().includes(lowerSearch) ||
                (order.orderNumber && order.orderNumber.toString().includes(lowerSearch)) || // Search by friendly ID
                order.shippingDetails.firstName.toLowerCase().includes(lowerSearch) ||
                order.shippingDetails.lastName.toLowerCase().includes(lowerSearch) ||
                order.shippingDetails.email.toLowerCase().includes(lowerSearch)
            ));
        }
    }, [search, orders]);

    const fetchOrders = async (loadMore = false) => {
        if (loadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const lastOrder = loadMore && orders.length > 0 ? orders[orders.length - 1] : undefined;
            const lastCreatedAt = lastOrder ? lastOrder.createdAt : undefined;

            // If we are loading more, pass the lastCreatedAt
            // If we are initially loading, lastCreatedAt is undefined
            const data = await getAllOrders(false, 10, lastCreatedAt);

            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (loadMore) {
                const newOrders = [...orders, ...data];
                // Remove duplicates if any (safety check)
                const uniqueOrders = newOrders.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i);
                setOrders(uniqueOrders);
            } else {
                setOrders(data);
            }
        } catch (error) {
            toast.error("Failed to load orders");
            if (!loadMore) setOrders([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        fetchOrders(true);
    };

    const requestStatusUpdate = (id: string, newStatus: string) => {
        // Prevent unnecessary updates
        const order = orders.find(o => o.id === id);
        if (order && order.status === newStatus) return;

        setPendingUpdate({ id, status: newStatus });
        setConfirmOpen(true);
    };

    const executeStatusUpdate = async () => {
        if (!pendingUpdate) return;
        setUpdating(true);
        try {
            await updateOrderStatus(pendingUpdate.id, pendingUpdate.status);
            setOrders(prev => prev.map(order =>
                order.id === pendingUpdate.id ? { ...order, status: pendingUpdate.status } : order
            ));
            toast.success(`Order updated to ${pendingUpdate.status}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
            setConfirmOpen(false);
            setPendingUpdate(null);
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
        <Layout>
            <div className="bg-white min-h-screen py-8">
                <div className="luxury-container">

                    {/* Header Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="col-span-1 md:col-span-2">
                            <h1 className="font-serif text-3xl font-medium text-foreground">Order Management</h1>
                            <p className="text-muted-foreground mt-2 max-w-lg">
                                View and manage all customer orders. Click on an order to view full details and print invoices.
                            </p>
                        </div>
                        <div className="flex gap-4 items-center md:justify-end">
                            <div className="bg-card px-6 py-3 rounded-xl border border-border shadow-sm text-center flex-1 md:flex-none">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Orders</span>
                                <span className="font-serif text-2xl font-medium text-foreground">{orders.length}</span>
                            </div>
                            <div className="bg-card px-6 py-3 rounded-xl border border-border shadow-sm text-center flex-1 md:flex-none">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider font-medium">Revenue</span>
                                <span className="font-serif text-2xl font-medium text-foreground">£{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Order ID, Name or Email"
                                className="pl-10 bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Potential future filters: Status, Date Range */}
                            <Button variant="outline" size="sm" className="hidden md:flex">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/30 border-b border-border">
                                    <tr>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap">Order ID</th>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap">Date Placed</th>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap">Customer</th>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap">Total</th>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap">Status</th>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap">Items</th>
                                        <th className="p-4 font-serif font-medium text-foreground whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-secondary/20 bg-white transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                            >
                                                <td className="p-4 font-mono text-sm text-accent font-medium">
                                                    {order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}...`}
                                                </td>
                                                <td className="p-4 text-sm whitespace-nowrap">
                                                    <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                    <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div className="font-medium text-foreground">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{order.shippingDetails.email}</div>
                                                </td>
                                                <td className="p-4 font-medium text-sm">£{order.total.toLocaleString()}</td>
                                                <td className="p-4">
                                                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm", getStatusColor(order.status))}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground max-w-[200px]">
                                                    <div className="line-clamp-1">
                                                        {order.items.length} item{order.items.length !== 1 && 's'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                                        {order.items.map(item => item.name).join(', ')}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <select
                                                            className="bg-transparent border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent w-28 cursor-pointer hover:bg-secondary/50 transition-colors"
                                                            value={order.status}
                                                            onChange={(e) => requestStatusUpdate(order.id, e.target.value)}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10" asChild>
                                                            <Link to={`/admin/orders/${order.id}`}>
                                                                <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <Package className="w-12 h-12 mb-3 text-muted-foreground/30" />
                                                    <p className="text-lg font-medium text-foreground">No orders found</p>
                                                    {search && <p className="text-sm">Try adjusting your search terms.</p>}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Load More Button - Only show if there's no active search (pagination logic doesn't mix with client-side search easily) */}
                        {!search && hasMore && orders.length > 0 && (
                            <div className="p-4 border-t border-border flex justify-center bg-secondary/10">
                                <Button
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="min-w-[150px]"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Orders'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle className="w-5 h-5" />
                                Confirm Status Change
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to change the order status to <strong>{pendingUpdate?.status}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-amber-50 p-4 rounded-md border border-amber-100 text-sm text-amber-800 mt-2">
                            This will update the order tracking status and may send a notification to the customer.
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={updating}>Cancel</Button>
                            <Button onClick={executeStatusUpdate} disabled={updating}>
                                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Confirm Update
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
