/**
 * Pre-rendering script for Somne SPA
 * 
 * Runs after `vite build` to generate static HTML snapshots for each route.
 * This ensures Google Ads bots see real content instead of an empty <div id="root"></div>.
 * 
 * Usage: node scripts/prerender.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import puppeteer from 'puppeteer';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const API_BASE_URL = "https://bedshowroom2-3duyqbp4qa-uc.a.run.app";

// Static routes to pre-render (must match App.tsx routes)
const STATIC_ROUTES = [
    '/',
    '/contact',
    '/returns',
    '/privacy',
    '/blogs',
    '/checkout',
    '/track-order',
    // Category routes
    '/beds',
    '/beds/divan-beds',
    '/beds/upholstered-beds',
    '/beds/ottoman-divan-beds',
    '/beds/upholstered-ottoman-bed',
    '/mattresses',
    '/mattresses/memory-foam',
    '/mattresses/orthopaedic-mattress',
    '/mattresses/pocket-sprung-mattress',
    '/mattresses/pillow-top-mattress',
    '/headboards',
];

/**
 * Serve the dist directory on a local HTTP server
 */
function startServer(port) {
    return new Promise((resolve) => {
        const server = createServer((req, res) => {
            // Parse URL and strip query strings
            let urlPath = req.url.split('?')[0];

            // Try exact file first
            let filePath = path.join(DIST_DIR, urlPath);

            // If it's a directory or doesn't exist as a file, serve index.html (SPA fallback)
            if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                // Check for index.html in the directory
                const indexPath = path.join(filePath, 'index.html');
                if (fs.existsSync(indexPath)) {
                    filePath = indexPath;
                } else {
                    // SPA fallback - serve root index.html
                    filePath = path.join(DIST_DIR, 'index.html');
                }
            }

            // Determine content type
            const ext = path.extname(filePath).toLowerCase();
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
                '.ico': 'image/x-icon',
            };

            const contentType = contentTypes[ext] || 'application/octet-stream';

            try {
                const content = fs.readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            } catch (err) {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        server.listen(port, () => {
            console.log(`  Static server running on http://localhost:${port}`);
            resolve(server);
        });
    });
}

/**
 * Fetch dynamic product routes from the API
 */
async function fetchProductRoutes() {
    console.log('  Fetching product routes from API...');
    const products = [];

    try {
        const categories = [
            ['beds', 'all'],
            ['mattresses', 'all'],
            ['headboards', 'all'],
        ];

        for (const [type, category] of categories) {
            try {
                const response = await axios.get(`${API_BASE_URL}/collection/${type}/${category}`);
                if (response.data) {
                    products.push(...response.data);
                }
            } catch (err) {
                console.warn(`  Warning: Could not fetch ${type}/${category}: ${err.message}`);
            }
        }

        // De-duplicate by ID
        const uniqueMap = new Map();
        products.forEach(p => {
            if (!uniqueMap.has(p.id)) {
                uniqueMap.set(p.id, p);
            }
        });

        const uniqueProducts = Array.from(uniqueMap.values());
        const routes = uniqueProducts
            .map(p => {
                const slug = p.slug || p.name;
                return slug ? `/product/${encodeURIComponent(slug)}` : null;
            })
            .filter(Boolean);

        console.log(`  Found ${routes.length} product routes`);
        return routes;
    } catch (err) {
        console.error('  Error fetching product routes:', err.message);
        return [];
    }
}

/**
 * Pre-render a single route using Puppeteer
 */
async function prerenderRoute(page, baseUrl, route) {
    const url = `${baseUrl}${route}`;

    try {
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000,
        });

        // Wait a bit more for lazy-loaded content and React hydration
        await page.waitForFunction(
            () => {
                const root = document.getElementById('root');
                return root && root.children.length > 0;
            },
            { timeout: 15000 }
        );

        // Small extra delay for any animations/transitions to settle
        await new Promise(r => setTimeout(r, 500));

        // Get the fully rendered HTML
        const html = await page.content();

        // Determine the output path
        let outputPath;
        if (route === '/') {
            outputPath = path.join(DIST_DIR, 'index.html');
        } else {
            // Create directory structure: /beds/divan-beds → dist/beds/divan-beds/index.html
            const routeDir = path.join(DIST_DIR, route);
            fs.mkdirSync(routeDir, { recursive: true });
            outputPath = path.join(routeDir, 'index.html');
        }

        fs.writeFileSync(outputPath, html);
        return true;
    } catch (err) {
        console.error(`  ✗ Failed: ${route} — ${err.message}`);
        return false;
    }
}

/**
 * Main pre-rendering process
 */
async function prerender() {
    console.log('\n🚀 Somne Pre-rendering\n');
    console.log('  Step 1: Starting local server...');

    const PORT = 4173;
    const server = await startServer(PORT);
    const baseUrl = `http://localhost:${PORT}`;

    let browser;
    try {
        console.log('  Step 2: Launching Puppeteer...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        console.log('  Step 3: Gathering routes...');
        const productRoutes = await fetchProductRoutes();
        const allRoutes = [...STATIC_ROUTES, ...productRoutes];
        console.log(`  Total routes to pre-render: ${allRoutes.length}\n`);

        const page = await browser.newPage();

        // Set a realistic viewport and user agent
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        );

        let success = 0;
        let failed = 0;

        for (let i = 0; i < allRoutes.length; i++) {
            const route = allRoutes[i];
            const num = `[${i + 1}/${allRoutes.length}]`;
            process.stdout.write(`  ${num} ${route}...`);

            const ok = await prerenderRoute(page, baseUrl, route);
            if (ok) {
                success++;
                console.log(' ✓');
            } else {
                failed++;
            }
        }

        await page.close();

        console.log(`\n  ✅ Pre-rendering complete: ${success} succeeded, ${failed} failed`);
        console.log(`  Output: ${DIST_DIR}\n`);

    } catch (err) {
        console.error('Pre-rendering failed:', err);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}

prerender();
