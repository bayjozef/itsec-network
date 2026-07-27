CREATE OR REPLACE FUNCTION public.is_admin_or_mod()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'mod', 'seller', 'distributor_mod'));
$function$;