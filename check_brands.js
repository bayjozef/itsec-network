import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { data: brands, error } = await supabase.from('brands').select('*');
  console.log('Current DB brands:', brands?.map(b => b.name));
  if (error) console.error('Error fetching brands:', error);
}
main();
