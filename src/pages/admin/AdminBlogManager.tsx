/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    adminGetAllBlogs, adminCreateBlog, adminUpdateBlog, adminDeleteBlog,
    adminGetBlogCategories, adminCreateBlogCategory, adminUpdateBlogCategory, adminDeleteBlogCategory,
    uploadImage, BlogPost, BlogCategory, BlogContentBlock
} from '@/api/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    Loader2, Plus, Trash2, Edit2, ChevronDown, ChevronUp,
    GripVertical, Image as ImageIcon, Type, List, Quote,
    Link2, Minus, FolderOpen, FileText, X, Upload, Eye
} from 'lucide-react';
import { AdminPageHeader, AdminPageShell } from '@/components/admin/AdminUI';

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminBlogManager() {
    const [activeTab, setActiveTab] = useState<'blogs' | 'categories'>('blogs');
    const [showBlogEditor, setShowBlogEditor] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

    return (
        <>
            <Helmet>
                <title>Blog Manager | Somne Admin</title>
            </Helmet>
            <AdminLayout>
                <AdminPageShell>
                        <AdminPageHeader
                            title="Blog Manager"
                            description="Create and manage blog posts, content blocks, categories, images, and publishing state."
                            icon={FileText}
                            actions={
                            <>
                                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                                    <button
                                        onClick={() => setActiveTab('blogs')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                            activeTab === 'blogs'
                                                ? "bg-primary text-white"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Posts
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('categories')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                            activeTab === 'categories'
                                                ? "bg-primary text-white"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <FolderOpen className="w-4 h-4 inline mr-2" />
                                        Categories
                                        </button>
                                </div>
                                {activeTab === 'blogs' && !showBlogEditor && (
                                    <Button
                                        onClick={() => { setEditingBlog(null); setShowBlogEditor(true); }}
                                        className="bg-primary text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> New Post
                                    </Button>
                                )}
                            </>
                            }
                        />

                        {/* Content */}
                        {activeTab === 'categories' && <CategoryManager />}
                        {activeTab === 'blogs' && !showBlogEditor && (
                            <BlogList
                                onEdit={(blog) => { setEditingBlog(blog); setShowBlogEditor(true); }}
                            />
                        )}
                        {activeTab === 'blogs' && showBlogEditor && (
                            <BlogEditor
                                blog={editingBlog}
                                onClose={() => { setShowBlogEditor(false); setEditingBlog(null); }}
                            />
                        )}
                </AdminPageShell>
            </AdminLayout>
        </>
    );
}

// ============================================
// CATEGORY MANAGER
// ============================================

function CategoryManager() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { data: categories = [], isLoading } = useQuery<BlogCategory[]>({
        queryKey: ['adminBlogCategories'],
        queryFn: adminGetBlogCategories,
    });

    const createMut = useMutation({
        mutationFn: (data: { name: string; description?: string }) => adminCreateBlogCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogCategories'] });
            toast.success('Category created');
            resetForm();
        },
        onError: (e: any) => toast.error(e?.error || 'Failed to create category'),
    });

    const updateMut = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => adminUpdateBlogCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogCategories'] });
            toast.success('Category updated');
            resetForm();
        },
        onError: (e: any) => toast.error(e?.error || 'Failed to update category'),
    });

    const deleteMut = useMutation({
        mutationFn: (id: string) => adminDeleteBlogCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogCategories'] });
            toast.success('Category deleted');
        },
        onError: (e: any) => toast.error(e?.error || 'Failed to delete category'),
    });

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setName('');
        setDescription('');
    };

    const handleEdit = (cat: BlogCategory) => {
        setEditId(cat.id);
        setName(cat.name);
        setDescription(cat.description || '');
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            updateMut.mutate({ id: editId, data: { name, description } });
        } else {
            createMut.mutate({ name, description });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add / Edit Form */}
            {!showForm ? (
                <Button onClick={() => setShowForm(true)} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">{editId ? 'Edit Category' : 'New Category'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Name *</label>
                            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Buying Guides" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Description</label>
                            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                            {(createMut.isPending || updateMut.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editId ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                    </div>
                </form>
            )}

            {/* Category List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 bg-slate-50/50 border-b">
                    <h3 className="text-lg font-semibold text-slate-950">Categories ({categories.length})</h3>
                </div>
                {categories.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">
                        <FolderOpen className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                        <p>No categories yet. Create one to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-medium text-slate-800">{cat.name}</p>
                                    <p className="text-xs text-slate-500">Slug: {cat.slug} {cat.description && `• ${cat.description}`}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => {
                                            if (confirm(`Delete "${cat.name}"?`)) deleteMut.mutate(cat.id);
                                        }}
                                        disabled={deleteMut.isPending}
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
    );
}

// ============================================
// BLOG LIST
// ============================================

function BlogList({ onEdit }: { onEdit: (blog: BlogPost) => void }) {
    const queryClient = useQueryClient();

    const { data: blogs = [], isLoading } = useQuery<BlogPost[]>({
        queryKey: ['adminBlogs'],
        queryFn: adminGetAllBlogs,
    });

    const deleteMut = useMutation({
        mutationFn: (id: string) => adminDeleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
            toast.success('Blog deleted');
        },
        onError: (e: any) => toast.error(e?.error || 'Failed to delete blog'),
    });

    const formatDate = (d?: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50/50 border-b">
                <h3 className="text-lg font-semibold text-slate-950">All Posts ({blogs.length})</h3>
            </div>
            {blogs.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                    <p>No blog posts yet. Create your first one!</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Thumbnail */}
                                <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                    {blog.featuredImage ? (
                                        <img src={blog.featuredImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{blog.title}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className={cn(
                                            "inline-block px-2 py-0.5 rounded-full font-medium",
                                            blog.status === 'published'
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        )}>
                                            {blog.status}
                                        </span>
                                        <span>{blog.category}</span>
                                        <span>{formatDate(blog.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button variant="ghost" size="sm" onClick={() => onEdit(blog)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                        if (confirm(`Delete "${blog.title}"?`)) deleteMut.mutate(blog.id);
                                    }}
                                    disabled={deleteMut.isPending}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                {blog.status === 'published' && (
                                    <a
                                        href={`/blogs/${blog.categorySlug}/${blog.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-400 hover:text-primary p-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// BLOG EDITOR
// ============================================

const EMPTY_BLOG: Partial<BlogPost> = {
    title: '',
    category: '',
    categorySlug: '',
    featuredImage: '',
    excerpt: '',
    author: 'Somne',
    readTime: '5 Min Read',
    status: 'draft',
    tags: [],
    content: [],
};

function BlogEditor({ blog, onClose }: { blog: BlogPost | null; onClose: () => void }) {
    const queryClient = useQueryClient();
    const isEdit = !!blog;

    const [form, setForm] = useState<Partial<BlogPost>>(blog || { ...EMPTY_BLOG });
    const [imageUploading, setImageUploading] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const { data: categories = [] } = useQuery<BlogCategory[]>({
        queryKey: ['adminBlogCategories'],
        queryFn: adminGetBlogCategories,
    });

    const saveMut = useMutation({
        mutationFn: async (data: any) => {
            if (isEdit && blog) {
                return adminUpdateBlog(blog.id, data);
            }
            return adminCreateBlog(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
            toast.success(isEdit ? 'Blog updated' : 'Blog created');
            onClose();
        },
        onError: (e: any) => toast.error(e?.error || 'Failed to save blog'),
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        try {
            const url = await uploadImage(file, 'blogs');
            setForm(f => ({ ...f, featuredImage: url }));
            toast.success('Image uploaded');
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    const handleCategoryChange = (catSlug: string) => {
        const cat = categories.find(c => c.slug === catSlug);
        setForm(f => ({
            ...f,
            categorySlug: catSlug,
            category: cat?.name || ''
        }));
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !form.tags?.includes(tag)) {
            setForm(f => ({ ...f, tags: [...(f.tags || []), tag] }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setForm(f => ({ ...f, tags: (f.tags || []).filter(t => t !== tag) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.categorySlug) {
            toast.error('Title and category are required');
            return;
        }
        saveMut.mutate(form);
    };

    // --- Content Block Management ---
    const addBlock = (type: BlogContentBlock['type']) => {
        const newBlock: BlogContentBlock = { type };
        switch (type) {
            case 'heading': newBlock.level = 2; newBlock.text = ''; break;
            case 'paragraph': newBlock.text = ''; break;
            case 'image': newBlock.url = ''; newBlock.alt = ''; newBlock.caption = ''; break;
            case 'list': newBlock.style = 'bullet'; newBlock.items = ['']; break;
            case 'product-link': newBlock.productSlug = ''; newBlock.text = 'View Product'; break;
            case 'quote': newBlock.text = ''; break;
            case 'divider': break;
        }
        setForm(f => ({ ...f, content: [...(f.content || []), newBlock] }));
    };

    const updateBlock = (index: number, updates: Partial<BlogContentBlock>) => {
        setForm(f => ({
            ...f,
            content: (f.content || []).map((b, i) => i === index ? { ...b, ...updates } : b)
        }));
    };

    const removeBlock = (index: number) => {
        setForm(f => ({
            ...f,
            content: (f.content || []).filter((_, i) => i !== index)
        }));
    };

    const moveBlock = (index: number, dir: 'up' | 'down') => {
        const arr = [...(form.content || [])];
        const target = dir === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= arr.length) return;
        [arr[index], arr[target]] = [arr[target], arr[index]];
        setForm(f => ({ ...f, content: arr }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-950">
                    {isEdit ? 'Edit Post' : 'New Post'}
                </h2>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={saveMut.isPending}>
                        {saveMut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEdit ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Title *</label>
                        <Input
                            value={form.title || ''}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="Enter blog title..."
                            className="text-lg"
                            required
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Excerpt</label>
                        <Textarea
                            value={form.excerpt || ''}
                            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                            placeholder="Brief summary of the post..."
                            rows={3}
                        />
                    </div>

                    {/* Content Blocks */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-slate-600">Content Blocks</label>
                        </div>

                        {/* Block List */}
                        <div className="space-y-4 mb-6">
                            {(form.content || []).length === 0 && (
                                <p className="text-center text-slate-400 py-8">
                                    No content yet. Add blocks below to start building your article.
                                </p>
                            )}
                            {(form.content || []).map((block, idx) => (
                                <ContentBlockEditor
                                    key={idx}
                                    block={block}
                                    index={idx}
                                    total={(form.content || []).length}
                                    onUpdate={(updates) => updateBlock(idx, updates)}
                                    onRemove={() => removeBlock(idx)}
                                    onMove={(dir) => moveBlock(idx, dir)}
                                />
                            ))}
                        </div>

                        {/* Add Block Toolbar */}
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-500 mb-3">Add a block:</p>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => addBlock('heading')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <Type className="w-3.5 h-3.5" /> Heading
                                </button>
                                <button type="button" onClick={() => addBlock('paragraph')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <FileText className="w-3.5 h-3.5" /> Paragraph
                                </button>
                                <button type="button" onClick={() => addBlock('image')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <ImageIcon className="w-3.5 h-3.5" /> Image
                                </button>
                                <button type="button" onClick={() => addBlock('list')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <List className="w-3.5 h-3.5" /> List
                                </button>
                                <button type="button" onClick={() => addBlock('product-link')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <Link2 className="w-3.5 h-3.5" /> Product Link
                                </button>
                                <button type="button" onClick={() => addBlock('quote')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <Quote className="w-3.5 h-3.5" /> Quote
                                </button>
                                <button type="button" onClick={() => addBlock('divider')} className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                                    <Minus className="w-3.5 h-3.5" /> Divider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Status</label>
                        <select
                            value={form.status || 'draft'}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Category *</label>
                        <select
                            value={form.categorySlug || ''}
                            onChange={e => handleCategoryChange(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            required
                        >
                            <option value="">Select category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Featured Image</label>
                        {form.featuredImage ? (
                            <div className="relative mb-3">
                                <img src={form.featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, featuredImage: '' }))}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : null}
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                            {imageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {imageUploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
                        </label>
                    </div>

                    {/* Author & Read Time */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Author</label>
                            <Input
                                value={form.author || ''}
                                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                                placeholder="Somne"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Read Time</label>
                            <Input
                                value={form.readTime || ''}
                                onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                                placeholder="5 Min Read"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <label className="text-sm font-medium text-slate-600 mb-2 block">Tags</label>
                        <div className="flex gap-2 mb-3">
                            <Input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                placeholder="Add a tag..."
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
                        </div>
                        {form.tags && form.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

// ============================================
// CONTENT BLOCK EDITOR
// ============================================

function ContentBlockEditor({
    block, index, total, onUpdate, onRemove, onMove
}: {
    block: BlogContentBlock;
    index: number;
    total: number;
    onUpdate: (updates: Partial<BlogContentBlock>) => void;
    onRemove: () => void;
    onMove: (dir: 'up' | 'down') => void;
}) {
    const [imgUploading, setImgUploading] = useState(false);

    const handleBlockImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImgUploading(true);
        try {
            const url = await uploadImage(file, 'blogs');
            onUpdate({ url });
            toast.success('Image uploaded');
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setImgUploading(false);
        }
    };

    const blockLabel = {
        heading: 'Heading',
        paragraph: 'Paragraph',
        image: 'Image',
        list: 'List',
        'product-link': 'Product Link',
        quote: 'Quote',
        divider: 'Divider',
    }[block.type];

    const blockIcon = {
        heading: <Type className="w-3.5 h-3.5" />,
        paragraph: <FileText className="w-3.5 h-3.5" />,
        image: <ImageIcon className="w-3.5 h-3.5" />,
        list: <List className="w-3.5 h-3.5" />,
        'product-link': <Link2 className="w-3.5 h-3.5" />,
        quote: <Quote className="w-3.5 h-3.5" />,
        divider: <Minus className="w-3.5 h-3.5" />,
    }[block.type];

    return (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 group">
            {/* Block Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                    {blockIcon}
                    {blockLabel}
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onMove('up')} disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => onMove('down')} disabled={index === total - 1}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={onRemove}
                        className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Block Body */}
            {block.type === 'heading' && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <select
                            value={block.level || 2}
                            onChange={e => onUpdate({ level: Number(e.target.value) })}
                            className="border border-slate-200 rounded px-2 py-1 text-sm w-20"
                        >
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                            <option value={4}>H4</option>
                        </select>
                        <Input
                            value={block.text || ''}
                            onChange={e => onUpdate({ text: e.target.value })}
                            placeholder="Heading text..."
                            className=""
                        />
                    </div>
                </div>
            )}

            {block.type === 'paragraph' && (
                <Textarea
                    value={block.text || ''}
                    onChange={e => onUpdate({ text: e.target.value })}
                    placeholder="Write paragraph text... (HTML tags like <a>, <strong>, <em> are supported)"
                    rows={4}
                />
            )}

            {block.type === 'image' && (
                <div className="space-y-3">
                    {block.url ? (
                        <div className="relative">
                            <img src={block.url} alt={block.alt || ''} className="w-full h-40 object-cover rounded-lg" />
                            <button type="button" onClick={() => onUpdate({ url: '' })}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer block border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-primary/30 transition-colors">
                            {imgUploading ? <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" /> : <ImageIcon className="w-6 h-6 mx-auto text-slate-300 mb-2" />}
                            <p className="text-sm text-slate-500">{imgUploading ? 'Uploading...' : 'Click to upload image'}</p>
                            <input type="file" accept="image/*" onChange={handleBlockImageUpload} className="hidden" disabled={imgUploading} />
                        </label>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <Input value={block.alt || ''} onChange={e => onUpdate({ alt: e.target.value })} placeholder="Alt text..." />
                        <Input value={block.caption || ''} onChange={e => onUpdate({ caption: e.target.value })} placeholder="Caption (optional)" />
                    </div>
                </div>
            )}

            {block.type === 'list' && (
                <div className="space-y-3">
                    <select
                        value={block.style || 'bullet'}
                        onChange={e => onUpdate({ style: e.target.value as 'bullet' | 'numbered' })}
                        className="border border-slate-200 rounded px-2 py-1 text-sm"
                    >
                        <option value="bullet">Bullet</option>
                        <option value="numbered">Numbered</option>
                    </select>
                    {(block.items || ['']).map((item, i) => (
                        <div key={i} className="flex gap-2">
                            <Input
                                value={item}
                                onChange={e => {
                                    const newItems = [...(block.items || [])];
                                    newItems[i] = e.target.value;
                                    onUpdate({ items: newItems });
                                }}
                                placeholder={`Item ${i + 1}...`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-600 flex-shrink-0"
                                onClick={() => {
                                    const newItems = (block.items || []).filter((_, idx) => idx !== i);
                                    onUpdate({ items: newItems.length ? newItems : [''] });
                                }}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate({ items: [...(block.items || []), ''] })}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add Item
                    </Button>
                </div>
            )}

            {block.type === 'product-link' && (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Product Slug</label>
                        <Input
                            value={block.productSlug || ''}
                            onChange={e => onUpdate({ productSlug: e.target.value })}
                            placeholder="e.g. luxury-divan-bed"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Link Text</label>
                        <Input
                            value={block.text || ''}
                            onChange={e => onUpdate({ text: e.target.value })}
                            placeholder="e.g. Shop Now"
                        />
                    </div>
                </div>
            )}

            {block.type === 'quote' && (
                <Textarea
                    value={block.text || ''}
                    onChange={e => onUpdate({ text: e.target.value })}
                    placeholder="Quote text..."
                    rows={3}
                    className="italic"
                />
            )}

            {block.type === 'divider' && (
                <hr className="border-slate-300 my-2" />
            )}
        </div>
    );
}
