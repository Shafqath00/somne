/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, ArrowLeft, BedSingle, BedDouble, Weight, BrickWall, Upload, Package, Palette, Ruler, Archive, Crown, Layers, Sparkles, Images, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductSize, ProductColor, ProductCategory, ProductSubcategory } from '@/types';
import { toast } from 'sonner';
import { postProduct, uploadImage } from '@/api/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const initialColor: ProductColor[] = [{ name: 'Black Plush', hex: '#000000' }, { name: 'Steel Plush', hex: '#454545' }, { name: 'Cream Plush', hex: '#c1b5a4' }, { name: 'Silver Plush', hex: '#a09f9f' }, { name: 'Blue Plush', hex: '#133a54' }, { name: 'Latte Plush', hex: '#302118' }, { name: 'Emerald Plush', hex: '#2a4430' }, { name: 'Mink Plush', hex: '#9f856f' }, { name: 'Pink Plush', hex: '#bf9089' }, { name: 'Seal Grey Naples', hex: '#9f938c' }, { name: 'Cream Naples', hex: '#ded1c1' }, { name: 'Black Naples', hex: '#000000' }, { name: 'Slate Grey Naples', hex: '#55504d' }, { name: 'Mauve Naples', hex: '#8f7774' }, { name: 'Mink Naples', hex: '#825d43' }, { name: 'Cream Chenille', hex: '#d0c5b4' }, { name: 'Silver Chenille', hex: '#757575' }, { name: 'Charcoal Chenille', hex: '#515655' }, { name: 'Black Chenille', hex: '#000000' }];

// Section Header Component
const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description?: string }) => (
    <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/10">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
            <h2 className="font-serif text-xl font-medium text-foreground">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
    </div>
);

// Input Field Component
const InputField = ({ label, required, ...props }: { label: string, required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-accent">*</span>}
        </label>
        <input
            {...props}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 placeholder:text-muted-foreground/50"
        />
    </div>
);

// Select Field Component
const SelectField = ({ label, children, ...props }: { label: string, children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <select
            {...props}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 appearance-none cursor-pointer"
        >
            {children}
        </select>
    </div>
);

export default function ProductAdd() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        basePrice: 0,
        categoryId: 'beds' as ProductCategory,
        subcategoryId: '' as string,
        images: [] as string[],
        sizes: [] as any[],
        colors: initialColor,
        storageOptions: [] as any[],
        headboardOptions: [] as any[],
        baseOptions: [] as any[],
        firmnessOptions: [] as any[],
        discountPercentage: 0,
        discountPrice: 0,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    // Generate a unique ID for storage organization
    const [storageId] = useState(() => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
        return `product-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    });

    const postProductData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.basePrice <= 0) {
            toast.error('Please fill in product name and base price');
            return;
        }
        // if (formData.sizes.length === 0) {
        //     toast.error('Please select at least one size');
        //     return;
        // }
        try {
            setLoading(true);
            const uploadedImageUrls: string[] = [];
            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(file => uploadImage(file, `products/${storageId}/main`));
                const urls = await Promise.all(uploadPromises);
                uploadedImageUrls.push(...urls);
            }
            const discountPrice = formData.basePrice * (1 - formData.discountPercentage / 100);
            const finalProductData = {
                ...formData,
                images: [...formData.images.filter(url => url.startsWith('http')), ...uploadedImageUrls],
                discountPrice
            };
            if (formData.categoryId === 'mattresses') {
                finalProductData.colors = null;
            }

            await postProduct(finalProductData);
            toast.success('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                shortDescription: '',
                basePrice: 0,
                categoryId: 'beds',
                subcategoryId: '',
                images: [],
                sizes: [],
                colors: initialColor,
                storageOptions: [],
                headboardOptions: [],
                baseOptions: [],
                firmnessOptions: [],
                discountPercentage: 0,
                discountPrice: 0,
            });
            setImageFiles([]);
        } catch (error) {
            console.error(error);
            toast.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => {
            const discountPrice = value * (1 - prev.discountPercentage / 100);
            return { ...prev, basePrice: value, discountPrice };
        });
    };

    const handleDiscountPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= 0 && value <= 100) {
            setFormData(prev => {
                const discountPrice = prev.basePrice * (1 - value / 100);
                return { ...prev, discountPercentage: value, discountPrice };
            });
        }
    };

    const handleDiscountPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => {
            const percentage = Number(prev.discountPercentage) || 0;
            // Avoid division by zero if percentage is 100 (though practically 100% off means price 0)
            if (percentage === 100) {
                return { ...prev, discountPrice: value };
            }
            const newBasePrice = value / (1 - percentage / 100);
            return {
                ...prev,
                discountPrice: value,
                basePrice: Number(newBasePrice.toFixed(2))
            };
        });
    };

    const handleColorChange = (index: number, field: keyof ProductColor, value: any) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const addColor = () => {
        setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#000000' }] }));
    };

    const removeColor = (index: number) => {
        setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
    };

    const setDefaultColor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.map((c, i) => ({ ...c, isDefault: i === index }))
        }));
    };

    const calculateFinalPrice = (sizeModifier: number) => {
        return Number(formData.discountPrice) + Number(sizeModifier || 0);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
            const newImageUrls = files.map(file => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                images: [...prev.images.filter(img => img !== ''), ...newImageUrls]
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            // Show loading toast
            const toastId = toast.loading('Uploading variant images...');

            const uploadPromises = files.map(file => uploadImage(file, `products/${storageId}/variants`));
            const urls = await Promise.all(uploadPromises);

            setFormData(prev => {
                const newColors = [...prev.colors];
                const currentImages = newColors[index].productImages || [];
                newColors[index] = {
                    ...newColors[index],
                    productImages: [...currentImages, ...urls]
                };
                return { ...prev, colors: newColors };
            });

            toast.dismiss(toastId);
            toast.success(`Uploaded ${urls.length} images`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload variant images');
        }
    };

    const [activeDragIndex, setActiveDragIndex] = useState<{ type: 'color' | 'variant' | 'mattress', index: number } | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (type: 'color' | 'variant' | 'mattress', index: number) => (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDragIndex({ type, index });
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDragIndex(null);
    };

    const handleColorImageDrop = async (index: number, e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDragIndex(null);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            try {
                const toastId = toast.loading('Uploading image...');
                const url = await uploadImage(files[0], `products/${storageId}/variants`);
                handleColorChange(index, 'image', url);
                toast.dismiss(toastId);
                toast.success('Image uploaded');
            } catch (err) {
                console.error(err);
                toast.error('Upload failed');
            }
        }
    };

    const handleVariantImageDrop = async (index: number, e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDragIndex(null);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        try {
            const toastId = toast.loading('Uploading variant images...');
            const uploadPromises = files.filter(file => file.type.startsWith('image/')).map(file => uploadImage(file, `products/${storageId}/variants`));

            if (uploadPromises.length === 0) {
                toast.dismiss(toastId);
                toast.error('No valid images found');
                return;
            }

            const urls = await Promise.all(uploadPromises);

            setFormData(prev => {
                const newColors = [...prev.colors];
                const currentImages = newColors[index].productImages || [];
                newColors[index] = {
                    ...newColors[index],
                    productImages: [...currentImages, ...urls]
                };
                return { ...prev, colors: newColors };
            });

            toast.dismiss(toastId);
            toast.success(`Uploaded ${urls.length} images`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload variant images');
        }
    };

    const removeVariantImage = (colorIndex: number, imageIndex: number) => {
        setFormData(prev => {
            const newColors = [...prev.colors];
            const currentImages = newColors[colorIndex].productImages || [];
            newColors[colorIndex] = {
                ...newColors[colorIndex],
                productImages: currentImages.filter((_, i) => i !== imageIndex)
            };
            return { ...prev, colors: newColors };
        });
    };

    const handleMattressImageDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDragIndex(null);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        try {
            const toastId = toast.loading('Uploading mattress images...');
            const imageFiles = files.filter(file => file.type.startsWith('image/'));

            if (imageFiles.length === 0) {
                toast.dismiss(toastId);
                toast.error('No valid images found');
                return;
            }

            const uploadPromises = imageFiles.map(file => uploadImage(file, `products/${storageId}/main`));
            const urls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images.filter(img => img), ...urls]
            }));

            toast.dismiss(toastId);
            toast.success(`Uploaded ${urls.length} images`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload mattress images');
        }
    };

    const setMattressImageAsCover = (index: number) => {
        if (index === 0) return;
        setFormData(prev => {
            const currentImages = prev.images;
            const imageToMove = currentImages[index];
            const otherImages = currentImages.filter((_, i) => i !== index);
            return {
                ...prev,
                images: [imageToMove, ...otherImages]
            };
        });
    };





    return (
        <>
            <Helmet>
                <title>Add Product | Admin</title>
            </Helmet>
            <Layout>
                {/* Hero Header */}
                <div className="relative bg-gradient-to-br from-primary via-primary to-[hsl(225,30%,22%)] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />

                    <div className="relative luxury-container py-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Link to="/admin">
                                    <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-4 h-4 text-accent" />
                                        <span className="text-xs font-medium text-accent uppercase tracking-wider">New Product</span>
                                    </div>
                                    <h1 className="font-serif text-3xl md:text-4xl font-medium text-white">Create Product</h1>
                                    <p className="text-white/60 mt-1">Add a new product to your catalog</p>
                                </div>
                            </div>
                            <Button
                                onClick={postProductData}
                                disabled={loading}
                                className="bg-accent hover:bg-accent/90 text-primary font-medium px-6 py-3 h-auto shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Saving...' : 'Save Product'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
                    <div className="luxury-container py-10">
                        <form onSubmit={postProductData} className="space-y-8 max-w-5xl mx-auto">

                            {/* Basic Details */}
                            <div className="bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                                <SectionHeader icon={Package} title="Basic Details" description="Essential product information" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Product Name"
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. The Westminster"
                                    />
                                    <InputField
                                        label="Base Price (£)"
                                        required
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice || ''}
                                        onChange={handleBasePriceChange}
                                        placeholder="0.00"
                                        min="0"
                                    />
                                    <div className="space-y-2">
                                        <InputField
                                            label="Discount Percentage (%)"
                                            type="number"
                                            name="discountPercentage"
                                            value={formData.discountPercentage || ''}
                                            onChange={handleDiscountPercentageChange}
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                        />
                                        <div className="text-sm font-medium bg-secondary/50 p-3 rounded-lg border border-border">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Original Price:</span>
                                                <span className="line-through">£{Number(formData.basePrice).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-accent mt-1">
                                                <span>OG Price:</span>
                                                <input
                                                    required
                                                    type="number"
                                                    name="discountPrice"
                                                    value={formData.discountPrice || (formData.basePrice && formData.discountPercentage ? (formData.basePrice * (1 - formData.discountPercentage / 100)).toFixed(2) : '')}
                                                    onChange={handleDiscountPriceChange}
                                                    placeholder="0.00"
                                                    min="0"
                                                    className="bg-transparent border-b border-accent/20 text-right w-24 focus:outline-none focus:border-accent"
                                                />
                                            </div>
                                            <div className="flex justify-between text-green-600 mt-1 text-xs">
                                                <span>You Save:</span>
                                                <span>£{(Number(formData.basePrice) * (Number(formData.discountPercentage) / 100)).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <SelectField
                                        label="Category"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                    >
                                        <option value="beds">Beds</option>
                                        <option value="mattresses">Mattresses</option>
                                        <option value="headboards">Headboards</option>
                                        <option value="panels">Panels</option>
                                    </SelectField>
                                    <SelectField
                                        label="Subcategory"
                                        name="subcategoryId"
                                        value={formData.subcategoryId}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Subcategory</option>
                                        <option value="upholstered-beds">Upholstered Beds</option>
                                        <option value="divan-beds">Divan Beds</option>
                                        <option value="kids-divan-beds">Kids Divan Beds</option>
                                        <option value="memory-foam">Memory Foam</option>
                                        <option value="orthopaedic-mattress">Orthopaedic Mattresses</option>
                                        <option value="pocket-sprung-mattress">Pocket Sprung Mattress</option>
                                        <option value="pillow-top-mattress">Pillow Top Mattress</option>
                                        <option value="ottoman-divan-beds">Ottoman Divan Beds</option>
                                        <option value="upholstered-ottoman-bed">Upholstered Ottoman Bed</option>
                                        <option value="headboards">Headboards</option>
                                        <option value="bathroom-panels">Bathroom Panels</option>
                                        <option value="wall-panels">Wall Panels</option>
                                        <option value="outdoor-panels">Outdoor Panels</option>
                                    </SelectField>
                                </div>

                                {/* <div className="mt-6 space-y-6">
                                    <InputField
                                        label="Short Description"
                                        type="text"
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        placeholder="Brief summary for product cards..."
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Full Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 placeholder:text-muted-foreground/50 resize-none"
                                            placeholder="Detailed product description..."
                                        />
                                    </div>
                                </div> */}
                            </div>

                            {/* Mattress Images - Only for Mattress Category */}
                            {formData.categoryId === 'mattresses' && (
                                <div className="bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <SectionHeader icon={Upload} title="Mattress Images" description="Upload high-quality mattress photos" />
                                        <div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                id="mattress-image-upload"
                                                onChange={handleImageChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('mattress-image-upload')?.click()}
                                                className="border-dashed border-2 hover:border-accent hover:bg-accent/5"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Images
                                            </Button>
                                        </div>
                                    </div>

                                    <div
                                        className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border-2 border-dashed rounded-xl transition-colors duration-200 ${activeDragIndex?.type === 'mattress' ? 'border-accent bg-accent/5' : 'border-transparent'}`}
                                        onDragEnter={handleDragEnter('mattress', 0)}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDrag}
                                        onDrop={handleMattressImageDrop}
                                    >
                                        {formData.images.filter(img => img).map((img, index) => (
                                            <div key={index} className="relative aspect-square group rounded-xl overflow-hidden border border-border/50 bg-secondary/30">
                                                <img
                                                    src={img}
                                                    alt={`Mattress ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                                {/* Set as Cover Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMattressImageAsCover(index);
                                                    }}
                                                    className={`absolute top-2 left-2 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 z-10 
                                                        ${index === 0
                                                            ? 'bg-amber-500 text-white opacity-100 shadow-md'
                                                            : 'bg-black/30 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white hover:scale-110'
                                                        }`}
                                                    title={index === 0 ? "Cover Image" : "Set as Cover"}
                                                >
                                                    <Star className={`w-4 h-4 ${index === 0 ? 'fill-current' : ''}`} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-destructive/90 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:scale-110"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                                                    {index === 0 ? 'Cover' : `${index + 1} / ${formData.images.filter(img => img).length}`}
                                                </div>
                                            </div>
                                        ))}
                                        {formData.images.filter(img => img).length === 0 && (
                                            <div
                                                className="col-span-full py-16 text-center cursor-pointer"
                                                onClick={() => document.getElementById('mattress-image-upload')?.click()}
                                            >
                                                <Upload className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                                                <p className="text-muted-foreground font-medium">
                                                    {activeDragIndex?.type === 'mattress' ? 'Drop images here' : 'No images selected'}
                                                </p>
                                                <p className="text-sm text-muted-foreground/70 mt-1">Click or drag to upload mattress photos</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image count badge */}
                                    <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{formData.images.filter(img => img).length} images uploaded</span>
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            <div className={`bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300 ${formData.categoryId === 'mattresses' ? 'hidden' : ''}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <SectionHeader icon={Palette} title="Color Options" description="Available fabric and finish colors" />
                                    <Button type="button" variant="outline" onClick={addColor} className="border-dashed border-2 hover:border-accent hover:bg-accent/5">
                                        <Plus className="w-4 h-4 mr-2" /> Add Color
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                    {formData.colors.map((color, index) => (
                                        <div key={index} className={`group relative border-2 rounded-xl bg-background overflow-hidden transition-all duration-200 ${color.isDefault ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10' : 'border-border hover:border-accent'}`}>
                                            {/* Image Upload Area */}
                                            <div
                                                className={`aspect-[4/3] bg-secondary/50 relative cursor-pointer overflow-hidden transition-colors duration-200 ${activeDragIndex?.type === 'color' && activeDragIndex?.index === index ? 'bg-accent/20 border-2 border-accent border-dashed' : ''}`}
                                                onClick={() => document.getElementById(`color-image-${index}`)?.click()}
                                                onDragEnter={handleDragEnter('color', index)}
                                                onDragLeave={handleDragLeave}
                                                onDragOver={handleDrag}
                                                onDrop={(e) => handleColorImageDrop(index, e)}
                                            >
                                                {color.image ? (
                                                    <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 gap-2 pointer-events-none">
                                                        <div className="w-8 h-8 rounded-full shadow-sm border border-white/20" style={{ backgroundColor: color.hex || '#000000' }} />
                                                        <span className="text-xs">
                                                            {activeDragIndex?.type === 'color' && activeDragIndex?.index === index ? 'Drop to Upload' : 'Click or Drag Image'}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Hover Overlay */}
                                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${activeDragIndex?.type === 'color' && activeDragIndex?.index === index ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id={`color-image-${index}`}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        try {
                                                            const url = await uploadImage(file, `products/${storageId}/variants`);
                                                            handleColorChange(index, 'image', url);
                                                            toast.success('Image uploaded');
                                                        } catch (err) {
                                                            toast.error('Upload failed');
                                                        }
                                                    }
                                                }}
                                            />

                                            {/* Controls */}
                                            <div className="p-3 space-y-2">
                                                <input
                                                    type="text"
                                                    value={color.name}
                                                    onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 placeholder:text-muted-foreground"
                                                    placeholder="Color Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={color.fabric || ''}
                                                    onChange={(e) => handleColorChange(index, 'fabric', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-xs text-muted-foreground focus:ring-0 placeholder:text-muted-foreground/70"
                                                    placeholder="Fabric (e.g. Velvet)"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            value={color.hex}
                                                            onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                                            className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden cursor-pointer shrink-0"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={color.hex}
                                                        onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xs text-muted-foreground focus:ring-0 font-mono"
                                                    />
                                                </div>
                                            </div>

                                            {/* Default Badge */}
                                            {color.isDefault && (
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    Default
                                                </div>
                                            )}

                                            {/* Set Default Button */}
                                            <button
                                                type="button"
                                                onClick={() => setDefaultColor(index)}
                                                className={`absolute top-2 right-10 p-1.5 rounded-full transition-all ${color.isDefault ? 'bg-amber-500 text-white' : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white hover:scale-110'}`}
                                                title={color.isDefault ? 'Default Color' : 'Set as Default'}
                                            >
                                                <Star className={`w-3.5 h-3.5 ${color.isDefault ? 'fill-current' : ''}`} />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={() => removeColor(index)}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:scale-110"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Variant Images Manager */}
                                            <div className="px-3 pb-3">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full text-xs h-8">
                                                            <Images className="w-3 h-3 mr-2" />
                                                            Images ({color.productImages?.length || 0})
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Manage Images for {color.name}</DialogTitle>
                                                            <DialogDescription>
                                                                Add images specific to this color variant. These will be displayed when the customer selects this color.
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4 mt-4">
                                                            <div className="flex items-center gap-4">
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    id={`variant-images-${index}`}
                                                                    onChange={(e) => handleVariantImageUpload(index, e)}
                                                                />
                                                                <Button
                                                                    onClick={() => document.getElementById(`variant-images-${index}`)?.click()}
                                                                    className="bg-accent text-primary hover:bg-accent/90"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" /> Upload Images
                                                                </Button>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {color.productImages?.length || 0} images uploaded
                                                                </span>
                                                            </div>

                                                            <div
                                                                className={`grid grid-cols-4 md:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-4 border-2 border-dashed rounded-xl transition-colors duration-200 ${activeDragIndex?.type === 'variant' && activeDragIndex?.index === index ? 'border-accent bg-accent/5' : 'border-transparent'}`}
                                                                onDragEnter={handleDragEnter('variant', index)}
                                                                onDragLeave={handleDragLeave}
                                                                onDragOver={handleDrag}
                                                                onDrop={(e) => handleVariantImageDrop(index, e)}
                                                            >
                                                                {color.productImages?.map((img, imgIndex) => (
                                                                    <div key={imgIndex} className="relative aspect-square group rounded-lg overflow-hidden border border-border">
                                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeVariantImage(index, imgIndex)}
                                                                            className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                {(!color.productImages || color.productImages.length === 0) && (
                                                                    <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-lg pointer-events-none">
                                                                        {activeDragIndex?.type === 'variant' && activeDragIndex?.index === index ? 'Drop images here' : 'No variant images uploaded yet'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Color count badge */}
                                <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{formData.colors.length} colors configured</span>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className={`bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300  ${formData.categoryId === "panels" ? 'hidden' : ''} `} >
                                <SectionHeader icon={Ruler} title="Size Options" description="Select available sizes and set price modifiers" />

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {[
                                        { name: 'Small Single', dim: '2FT6', icon: BedSingle, defaultPrice: 0 },
                                        { name: 'Single', dim: '3FT', icon: BedSingle, defaultPrice: 10 },
                                        { name: 'Small Double', dim: '4FT', icon: BedDouble, defaultPrice: 90 },
                                        { name: 'Double', dim: '4FT6', icon: BedDouble, defaultPrice: 95 },
                                        { name: 'King', dim: '5FT', icon: BedDouble, defaultPrice: 115 },
                                        { name: 'Queen', dim: '6FT', icon: BedDouble, defaultPrice: 140 },
                                    ].map((sizeOption) => {
                                        const isSelected = formData.sizes.some(s => s.name === sizeOption.name);
                                        const currentSize = formData.sizes.find(s => s.name === sizeOption.name) || { priceModifier: 0 };
                                        const finalPrice = calculateFinalPrice(currentSize.priceModifier);

                                        return (
                                            <div
                                                key={sizeOption.name}
                                                className={`
                                                    relative flex flex-col p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                        : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'
                                                    }
                                                `}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            sizes: prev.sizes.filter(s => s.name !== sizeOption.name)
                                                        }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            sizes: [...prev.sizes, {
                                                                name: sizeOption.name,
                                                                dimensions: sizeOption.dim,
                                                                priceModifier: sizeOption.defaultPrice || 0,
                                                                inStock: true
                                                            }]
                                                        }));
                                                    }
                                                }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <sizeOption.icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                                <p className="font-semibold text-foreground">{sizeOption.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{sizeOption.dim}</p>

                                                {isSelected && (
                                                    <div className="space-y-3 pt-4 mt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                                                        {sizeOption.name !== 'Small Single' ? (
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                                                                    Price Top-up (£)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={currentSize.priceModifier || ''}
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value) || 0;
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            sizes: prev.sizes.map(s =>
                                                                                s.name === sizeOption.name ? { ...s, priceModifier: val } : s
                                                                            )
                                                                        }));
                                                                    }}
                                                                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                                    placeholder="0.00"
                                                                    step="0.01"
                                                                    min="0"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-1">
                                                                <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                                                    Base Price
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="bg-gradient-to-br from-primary to-primary/90 text-white px-4 py-3 rounded-lg text-center">
                                                            <p className="text-xs opacity-80">Final Price</p>
                                                            <p className="text-xl font-bold">£{finalPrice.toFixed(2)}</p>
                                                            {currentSize.priceModifier > 0 && (
                                                                <p className="text-xs opacity-70 mt-0.5">
                                                                    £{formData.discountPrice} + £{currentSize.priceModifier}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {formData.sizes.length > 0 && (
                                    <div className="mt-6 bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/30 rounded-xl p-5">
                                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-accent" />
                                            Price Summary
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between py-2 border-b border-border/30">
                                                <span className="text-muted-foreground">Base Price:</span>
                                                <span className="font-semibold text-foreground">£{Number(formData.discountPrice).toFixed(2)}</span>
                                            </div>
                                            {formData.sizes.map(size => (
                                                <div key={size.name} className="flex justify-between py-2">
                                                    <span className="text-muted-foreground">{size.name}:</span>
                                                    <span className="font-medium text-foreground">
                                                        £{calculateFinalPrice(size.priceModifier).toFixed(2)}
                                                        {size.priceModifier > 0 && (
                                                            <span className="text-xs text-accent ml-2">(+£{size.priceModifier})</span>
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Firmness Options - Only for mattresses (No Price Modifier) */}
                            {formData.categoryId === 'mattresses' && (
                                <div className={`bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300`}>
                                    <SectionHeader icon={Layers} title="Mattress Firmness" description="Select available firmness levels" />
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[
                                            { name: 'Firm', icon: Sparkles },
                                            { name: 'Medium Firm', icon: Sparkles },
                                            { name: 'Extra Firm', icon: Sparkles },
                                        ].map((firmnessOption) => {
                                            const isSelected = formData.firmnessOptions.some(f => f.name === firmnessOption.name);

                                            return (
                                                <div
                                                    key={firmnessOption.name}
                                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-md'
                                                        : 'border-border hover:border-border/80 hover:bg-secondary/20'
                                                        }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                firmnessOptions: prev.firmnessOptions.filter(f => f.name !== firmnessOption.name)
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                firmnessOptions: [...prev.firmnessOptions, {
                                                                    name: firmnessOption.name,
                                                                    priceModifier: 0 // Enforced 0 price
                                                                }]
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col items-center text-center gap-2">
                                                        <div className={`p-2 rounded-full ${isSelected ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                                            <firmnessOption.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-sm text-foreground">{firmnessOption.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Storage Options */}
                            <div className={`bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300 ${formData.categoryId === 'mattresses' ? 'hidden' : ''} ${formData.categoryId === 'headboards' ? 'hidden' : ''} ${formData.subcategoryId === 'upholstered-beds' ? 'hidden' : ''} ${formData.categoryId === 'panels' ? 'hidden' : ''}`}>
                                <SectionHeader icon={Archive} title="Storage Options" description="Available drawer configurations" />

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    {[
                                        { name: 'No drawers', description: 'Standard base without storage', icon: BedDouble, defaultPrice: 0 },
                                        { name: '2 Drawers Right', description: 'Two drawers on the right side', icon: BedDouble, defaultPrice: 50 },
                                        { name: '2 Drawers Left', description: 'Two drawers on the left side', icon: BedDouble, defaultPrice: 50 },
                                        { name: '4 Drawers', description: 'Two drawers on the each sides', icon: BedDouble, defaultPrice: 100 }
                                    ].map((storageOption) => {
                                        const isSelected = formData.storageOptions.some(s => s.name === storageOption.name);
                                        const currentStorage = formData.storageOptions.find(s => s.name === storageOption.name) || { priceModifier: 0 };
                                        const finalPrice = calculateFinalPrice(currentStorage.priceModifier);

                                        return (
                                            <div
                                                key={storageOption.name}
                                                className={`
                                                    relative flex flex-col p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                        : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'
                                                    }
                                                `}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            storageOptions: prev.storageOptions.filter(s => s.name !== storageOption.name)
                                                        }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            storageOptions: [...prev.storageOptions, {
                                                                name: storageOption.name,
                                                                description: storageOption.description,
                                                                priceModifier: storageOption.defaultPrice || 0
                                                            }]
                                                        }));
                                                    }
                                                }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <storageOption.icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                                <p className="font-semibold text-foreground">{storageOption.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{storageOption.description}</p>

                                                {isSelected && (
                                                    <div className="space-y-3 pt-4 mt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                                                        {storageOption.name !== 'No drawers' ? (
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price Top-up (£)</label>
                                                                <input
                                                                    type="number"
                                                                    value={currentStorage.priceModifier || ''}
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value) || 0;
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            storageOptions: prev.storageOptions.map(s =>
                                                                                s.name === storageOption.name ? { ...s, priceModifier: val } : s
                                                                            )
                                                                        }));
                                                                    }}
                                                                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                                    placeholder="0.00"
                                                                    step="0.01"
                                                                    min="0"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-1">
                                                                <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                                                    Included
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="bg-gradient-to-br from-primary to-primary/90 text-white px-4 py-3 rounded-lg text-center">
                                                            <p className="text-xs opacity-80">Final Price</p>
                                                            <p className="text-xl font-bold">£{finalPrice.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Headboard Options */}
                            <div className={`bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300 ${formData.categoryId === 'mattresses' ? 'hidden' : ''} ${formData.categoryId === 'panels' ? 'hidden' : ''}`}>
                                <SectionHeader icon={Crown} title="Headboard Options" description="Available headboard upgrades" />

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {[
                                        {
                                            name: '24" Headboard',
                                            height: 24,
                                            icon: BrickWall,
                                            priceBySize: {
                                                "2FT6": 0,
                                                "3FT": 0,
                                                "4FT": 0,
                                                "4FT6": 0,
                                                "5FT": 0,
                                                "6FT": 0
                                            }
                                        },
                                        {
                                            name: '48" Headboard',
                                            height: 48,
                                            icon: BrickWall,
                                            priceBySize: {
                                                "2FT6": 20,
                                                "3FT": 20,
                                                "4FT": 30,
                                                "4FT6": 30,
                                                "5FT": 40,
                                                "6FT": 50
                                            }
                                        },
                                        {
                                            name: '54" Headboard',
                                            height: 54,
                                            icon: BrickWall,
                                            priceBySize: {
                                                "2FT6": 30,
                                                "3FT": 30,
                                                "4FT": 40,
                                                "4FT6": 40,
                                                "5FT": 50,
                                                "6FT": 60
                                            }
                                        }
                                    ].map((headboardOption) => {
                                        const isSelected = formData.headboardOptions.some(s => s.name === headboardOption.name);
                                        const currentHeadboard = formData.headboardOptions.find(s => s.name === headboardOption.name) || { priceModifier: 0 };

                                        // Calculate display price (show range or "From £X") if priceBySize exists
                                        const displayPrice = headboardOption.priceBySize
                                            ? `From £${Math.min(...Object.values(headboardOption.priceBySize))}`
                                            : `+£${currentHeadboard.priceModifier}`;

                                        return (
                                            <div
                                                key={headboardOption.name}
                                                className={`
                                                    relative flex flex-col p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                        : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'
                                                    }
                                                `}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            headboardOptions: prev.headboardOptions.filter(s => s.name !== headboardOption.name)
                                                        }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            headboardOptions: [...prev.headboardOptions, {
                                                                name: headboardOption.name,
                                                                height: headboardOption.height,
                                                                priceBySize: headboardOption.priceBySize,
                                                                priceModifier: 0 // Default to 0 as price is determined by size
                                                            }]
                                                        }));
                                                    }
                                                }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <headboardOption.icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                                <p className="font-semibold text-foreground">{headboardOption.name}</p>

                                                {isSelected && (
                                                    <div className="space-y-3 pt-4 mt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                                                        {headboardOption.priceBySize ? (
                                                            <div className="text-center py-2">
                                                                <span className="inline-block px-3 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
                                                                    Size-based Pricing Applied
                                                                </span>
                                                                <div className="grid grid-cols-3 gap-1 mt-2 text-[10px] text-muted-foreground">
                                                                    {Object.entries(headboardOption.priceBySize).slice(0, 3).map(([size, price]) => (
                                                                        <div key={size}>{size}: £{price}</div>
                                                                    ))}
                                                                    <div className="col-span-3 text-center">...</div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price Top-up (£)</label>
                                                                <input
                                                                    type="number"
                                                                    value={currentHeadboard.priceModifier || ''}
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value) || 0;
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            headboardOptions: prev.headboardOptions.map(s =>
                                                                                s.name === headboardOption.name ? { ...s, priceModifier: val } : s
                                                                            )
                                                                        }));
                                                                    }}
                                                                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                                    placeholder="0.00"
                                                                    step="0.01"
                                                                    min="0"
                                                                />
                                                            </div>
                                                        )}

                                                        {!headboardOption.priceBySize && (
                                                            <div className="bg-gradient-to-br from-primary to-primary/90 text-white px-4 py-3 rounded-lg text-center">
                                                                <p className="text-xs opacity-80">Final Price</p>
                                                                <p className="text-xl font-bold">£{calculateFinalPrice(currentHeadboard.priceModifier).toFixed(2)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Base Options */}
                            <div className={`bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300 ${formData.categoryId === 'mattresses' ? 'hidden' : ''} ${formData.categoryId === 'headboards' ? 'hidden' : ''} ${formData.subcategoryId === 'upholstered-beds' ? 'hidden' : ''} ${formData.categoryId === 'panels' ? 'hidden' : ''}`}>
                                <SectionHeader icon={Layers} title="Base Options" description="Available base configurations" />

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {[
                                        { name: 'Standard Base', icon: Weight, defaultPrice: 0 },
                                        { name: 'Reinforced Base', icon: Weight, defaultPrice: 25 }
                                    ].map((baseOption) => {
                                        const isSelected = formData.baseOptions.some(s => s.name === baseOption.name);
                                        const currentBase = formData.baseOptions.find(s => s.name === baseOption.name) || { priceModifier: 0 };
                                        const finalPrice = calculateFinalPrice(currentBase.priceModifier);

                                        return (
                                            <div
                                                key={baseOption.name}
                                                className={`
                                                    relative flex flex-col p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                        : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'
                                                    }
                                                `}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            baseOptions: prev.baseOptions.filter(s => s.name !== baseOption.name)
                                                        }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            baseOptions: [...prev.baseOptions, {
                                                                name: baseOption.name,
                                                                priceModifier: baseOption.defaultPrice || 0
                                                            }]
                                                        }));
                                                    }
                                                }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <baseOption.icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                                <p className="font-semibold text-foreground">{baseOption.name}</p>

                                                {isSelected && (
                                                    <div className="space-y-3 pt-4 mt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                                                        {baseOption.name !== 'Standard Base' ? (
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price Top-up (£)</label>
                                                                <input
                                                                    type="number"
                                                                    value={currentBase.priceModifier || ''}
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value) || 0;
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            baseOptions: prev.baseOptions.map(s =>
                                                                                s.name === baseOption.name ? { ...s, priceModifier: val } : s
                                                                            )
                                                                        }));
                                                                    }}
                                                                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                                                                    placeholder="0.00"
                                                                    step="0.01"
                                                                    min="0"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-1">
                                                                <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                                                    Standard
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="bg-gradient-to-br from-primary to-primary/90 text-white px-4 py-3 rounded-lg text-center">
                                                            <p className="text-xs opacity-80">Final Price</p>
                                                            <p className="text-xl font-bold">£{finalPrice.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>



                            {/* Bottom Save Button */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={postProductData}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium px-8 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving Product...' : 'Save Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}
