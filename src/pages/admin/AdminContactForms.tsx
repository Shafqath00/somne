/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getAllContactForms, updateContactFormStatus, markContactFormAsRead, ContactForm } from '@/api/api';
import {
    Loader2, MessageSquare, Search, Clock, CheckCircle, AlertCircle, XCircle, Eye, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
import { Helmet } from 'react-helmet-async';

const STATUS_OPTIONS = ['pending', 'in progress', 'resolved', 'closed'];

export default function AdminContactForms() {
    const [contactForms, setContactForms] = useState<ContactForm[]>([]);
    const [filteredForms, setFilteredForms] = useState<ContactForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Status update confirmation
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: string } | null>(null);
    const [updating, setUpdating] = useState(false);

    // Expanded row state
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchContactForms();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredForms(contactForms);
        } else {
            const lowerSearch = search.toLowerCase();
            setFilteredForms(contactForms.filter(form =>
                (form.refNo || '').toLowerCase().includes(lowerSearch) ||
                form.name.toLowerCase().includes(lowerSearch) ||
                form.email.toLowerCase().includes(lowerSearch) ||
                form.message.toLowerCase().includes(lowerSearch)
            ));
        }
    }, [search, contactForms]);

    const fetchContactForms = async () => {
        setLoading(true);
        try {
            const forms = await getAllContactForms();
            setContactForms(forms);
        } catch (error) {
            toast.error("Failed to load contact forms");
        } finally {
            setLoading(false);
        }
    };

    const requestStatusUpdate = (id: string, newStatus: string) => {
        const form = contactForms.find(f => f.id === id);
        if (form && form.status === newStatus) return;
        setPendingUpdate({ id, status: newStatus });
        setConfirmOpen(true);
    };

    const handleMarkAsRead = async (form: ContactForm) => {
        if (form.isRead) return;
        try {
            await markContactFormAsRead(form.id);
            setContactForms(prev => prev.map(f =>
                f.id === form.id ? { ...f, isRead: true } : f
            ));
        } catch (error) {
            // Silently fail - not critical
        }
    };

    const toggleExpand = (form: ContactForm) => {
        if (expandedId === form.id) {
            setExpandedId(null);
        } else {
            setExpandedId(form.id);
            handleMarkAsRead(form);
        }
    };

    const executeStatusUpdate = async () => {
        if (!pendingUpdate) return;
        setUpdating(true);
        try {
            await updateContactFormStatus(pendingUpdate.id, pendingUpdate.status);
            setContactForms(prev => prev.map(form =>
                form.id === pendingUpdate.id ? { ...form, status: pendingUpdate.status } : form
            ));
            toast.success(`Status updated to ${pendingUpdate.status}`);
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
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3.5 h-3.5" />;
            case 'in progress': return <AlertCircle className="w-3.5 h-3.5" />;
            case 'resolved': return <CheckCircle className="w-3.5 h-3.5" />;
            case 'closed': return <XCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
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
                <title>Customer Inquiries | Admin</title>
            </Helmet>
            <Layout>
                <div className="bg-slate-50 min-h-screen py-8">
                    <div className="luxury-container">

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="font-serif text-3xl font-medium text-foreground">Customer Inquiries</h1>
                            <p className="text-muted-foreground mt-2">Manage contact form submissions and customer queries</p>
                        </div>

                        {/* Contact Forms Table */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {contactForms.length} total • {contactForms.filter(f => f.status === 'pending').length} pending • {contactForms.filter(f => !f.isRead).length} unread
                                    </span>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, email..."
                                        className="pl-10 bg-slate-50"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap w-8"></th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap">Token ID</th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap">Date</th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap">Customer</th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap">Contact</th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap">Message</th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap">Status</th>
                                            <th className="p-4 font-medium text-slate-600 text-sm whitespace-nowrap text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredForms.length > 0 ? (
                                            filteredForms.map((form) => (
                                                <>
                                                    <tr
                                                        key={form.id}
                                                        className={cn(
                                                            "hover:bg-slate-50/50 transition-colors cursor-pointer",
                                                            !form.isRead && "bg-blue-50/30",
                                                            expandedId === form.id && "bg-slate-50"
                                                        )}
                                                        onClick={() => toggleExpand(form)}
                                                    >
                                                        <td className="p-4 text-center">
                                                            {!form.isRead ? (
                                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mx-auto" title="Unread" />
                                                            ) : (
                                                                <Eye className="w-4 h-4 text-slate-300 mx-auto" />
                                                            )}
                                                        </td>
                                                        <td className="p-4 font-mono text-sm font-semibold text-accent">
                                                            {form.refNo || form.id.slice(0, 6)}
                                                        </td>
                                                        <td className="p-4 text-sm whitespace-nowrap">
                                                            {formatDate(form.createdAt)}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-medium text-sm text-foreground">{form.name}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-sm text-foreground">{form.email}</div>
                                                            <div className="text-xs text-muted-foreground">{form.phone}</div>
                                                        </td>
                                                        <td className="p-4 max-w-[250px]">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm text-muted-foreground line-clamp-1 flex-1">
                                                                    {form.message.slice(0, 50)}
                                                                    {form.message.length > 50 && '...'}
                                                                </p>
                                                                {form.message.length > 50 && (
                                                                    <span className="text-xs text-accent font-medium whitespace-nowrap">
                                                                        +{form.message.length - 50} more
                                                                    </span>
                                                                )}
                                                                <ChevronDown className={cn(
                                                                    "w-4 h-4 text-slate-400 transition-transform flex-shrink-0",
                                                                    expandedId === form.id && "rotate-180"
                                                                )} />
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(form.status))}>
                                                                {getStatusIcon(form.status)}
                                                                {form.status}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                            <select
                                                                className="bg-transparent border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent w-28 cursor-pointer hover:bg-slate-50 transition-colors"
                                                                value={form.status}
                                                                onChange={(e) => requestStatusUpdate(form.id, e.target.value)}
                                                            >
                                                                {STATUS_OPTIONS.map(status => (
                                                                    <option key={status} value={status}>{status}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    {/* Expanded Message Row */}
                                                    {expandedId === form.id && (
                                                        <tr className="bg-slate-50">
                                                            <td colSpan={8} className="p-0">
                                                                <div className="px-6 py-4 border-t border-slate-100">
                                                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Full Message</div>
                                                                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                                        <p className="text-sm text-foreground whitespace-pre-wrap">{form.message}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="p-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                        <MessageSquare className="w-12 h-12 mb-3 text-slate-200" />
                                                        <p className="text-lg font-medium text-foreground">No inquiries found</p>
                                                        {search && <p className="text-sm">Try adjusting your search terms.</p>}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Dialog */}
                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-amber-600">
                                    <AlertCircle className="w-5 h-5" />
                                    Confirm Status Change
                                </DialogTitle>
                                <DialogDescription className="pt-2">
                                    Are you sure you want to change the status to <strong>{pendingUpdate?.status}</strong>?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="bg-amber-50 p-4 rounded-md border border-amber-100 text-sm text-amber-800 mt-2">
                                This will send an email notification to the customer about the status update.
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
        </>
    );
}
