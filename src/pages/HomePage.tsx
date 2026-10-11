import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { USPStrip } from '@/components/home/USPStrip';

// Lazy load below-the-fold components
const CategoryGrid = lazy(() => import('@/components/home/CategoryGrid').then(module => ({ default: module.CategoryGrid })));
const HomeEditorialSections = lazy(() => import('@/components/home/HomeEditorialSections').then(module => ({ default: module.HomeEditorialSections })));
const TrendingProducts = lazy(() => import('@/components/home/trending').then(module => ({ default: module.TrendingProducts })));
const WhyChooseUs = lazy(() => import('@/components/home/WhyChooseUs').then(module => ({ default: module.WhyChooseUs })));
const VideoSection = lazy(() => import('@/components/home/VideoSection').then(module => ({ default: module.VideoSection })));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })));
const ProcessSection = lazy(() => import('@/components/home/ProcessSection').then(module => ({ default: module.ProcessSection })));
const FAQSection = lazy(() => import('@/components/home/faq').then(module => ({ default: module.FAQSection })));

const SectionLoader = () => (
  <div className="flex h-72 items-center justify-center bg-gray-50 md:h-96">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
  </div>
);

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SomneÂ® Beds & Mattresses UK | Divan & Ottoman Beds Online</title>
        <meta
          name="description"
          content="Shop SomneÂ® for premium divan and ottoman beds, mattresses, headboards and more. UK-wide delivery, great value, and styles made for better sleep."
        />
        <meta property="og:title" content="SomneÂ® Beds & Mattresses UK | Divan & Ottoman Beds Online" />
        <meta property="og:description" content="Shop SomneÂ® for premium divan and ottoman beds, mattresses, headboards and more. UK-wide delivery, great value, and styles made for better sleep." />
        <meta property="og:url" content="https://somne.co.uk" />
        <meta property="og:image" content="https://somne.co.uk/img/logo.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Layout>
        <div className="overflow-x-hidden">
          <h1 className="sr-only">SomneÂ® Beds & Mattresses UK | Divan & Ottoman Beds Online</h1>
          <HeroSection />
          <USPStrip />

          <Suspense fallback={<SectionLoader />}>
            <CategoryGrid />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <HomeEditorialSections />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <TrendingProducts />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <WhyChooseUs />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <VideoSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <TestimonialsSection />
          </Suspense>

          {/* <Suspense fallback={<SectionLoader />}>
            <ProcessSection />
          </Suspense> */}

          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
