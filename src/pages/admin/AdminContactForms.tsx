/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllContactForms, updateContactFormStatus, markContactFormAsRead, ContactForm } from '@/api/api';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, ChevronDown, Clock, Eye, Loader2, MessageSquare, Search, XCircle } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'in progress', 'resolved', 'closed'];

export default function AdminContactForms() {
    const [contactForms, setContactForms] = useState<ContactForm[]>([]);
    const [filteredForms, setFilteredForms] = useState<ContactForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: string } | null>(null);
    const [updating, setUpdating] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchContactForms();
    }, []);

    useEffect(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            setFilteredForms(contactForms);
            return;
        }

        setFilteredForms(contactForms.filter(form =>
            (form.refNo || '').toLowerCase().includes(query) ||
            (form.name || '').toLowerCase().includes(query) ||
            (form.email || '').toLowerCase().includes(query) ||
            (form.message || '').toLowerCase().includes(query) ||
            (form.phone || '').toLowerCase().includes(query) ||
            (form.status || '').toLowerCase().includes(query)
        ));
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
        const form = contactForms.find(item => item.id === id);
        if (form && (form.status || 'pending') === newStatus) return;
        setPendingUpdate({ id, status: newStatus });
        setConfirmOpen(true);
    };

    const handleMarkAsRead = async (form: ContactForm) => {
        if (form.isRead) return;
        try {
            await markContactFormAsRead(form.id);
            setContactForms(prev => prev.map(item => item.id === form.id ? { ...item, isRead: true } : item));
        } catch (error) {
            // Read state is helpful, but not critical enough to interrupt the workflow.
        }
    };

    const toggleExpand = (form: ContactForm) => {
        setExpandedId(expandedId === form.id ? null : form.id);
        if (expandedId !== form.id) handleMarkAsRead(form);
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

    const getStatusIcon = (status?: string) => {
        switch ((status || '').toLowerCase()) {
            case 'in progress': return AlertCircle;
            case 'resolved': return CheckCircle;
            case 'closed': return XCircle;
            default: return Clock;
        }
    };

    const formatDate = (createdAt?: string | { _seconds: number; _nanoseconds: number }) => {
        if (!createdAt) return '—';
        if (typeof createdAt === 'object' && '_seconds' in createdAt) {
            return new Date(createdAt._seconds * 1000).toLocaleDateString();
        }
        try {
            const date = new Date(createdAt);
            return isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
        } catch {
            return '—';
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
        <>
            <Helmet>
                <title>Customer Inquiries | Admin</title>
            </Helmet>
            <AdminLayout>
                <AdminPageShell>
                    <AdminPageHeader
                        title="Customer Inquiries"
                        description="Review contact form submissions, mark messages as read, and update customer query status."
                        icon={MessageSquare}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <AdminStatCard title="Total" value={contactForms.length} icon={MessageSquare} tone="blue" />
                        <AdminStatCard title="Pending" value={contactForms.filter(form => (form.status || 'pending').toLowerCase() === 'pending').length} icon={Clock} tone="amber" />
                        <AdminStatCard title="Unread" value={contactForms.filter(form => !form.isRead).length} icon={Eye} tone="purple" />
                    </div>

                    <AdminPanel>
                        <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-slate-600">
                                Showing {filteredForms.length} of {contactForms.length} inquiries
                            </p>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search by name, email, or message"
                                    className="bg-white pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        {['', 'Token ID', 'Date', 'Customer', 'Contact', 'Message', 'Status', 'Action'].map((heading) => (
                                            <th key={heading || 'read'} className="whitespace-nowrap p-4 text-sm font-semibold text-slate-700 last:text-right">
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredForms.length > 0 ? (
                                        filteredForms.map((form) => (
                                            <Fragment key={form.id}>
                                                <tr
                                                    className={cn(
                                                        "cursor-pointer transition-colors hover:bg-slate-50",
                                                        !form.isRead && "bg-blue-50/50",
                                                        expandedId === form.id && "bg-slate-50"
                                                    )}
                                                    onClick={() => toggleExpand(form)}
                                                >
                                                    <td className="p-4 text-center">
                                                        {!form.isRead ? (
                                                            <div className="mx-auto h-2.5 w-2.5 rounded-full bg-blue-500" title="Unread" />
                                                        ) : (
                                                            <Eye className="mx-auto h-4 w-4 text-slate-300" />
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-mono text-sm font-semibold text-slate-900">{form.refNo || form.id?.slice(0, 6) || '—'}</td>
                                                    <td className="whitespace-nowrap p-4 text-sm text-slate-600">{formatDate(form.createdAt)}</td>
                                                    <td className="p-4">
                                                        <div className="text-sm font-semibold text-slate-950">{form.name || 'Unnamed'}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-slate-900">{form.email || 'No email'}</div>
                                                        <div className="text-xs text-slate-500">{form.phone || '—'}</div>
                                                    </td>
                                                    <td className="max-w-[280px] p-4">
                                                        <div className="flex items-center gap-2">
                                                            <p className="line-clamp-1 flex-1 text-sm text-slate-600">
                                                                {(form.message || '').slice(0, 60)}{(form.message || '').length > 60 && '...'}
                                                            </p>
                                                            <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", expandedId === form.id && "rotate-180")} />
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <AdminStatusBadge tone={adminStatusTone(form.status || 'pending')} icon={getStatusIcon(form.status)}>
                                                            {form.status || 'pending'}
                                                        </AdminStatusBadge>
                                                    </td>
                                                    <td className="p-4 text-right" onClick={(event) => event.stopPropagation()}>
                                                        <select
                                                            className="w-32 cursor-pointer rounded border border-slate-200 bg-white px-2 py-1.5 text-xs transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                            value={form.status || 'pending'}
                                                            onChange={(e) => requestStatusUpdate(form.id, e.target.value)}
                                                        >
                                                            {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                                {expandedId === form.id && (
                                                    <tr className="bg-slate-50">
                                                        <td colSpan={8} className="p-0">
                                                            <div className="px-6 py-4">
                                                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Full Message</div>
                                                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                                                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-900">{form.message || 'No message provided.'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-6">
                                                <AdminEmptyState
                                                    icon={MessageSquare}
                                                    title="No inquiries found"
                                                    description={search ? "Try adjusting your search terms." : "Customer messages will appear here."}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </AdminPanel>

                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-amber-600">
                                    <AlertCircle className="h-5 w-5" />
                                    Confirm Status Change
                                </DialogTitle>
                                <DialogDescription className="pt-2">
                                    Are you sure you want to change the status to <strong>{pendingUpdate?.status}</strong>?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-2 rounded-md border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                                This will send an email notification to the customer about the status update.
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
        </>
    );
}
