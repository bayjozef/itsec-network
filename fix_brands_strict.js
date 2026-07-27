import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data: brands } = await supabase.from('brands').select('id, name');
  if (!brands) return;

  const { data: products } = await supabase.from('products').select('id, name');
  if (!products) return;

  for (const p of products) {
    const nameLower = p.name.toLowerCase();
    const brandMatch = brands.find(b => nameLower.includes(b.name.toLowerCase()));
    
    if (brandMatch) {
      await supabase.from('products').update({ brand_id: brandMatch.id }).eq('id', p.id);
      console.log(`Updated ${p.name} to ${brandMatch.name}`);
    } else {
      // Look for specific patterns
      if (nameLower.includes('unifi') || nameLower.includes('ubiquiti')) {
        const u = brands.find(b => b.name === 'UNIFI');
        if (u) await supabase.from('products').update({ brand_id: u.id }).eq('id', p.id);
      }
    }
  }
}
run();