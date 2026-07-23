import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { fetchCategories, adminUpsertCategory, adminDeleteCategory } from '@/services/api';
import { toast } from 'sonner';
import type { Category } from '@/types/types';
import ImageUpload from '@/components/common/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';

const EMPTY: Partial<Category> = { name: '', slug: '', description: '', image_url: '' };

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<false | 'create' | 'edit'>(false);
  const [selected, setSelected] = useState<Partial<Category>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { profile, isAdmin } = useAuth();

  const load = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  const handleReorder = async (dragIndex: number, dropIndex: number) => {
    if (dragIndex === dropIndex) return;
    const newOrder = [...categories];
    const [draggedItem] = newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    setCategories(newOrder);

    try {
      const updates = newOrder.map((c, i) => ({ id: c.id, sort_order: i }));
      await Promise.all(updates.map(u => adminUpsertCategory({ id: u.id, sort_order: u.sort_order } as any)));
      toast.success('Sıralama yeniləndi');
    } catch {
      toast.error('Sıralama yenilənərkən xəta baş verdi');
      load();
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setSelected(EMPTY); setDialog('create'); };
  const openEdit = (c: Category) => { setSelected(c); setDialog('edit'); };
  const closeDialog = () => { setDialog(false); setSelected(EMPTY); };

  const handleSave = async () => {
    if (!selected.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      // Auto-generate slug from name if empty
      const slug = selected.slug || selected.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const parent_id = selected.parent_id || null;
      await adminUpsertCategory({ ...selected, slug, parent_id });
      toast.success(dialog === 'create' ? 'Kategoriya yaradıldı' : 'Kategoriya yeniləndi');
      closeDialog();
      load();
    } catch {
      toast.error('Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyanı silmək istədiyinizə əminsiniz?')) return;
    try {
      await adminDeleteCategory(id);
      toast.success('Kategoriya silindi');
      load();
    } catch {
      toast.error('Silinmə zamanı xəta (Məhsulları ola bilər)');
    }
  };

  const filtered = search ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : categories;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-foreground">Kategoriyalar ({categories.length})</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Axtar..." className="pl-9 h-9 bg-muted border-border text-sm w-48" />
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent" onClick={openCreate}>
            <Plus size={14} className="mr-1" />Əlavə et
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 w-10"></th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Şəkil & Ad</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Sıralama</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="px-4 py-3 text-center text-sm">Yüklənir...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-3 text-center text-sm text-muted-foreground">Tapılmadı</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', i.toString())}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    handleReorder(parseInt(e.dataTransfer.getData('text/plain')), i);
                  }}
                >
                  <td className="px-4 py-3 cursor-move text-muted-foreground hover:text-foreground">
                    <GripVertical size={16} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.image_url ?? ''} alt={c.name} className="w-10 h-10 rounded object-cover bg-muted shrink-0" />
                      <span className="text-sm font-bold text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleReorder(i, i - 1)} disabled={i === 0}>
                        <ArrowUp size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleReorder(i, i + 1)} disabled={i === filtered.length - 1}>
                        <ArrowDown size={14} />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(c)}><Pencil size={14} /></Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!dialog} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="bg-secondary border-border max-w-[calc(100%-2rem)] md:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialog === 'create' ? 'Yeni Kategoriya' : 'Kategoriyanı Yenilə'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ad *</label>
              <Input value={selected.name ?? ''} onChange={e => setSelected({ ...selected, name: e.target.value })} className="bg-muted border-border h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Slug (URL) - Boş buraxsanız avtomatik yaranır</label>
              <Input value={selected.slug ?? ''} onChange={e => setSelected({ ...selected, slug: e.target.value })} className="bg-muted border-border h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Açıqlama</label>
              <Input value={selected.description ?? ''} onChange={e => setSelected({ ...selected, description: e.target.value })} className="bg-muted border-border h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-semibold">Şəkil</label>
              <ImageUpload bucket="products" path={`categories/${profile?.id ?? 'admin'}`} currentUrl={selected.image_url ?? ''} onUploaded={url => setSelected({ ...selected, image_url: url })} label="Şəkil yüklə" aspectRatio="video" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="border border-border" onClick={closeDialog}>Ləğv et</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-accent" onClick={handleSave} disabled={saving}>
              {saving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
