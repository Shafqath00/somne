// Run against local Vite: node scripts/check-coupon-exclusions.cjs [url]
// Catalogue/auth-independent fixture; never writes to the live admin API.
const puppeteer = require('puppeteer');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const entryPath = path.join(__dirname, '.coupon-check-entry.tsx');
const origin = process.argv[2] || 'http://127.0.0.1:5185';
const entry = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DiscountPage from '../src/pages/admin/DiscountPage';
import Checkout from '../src/pages/PaymentPages/Checkout';
import { CartProvider } from '../src/contexts/CartContext';
import '../src/index.css';
createRoot(document.getElementById('root')!).render(<BrowserRouter><HelmetProvider>{location.search ? <CartProvider><Checkout /></CartProvider> : <DiscountPage />}</HelmetProvider></BrowserRouter>);`;
const html = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div>
<script type="module">import RefreshRuntime from '/@react-refresh';RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script>
<script type="module" src="/scripts/.coupon-check-entry.tsx"></script></body></html>`;
const fixtureApi = `
const beds=[{id:'bed-a',name:'Amber bed'},{id:'bed-b',name:'Birch bed'},{id:'bed-c',name:'Cedar bed'}];
let discounts=[{id:'existing',code:'EXISTING',type:'percentage',value:10,active:true,excludedProductIds:['bed-c']}];
export const getAllProducts=async()=>beds;
export const getAllDiscounts=async()=>discounts;
export const deleteDiscount=async()=>{};
export const createDiscount=async data=>{window.__savedCoupon=data;discounts=[...discounts,{...data,id:'created',active:true}];};
export const createCheckoutSession=async()=>{};
export const validateDiscountCode=async(code,items)=>{
window.__validationItems=items;
await new Promise(resolve=>setTimeout(resolve,50));
const quantity=items.filter(item=>item.productId==='bed-b').reduce((sum,item)=>sum+item.quantity,0);
return quantity ? {valid:true,code,type:'percentage',value:10,discountAmount:20*quantity,eligibleTotal:200*quantity,eligibleProductIds:['bed-b']} : {valid:false,error:'This coupon does not apply to any eligible products in your cart'};
};`;

(async () => {
    let browser;
    let preview;
    fs.writeFileSync(entryPath, entry);
    try {
        if (!process.argv[2]) {
            preview = spawn(process.execPath, [path.join(__dirname, '../node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5185', '--strictPort'], { cwd: path.join(__dirname, '..'), windowsHide: true });
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Preview server did not start')), 20000);
                preview.stdout.on('data', data => { if (data.toString().includes('Local:')) { clearTimeout(timeout); resolve(); } });
                preview.on('error', reject);
                preview.on('exit', code => { clearTimeout(timeout); reject(new Error('Preview server exited: ' + code)); });
            });
        }
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => { errors.push(error.message); console.error('Browser error:', error.message); });
        await page.setRequestInterception(true);
        page.on('request', request => {
            const url = new URL(request.url());
            if (url.pathname === '/__coupon_check') return request.respond({ status: 200, contentType: 'text/html', body: html });
            if (url.pathname === '/src/api/api.ts') return request.respond({ status: 200, contentType: 'application/javascript', body: fixtureApi });
            if (url.pathname === '/src/components/layout/Layout.tsx') return request.respond({ status: 200, contentType: 'application/javascript', body: 'export function Layout({children}) { return children; }' });
            if (url.origin !== origin) return request.abort();
            return request.continue();
        });
        await page.setViewport({ width: 1440, height: 1100 });
        await page.goto(origin + '/__coupon_check');
        await page.waitForFunction(() => document.body.innerText.includes('Amber bed'));
        assert.ok(await page.evaluate(() => document.body.innerText.includes('Excluded products: Cedar bed')));
        await page.evaluate(() => Array.from(document.querySelectorAll('label')).find(label => label.textContent.includes('Amber bed')).querySelector('input').click());
        await page.type('input[aria-label="Search products to exclude"]', 'Birch');
        await page.evaluate(() => Array.from(document.querySelectorAll('label')).find(label => label.textContent.includes('Birch bed')).querySelector('input').click());
        assert.ok(await page.evaluate(() => document.body.innerText.includes('2 products excluded')));
        await page.evaluate(() => {
            const inputs = document.querySelectorAll('form input');
            const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            for (const [input, value] of [[inputs[0], 'EXCLUDE10'], [document.querySelector('input[type="number"]'), '10']]) {
                setValue.call(input, value);
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        await page.evaluate(() => document.querySelector('button[type="submit"]').click());
        await page.waitForFunction(() => window.__savedCoupon);
        const saved = await page.evaluate(() => window.__savedCoupon);
        assert.deepEqual(saved.excludedProductIds, ['bed-a', 'bed-b']);
        await page.waitForFunction(() => document.body.innerText.includes('Excluded products: Amber bed, Birch bed'));
        await page.setViewport({ width: 390, height: 844 });
        await page.waitForFunction(() => document.documentElement.scrollWidth <= window.innerWidth);
        assert.deepEqual(errors, []);
        await page.evaluate(() => localStorage.setItem('somne-cart', JSON.stringify({ items: [
            { cartItemId: 'cart-a', quantity: 1, product: { id: 'bed-a', name: 'Amber bed', categoryId: 'beds', price: 500, images: [], sizes: [] } },
            { cartItemId: 'cart-b', quantity: 1, product: { id: 'bed-b', name: 'Birch bed', categoryId: 'beds', price: 200, images: [], sizes: [] } },
        ] })));
        await page.goto(origin + '/__coupon_check?checkout');
        await page.waitForSelector('input[placeholder="Enter code"]');
        await page.type('input[placeholder="Enter code"]', 'SAVE');
        await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Apply').click());
        await page.waitForFunction(() => document.body.innerText.includes('SAVE applied'));
        assert.equal(await page.evaluate(() => Array.from(document.querySelectorAll('span')).filter(span => span.textContent.startsWith('SAVE applied')).length), 1);
        assert.deepEqual(await page.evaluate(() => window.__validationItems.map(item => item.productId)), ['bed-a', 'bed-b']);
        await page.evaluate(() => document.querySelectorAll('button[aria-label="Increase quantity"]')[1].click());
        await page.waitForFunction(() => document.body.innerText.includes('SAVE applied') && document.body.innerText.includes('£40'));
        await page.evaluate(() => document.querySelectorAll('button[aria-label="Remove item"]')[1].click());
        await page.waitForFunction(() => document.body.innerText.includes('does not apply to any eligible products'));
        assert.ok(await page.evaluate(() => !document.body.innerText.includes('SAVE applied')));
        assert.deepEqual(errors, []);
        console.log('PASS: admin search, multiple selections, saved exclusions, mobile width; checkout skips excluded labels and revalidates quantity changes and removal.');
    } finally {
        if (browser) await browser.close();
        if (preview) preview.kill();
        fs.rmSync(entryPath, { force: true });
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
