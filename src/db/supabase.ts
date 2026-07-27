
            import { createClient } from "@supabase/supabase-js";

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

            if (!supabaseUrl || !supabaseAnonKey) {
              console.error("CRITICAL: Supabase credentials are missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
            }

            // Create client with dummy URL if missing, so the app doesn't crash to a white screen at module evaluation
            export const supabase = createClient(
              supabaseUrl || 'https://missing-supabase-url.supabase.co', 
              supabaseAnonKey || 'missing-anon-key'
            );
            