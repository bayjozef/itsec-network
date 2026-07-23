# Vercel-ə Yükləmə (Deploy) Təlimatı

Saytınızı Vercel-də onlayn etmək və `itsec.az` domeninə bağlamaq üçün aşağıdakı addımları diqqətlə izləyin:

## 1. Kodları GitHub-a Yükləyin
Vercel birbaşa GitHub ilə işləyir. Ona görə də əvvəlcə kodları GitHub-a yükləməliyik.
1. Təqdim olunan **ZIP faylını** yükləyin və kompyuterinizdə arxivdən (zip-dən) çıxarın.
2. [GitHub.com](https://github.com/) saytına daxil olun və hesabınıza giriş edin (yoxdursa, yeni hesab yaradın).
3. Sağ yuxarı küncdəki **"+"** düyməsinə basıb **"New repository"** seçin.
4. Repozitoriyaya ad verin (məsələn: `itsec-az-website`).
5. Görünüşünü **Private** (Gizli) olaraq seçin ki, kodlarınızı başqası görməsin. **"Create repository"** düyməsini basın.
6. Kompyuterinizdə arxivdən çıxardığınız qovluğa daxil olun. Əgər Git istifadə etməyi bilirsinizsə, kodları terminal vasitəsilə push edin. Bilmirsinizsə, GitHub səhifəsindəki **"uploading an existing file"** linkinə klikləyərək qovluğun içindəki *bütün faylları* sürüşdürüb ora atın və "Commit changes" basın.

## 2. Vercel-də Layihəni Yaratmaq
1. [Vercel.com](https://vercel.com/) saytına daxil olun. **"Continue with GitHub"** seçərək GitHub hesabınızla giriş edin.
2. Sağ yuxarıdan **"Add New" -> "Project"** düyməsini basın.
3. Ekranda GitHub-dakı repozitoriyalarınız görünəcək. Bayaq yaratdığınız `itsec-az-website` repozitoriyasının yanındakı **"Import"** düyməsini basın.
4. "Configure Project" səhifəsi açılacaq. **Framework Preset** avtomatik olaraq **Vite** seçilmiş olmalıdır (əgər seçilməyibsə, Vite seçin).

## 3. Məlumatlar Bazasını (Supabase) Qoşmaq (ƏN VACİB ADDIM)
Saytınızın məlumatları (məhsullar, admin panel məlumatları və s.) çəkə bilməsi üçün Vercel-ə Supabase açarlarını verməlisiniz.
1. Həmin "Configure Project" səhifəsində **"Environment Variables"** bölməsini tapıb açın.
2. İlk sətirdə:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://kdjwhelicqfjxrfjooaq.supabase.co`
   Və **"Add"** düyməsini basın.
3. İkinci sətirdə:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkandoZWxpY3FmanhyZmpvb2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMjcxNjEsImV4cCI6MjA5ODYwMzE2MX0.H8LWLP34FMgPvo5NliYy3pUtRC14jz2k734fodgP84o`
   Və **"Add"** düyməsini basın.

*(Qeyd: Əgər bu açarları bilmirsinizsə, mənə "Supabase açarlarımı ver" deyə bilərsiniz və mən onları sizə təqdim edəcəyəm).*

## 4. Deploy (Canlıya Çıxarma)
1. Bütün məlumatları daxil etdikdən sonra **"Deploy"** düyməsini basın.
2. Vercel təxminən 1-2 dəqiqə ərzində saytınızı quracaq (Build edəcək).
3. Uğurla bitdikdən sonra ekranda təbriklər ("Congratulations") yazısı və saytın Vercel tərəfindən verilmiş müvəqqəti linki görünəcək.

## 5. Domeni (itsec.az) Qoşmaq
1. Vercel-də layihənizin idarə panelinə (Dashboard) daxil olun.
2. Yuxarıdakı menyudan **"Settings"** -> **"Domains"** bölməsinə daxil olun.
3. Boş xanaya **itsec.az** yazın və **"Add"** düyməsini basın.
4. Vercel sizə DNS məlumatları (Nameservers və ya A Record / CNAME) verəcək.
5. `itsec.az` domenini hardan almısınızsa (məsələn: yönlendir.az, online.az, namecheap), həmin sayta daxil olun, domeninizin DNS tənzimləmələri bölməsinə keçin və Vercel-in sizə verdiyi qeydləri (records) oraya əlavə edin.
6. DNS yenilənməsi 1-24 saat çəkə bilər. Tamamlandıqdan sonra saytınız `itsec.az` ünvanında aktiv olacaq.
