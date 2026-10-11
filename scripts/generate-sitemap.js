
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = "https://bedshowroom2-3duyqbp4qa-uc.a.run.app";
const BASE_URL = "https://somne.co.uk"; // Replace with actual domain

const STATIC_ROUTES = [
    '/',
    '/contact',
    '/returns',
    '/beds',
    '/mattresses',
    '/headboards',
    '/blogs',
    // Add other static category routes
    '/beds/divan-beds',
    '/beds/upholstered-beds',
    '/beds/ottoman-divan-beds',
    '/beds/upholstered-ottoman-bed',
    '/mattresses/memory-foam',
    '/mattresses/orthopaedic-mattress',
    '/mattresses/pocket-sprung-mattress',
    '/mattresses/pillow-top-mattress',
];

async function fetchProducts(type, category) {
    try {
        const response = await axios.get(`${API_BASE_URL}/collection/${type}/${category}`);
        return response.data || [];
    } catch (error) {
        console.error(`Error fetching ${type}/${category}:`, error.message);
        return [];
    }
}

async function generateSitemap() {
    console.log('Generating sitemap...');

    const products = [];

    // Fetch from main categories
    const bedProducts = await fetchProducts('beds', 'all');
    const mattressProducts = await fetchProducts('mattresses', 'all');
    const headboardProducts = await fetchProducts('headboards', 'all');


    products.push(...bedProducts, ...mattressProducts, ...headboardProducts);

    // Remove duplicates based on ID (more reliable than slug/name)
    const uniqueProductsMap = new Map();
    products.forEach(item => {
        if (!uniqueProductsMap.has(item.id)) {
            uniqueProductsMap.set(item.id, item);
        }
    });

    const uniqueProducts = Array.from(uniqueProductsMap.values());

    console.log(`Found ${uniqueProducts.length} unique products.`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${STATIC_ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${uniqueProducts.map(product => {
        const slug = product.slug || product.name;
        if (!slug) return '';
        const encodedSlug = encodeURIComponent(slug).replace(/%20/g, '-'); // Optional: replace spaces with - if you want, but app uses raw names?
        // Wait, the app uses Raw Names (spaces -> %20).
        // ProductCard uses: product.slug || product.name
        // If I use product.name with spaces, I should encode it as %20.
        // However, if the App expects spaces (decoded) in useParams, then the URL in browser (and sitemap) should have %20.

        // Let's stick to what the App does. 
        // The App link is simply /product/${name}. Browser turns space to %20.
        // So for sitemap <loc>, we should use encoded URI.

        const loc = `${BASE_URL}/product/${encodeURIComponent(slug)}`;

        return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }).join('')}
</urlset>`;


    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap().catch(console.error);
