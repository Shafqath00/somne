import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicBlogs, getPublicBlogCategories, BlogPost, BlogCategory } from '@/api/api';
import { Loader2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BlogsPage = () => {
    const { category } = useParams<{ category?: string }>();
    const [activeCategory, setActiveCategory] = useState<string>(category || 'all');

    const { data: categories = [], isLoading: catLoading } = useQuery<BlogCategory[]>({
        queryKey: ['blogCategories'],
        queryFn: getPublicBlogCategories,
    });

    const { data: blogs = [], isLoading: blogsLoading } = useQuery<BlogPost[]>({
        queryKey: ['blogs', activeCategory],
        queryFn: () => getPublicBlogs(activeCategory === 'all' ? undefined : activeCategory),
    });

    const isLoading = catLoading || blogsLoading;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Helmet>
                <title>{activeCategory !== 'all'
                    ? `${categories.find(c => c.slug === activeCategory)?.name || 'Blog'} | Somne`
                    : 'Blog | Somne'
                }</title>
                <meta
                    name="description"
                    content="Explore our blog for expert advice on beds, mattresses, sleep science, interior inspiration, and buying guides from Somne."
                />
            </Helmet>
            <Layout>
                {/* Hero */}
                <section className="py-10 bg-primary">
                    <div className="luxury-container text-center">
                        {/* <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
                            Explore & Learn
                        </span> */}
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-cream mb-4">
                            Our Blog
                        </h1>
                        <p className="font-sans text-lg text-cream/80 max-w-2xl mx-auto">
                            Expert advice, buying guides, and inspiration for your perfect bedroom.
                        </p>
                    </div>
                </section>

                {/* Category Tabs */}
                <section className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                    <div className="luxury-container">
                        <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                                    activeCategory === 'all'
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                                        activeCategory === cat.slug
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="section-padding bg-slate-50 min-h-[50vh]">
                    <div className="luxury-container">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="font-serif text-2xl text-slate-400 mb-2">No articles yet</p>
                                <p className="text-slate-500">Check back soon for new content.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} formatDate={formatDate} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </Layout>
        </>
    );
};

function BlogCard({ blog, formatDate }: { blog: BlogPost; formatDate: (d?: string) => string }) {
    return (
        <Link
            to={`/blogs/${blog.categorySlug}/${blog.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 flex flex-col"
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {blog.featuredImage ? (
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                        <span className="font-serif text-primary/30 text-4xl">S</span>
                    </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {blog.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-lg md:text-xl font-medium text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {blog.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(blog.publishedAt)}
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary" />
                </div>
            </div>
        </Link>
    );
}

export default BlogsPage;
