import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { SomneLoader } from '@/components/ui/SomneLoader';
import { HeroShowcase } from '@/components/home/revamp/HeroShowcase';
import {
  CategoryBento,
  ColourStory,
  MattressFeature,
  OfferBanner,
  ReviewWall,
  StorageSpotlight,
  TrustStrip,
} from '@/components/home/revamp/HomeSections';

// Lazy load below-the-fold components
const TrendingProducts = lazy(() => import('@/components/home/trending').then(module => ({ default: module.TrendingProducts })));
const FAQSection = lazy(() => import('@/components/home/faq').then(module => ({ default: module.FAQSection })));

const SectionLoader = () => <SomneLoader size="md" className="h-72" />;

const TITLE = 'Somne® Beds & Mattresses UK | Divan & Ottoman Beds Online';
const DESCRIPTION =
  'Shop Somne® for premium divan and ottoman beds, mattresses, headboards and more. UK-wide delivery, great value, and styles made for better sleep.';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content="https://somne.co.uk" />
        <meta property="og:image" content="https://somne.co.uk/img/revamp/hero-ambassador.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Layout>
        <div className="overflow-x-hidden">
          <h1 className="sr-only">{TITLE}</h1>
          <HeroShowcase />
          <TrustStrip />
          <CategoryBento />

          <Suspense fallback={<SectionLoader />}>
            <TrendingProducts />
          </Suspense>

          <OfferBanner />
          <ColourStory />
          <StorageSpotlight />
          <MattressFeature />
          <ReviewWall />

          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
