/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '@/api/api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdminEmptyState, AdminPageHeader, AdminPageShell, AdminPanel, AdminStatCard, AdminStatusBadge, adminStatusTone } from '@/components/admin/AdminUI';
import { toast } from 'sonner';
import { AlertTriangle, ArrowRight, CheckCircle, Clock, Filter, Loader2, Package, Search, ShoppingCart, Truck, XCircle } from 'lucide-react';

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
        phone: string;
        address: string;
        city: string;
        postalCode: string;
    };
    items: any[];
}

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ id: string, status: string } | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            setFilteredOrders(orders);
            return;
        }

        setFilteredOrders(orders.filter(order =>
            order.id.toLowerCase().includes(query) ||
            (order.orderNumber && order.orderNumber.toString().includes(query)) ||
            order.shippingDetails.firstName.toLowerCase().includes(query) ||
            order.shippingDetails.lastName.toLowerCase().includes(query) ||
            order.shippingDetails.email.toLowerCase().includes(query)
        ));
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
            const data = await getAllOrders(false, 10, lastCreatedAt);

            setHasMore(data.length >= 10);
            if (loadMore) {
                const nextOrders = [...orders, ...data].filter((order, index, all) => all.findIndex(candidate => candidate.id === order.id) === index);
                setOrders(nextOrders);
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

    const requestStatusUpdate = (id: string, newStatus: string) => {
        const order = orders.find(item => item.id === id);
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Processing': return Package;
            case 'Shipped': return Truck;
            case 'Delivered': return CheckCircle;
            case 'Cancelled': return XCircle;
            default: return Clock;
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPageShell>
                <AdminPageHeader
                    title="Order Management"
                    description="View and manage customer orders. Open an order for full details and invoice actions."
                    icon={ShoppingCart}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AdminStatCard title="Total Orders" value={orders.length} icon={Package} tone="blue" />
                    <AdminStatCard title="Revenue" value={`£${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`} icon={CheckCircle} tone="green" />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by order ID, name, or email"
                            className="bg-white pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="hidden bg-white md:flex">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>

                <AdminPanel>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    {['Order ID', 'Date Placed', 'Customer', 'Total', 'Status', 'Items', 'Actions'].map((heading) => (
                                        <th key={heading} className="whitespace-nowrap p-4 text-sm font-semibold text-slate-700 last:text-right">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="cursor-pointer bg-white transition-colors hover:bg-slate-50"
                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        >
                                            <td className="p-4 font-mono text-sm font-medium text-slate-900">
                                                {order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 8)}...`}
                                            </td>
                                            <td className="whitespace-nowrap p-4 text-sm">
                                                <div className="font-medium text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="font-medium text-slate-900">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</div>
                                                <div className="text-xs text-slate-500">{order.shippingDetails.email}</div>
                                            </td>
                                            <td className="p-4 text-sm font-semibold text-slate-900">£{order.total.toLocaleString()}</td>
                                            <td className="p-4">
                                                <AdminStatusBadge tone={adminStatusTone(order.status)} icon={getStatusIcon(order.status)}>
                                                    {order.status}
                                                </AdminStatusBadge>
                                            </td>
                                            <td className="max-w-[220px] p-4 text-sm text-slate-600">
                                                <div className="line-clamp-1">{order.items.length} item{order.items.length !== 1 && 's'}</div>
                                                <div className="line-clamp-1 text-xs text-slate-500">{order.items.map(item => item.name).join(', ')}</div>
                                            </td>
                                            <td className="p-4 text-right" onClick={(event) => event.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        className="w-28 cursor-pointer rounded border border-slate-200 bg-white px-2 py-1.5 text-xs transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                        value={order.status}
                                                        onChange={(e) => requestStatusUpdate(order.id, e.target.value)}
                                                    >
                                                        {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                                                    </select>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900" asChild>
                                                        <Link to={`/admin/orders/${order.id}`}>
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-6">
                                            <AdminEmptyState
                                                icon={Package}
                                                title="No orders found"
                                                description={search ? "Try adjusting your search terms." : "Orders will appear here after checkout."}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!search && hasMore && orders.length > 0 && (
                        <div className="flex justify-center border-t border-slate-200 bg-slate-50 p-4">
                            <Button variant="outline" onClick={() => fetchOrders(true)} disabled={loadingMore} className="min-w-[150px] bg-white">
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Orders'
                                )}
                            </Button>
                        </div>
                    )}
                </AdminPanel>

                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle className="h-5 w-5" />
                                Confirm Status Change
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to change the order status to <strong>{pendingUpdate?.status}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 rounded-md border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                            This will update the order tracking status and may send a notification to the customer.
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={updating}>Cancel</Button>
                            <Button onClick={executeStatusUpdate} disabled={updating}>
                                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Confirm Update
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AdminPageShell>
        </AdminLayout>
    );
}
