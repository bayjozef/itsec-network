import { useCompare } from '@/contexts/CompareContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('compare')}</h1>
        <p className="text-muted-foreground mb-8">Müqayisə üçün heç bir məhsul seçilməyib.</p>
        <Button asChild>
          <Link to="/products">Məhsullara bax</Link>
        </Button>
      </div>
    );
  }

  // Get all unique specification keys from all products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specifications || {})))
  ).sort();

  // Helper to highlight better specs. Very naive highlighting based on numbers if available.
  const getBetterSpec = (key: string) => {
    // Collect all values for this key
    const values = compareList.map(p => {
      const val = (p.specifications || {})[key] || '';
      // Try to extract a number for comparison
      const numMatch = val.match(/\d+(\.\d+)?/);
      return {
        id: p.id,
        val,
        num: numMatch ? parseFloat(numMatch[0]) : null
      };
    });

    const validNums = values.filter(v => v.num !== null);
    if (validNums.length === 0) return null; // No numerical comparison

    // Depending on the key, "better" could mean higher or lower.
    // Generally higher is better (Megapixels, Range, Capacity, Warranty)
    // Sometimes lower is better (Weight, Power consumption). Let's assume higher for now.
    const maxNum = Math.max(...validNums.map(v => v.num as number));
    
    // Return the ids that have this max number
    return validNums.filter(v => v.num === maxNum).map(v => v.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('compare')}</h1>
        <Button variant="outline" onClick={clearCompare} className="text-destructive">
          <Trash2 size={16} className="mr-2" /> Təmizlə
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border bg-muted/50 w-48 text-left">Xüsusiyyətlər</th>
              {compareList.map(p => (
                <th key={p.id} className="p-4 border min-w-[250px] align-top relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => removeFromCompare(p.id)}
                  >
                    <X size={16} />
                  </Button>
                  <div className="flex flex-col items-center text-center mt-4">
                    <img 
                      src={p.thumbnail_url || 'https://via.placeholder.com/150'} 
                      alt={p.name} 
                      className="w-32 h-32 object-contain mb-4 bg-white rounded-md p-2"
                    />
                    <Link to={`/products/${p.slug}`} className="font-semibold text-primary hover:underline line-clamp-2 min-h-12">
                      {lang === 'az' ? p.name_az || p.name : lang === 'ru' ? p.name_ru || p.name : p.name}
                    </Link>
                    <div className="mt-2 text-lg font-bold">₼{p.price.toFixed(2)}</div>
                    <Button className="mt-4 w-full" onClick={() => addToCart(p.id)}>
                      <ShoppingCart size={16} className="mr-2" /> Səbətə At
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border font-medium bg-muted/20">Brend</td>
              {compareList.map(p => (
                <td key={p.id} className="p-4 border text-center">{p.brands?.name || '-'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border font-medium bg-muted/20">Kateqoriya</td>
              {compareList.map(p => (
                <td key={p.id} className="p-4 border text-center">
                  {p.categories ? (lang === 'az' ? p.categories.name_az || p.categories.name : lang === 'ru' ? p.categories.name_ru || p.categories.name : p.categories.name) : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border font-medium bg-muted/20">Zəmanət (Ay)</td>
              {compareList.map(p => {
                // Warranty is standard property
                const maxWarranty = Math.max(...compareList.map(prod => prod.warranty_months || 0));
                const isBest = p.warranty_months > 0 && p.warranty_months === maxWarranty;
                return (
                  <td key={p.id} className={`p-4 border text-center ${isBest ? 'bg-green-500/10 font-bold text-green-700 dark:text-green-400' : ''}`}>
                    {p.warranty_months || 0}
                  </td>
                );
              })}
            </tr>
            {allSpecKeys.map(key => {
              const bestIds = getBetterSpec(key);
              return (
                <tr key={key}>
                  <td className="p-4 border font-medium bg-muted/20 capitalize">{key.replace(/_/g, ' ')}</td>
                  {compareList.map(p => {
                    const val = (p.specifications || {})[key];
                    const isBest = bestIds?.includes(p.id) && val;
                    return (
                      <td key={p.id} className={`p-4 border text-center ${isBest ? 'bg-green-500/10 font-bold text-green-700 dark:text-green-400' : ''}`}>
                        {val ? (
                          <div className="flex items-center justify-center gap-1">
                            {isBest && <Check size={14} className="text-green-600 dark:text-green-400" />}
                            {val}
                          </div>
                        ) : '-'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}