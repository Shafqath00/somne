/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { createDiscount, getAllDiscounts, deleteDiscount } from "@/api/api";
import { Loader2, Trash2, Tag, Percent, PoundSterling, Calendar, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const discountSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
    type: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().min(0.01, "Value must be greater than 0"),
    minOrderAmount: z.coerce.number().optional().default(0),
    maxUses: z.coerce.number().optional(),
    expiresAt: z.string().optional(),
    autoApply: z.boolean().default(false),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

// Helper to format date nicely
const formatDate = (dateString: any) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

export default function DiscountPage() {
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [discountToDelete, setDiscountToDelete] = useState<{ id: string; code: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<DiscountFormValues>({
        resolver: zodResolver(discountSchema),
        defaultValues: {
            code: "",
            type: "percentage",
            value: 0,
            minOrderAmount: 0,
            autoApply: false,
        },
    });

    const fetchDiscounts = async () => {
        try {
            const data = await getAllDiscounts();
            setDiscounts(data);
        } catch (error) {
            toast.error("Failed to load discount codes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const onSubmit = async (data: DiscountFormValues) => {
        setIsSubmitting(true);
        try {
            await createDiscount({
                ...data,
                expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null
            });
            toast.success("Discount code created successfully!");
            form.reset();
            fetchDiscounts(); // Refresh list
        } catch (error: any) {
            toast.error(error.error || "Failed to create discount code");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id: string, code: string) => {
        setDiscountToDelete({ id, code });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!discountToDelete) return;
        setIsDeleting(true);
        try {
            await deleteDiscount(discountToDelete.id);
            toast.success(`Discount code "${discountToDelete.code}" deleted`);
            fetchDiscounts();
        } catch (error) {
            toast.error("Failed to delete discount code");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setDiscountToDelete(null);
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Discounts | Bed Showroom Admin</title>
            </Helmet>
            <Layout>
                <div className="min-h-screen bg-slate-50/50 py-12">
                    <div className="luxury-container max-w-6xl mx-auto px-4">
                        <div className="mb-8">
                            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Discount Management</h1>
                            <p className="text-muted-foreground">Create and manage discount codes for your store.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Create Discount Form */}
                            <div className="lg:col-span-1">
                                <Card className="border-none shadow-lg">
                                    <CardHeader className="bg-white rounded-t-lg pb-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-accent" />
                                            New Discount Code
                                        </CardTitle>
                                        <CardDescription>Create a new promotional code</CardDescription>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-6 bg-white rounded-b-lg">
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="code"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Code Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="SUMMER25" {...field} className="uppercase font-medium tracking-wide" />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">
                                                                The code customers will enter at checkout.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="type"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                                        <SelectItem value="fixed">Fixed Amount (£)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="value"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Value</FormLabel>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <Input type="number" {...field} className="pl-8" />
                                                                        <span className="absolute left-3 top-2.5 text-muted-foreground">
                                                                            {form.watch("type") === "percentage" ? <Percent className="w-4 h-4" /> : <PoundSterling className="w-4 h-4" />}
                                                                        </span>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="minOrderAmount"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Min Order Amount (£)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">Optional. Leave 0 for no minimum.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="maxUses"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Usage Limit</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} placeholder="Target 1st 100 customers..." />
                                                            </FormControl>
                                                            <FormDescription className="text-xs">Optional total number of times this code can be used.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="expiresAt"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Expires At</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="autoApply"
                                                    render={({ field }) => (
                                                        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-slate-50">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Auto Apply</FormLabel>
                                                                <FormDescription className="text-xs">
                                                                    Automatically apply this code at checkout for all users.
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={field.value}
                                                                        onChange={field.onChange}
                                                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </div>
                                                    )}
                                                />

                                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Discount Code"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Existing Discounts List */}
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-xl font-semibold mb-4 text-primary">Active Discounts</h2>
                                {isLoading ? (
                                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                ) : discounts.length === 0 ? (
                                    <div className="text-center p-12 bg-white rounded-lg shadow border border-dashed text-muted-foreground">
                                        No discount codes found. Create your first one!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {discounts.map((discount) => (
                                            <div key={discount.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-lg font-bold text-primary tracking-wider px-3 py-1 bg-primary/5 rounded border border-primary/10">
                                                            {discount.code}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${discount.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {discount.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {discount.autoApply && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                                                                Auto Apply
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-600 mt-2 flex flex-wrap gap-x-6 gap-y-1">
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-semibold text-accent">
                                                                {discount.type === 'percentage' ? `${discount.value}% Off` : `£${discount.value} Off`}
                                                            </span>
                                                        </span>
                                                        {discount.minOrderAmount > 0 && <span>Min Order: £{discount.minOrderAmount}</span>}
                                                        <span>Used: <span className="font-medium">{discount.usedCount || 0}</span>{discount.maxUses ? ` / ${discount.maxUses}` : ''}</span>
                                                        {discount.expiresAt && <span className="flex items-center gap-1 text-orange-600"><Calendar className="w-3 h-3" /> Exp: {formatDate(discount.expiresAt)}</span>}
                                                    </div>
                                                </div>
                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                        onClick={() => handleDeleteClick(discount.id, discount.code)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-5 h-5" />
                                Delete Discount Code
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to delete the discount code <strong>{discountToDelete?.code}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-red-50 p-4 rounded-md border border-red-100 text-sm text-red-800 mt-2">
                            This action cannot be undone. The discount code will be permanently deleted.
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Layout>
        </>
    );
}