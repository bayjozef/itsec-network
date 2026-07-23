import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useThemeSettings } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminTheme() {
  const { theme, setTheme } = useThemeSettings();
  
  const handleChange = (key: keyof typeof theme, value: string | boolean) => {
    setTheme({ ...theme, [key]: value });
  };

  const handleReset = () => {
    setTheme({
      primaryColor: '#0047b3',
      accentColor: '#1751d0',
      neonEffect: false,
      texture: 'none',
      backgroundColor: '#0a0a0a',
    });
    toast.success('Dizayn standart ayarlara qaytarıldı');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dizayn və Rənglər</h1>
        <Button variant="outline" onClick={handleReset}>Standart Ayarlara Qaytar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Rəng Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Əsas Rəng (Primary)</Label>
              <div className="flex gap-4 items-center">
                <Input type="color" value={theme.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="w-16 h-10 p-1" />
                <Input value={theme.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="flex-1" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Vurğu Rəngi (Accent)</Label>
              <div className="flex gap-4 items-center">
                <Input type="color" value={theme.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="w-16 h-10 p-1" />
                <Input value={theme.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Arxafon Rəngi (Background)</Label>
              <div className="flex gap-4 items-center">
                <Input type="color" value={theme.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} className="w-16 h-10 p-1" />
                <Input value={theme.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} className="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Xüsusi Effektlər</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Neon İşıq Effekti</Label>
                <p className="text-sm text-muted-foreground">Düymələrə və vacib elementlərə neon parlaması əlavə edir</p>
              </div>
              <Switch checked={theme.neonEffect} onCheckedChange={(v) => handleChange('neonEffect', v)} />
            </div>

            <div className="space-y-2">
              <Label>Arxafon Teksturası (Texture)</Label>
              <Select value={theme.texture} onValueChange={(v) => handleChange('texture', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tekstura seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sip-sadə (None)</SelectItem>
                  <SelectItem value="grid">Şəbəkə (Grid)</SelectItem>
                  <SelectItem value="dots">Nöqtələr (Dots)</SelectItem>
                  <SelectItem value="waves">Dalğalar (Waves)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Canlı Önizləmə / Live Preview */}
        <Card className="bg-card md:col-span-2">
          <CardHeader>
            <CardTitle>Canlı Önizləmə</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-6" style={{
              backgroundImage: theme.texture === 'grid' ? 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)' : 
                               theme.texture === 'dots' ? 'radial-gradient(rgba(255,255,255,0.1) 2px, transparent 2px)' : 'none',
              backgroundSize: theme.texture === 'grid' ? '20px 20px' : theme.texture === 'dots' ? '20px 20px' : 'auto'
            }}>
              <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>itsec.az</h2>
              <p className="text-muted-foreground max-w-md text-center">Bu bölmədə etdiyiniz dəyişikliklərin saytda necə görünəcəyini test edə bilərsiniz.</p>
              <div className="flex gap-4">
                <Button onClick={() => toast.success('Test klik edildi!')} style={{
                  backgroundColor: theme.primaryColor,
                  color: '#fff',
                  boxShadow: theme.neonEffect ? `0 0 15px ${theme.primaryColor}` : 'none'
                }}>Əsas Düymə</Button>
                <Button onClick={() => toast.success('Test klik edildi!')} variant="outline" style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  boxShadow: theme.neonEffect ? `0 0 10px ${theme.primaryColor} inset` : 'none'
                }}>İkinci Düymə</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
