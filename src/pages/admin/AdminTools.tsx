import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { upsertSiteSetting } from '@/services/api';
import { toast } from 'sonner';

interface DownloadItem {
  label: string;
  icon: string;
  url: string;
}

interface DownloadGroup {
  brand: string;
  color: string;
  bgColor: string;
  items: DownloadItem[];
}

const DEFAULT_GROUPS: DownloadGroup[] = [
  {
    brand: 'Hikvision',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    items: [
      { label: 'iVMS-4200 (Windows PC)', icon: 'Monitor', url: 'https://www.hikvision.com/en/support/download/software/ivms-4200-series/' },
      { label: 'Hik-Connect (Android)', icon: 'Smartphone', url: 'https://play.google.com/store/apps/details?id=com.hikvision.star' },
      { label: 'Hik-Connect (iOS)', icon: 'Smartphone', url: 'https://apps.apple.com/app/hik-connect/id1017216479' },
    ],
  },
  {
    brand: 'ITSEC Network',
    color: 'text-primary',
    bgColor: 'bg-primary/10 border-primary/20',
    items: [
      { label: 'ITSEC HiEasy Network (Windows)', icon: 'Monitor', url: '#' },
    ],
  }
];

const AdminTools: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [groups, setGroups] = useState<DownloadGroup[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      if (settings.software_downloads) {
        const parsed = JSON.parse(settings.software_downloads);
        setGroups(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GROUPS);
      } else {
        setGroups(DEFAULT_GROUPS);
      }
    } catch {
      setGroups(DEFAULT_GROUPS);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertSiteSetting('software_downloads', JSON.stringify(groups), 'Software Downloads List');
      await refreshSettings();
      toast.success('Alətlər yadda saxlanıldı');
    } catch (err) {
      toast.error('Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const addGroup = () => {
    setGroups([...groups, { brand: 'Yeni Qrup', color: 'text-gray-400', bgColor: 'bg-gray-500/10 border-gray-500/20', items: [] }]);
  };

  const updateGroup = (idx: number, field: keyof DownloadGroup, value: string) => {
    const newGroups = [...groups];
    newGroups[idx] = { ...newGroups[idx], [field]: value };
    setGroups(newGroups);
  };

  const removeGroup = (idx: number) => {
    setGroups(groups.filter((_, i) => i !== idx));
  };

  const addItem = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].items.push({ label: 'Yeni Alət', icon: 'Download', url: 'https://' });
    setGroups(newGroups);
  };

  const updateItem = (groupIndex: number, itemIndex: number, field: keyof DownloadItem, value: string) => {
    const newGroups = [...groups];
    newGroups[groupIndex].items[itemIndex] = { ...newGroups[groupIndex].items[itemIndex], [field]: value };
    setGroups(newGroups);
  };

  const removeItem = (groupIndex: number, itemIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].items = newGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
    setGroups(newGroups);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Yükləmələr və Alətlər</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Saxlanılır...' : <><Save size={16} className="mr-2" /> Yadda Saxla</>}
        </Button>
      </div>

      <div className="space-y-6">
        {groups.map((group, gIdx) => (
          <Card key={gIdx} className="bg-card border-border p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Qrup adı (Brend)</label>
                  <Input value={group.brand} onChange={e => updateGroup(gIdx, 'brand', e.target.value)} className="bg-muted border-border h-9" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Mətn rəngi (Tailwind class)</label>
                  <Input value={group.color} onChange={e => updateGroup(gIdx, 'color', e.target.value)} className="bg-muted border-border h-9" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Fon rəngi (Tailwind class)</label>
                  <Input value={group.bgColor} onChange={e => updateGroup(gIdx, 'bgColor', e.target.value)} className="bg-muted border-border h-9" />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive mt-5" onClick={() => removeGroup(gIdx)}><Trash2 size={16} /></Button>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-border/50">
              {group.items.map((item, iIdx) => (
                <div key={iIdx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1">Alət adı</label>
                    <Input value={item.label} onChange={e => updateItem(gIdx, iIdx, 'label', e.target.value)} className="bg-muted border-border h-8 text-sm" />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-muted-foreground block mb-1">İkon (Monitor/Smartphone/Download)</label>
                    <Input value={item.icon} onChange={e => updateItem(gIdx, iIdx, 'icon', e.target.value)} className="bg-muted border-border h-8 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground block mb-1">URL (Yükləmə linki)</label>
                    <Input value={item.url} onChange={e => updateItem(gIdx, iIdx, 'url', e.target.value)} className="bg-muted border-border h-8 text-sm" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeItem(gIdx, iIdx)}><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2 text-xs border-border" onClick={() => addItem(gIdx)}>
                <Plus size={14} className="mr-1" /> Alət əlavə et
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full border-border border-dashed py-8 text-muted-foreground hover:text-foreground" onClick={addGroup}>
        <Plus size={20} className="mr-2" /> Yeni Qrup Əlavə Et
      </Button>
    </div>
  );
};

export default AdminTools;
