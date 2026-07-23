import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, Star, FileSpreadsheet } from 'lucide-react';
import * as xlsx from 'xlsx';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { adminFetchAllProducts, adminUpsertProduct, adminDeleteProduct, adminDeleteAllProducts, adminDeleteProducts, adminFetchCategories, fetchBrands, adminCreateCategoryAndGetId } from '@/services/api';
import { toast } from 'sonner';
import type { Product, Category, Brand } from '@/types/types';
import ImageUpload from '@/components/common/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';

const EMPTY: Partial<Product> = {
  name: '', slug: '', sku: '', price: 0, dealer_price: undefined,
  distributor_price: undefined, cost_price: undefined,
  description: '', category_id: '', brand_id: '', stock_qty: 0,
  warranty_months: 24, is_active: true, is_featured: false,
  thumbnail_url: '', tags: [],
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<false | 'create' | 'edit'>(false);
  const [selected, setSelected] = useState<Partial<Product>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { profile, isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const LIMIT = 15;

  const load = useCallback(() => {
    setLoading(true);
    adminFetchAllProducts(page, LIMIT, filterCategory, search)
      .then(({ data, count }) => { setProducts(data); setCount(count); })
      .catch(console.error).finally(() => setLoading(false));
  }, [page, filterCategory, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filterCategory, search]);
  useEffect(() => {
    adminFetchCategories().then(setCategories).catch(console.error);
    fetchBrands().then(setBrands).catch(console.error);
  }, []);

  const openCreate = () => { setSelected(EMPTY); setDialog('create'); };
  const openEdit = (p: Product) => { setSelected(p); setDialog('edit'); };
  const closeDialog = () => { setDialog(false); setSelected(EMPTY); };

  const handleSave = async () => {
    if (!selected.name || !selected.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      // Auto-generate slug from name if empty
      const slug = selected.slug || selected.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      // Convert empty SKU to null — prevents unique constraint violation when SKU is not provided
      const sku = selected.sku?.trim() || null;
      // Convert empty strings to null for UUIDs
      const category_id = selected.category_id || null;
      const brand_id = selected.brand_id || null;
      await adminUpsertProduct({ ...selected, slug, sku, category_id, brand_id });
      toast.success(dialog === 'create' ? 'Product created!' : 'Product updated!');
      closeDialog();
      load();
    } catch { toast.error('Failed to save product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    await adminDeleteProduct(id);
    toast.success('Product deactivated');
    load();
  };

  const handleDeleteAll = async () => {
    if (!confirm('DİQQƏT: Saytdakı BÜTÜN məhsullar silinəcək! Əminsiniz?')) return;
    if (!confirm('Bu əməliyyat geri qaytarıla bilməz! Həqiqətən BÜTÜN məhsulları silmək istəyirsiniz?')) return;
    
    setIsDeletingAll(true);
    try {
      await adminDeleteAllProducts();
      toast.success('Bütün məhsullar uğurla silindi!');
      setSelectedIds([]);
      load();
    } catch (error) {
      toast.error('Məhsulları silərkən xəta baş verdi');
      console.error(error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Seçilmiş ${selectedIds.length} məhsulu silmək istədiyinizə əminsiniz?`)) return;
    
    setIsDeletingAll(true);
    try {
      await adminDeleteProducts(selectedIds);
      toast.success('Seçilmiş məhsullar uğurla silindi!');
      setSelectedIds([]);
      load();
    } catch (error) {
      toast.error('Məhsulları silərkən xəta baş verdi');
      console.error(error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const toggleFeatured = async (p: Product) => {
    try {
      await adminUpsertProduct({ id: p.id, is_featured: !p.is_featured });
      toast.success(p.is_featured ? 'Əla seçimdən çıxarıldı' : 'Əla seçimə əlavə edildi');
      load();
    } catch {
      toast.error('Xəta baş verdi');
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingExcel(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = xlsx.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json<any>(ws);

        if (data.length === 0) {
          toast.error("Fayl boşdur və ya düzgün formatda deyil.");
          return;
        }

        toast.info(`${data.length} məhsul oxundu, yüklənir...`);
        let successCount = 0;
        let failCount = 0;
        let skippedCount = 0;

        // Fetch existing products to avoid duplicates
        const { data: existingProducts } = await supabase.from('products').select('sku, name');
        const existingSkus = new Set((existingProducts || []).filter((p: any) => p.sku).map((p: any) => p.sku));
        const existingNames = new Set((existingProducts || []).filter((p: any) => p.name).map((p: any) => p.name.toLowerCase()));

        for (const row of data) {
          if (!row.name) continue;

          // Check for duplicates
          const nameLower = String(row.name).toLowerCase();
          const sku = String(row.sku || row.SKU || '');
          if ((sku && existingSkus.has(sku)) || existingNames.has(nameLower)) {
            skippedCount++;
            continue;
          }

          // Auto-assign Category if missing or invalid
          let guessedCategoryId = row.category_id;
          if (guessedCategoryId && !categories.find(c => c.id === guessedCategoryId)) {
            guessedCategoryId = undefined;
          }
          if (!guessedCategoryId) {
            const explicitCategory = String(row.category || row.category_name || row.kateqoriya || row.bolme || '').trim();
            if (explicitCategory) {
              const generatedSlug = explicitCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const exactMatch = categories.find(c => c.slug === generatedSlug || c.name.toLowerCase() === explicitCategory.toLowerCase());
              if (exactMatch) {
                guessedCategoryId = exactMatch.id;
              } else {
                try {
                  const newId = await adminCreateCategoryAndGetId(explicitCategory);
                  guessedCategoryId = newId;
                  // Push to local array so we don't recreate it for the next row
                  categories.push({ id: newId, name: explicitCategory, slug: explicitCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'), is_active: true, sort_order: 0, created_at: new Date().toISOString(), name_az: null, name_ru: null, description: null, image_url: null, parent_id: null });
                } catch (err) {
                  console.error('Error creating category', explicitCategory, err);
                }
              }
            } else {
              const nameLower = row.name.toLowerCase();
              
              // Helper to find or create
              const assignOrCreate = async (searchStrs: string[], createName: string) => {
                let cat = categories.find(c => searchStrs.some(s => c.name.toLowerCase().includes(s)));
                if (!cat) {
                  try {
                    const newId = await adminCreateCategoryAndGetId(createName);
                    cat = { id: newId, name: createName, slug: createName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), is_active: true, sort_order: 0, created_at: new Date().toISOString(), name_az: null, name_ru: null, description: null, image_url: null, parent_id: null };
                    categories.push(cat);
                  } catch(e) {
                    console.error('Error auto-creating category', createName, e);
                  }
                }
                return cat?.id;
              };

              if (nameLower.includes('switch') || nameLower.includes('router') || nameLower.includes('şəbəkə') || nameLower.includes('poe')) {
                guessedCategoryId = await assignOrCreate(['şəbəkə', 'switch', 'network'], 'Şəbəkə');
              } else if (nameLower.includes('nvr') || nameLower.includes('dvr') || nameLower.includes('xvr') || nameLower.includes('ds-7') || nameLower.includes('dhi-nvr') || nameLower.includes('dhi-xvr')) {
                guessedCategoryId = await assignOrCreate(['nvr', 'dvr', 'xvr'], 'NVR DVR');
              } else if (nameLower.includes('kamera') || nameLower.includes('camera') || nameLower.includes('dome') || nameLower.includes('bullet') || nameLower.includes('ptz') || nameLower.match(/\bip\b/) || nameLower.includes('ds-2') || nameLower.includes('dh-ipc') || nameLower.includes('dh-hac')) {
                guessedCategoryId = await assignOrCreate(['camera', 'kamera'], 'Camera');
              } else if (nameLower.includes('keçid') || nameLower.includes('access control') || nameLower.includes('turniket') || nameLower.includes('giriş') || nameLower.includes('barriyer') || nameLower.includes('ds-k')) {
                guessedCategoryId = await assignOrCreate(['keçid', 'giriş', 'access control', 'turniket'], 'KEÇİD NƏZARƏT');
              } else if (nameLower.includes('monitor') || nameLower.includes('ekran') || nameLower.includes('tv') || nameLower.includes('display')) {
                guessedCategoryId = await assignOrCreate(['monitor', 'ekran', 'tv', 'manitor'], 'Monitor və TV');
              } else if (nameLower.includes('hdd') || nameLower.includes('sərt disk') || nameLower.includes('ssd') || nameLower.includes('hard drive') || nameLower.includes('yaddaş')) {
                guessedCategoryId = await assignOrCreate(['hdd', 'sərt disk', 'yaddaş', 'ssd'], 'Sərt Disk (HDD)');
              } else if (nameLower.includes('kabel') || nameLower.includes('cable') || nameLower.includes('utp') || nameLower.includes('ftp') || nameLower.includes('rg59')) {
                guessedCategoryId = await assignOrCreate(['kabel', 'cable'], 'Kabel');
              } else if (nameLower.includes('damafon') || nameLower.includes('domofon') || nameLower.includes('intercom') || nameLower.includes('çağrı')) {
                guessedCategoryId = await assignOrCreate(['damafon', 'domofon', 'intercom'], 'DAMAFON');
              } else if (nameLower.includes('siqnalizasiya') || nameLower.includes('alarm') || nameLower.includes('sensor') || nameLower.includes('detektor')) {
                guessedCategoryId = await assignOrCreate(['siqnalizasiya', 'alarm', 'sensor'], 'Siqnalizasiya');
              } else if (nameLower.includes('ağıllı ev') || nameLower.includes('smart home') || nameLower.includes('smart ev')) {
                guessedCategoryId = await assignOrCreate(['ağıllı ev', 'smart home'], 'Ağıllı Ev');
              } else if (nameLower.includes('səs') || nameLower.includes('audio') || nameLower.includes('speaker') || nameLower.includes('dinamik') || nameLower.includes('mikrofon')) {
                guessedCategoryId = await assignOrCreate(['səs', 'audio', 'speaker', 'ses'], 'Ses sistemleri');
              } else {
                // Default fallback
                guessedCategoryId = await assignOrCreate(['əlavə', 'aksesuar', 'digər'], 'Əlavə & Aksesuar');
              }
            }
          }

          // Auto-assign Brand if missing or invalid
          let guessedBrandId = row.brand_id;
          if (guessedBrandId && !brands.find(b => b.id === guessedBrandId)) {
            guessedBrandId = undefined;
          }
          if (!guessedBrandId) {
            const nameLower = row.name.toLowerCase();
            const explicitBrand = String(row.brand || row.brand_name || '').toLowerCase();
            
            // Match against explicit brand column if exists, otherwise search in product name
            const brandMatch = brands.find(b => 
              (explicitBrand && explicitBrand.includes(b.name.toLowerCase())) || 
              nameLower.includes(b.name.toLowerCase())
            );
            
            if (brandMatch) {
              guessedBrandId = brandMatch.id;
            } else if (nameLower.includes('unifi') || nameLower.includes('ubiquiti') || explicitBrand.includes('ubiquiti')) {
              const unifiMatch = brands.find(b => b.name.toLowerCase().includes('unifi') || b.name.toLowerCase().includes('ubiquiti'));
              if (unifiMatch) guessedBrandId = unifiMatch.id;
            } else if (nameLower.includes('hikvision') || explicitBrand.includes('hikvision')) {
              const hikMatch = brands.find(b => b.name.toLowerCase() === 'hikvision');
              if (hikMatch) guessedBrandId = hikMatch.id;
            } else if (nameLower.includes('dahua') || explicitBrand.includes('dahua')) {
              const dahuaMatch = brands.find(b => b.name.toLowerCase() === 'dahua');
              if (dahuaMatch) guessedBrandId = dahuaMatch.id;
            }
          }

          const newProduct: Partial<Product> = {
            name: row.name,
            sku: String(row.sku || row.name),
            price: parseFloat(row.price) || 0,
            dealer_price: row.dealer_price ? parseFloat(row.dealer_price) : undefined,
            distributor_price: row.distributor_price ? parseFloat(row.distributor_price) : undefined,
            cost_price: row.cost_price ? parseFloat(row.cost_price) : undefined,
            stock_qty: parseInt(row.stock_qty) || 10,
            warranty_months: parseInt(row.warranty_months) || 24,
            thumbnail_url: row.thumbnail_url || undefined,
            category_id: guessedCategoryId || undefined,
            brand_id: guessedBrandId || undefined,
            description: row.description || `Avtomatik əlavə edilmiş: ${row.name}`,
            is_active: true,
            is_featured: false,
            slug: row.name.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000),
          };

          try {
            await adminUpsertProduct(newProduct);
            successCount++;
          } catch (err) {
            failCount++;
          }
        }

        let message = `Yükləmə bitdi: ${successCount} uğurlu, ${failCount} xəta.`;
        if (skippedCount > 0) {
          message += ` ${skippedCount} məhsul artıq mövcud olduğu üçün buraxıldı.`;
        }
        toast.success(message);
        load();
      } catch (error) {
        toast.error("Excel faylı oxunarkən xəta baş verdi.");
        console.error(error);
      } finally {
        setIsUploadingExcel(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filtered = products;
  const totalPages = Math.ceil(count / LIMIT);

  const setField = (field: string, value: unknown) => setSelected(s => ({ ...s, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-foreground">Products ({count})</h1>
        <div className="flex items-center gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-36 h-9 bg-muted border-border text-sm">
              <SelectValue placeholder="Bütün Kateqoriyalar" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-border">
              <SelectItem value="all">Bütün Kateqoriyalar</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 h-9 bg-muted border-border text-sm w-40" />
          </div>
          {selectedIds.length > 0 && (
            <Button size="sm" variant="destructive" className="hidden md:flex" disabled={isDeletingAll || isUploadingExcel} onClick={handleDeleteSelected}>
              {isDeletingAll ? <span className="animate-spin mr-1">⌛</span> : <Trash2 size={14} className="mr-1" />}
              Seçilmişləri Sil ({selectedIds.length})
            </Button>
          )}
          <Button size="sm" variant="destructive" className="hidden md:flex" disabled={isDeletingAll || isUploadingExcel} onClick={handleDeleteAll}>
            {isDeletingAll ? <span className="animate-spin mr-1">⌛</span> : <Trash2 size={14} className="mr-1" />}
            {isDeletingAll ? 'Silinir...' : 'Hamısını Sil'}
          </Button>
          <Button size="sm" variant="outline" className="border-border hidden md:flex" disabled={isUploadingExcel || isDeletingAll} onClick={() => fileInputRef.current?.click()}>
            {isUploadingExcel ? <span className="animate-spin mr-1">⌛</span> : <FileSpreadsheet size={14} className="mr-1 text-green-500" />}
            {isUploadingExcel ? 'Yüklənir...' : 'Excel Yüklə'}
          </Button>
          <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleExcelUpload} />
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent" onClick={openCreate}>
            <Plus size={14} className="mr-1" />Add Product
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 w-10">
                  <Checkbox 
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onCheckedChange={(c) => {
                      if (c) setSelectedIds(filtered.map(p => p.id!));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedIds.includes(p.id!)}
                      onCheckedChange={(c) => {
                        if (c) setSelectedIds(prev => [...prev, p.id!]);
                        else setSelectedIds(prev => prev.filter(id => id !== p.id));
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail_url ?? ''} alt={p.name} className="w-9 h-9 rounded object-cover bg-muted shrink-0" />
                      <span className="text-sm font-medium text-foreground max-w-[200px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.categories?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm price-tag">₼{p.price}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{p.stock_qty}</td>
                  <td className="px-4 py-3">
                    <Badge className={p.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className={`h-7 w-7 ${p.is_featured ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`} onClick={() => toggleFeatured(p)} title="Əla seçim">
                        <Star size={13} className={p.is_featured ? 'fill-current' : ''} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(p)}><Pencil size={13} /></Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 size={13} /></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border border-border"><ChevronLeft size={16} /></Button>
          <span className="flex items-center text-sm text-muted-foreground px-3">Page {page} / {totalPages}</span>
          <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border border-border"><ChevronRight size={16} /></Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={!!dialog} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="bg-secondary border-border max-w-[calc(100%-2rem)] md:max-w-2xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialog === 'create' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Product Name *</label>
              <Input value={selected.name ?? ''} onChange={e => setField('name', e.target.value)} className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">SKU</label>
              <Input value={selected.sku ?? ''} onChange={e => setField('sku', e.target.value)} className="bg-muted border-border h-9 text-sm" placeholder="DS-2CD2143G2-I" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Model Number</label>
              <Input value={selected.model_number ?? ''} onChange={e => setField('model_number', e.target.value)} className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price (₼) — Pərakəndə *</label>
              <Input type="number" value={selected.price ?? 0} onChange={e => setField('price', +e.target.value)} className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Topdancı qiyməti (₼) — 15% off</label>
              <Input type="number" value={selected.dealer_price ?? ''} onChange={e => setField('dealer_price', e.target.value ? +e.target.value : undefined)} placeholder="Boş buraxsanız avtomatik" className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Diler qiyməti (₼) — 10% off</label>
              <Input type="number" value={selected.distributor_price ?? ''} onChange={e => setField('distributor_price', e.target.value ? +e.target.value : undefined)} placeholder="Boş buraxsanız avtomatik" className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Maya dəyəri (₼) — Admin görür</label>
              <Input type="number" value={selected.cost_price ?? ''} onChange={e => setField('cost_price', e.target.value ? +e.target.value : undefined)} placeholder="Admin üçün daxili qiymət" className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <Select value={selected.category_id ?? ''} onValueChange={v => setField('category_id', v)}>
                <SelectTrigger className="bg-muted border-border h-9 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Brand</label>
              <Select value={selected.brand_id ?? ''} onValueChange={v => setField('brand_id', v)}>
                <SelectTrigger className="bg-muted border-border h-9 text-sm"><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent className="bg-secondary border-border">
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stock Quantity</label>
              <Input type="number" value={selected.stock_qty ?? 0} onChange={e => setField('stock_qty', +e.target.value)} className="bg-muted border-border h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Warranty (months)</label>
              <Input type="number" value={selected.warranty_months ?? 24} onChange={e => setField('warranty_months', +e.target.value)} className="bg-muted border-border h-9 text-sm" />
            </div>
            <div className="md:col-span-2">
              {/* Multi-image upload: thumbnail + 2 extra images */}
              <label className="text-xs text-muted-foreground mb-2 block font-semibold">Product Images (up to 3)</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Main image *</p>
                  <ImageUpload bucket="products" path={profile?.id ?? 'admin'} currentUrl={selected.thumbnail_url ?? ''} onUploaded={url => setField('thumbnail_url', url)} label="" aspectRatio="square" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Image 2</p>
                  <ImageUpload bucket="products" path={profile?.id ?? 'admin'} currentUrl={(selected as { image_url_2?: string }).image_url_2 ?? ''} onUploaded={url => setField('image_url_2', url)} label="" aspectRatio="square" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Image 3</p>
                  <ImageUpload bucket="products" path={profile?.id ?? 'admin'} currentUrl={(selected as { image_url_3?: string }).image_url_3 ?? ''} onUploaded={url => setField('image_url_3', url)} label="" aspectRatio="square" />
                </div>
              </div>
              <Input value={selected.thumbnail_url ?? ''} onChange={e => setField('thumbnail_url', e.target.value)} className="bg-muted border-border h-9 text-sm mt-2" placeholder="Or paste main image URL directly…" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <textarea value={selected.description ?? ''} onChange={e => setField('description', e.target.value)}
                className="w-full bg-muted border border-border rounded px-3 py-2 text-sm text-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={selected.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} className="accent-primary" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={selected.is_featured ?? false} onChange={e => setField('is_featured', e.target.checked)} className="accent-primary" />
                Featured
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="border border-border" onClick={closeDialog}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-accent" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
