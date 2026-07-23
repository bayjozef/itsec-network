import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  // Fix brands
  const { data: brands } = await supabase.from('brands').select('*');
  console.log('Current brands:', brands?.map(b => b.name));

  const desiredBrands = [
    { name: 'Dahua', slug: 'dahua', website: 'https://www.dahuasecurity.com' },
    { name: 'Uniview', slug: 'uniview', website: 'https://www.uniview.com' },
    { name: 'Avitel', slug: 'avitel', website: 'https://avitel.az' },
    { name: 'Hikvision', slug: 'hikvision', website: 'https://www.hikvision.com' },
    { name: 'TP-Link', slug: 'tp-link', website: 'https://www.tp-link.com' },
    { name: 'Cisco', slug: 'cisco', website: 'https://www.cisco.com' },
    { name: 'Unifi', slug: 'unifi', website: 'https://ui.com' }
  ];

  for (const b of desiredBrands) {
    const existing = brands?.find(ex => ex.name.toLowerCase() === b.name.toLowerCase());
    if (!existing) {
      console.log('Adding brand:', b.name);
      await supabase.from('brands').insert(b);
    }
  }

  const brandsToDelete = brands?.filter(b => !desiredBrands.some(db => db.name.toLowerCase() === b.name.toLowerCase()));
  if (brandsToDelete?.length) {
    console.log('Deleting extra brands:', brandsToDelete.map(b => b.name));
    for (const b of brandsToDelete) {
      await supabase.from('brands').delete().eq('id', b.id);
    }
  }

  // Update categories
  // User wanted:
  // kamera, nvr, hdd, kecit nezaret sistemleri, damafon, siqnalizasiya, sebeke, manitor tv, ses sistemleri, elave kabel aksesuarlar, kompaniya destleri
  const desiredCategories = [
    { name: 'Kamera', slug: 'kamera', description: 'Kameralar' },
    { name: 'NVR', slug: 'nvr', description: 'NVR' },
    { name: 'HDD', slug: 'hdd', description: 'HDD' },
    { name: 'Keçid Nəzarət Sistemləri', slug: 'kecid-nezaret', description: 'Keçid Nəzarət Sistemləri' },
    { name: 'Damafon', slug: 'damafon', description: 'Damafon' },
    { name: 'Siqnalizasiya', slug: 'siqnalizasiya', description: 'Siqnalizasiya' },
    { name: 'Şəbəkə', slug: 'sebeke', description: 'Şəbəkə' },
    { name: 'Monitor TV', slug: 'monitor-tv', description: 'Monitor TV' },
    { name: 'Səs Sistemləri', slug: 'ses-sistemleri', description: 'Səs Sistemləri' },
    { name: 'Kabel və Aksesuarlar', slug: 'kabel-aksesuarlar', description: 'Kabel və Aksesuarlar' },
    { name: 'Kompaniya Dəstləri', slug: 'kompaniya-destleri', description: 'Hazır Kamera Paketləri' }
  ];

  const { data: categories } = await supabase.from('categories').select('*');
  console.log('Current categories:', categories?.map(c => c.name));

  for (const dc of desiredCategories) {
    const existing = categories?.find(ex => ex.slug === dc.slug || ex.name === dc.name);
    if (!existing) {
      console.log('Adding category:', dc.name);
      await supabase.from('categories').insert(dc);
    } else {
      await supabase.from('categories').update({ name: dc.name }).eq('id', existing.id);
    }
  }

  console.log('Done fixing brands and categories.');
}
main();
