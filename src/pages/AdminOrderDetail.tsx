/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getOrderById, updateOrderStatus } from '@/api/api';
import { Loader2, Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, MapPin, Mail, Phone, Calendar, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

export default function AdminOrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder(id);
        }
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
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Processing': return <Package className="w-4 h-4" />;
            case 'Shipped': return <Truck className="w-4 h-4" />;
            case 'Delivered': return <CheckCircle className="w-4 h-4" />;
            case 'Cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const possibleStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            </Layout>
        );
    }

    if (!order) return null;

    return (
        <Layout>
            <div className="bg-white min-h-screen py-8">
                <div className="luxury-container">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild className="shrink-0">
                                <Link to="/admin/orders">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center flex-wrap gap-3">
                                    <h1 className="font-serif md:text-3xl text-xl font-medium text-foreground">
                                        {order.orderNumber ? `Order #${order.orderNumber}` : `Order #${order.id}`}
                                    </h1>
                                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border", getStatusColor(order.status))}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                </div>
                                <p className="text-muted-foreground mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-card px-4 py-2 rounded-lg border border-border shadow-sm text-center">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider">Total Amount</span>
                                <span className="font-serif text-xl font-medium">£{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Order Items */}
                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h2 className="font-serif text-xl font-medium flex items-center gap-2">
                                        <Package className="w-5 h-5 text-accent" />
                                        Order Items
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-secondary/30 text-xs uppercase text-muted-foreground border-b border-border">
                                            <tr>
                                                <th className="p-4 font-medium">Product</th>
                                                <th className="p-4 font-medium text-center">Quantity</th>
                                                <th className="p-4 font-medium text-right">Unit Price</th>
                                                <th className="p-4 font-medium text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {order.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-secondary/10 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-md bg-secondary overflow-hidden shrink-0 border border-border">
                                                                <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">{item.name}</p>
                                                                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
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
                                                    <td className="p-4 text-right font-medium">£{((item.price || item.basePrice) * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-secondary/20 font-medium border-t border-border">
                                            <tr>
                                                <td colSpan={3} className="p-4 text-right">Subtotal</td>
                                                <td className="p-4 text-right">£{order.total.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="p-4 text-right text-lg font-bold text-accent">Total</td>
                                                <td className="p-4 text-right text-lg font-bold text-accent">£{order.total.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Customer & Status */}
                        <div className="space-y-8">
                            {/* Status Management */}
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                                <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-accent" />
                                    Order Actions
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Current Status</p>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className="font-medium">{order.status}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Change Status</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {possibleStatuses.map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusUpdateClick(status)}
                                                    disabled={order.status === status}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 rounded-md text-sm transition-colors border",
                                                        order.status === status
                                                            ? "bg-accent/10 border-accent/20 text-accent font-medium cursor-default"
                                                            : "bg-white border-border hover:bg-secondary hover:border-accent/50"
                                                    )}
                                                >
                                                    {status}
                                                    {order.status === status && <span className="float-right text-xs bg-accent/20 px-2 py-0.5 rounded-full">Current</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                                <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    Shipping Details
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Customer</p>
                                        <p className="font-medium text-base">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                    </div>
                                    <div className="pt-3 border-t border-border">
                                        <p className="text-muted-foreground mb-1">Contact</p>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Mail className="w-4 h-4 text-accent/70" />
                                            <a href={`mailto:${order.shippingDetails.email}`} className="hover:text-accent transition-colors">
                                                {order.shippingDetails.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-accent/70" />
                                            <span>{order.shippingDetails.phone}</span>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-border">
                                        <p className="text-muted-foreground mb-1">Address</p>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 text-accent/70 shrink-0" />
                                            <span>
                                                {order.shippingDetails.address}<br />
                                                {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle className="w-5 h-5" />
                                Confirm Status Change
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to change the order status from <strong>{order.status}</strong> to <strong>{statusToUpdate}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-amber-50 p-4 rounded-md border border-amber-100 text-sm text-amber-800 mt-2">
                            This action may trigger email notifications to the customer.
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={updating}>Cancel</Button>
                            <Button onClick={confirmStatusUpdate} disabled={updating}>
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

// Icon component
function Settings2({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
        </svg>
    )
}
