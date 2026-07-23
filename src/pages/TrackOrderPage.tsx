import React, { useState } from 'react';
import { Package, Search, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { trackOrder } from '@/services/api';
import PageMeta from '@/components/common/PageMeta';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      toast.error('Zəhmət olmasa sifariş nömrəsi və əlaqə nömrəsini daxil edin');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await trackOrder(orderNumber.trim(), phone.trim());
      setResult(data);
      if (!data) {
        toast.error('Bu məlumatlara uyğun sifariş tapılmadı');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Xəta baş verdi');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Gözləmədə' };
      case 'processing': return { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Hazırlanır' };
      case 'shipped': return { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'Kargoya verildi' };
      case 'delivered': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Çatdırıldı' };
      case 'cancelled': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Ləğv edildi' };
      default: return { icon: Package, color: 'text-muted-foreground', bg: 'bg-muted', label: status };
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh] max-w-3xl">
      <PageMeta title="Sifarişin İzlənməsi" description="Sifarişinizin cari statusunu öyrənin" />
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-4">Sifarişin İzlənməsi</h1>
        <p className="text-muted-foreground">
          Sifarişinizin cari statusunu öyrənmək üçün sifariş nömrənizi və sifariş zamanı daxil etdiyiniz əlaqə nömrəsini yazın.
        </p>
      </div>

      <Card className="p-6 md:p-8 bg-card border-border shadow-sm mb-8">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Sifariş nömrəsi (Nümunə: ORD-12345)</label>
            <Input
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="ORD-..."
              className="bg-background"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Əlaqə nömrəsi</label>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0551234567"
              className="bg-background"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={loading} className="w-full md:w-auto min-w-[120px]">
              {loading ? 'Axtarılır...' : <><Search size={16} className="mr-2" /> Axtar</>}
            </Button>
          </div>
        </form>
      </Card>

      {searched && !loading && result && (
        <Card className="p-6 bg-card border-border overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Package size={20} className="text-primary" />
            Sifariş Detalları: {result.order_number}
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${getStatusInfo(result.status).bg}`}>
                  {React.createElement(getStatusInfo(result.status).icon, { size: 16, className: getStatusInfo(result.status).color })}
                  <span className={`font-semibold ${getStatusInfo(result.status).color}`}>
                    {getStatusInfo(result.status).label}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tarix</p>
                <p className="font-medium">{new Date(result.created_at).toLocaleString('az-AZ')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Məbləğ</p>
                <p className="font-bold text-lg text-primary">{result.total} AZN</p>
              </div>
            </div>

            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm border-b pb-2 mb-2">Çatdırılma Məlumatları</h4>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ad, Soyad</p>
                <p className="font-medium text-sm">{result.shipping_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ünvan</p>
                <p className="font-medium text-sm">{result.shipping_address}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {searched && !loading && !result && (
        <div className="text-center py-10 bg-muted/30 rounded-xl border border-border border-dashed">
          <XCircle size={48} className="mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Sifariş tapılmadı</h3>
          <p className="text-muted-foreground text-sm">Zəhmət olmasa daxil etdiyiniz məlumatların doğruluğunu yoxlayın.</p>
        </div>
      )}
    </div>
  );
}
