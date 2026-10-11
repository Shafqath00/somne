/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileSpreadsheet, ImagePlus, Loader2, Upload, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { bulkCreateProducts, uploadImageResumable } from '@/api/api';
import { AdminPageHeader, AdminPageShell } from '@/components/admin/AdminUI';

type CsvRow = Record<string, string> & { __row: string };
type ImportResult = {
    created: { row: number; id: string; slug: string }[];
    failed: { row: number; name: string; error: string }[];
};

const REQUIRED_COLUMNS = ['name', 'basePrice', 'categoryId', 'subcategoryId'];
const JSON_COLUMNS = ['sizes', 'colors', 'storageOptions', 'headboardOptions', 'baseOptions', 'firmnessOptions'];

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

const splitCsvLine = (line: string) => {
    const cells: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        const next = line[i + 1];

        if (char === '"' && inQuotes && next === '"') {
            cell += '"';
            i += 1;
            continue;
        }

        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }

        if (char === ',' && !inQuotes) {
            cells.push(cell.trim());
            cell = '';
            continue;
        }

        cell += char;
    }

    cells.push(cell.trim());
    return cells;
};

const parseCsv = (text: string): CsvRow[] => {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = splitCsvLine(lines[0]).map(header => header.trim());
    return lines.slice(1).map((line, index) => {
        const values = splitCsvLine(line);
        const row: CsvRow = { __row: String(index + 2) };
        headers.forEach((header, headerIndex) => {
            row[header] = values[headerIndex] || '';
        });
        return row;
    });
};

const parseBoolean = (value: string, fallback = false) => {
    if (!value) return fallback;
    return ['true', '1', 'yes', 'y'].includes(value.trim().toLowerCase());
};

const parsePipeList = (value: string) => value.split('|').map(item => item.trim()).filter(Boolean);

const parseJsonColumn = (row: CsvRow, column: string, errors: string[]) => {
    const value = row[column];
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        errors.push(`Row ${row.__row}: ${column} must be valid JSON`);
        return [];
    }
};

const collectImageNames = (row: CsvRow, colors: any[]) => {
    const names = new Set<string>();
    parsePipeList(row.mainImageFiles || '').forEach(name => names.add(name));
    if (row.coverImageFile) names.add(row.coverImageFile.trim());
    colors.forEach(color => {
        if (color.imageFile) names.add(String(color.imageFile).trim());
        const variantFiles = Array.isArray(color.productImageFiles)
            ? color.productImageFiles
            : parsePipeList(String(color.productImageFiles || ''));
        variantFiles.forEach((name: string) => names.add(name.trim()));
    });
    names.delete('');
    return Array.from(names);
};

export default function ProductBulkUpload() {
    const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);

    const imagesByName = useMemo(() => {
        const map = new Map<string, File>();
        imageFiles.forEach(file => map.set(file.name, file));
        return map;
    }, [imageFiles]);

    const validation = useMemo(() => {
        const errors: string[] = [];
        const slugs = new Set<string>();
        const parsedRows = csvRows.map(row => {
            REQUIRED_COLUMNS.forEach(column => {
                if (!row[column]) errors.push(`Row ${row.__row}: ${column} is required`);
            });

            if (row.basePrice && (Number.isNaN(Number(row.basePrice)) || Number(row.basePrice) <= 0)) {
                errors.push(`Row ${row.__row}: basePrice must be a positive number`);
            }

            const slug = slugify(row.name || '');
            if (slug && slugs.has(slug)) errors.push(`Row ${row.__row}: duplicate product name in CSV`);
            if (slug) slugs.add(slug);

            const jsonErrors: string[] = [];
            const parsedJson = Object.fromEntries(JSON_COLUMNS.map(column => [column, parseJsonColumn(row, column, jsonErrors)]));
            errors.push(...jsonErrors);

            collectImageNames(row, parsedJson.colors).forEach(name => {
                if (!imagesByName.has(name)) errors.push(`Row ${row.__row}: image file "${name}" was not selected`);
            });

            return { row, parsedJson };
        });

        return { errors, parsedRows };
    }, [csvRows, imagesByName]);

    const handleCsvChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const rows = parseCsv(text);
        setCsvRows(rows);
        setResult(null);
        toast.success(`Loaded ${rows.length} CSV row${rows.length === 1 ? '' : 's'}`);
        event.target.value = '';
    };

    const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setImageFiles(prev => {
            const next = new Map(prev.map(file => [file.name, file]));
            files.forEach(file => next.set(file.name, file));
            return Array.from(next.values());
        });
        setResult(null);
        event.target.value = '';
    };

    const uploadReferencedImages = async () => {
        const names = new Set<string>();
        validation.parsedRows.forEach(({ row, parsedJson }) => {
            collectImageNames(row, parsedJson.colors).forEach(name => names.add(name));
        });

        const urlByName = new Map<string, string>();
        const files = Array.from(names).map(name => ({ name, file: imagesByName.get(name) })).filter((item): item is { name: string; file: File } => Boolean(item.file));
        let nextIndex = 0;

        const worker = async () => {
            while (nextIndex < files.length) {
                const current = files[nextIndex];
                nextIndex += 1;
                const url = await uploadImageResumable(
                    current.file,
                    `products/bulk/${Date.now()}`,
                    progress => setUploadProgress(prev => ({ ...prev, [current.name]: progress }))
                );
                urlByName.set(current.name, url);
            }
        };

        await Promise.all(Array.from({ length: Math.min(3, files.length) }, () => worker()));
        return urlByName;
    };

    const buildProductPayloads = (urlByName: Map<string, string>) => {
        return validation.parsedRows.map(({ row, parsedJson }) => {
            const mainImages = parsePipeList(row.mainImageFiles || '').map(name => urlByName.get(name)).filter(Boolean);
            const colors = parsedJson.colors.map((color: any) => {
                const variantFiles = Array.isArray(color.productImageFiles)
                    ? color.productImageFiles
                    : parsePipeList(String(color.productImageFiles || ''));
                const { imageFile, productImageFiles, ...rest } = color;
                return {
                    ...rest,
                    image: imageFile ? urlByName.get(String(imageFile)) : color.image,
                    productImages: variantFiles.map((name: string) => urlByName.get(name)).filter(Boolean)
                };
            });

            return {
                row: Number(row.__row),
                name: row.name,
                basePrice: Number(row.basePrice),
                categoryId: row.categoryId,
                subcategoryId: row.subcategoryId,
                shortDescription: row.shortDescription || '',
                description: row.description || '',
                discountPercentage: row.discountPercentage ? Number(row.discountPercentage) : 0,
                bestseller: parseBoolean(row.bestseller),
                featured: parseBoolean(row.featured),
                active: parseBoolean(row.active, true),
                images: mainImages,
                coverImage: row.coverImageFile ? urlByName.get(row.coverImageFile.trim()) : mainImages[0],
                colors,
                sizes: parsedJson.sizes,
                storageOptions: parsedJson.storageOptions,
                headboardOptions: parsedJson.headboardOptions,
                baseOptions: parsedJson.baseOptions,
                firmnessOptions: parsedJson.firmnessOptions
            };
        });
    };

    const handleImport = async () => {
        if (csvRows.length === 0) {
            toast.error('Upload a CSV first');
            return;
        }
        if (validation.errors.length > 0) {
            toast.error('Fix validation errors before importing');
            return;
        }

        setImporting(true);
        setResult(null);
        setUploadProgress({});

        try {
            const urlByName = await uploadReferencedImages();
            const products = buildProductPayloads(urlByName);
            const response = await bulkCreateProducts(products);
            setResult(response);
            toast.success(`Imported ${response.created?.length || 0} product${response.created?.length === 1 ? '' : 's'}`);
        } catch (error) {
            console.error(error);
            toast.error('Bulk import failed');
        } finally {
            setImporting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Bulk Upload Products | Admin</title>
            </Helmet>
            <AdminLayout>
                <AdminPageShell>
                        <AdminPageHeader
                            title="Bulk Product Upload"
                            description="Import CSV rows and match product images by filename before creating products."
                            icon={FileSpreadsheet}
                            actions={
                                <>
                                <Button asChild variant="outline" size="icon" className="bg-white" aria-label="Back to products">
                                    <Link to="/admin/products">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                            <Button onClick={handleImport} disabled={importing || validation.errors.length > 0 || csvRows.length === 0}>
                                {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                Import Products
                            </Button>
                                </>
                            }
                        />

                        <div className="grid gap-4 lg:grid-cols-2">
                            <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white p-5 transition-colors hover:border-slate-500">
                                <FileSpreadsheet className="h-8 w-8 text-slate-400" />
                                <div>
                                    <p className="font-medium text-slate-900">Upload CSV</p>
                                    <p className="text-sm text-slate-500">{csvRows.length ? `${csvRows.length} rows loaded` : 'Choose a CSV file'}</p>
                                </div>
                                <input type="file" accept=".csv,text/csv" onChange={handleCsvChange} className="hidden" />
                            </label>

                            <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white p-5 transition-colors hover:border-slate-500">
                                <ImagePlus className="h-8 w-8 text-slate-400" />
                                <div>
                                    <p className="font-medium text-slate-900">Select Product Images</p>
                                    <p className="text-sm text-slate-500">{imageFiles.length ? `${imageFiles.length} image files selected` : 'Choose all files referenced by CSV'}</p>
                                </div>
                                <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                            </label>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-medium text-slate-900">Preview</h2>
                                <span className="text-sm text-slate-500">{validation.errors.length} validation errors</span>
                            </div>

                            {validation.errors.length > 0 && (
                                <div className="mb-5 max-h-48 overflow-auto rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {validation.errors.map(error => <p key={error}>{error}</p>)}
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="py-2 pr-3">Row</th>
                                            <th className="py-2 pr-3">Name</th>
                                            <th className="py-2 pr-3">Category</th>
                                            <th className="py-2 pr-3">Price</th>
                                            <th className="py-2 pr-3">Images</th>
                                            <th className="py-2 pr-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvRows.slice(0, 50).map(row => {
                                            const parsed = validation.parsedRows.find(item => item.row.__row === row.__row);
                                            const imageCount = parsed ? collectImageNames(row, parsed.parsedJson.colors).length : 0;
                                            const rowHasError = validation.errors.some(error => error.startsWith(`Row ${row.__row}:`));
                                            return (
                                                <tr key={row.__row} className="border-b border-slate-100">
                                                    <td className="py-3 pr-3 text-slate-500">{row.__row}</td>
                                                    <td className="py-3 pr-3 font-medium text-slate-900">{row.name}</td>
                                                    <td className="py-3 pr-3 text-slate-600">{row.categoryId} / {row.subcategoryId}</td>
                                                    <td className="py-3 pr-3 text-slate-600">£{row.basePrice}</td>
                                                    <td className="py-3 pr-3 text-slate-600">{imageCount}</td>
                                                    <td className="py-3 pr-3">
                                                        {rowHasError ? <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" /> Error</span> : <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Ready</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {Object.keys(uploadProgress).length > 0 && (
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h2 className="mb-4 font-medium text-slate-900">Image Upload Progress</h2>
                                <div className="space-y-3">
                                    {Object.entries(uploadProgress).map(([name, progress]) => (
                                        <div key={name} className="space-y-1">
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>{name}</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <Progress value={progress} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h2 className="mb-3 font-medium text-slate-900">Import Result</h2>
                                <p className="text-sm text-slate-600">{result.created.length} created, {result.failed.length} failed.</p>
                                {result.failed.length > 0 && (
                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {result.failed.map(item => <p key={`${item.row}-${item.error}`}>Row {item.row}: {item.error}</p>)}
                                    </div>
                                )}
                            </div>
                        )}
                </AdminPageShell>
            </AdminLayout>
        </>
    );
}
