import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { USPStrip } from '@/components/home/USPStrip';

// Lazy load below-the-fold components
const CategoryGrid = lazy(() => import('@/components/home/CategoryGrid').then(module => ({ default: module.CategoryGrid })));
const TrendingProducts = lazy(() => import('@/components/home/trending').then(module => ({ default: module.TrendingProducts })));
const WhyChooseUs = lazy(() => import('@/components/home/WhyChooseUs').then(module => ({ default: module.WhyChooseUs })));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })));
const ProcessSection = lazy(() => import('@/components/home/ProcessSection').then(module => ({ default: module.ProcessSection })));
const FAQSection = lazy(() => import('@/components/home/faq').then(module => ({ default: module.FAQSection })));

// Loading fallback
const SectionLoader = () => <div className="h-96 flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Somne® Beds & Mattresses UK | Divan & Ottoman Beds Online</title>
        <meta
          name="description"
          content="Shop Somne® for premium divan and ottoman beds, mattresses, headboards and more. UK-wide delivery, great value, and styles made for better sleep."
        />
        <meta property="og:title" content="Somne® Beds & Mattresses UK | Divan & Ottoman Beds Online" />
        <meta property="og:description" content="Shop Somne® for premium divan and ottoman beds, mattresses, headboards and more. UK-wide delivery, great value, and styles made for better sleep." />
      </Helmet>
      <Layout>
        <HeroSection />
        <USPStrip />

        <Suspense fallback={<SectionLoader />}>
          <CategoryGrid />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TrendingProducts />
        </Suspense>

        {/* <FeaturedProducts /> */}
        {/* <CustomizeBanner /> */}

        <Suspense fallback={<SectionLoader />}>
          <WhyChooseUs />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProcessSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>

        {/* <InstagramGallery /> */}
      </Layout>
    </>
  );
};

export default HomePage;
