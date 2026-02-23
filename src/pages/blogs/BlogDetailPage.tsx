import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicBlogBySlug, BlogPost, BlogContentBlock } from '@/api/api';
import { Loader2, Clock, Calendar, User, ChevronRight, ArrowRight } from 'lucide-react';

const BlogDetailPage = () => {
    const { slug, category } = useParams<{ slug: string; category: string }>();

    const { data: blog, isLoading, error } = useQuery<BlogPost>({
        queryKey: ['blog', slug],
        queryFn: () => getPublicBlogBySlug(slug!),
        enabled: !!slug,
    });

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (error || !blog) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                    <h1 className="font-serif text-3xl text-slate-800">Article Not Found</h1>
                    <p className="text-slate-500">The article you're looking for doesn't exist or has been removed.</p>
                    <Link to="/blogs" className="text-primary hover:underline font-medium">
                        ← Back to Blog
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Helmet>
                <title>{blog.title} | Somne Blog</title>
                <meta name="description" content={blog.excerpt} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.excerpt} />
                {blog.featuredImage && <meta property="og:image" content={blog.featuredImage} />}
                <meta property="og:type" content="article" />
            </Helmet>
            <Layout>
                {/* Breadcrumbs */}
                <section className="bg-slate-50 border-b border-slate-200">
                    <div className="luxury-container py-4">
                        <nav className="flex items-center gap-2 text-sm text-slate-500">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <Link to="/blogs" className="hover:text-primary transition-colors">Blog</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            {blog.category && (
                                <>
                                    <Link
                                        to={`/blogs/${blog.categorySlug}`}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {blog.category}
                                    </Link>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </>
                            )}
                            <span className="text-slate-800 font-medium truncate max-w-[200px]">{blog.title}</span>
                        </nav>
                    </div>
                </section>

                {/* Article Header */}
                <section className="bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                        {/* Category Badge */}
                        <div className="mb-6">
                            <Link
                                to={`/blogs/${blog.categorySlug}`}
                                className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                            >
                                {blog.category}
                            </Link>
                        </div>

                        {/* Title */}
                        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6">
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        {blog.excerpt && (
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                {blog.excerpt}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-t border-b border-slate-100 py-4">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {blog.author}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(blog.publishedAt)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {blog.readTime}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <section className="bg-white pb-8">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={blog.featuredImage}
                                    alt={blog.title}
                                    className="w-full h-auto max-h-[500px] object-cover"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Article Content */}
                <section className="bg-white pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <article className="prose prose-lg prose-slate max-w-none">
                            {blog.content?.map((block, index) => (
                                <ContentBlockRenderer key={index} block={block} />
                            ))}
                        </article>
                    </div>
                </section>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <section className="bg-white pb-10">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                                <span className="text-sm font-medium text-slate-500">Tags:</span>
                                {blog.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Posts */}
                {blog.relatedPosts && blog.relatedPosts.length > 0 && (
                    <section className="bg-slate-50 section-padding">
                        <div className="luxury-container">
                            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-8 text-center">
                                Related Articles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blog.relatedPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={`/blogs/${post.categorySlug}/${post.slug}`}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                            {post.featuredImage ? (
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                                                    <span className="font-serif text-primary/30 text-4xl">S</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-block bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-serif text-lg font-medium text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {post.readTime}
                                                </span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </Layout>
        </>
    );
};

// Renders individual content blocks from the block-based content array
function ContentBlockRenderer({ block }: { block: BlogContentBlock }) {
    switch (block.type) {
        case 'heading': {
            const Tag = (`h${block.level || 2}`) as keyof JSX.IntrinsicElements;
            return <Tag className="font-serif">{block.text}</Tag>;
        }

        case 'paragraph':
            return (
                <p
                    className="text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.text || '' }}
                />
            );

        case 'image':
            return (
                <figure className="my-8">
                    <div className="rounded-xl overflow-hidden">
                        <img
                            src={block.url}
                            alt={block.alt || ''}
                            className="w-full h-auto"
                            loading="lazy"
                        />
                    </div>
                    {block.caption && (
                        <figcaption className="text-center text-sm text-slate-500 mt-3 italic">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            );

        case 'list':
            if (block.style === 'numbered') {
                return (
                    <ol className="list-decimal pl-6 space-y-2 text-slate-700">
                        {block.items?.map((item, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                    </ol>
                );
            }
            return (
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                    {block.items?.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ul>
            );

        case 'product-link':
            return (
                <div className="my-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                    <Link
                        to={`/product/${block.productSlug}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-lg"
                    >
                        {block.text || 'View Product'}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            );

        case 'quote':
            return (
                <blockquote className="border-l-4 border-primary/30 pl-6 py-2 my-8 bg-slate-50 rounded-r-lg">
                    <p className="text-lg text-slate-700 italic font-serif">{block.text}</p>
                </blockquote>
            );

        case 'divider':
            return <hr className="my-10 border-slate-200" />;

        default:
            return null;
    }
}

export default BlogDetailPage;
