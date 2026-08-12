/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '@/api/api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdminPageHeader, AdminPageShell, AdminPanel, AdminStatCard, AdminStatusBadge, adminStatusTone } from '@/components/admin/AdminUI';
import { toast } from 'sonner';
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, Mail, MapPin, Package, Phone, Settings2, Truck, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const POSSIBLE_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) fetchOrder(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchOrder = async (orderId: string) => {
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            toast.error("Failed to load order details");
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdateClick = (newStatus: string) => {
        if (newStatus === order?.status) return;
        setStatusToUpdate(newStatus);
        setIsConfirmOpen(true);
    };

    const confirmStatusUpdate = async () => {
        if (!order || !statusToUpdate) return;
        setUpdating(true);
        try {
            await updateOrderStatus(order.id, statusToUpdate);
            setOrder({ ...order, status: statusToUpdate });
            toast.success(`Order status updated to ${statusToUpdate}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
            setIsConfirmOpen(false);
            setStatusToUpdate(null);
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
                    <Clock className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            </AdminLayout>
        );
    }

    if (!order) return null;

    const orderTitle = order.orderNumber ? `Order #${order.orderNumber}` : `Order #${order.id}`;

    return (
        <AdminLayout>
            <AdminPageShell>
                <AdminPageHeader
                    title={orderTitle}
                    description={`Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}`}
                    icon={Package}
                    actions={
                        <>
                            <Button asChild variant="outline" size="icon" className="bg-white" aria-label="Back to orders">
                                <Link to="/admin/orders">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <AdminStatusBadge tone={adminStatusTone(order.status)} icon={getStatusIcon(order.status)}>
                                {order.status}
                            </AdminStatusBadge>
                        </>
                    }
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AdminStatCard title="Total Amount" value={`£${order.total.toLocaleString()}`} icon={CheckCircle} tone="green" />
                    <AdminStatCard title="Items" value={order.items.length} icon={Package} tone="blue" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <AdminPanel
                            header={
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                                    <Package className="h-5 w-5 text-slate-600" />
                                    Order Items
                                </h2>
                            }
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="p-4 font-semibold">Product</th>
                                            <th className="p-4 text-center font-semibold">Quantity</th>
                                            <th className="p-4 text-right font-semibold">Unit Price</th>
                                            <th className="p-4 text-right font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {order.items.map((item, index) => (
                                            <tr key={index} className="transition-colors hover:bg-slate-50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                                                            <img src={item.image || "/placeholder.jpg"} alt={item.name} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-950">{item.name}</p>
                                                            <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                                                                {item.selectedSize?.name && <p>Size: {item.selectedSize.name}</p>}
                                                                {item.selectedColor?.name && <p>Color: {item.selectedColor.name}</p>}
                                                                {item.selectedStorage?.name && <p>Storage: {item.selectedStorage.name}</p>}
                                                                {item.selectedHeadboard?.name && <p>Headboard: {item.selectedHeadboard.name}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">{item.quantity}</td>
                                                <td className="p-4 text-right">£{(item.price || item.basePrice).toLocaleString()}</td>
                                                <td className="p-4 text-right font-semibold">£{((item.price || item.basePrice) * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold">
                                        <tr>
                                            <td colSpan={3} className="p-4 text-right">Subtotal</td>
                                            <td className="p-4 text-right">£{order.total.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="p-4 text-right text-lg text-slate-950">Total</td>
                                            <td className="p-4 text-right text-lg text-slate-950">£{order.total.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </AdminPanel>
                    </div>

                    <div className="space-y-6">
                        <AdminPanel className="p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-950">
                                <Settings2 className="h-5 w-5 text-slate-600" />
                                Order Actions
                            </h3>
                            <div className="space-y-4">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <p className="mb-2 text-sm font-medium text-slate-600">Current Status</p>
                                    <AdminStatusBadge tone={adminStatusTone(order.status)} icon={getStatusIcon(order.status)}>
                                        {order.status}
                                    </AdminStatusBadge>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-600">Change Status</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {POSSIBLE_STATUSES.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdateClick(status)}
                                                disabled={order.status === status}
                                                className={cn(
                                                    "w-full rounded-md border px-4 py-2 text-left text-sm transition-colors",
                                                    order.status === status
                                                        ? "cursor-default border-slate-300 bg-slate-100 font-medium text-slate-950"
                                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                )}
                                            >
                                                {status}
                                                {order.status === status && <span className="float-right rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">Current</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AdminPanel>

                        <AdminPanel className="p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-950">
                                <MapPin className="h-5 w-5 text-slate-600" />
                                Shipping Details
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="mb-1 text-slate-500">Customer</p>
                                    <p className="text-base font-semibold text-slate-950">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                </div>
                                <div className="border-t border-slate-200 pt-3">
                                    <p className="mb-1 text-slate-500">Contact</p>
                                    <div className="mb-1 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <a href={`mailto:${order.shippingDetails.email}`} className="text-slate-700 transition-colors hover:text-slate-950">
                                            {order.shippingDetails.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <span>{order.shippingDetails.phone}</span>
                                    </div>
                                </div>
                                <div className="border-t border-slate-200 pt-3">
                                    <p className="mb-1 text-slate-500">Address</p>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <span>
                                            {order.shippingDetails.address}<br />
                                            {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AdminPanel>
                    </div>
                </div>

                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle className="h-5 w-5" />
                                Confirm Status Change
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to change the order status from <strong>{order.status}</strong> to <strong>{statusToUpdate}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 rounded-md border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                            This action may trigger email notifications to the customer.
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={updating}>Cancel</Button>
                            <Button onClick={confirmStatusUpdate} disabled={updating}>
                                {updating ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Confirm Update
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AdminPageShell>
        </AdminLayout>
    );
}
