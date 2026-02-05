import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { USPStrip } from '@/components/home/USPStrip';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CustomizeBanner } from '@/components/home/CustomizeBanner';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { TrendingProducts } from '@/components/home/trending';
import { FAQSection } from '@/components/home/faq';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Somne</title>
        <meta
          name="description"
          content="Discover luxury beds and mattresses handcrafted in the UK. Premium upholstered beds, divan sets, ottoman beds & natural mattresses. Free delivery & 5-year guarantee."
        />
        <meta property="og:title" content="Somne" />
        <meta property="og:description" content="Experience hotel-quality comfort in your own home with our premium handcrafted beds and mattresses." />
      </Helmet>
      <Layout>
        <HeroSection />
        <USPStrip />
        <CategoryGrid />
        <TrendingProducts />
        {/* <FeaturedProducts /> */}
        {/* <CustomizeBanner /> */}
        <WhyChooseUs />
        <TestimonialsSection />
        <ProcessSection />
        <FAQSection />
        {/* <InstagramGallery /> */}
      </Layout>
    </>
  );
};

export default HomePage;
