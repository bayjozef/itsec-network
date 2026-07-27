import React, { useEffect, useState } from 'react';
import { adminFetchAllProducts, adminUpsertProduct, adminDeleteProduct, fetchCategories } from '@/services/api';
import { Product, Category } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/common/ImageUpload';
import { Edit, Trash2, Search, Package } from 'lucide-react';
import { toast } from 'sonner';

const AdminPromoKits: React.FC = () => {
  const [kits, setKits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Removed unused categories state
  const [promoCategory, setPromoCategory] = useState<Category | null>(null);

  const [editingKit, setEditingKit] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    thumbnail_url: '',
    stock_qty: 100,
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchCategories(), adminFetchAllProducts(1, 1000)])
      .then(([cats, { data }]) => {
        const promoCat = cats.find(c => c.slug === 'kompaniya-destleri' || c.name.toLowerCase().includes('kompaniya'));
        setPromoCategory(promoCat || null);
        
        if (promoCat) {
          setKits(data.filter(p => p.category_id === promoCat.id));
        } else {
          setKits([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (kit: Product) => {
    setEditingKit(kit);
    setFormData({
      id: kit.id,
      name: kit.name,
      description: kit.description || '',
      price: kit.price,
      dealer_price: kit.dealer_price || 0,
      thumbnail_url: kit.thumbnail_url || '',
      stock_qty: kit.stock_qty,
      is_active: kit.is_active
    });
  };

  const handleNew = () => {
    if (!promoCategory) {
      toast.error('"Kompaniya Dəstləri" kateqoriyası tapılmadı. Zəhmət olmasa kateqoriyalardan əlavə edin.');
      return;
    }
    setEditingKit(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      dealer_price: 0,
      thumbnail_url: '',
      stock_qty: 100,
      is_active: true,
      category_id: promoCategory.id
    });
  };

  const handleSave = async () => {
    if (!formData.name) return toast.error('Ad daxil edin');
    
    setSaving(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await adminUpsertProduct({
        ...formData,
        slug: formData.id ? editingKit?.slug : slug,
        category_id: promoCategory?.id,
        warranty_months: 12,
        is_featured: false,
        specifications: formData.id ? editingKit?.specifications : {}
      } as Product);
      
      toast.success('Yadda saxlanıldı');
      
      const { data } = await adminFetchAllProducts(1, 1000);
      if (promoCategory) {
        setKits(data.filter(p => p.category_id === promoCategory.id));
      }
      setFormData({ name: '' });
    } catch (err) {
      toast.error('Xəta');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Silmək istədiyinizə əminsiniz?')) return;
    try {
      await adminDeleteProduct(id);
      setKits(prev => prev.filter(k => k.id !== id));
      toast.success('Silindi');
    } catch {
      toast.error('Xəta');
    }
  };

  const filteredKits = kits.filter(k => k.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-10 text-center">Yüklənir...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="text-primary" /> Kompaniya Dəstləri (Promo Kits)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">4 kameralı və ya digər hazır komplekt dəstlərin idarəsi və tanıtım mətnləri</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-card border-border">
            <h3 className="font-bold text-lg mb-4">{formData.id ? 'Dəstə Düzəliş Et' : 'Yeni Dəst Yarat'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Dəstin Adı (məs: 4 Kameralı İP Dəst)</label>
                <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-muted border-border" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tanıtım Mətni (Təsvir)</label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  className="bg-muted border-border min-h-[120px]" 
                  placeholder="Dəstin içindəkilər və üstünlükləri barədə ətraflı məlumat..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Pərakəndə Qiymət (₼)</label>
                  <Input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="bg-muted border-border" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Topdan Qiymət (₼)</label>
                  <Input type="number" value={formData.dealer_price || 0} onChange={e => setFormData({ ...formData, dealer_price: Number(e.target.value) })} className="bg-muted border-border" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Dəst Şəkli</label>
                {formData.thumbnail_url && (
                  <div className="mb-2 p-2 bg-white rounded border border-border">
                    <img src={formData.thumbnail_url} className="w-full h-32 object-contain" alt="preview" />
                  </div>
                )}
                <ImageUpload bucket="products" path="kits" onUploaded={url => setFormData({ ...formData, thumbnail_url: url })} label="Şəkil Yüklə" aspectRatio="square" />
              </div>
              <div className="pt-2 flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-primary-foreground">
                  {saving ? 'Saxlanılır...' : formData.id ? 'Yenilə' : 'Əlavə Et'}
                </Button>
                {formData.name && (
                  <Button variant="outline" onClick={handleNew} className="border-border text-primary">Yeni</Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Mövcud Dəstlər ({filteredKits.length})</h3>
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Dəst axtar..." className="pl-9 h-9 bg-muted border-border" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {filteredKits.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Heç bir dəst tapılmadı.</div>
              ) : (
                filteredKits.map(kit => (
                  <div key={kit.id} className="p-4 flex gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-20 h-20 shrink-0 bg-white rounded border border-border p-1 flex items-center justify-center">
                      {kit.thumbnail_url ? <img src={kit.thumbnail_url} className="max-w-full max-h-full object-contain" alt={kit.name} /> : <Package className="text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{kit.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2">{kit.description}</p>
                      <div className="text-sm font-semibold text-primary">{kit.price} ₼</div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(kit)} className="h-8 px-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(kit.id)} className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoKits;
