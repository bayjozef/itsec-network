# Tələblər Sənədi

## 1. Tətbiq Haqqında Ümumi Məlumat

**Tətbiq Adı**: ITSEC.AZ (Ibrahim Tebriz Security)

**Təsvir**: CCTV kameraları, kommutatorlar, kabellər və təhlükəsizlik avadanlıqları üzrə ixtisaslaşmış peşəkar təhlükəsizlik sistemləri e-ticarət platforması. Platform həm pərakəndə müştərilərə, həm də topdansatış dilerlərə xidmət göstərir, çoxdilli dəstək (Azərbaycan, İngilis, Rus), texniki hesablama alətləri və hərtərəfli idarəetmə imkanları təqdim edir.

## 2. İstifadəçilər və İstifadə Ssenarilər

**Hədəf İstifadəçilər**:
- Təhlükəsizlik avadanlığı axtaran pərakəndə müştərilər
- Topdansatış dilerləri və distribyutorlar
- Platformanı idarə edən sistem administratorları
- Məhsul və kateqoriya idarəetməsi üçün moderatorlar

**Əsas İstifadə Ssenarilər**:
- Müştərilər onlayn təhlükəsizlik məhsullarına baxır və alır
- Dilerlər topdansatış qiymətlərinə və toplu sifarişlərə daxil olur
- Administratorlar məhsulları, sifarişləri və məzmunu idarə edir
- İstifadəçilər sistem planlaşdırması üçün texniki alətlərdən istifadə edir
- Moderatorlar məhsul və kateqoriya əlavə edir, şəkil yükləyir
- İstifadəçilər məhsulları müqayisə edir və xüsusiyyətləri yan-yana görür

## 3. Səhifə Strukturu və Funksionallıq

```
ITSEC.AZ
├── İctimai Veb-sayt
│   ├── Ana Səhifə
│   ├── Məhsul Kataloqu
│   ├── Məhsul Təfərrüat Səhifəsi
│   ├── Alış-veriş Səbəti
│   ├── Ödəniş
│   ├── Axtarış Nəticələri
│   ├── Müqayisə Səhifəsi
│   ├── Hikvision Smart Texnologiya Mərkəzi
│   ├── Ağıllı Alətlər
│   ├── Bloq/Xəbərlər
│   ├── Əlaqə Səhifəsi
│   └── Statik Səhifələr
├── İstifadəçi Paneli
│   ├── Giriş/Qeydiyyat
│   ├── Profil İdarəetməsi
│   ├── Sifariş Tarixçəsi
│   ├── İstək Siyahısı
│   ├── Qiymət Sorğuları
│   ├── Mesajlar
│   └── Fakturalar
├── Diler Paneli
│   ├── İdarəetmə Paneli
│   ├── Toplu Sifariş
│   ├── Kredit İdarəetməsi
│   ├── Satış Statistikası
│   └── Excel İdxal/İxrac
├── Moderator Paneli
│   ├── İdarəetmə Paneli
│   ├── Məhsul İdarəetməsi
│   └── Kateqoriya İdarəetməsi
└── Admin Paneli
    ├── İdarəetmə Paneli
    ├── Məhsul İdarəetməsi
    ├── Sifariş İdarəetməsi
    ├── Müştəri İdarəetməsi
    ├── CMS İdarəetməsi
    ├── Analitika və Hesabatlar
    ├── Texniki Alətlər İdarəetməsi
    ├── İnteqrasiya İdarəetməsi
    ├── Təhlükəsizlik Parametrləri
    └── Tənzimləmələr
```

### 3.1 İctimai Veb-sayt

#### 3.1.1 Ana Səhifə
- Sürüşdürmə zamanı glassmorphism effekti ilə yapışqan başlıq göstərmək (backdrop-blur, yarı şəffaf fon)
- Başlıqda sayt adını ITSEC.AZ olaraq göstərmək
- Başlıqda AZ / EN / RU seçimlərini göstərən dil dəyişdirici UI daxil etmək
- Animasiyalı incə mesh/qradient fonu ilə qradient hero bölməsini göstərmək
- Premium tipoqrafiya istifadə edərək promosyon məzmunu ilə hero banner göstərmək (başlıqlar üçün display şrift, mətn üçün Inter)
- Hero banner hündürlüyü: PC-də standart hündürlük (məsələn 550px), mobil cihazlarda uyğun hündürlük (məsələn 400px) istifadə etmək ki, şəkil düzgün proporsiyada görünsün və məzmun tam oxuna bilsin
- Hover yüksəlmə effekti ilə məhsul kartları olan seçilmiş məhsullar bölməsini göstərmək
- Brend nümayişi: Hikvision, Dahua, TP-Link, Cisco, Avitel, RVI
- Animasiyalı statistika sayğacı göstərmək: 2500+ məhsul, 3500+ layihə, 5000+ müştəri, 100% zəmanət
- İkonlar və qradient örtükləri ilə seçilmiş kateqoriyalar bölməsini göstərmək
- Tünd qırmızı qradient fonu ilə görkəmli \"Diler Olun\" CTA banner bölməsi daxil etmək, diler üstünlüklərini nümayiş etdirmək: 15% endirim, kredit xətti, xüsusi dəstək
- Hikvision Smart Texnologiya Mərkəzi nümayiş bölməsini daxil etmək
- Məhsul şəbəkə bölməsini göstərmək
- Linklər, sosial media ikonları, əlaqə məlumatları ilə footer göstərmək
- Footer-də sayt adını ITSEC (Ibrahim Tebriz Security) olaraq göstərmək
- Footer-də powered by məlumatını ITSEC Ibrahim Tebriz Security olaraq göstərmək
- Əlaqə məlumatlarını göstərmək: Bakı, Azadlıq prospekti 143, iş saatları 09:00-18:00
- WhatsApp sifariş çat düyməsini təmin etmək (+994 77 611 77 80)
- Dizayn boyunca tünd dəniz mavi əsas rəng (#0A0E1A) və canlı qırmızı brend rəngi (#CC0000) tətbiq etmək
- Kartlarda glassmorphism effektləri tətbiq etmək (backdrop-blur, yarı şəffaf fonlar)

#### 3.1.2 Məhsul Kataloqu
- Məhsul kateqoriyalarını göstərmək: IP kameralar, analoq kameralar, DVR/NVR, kommutatorlar, kabellər, giriş nəzarəti, siqnalizasiya, ağıllı ev
- Hover yüksəlmə effekti ilə kartlar istifadə edərək şəkillər, adlar, qiymətlər ilə məhsul şəbəkəsini göstərmək
- Hər məhsul kartında \"Müqayisəyə Əlavə Et\" düyməsini göstərmək
- Filtrasiya və çeşidləmə seçimlərini təmin etmək
- Səhifələməni dəstəkləmək

#### 3.1.3 Məhsul Təfərrüat Səhifəsi
- Məhsul şəkillərini göstərmək
- Məhsul xüsusiyyətlərini göstərmək
- Qiyməti göstərmək
- \"Səbətə Əlavə Et\" düyməsini təmin etmək
- \"Müqayisəyə Əlavə Et\" düyməsini təmin etmək
- Hover yüksəlmə effekti ilə əlaqəli məhsulları göstərmək

#### 3.1.4 Alış-veriş Səbəti
- Seçilmiş məhsulları miqdarları ilə siyahıya almaq
- Ara cəm və ümumi məbləği göstərmək
- Miqdar tənzimləməsinə və element silinməsinə icazə vermək
- \"Ödənişə Keç\" düyməsini təmin etmək

#### 3.1.5 Ödəniş
- Çatdırılma məlumatlarını toplamaq
- Ödəniş məlumatlarını toplamaq
- Sifariş xülasəsini göstərmək
- Sifariş təsdiqini təmin etmək

#### 3.1.6 Axtarış Nəticələri
- İstifadəçi sorğusuna əsasən axtarış nəticələrini göstərmək
- Şəkillər və qiymətlərlə məhsul uyğunluqlarını göstərmək
- Filtrasiya seçimlərini təmin etmək

#### 3.1.7 Müqayisə Səhifəsi
- İstifadəçinin seçdiyi məhsulları yan-yana göstərmək (maksimum 4 məhsul)
- Məhsul şəkillərini, adlarını və qiymətlərini göstərmək
- Məhsul xüsusiyyətlərini cədvəl formatında göstərmək
- Hər xüsusiyyət üçün daha yaxşı göstəriciyə malik məhsulu vurğulamaq
- Vurğulama qaydası: daha yüksək meqapiksel, daha böyük yaddaş, daha uzun məsafə və s.
- İstifadəçiyə müqayisədən məhsul silməyə icazə vermək
- \"Səbətə Əlavə Et\" düyməsini hər məhsul üçün təmin etmək

#### 3.1.8 Hikvision Smart Texnologiya Mərkəzi
- Hikvision texnologiyası və həllərini nümayiş etdirmək
- Seçilmiş Hikvision məhsullarını göstərmek
- Ağıllı texnologiya təklifləri haqqında məlumat təqdim etmək

#### 3.1.9 Ağıllı Alətlər
- **Disk Tutumu Kalkulyatoru**: Kamera sayı, həlledilmə, qeyd müddəti əsasında tələb olunan HDD yaddaşını hesablamaq
- **Lens Bucağı Simulyatoru**: Lens fokus uzunluğuna əsasən kamera görüş sahəsini simulyasiya etmək
- **PoE Kalkulyatoru**: PoE güc tələblərini hesablamaq
- **Bant Genişliyi Kalkulyatoru**: Şəbəkə bant genişliyi ehtiyaclarını hesablamaq
- **Kabel Uzunluğu Kalkulyatoru**: Maksimum kabel məsafəsini hesablamaq
- **NVR Kanal Seçici**: Kamera sayına əsasən NVR tövsiyə etmək
- **Fiber Məsafə Kalkulyatoru**: Fiber optik ötürmə məsafəsini hesablamaq

#### 3.1.10 Bloq/Xəbərlər
- Bloq yazıları və xəbər məqalələrinin siyahısını göstərmək
- Şəkillər və məzmunla məqalə təfərrüatlarını göstərmək

#### 3.1.11 Əlaqə Səhifəsi
- Əlaqə məlumatlarını göstərmək: ünvan, telefon, e-poçt, iş saatları
- Sorğular üçün əlaqə forması təmin etmək
- Xəritə yerini göstərmək

#### 3.1.12 Statik Səhifələr
- Haqqımızda
- Şərtlər və Qaydalar
- Məxfilik Siyasəti
- Zəmanət Məlumatı

### 3.2 İstifadəçi Paneli

#### 3.2.1 Giriş/Qeydiyyat
- E-poçt və şifrə ilə istifadəçi qeydiyyatı
- Etimadnamələrlə istifadəçi girişi
- Şifrə bərpası

#### 3.2.2 Profil İdarəetməsi
- Şəxsi məlumatları görmək və redaktə etmək
- Şifrəni dəyişdirmək
- Çatdırılma ünvanlarını idarə etmək

#### 3.2.3 Sifariş Tarixçəsi
- Keçmiş sifarişlərin siyahısını göstərmək
- Sifariş təfərrüatlarını və statusunu göstərmək
- PDF formatında fakturaları yükləmək

#### 3.2.4 İstək Siyahısı
- Saxlanmış məhsullara baxmaq
- İstək siyahısından məhsulları səbətə əlavə etmək
- Məhsulları istək siyahısından silmək

#### 3.2.5 Qiymət Sorğuları
- Toplu sifarişlər üçün qiymət sorğuları göndərmək
- Qiymət sorğusu statusuna baxmaq
- Qiymət cavablarını almaq

#### 3.2.6 Mesajlar
- Admin və ya dəstəkdən mesajlara baxmaq
- Dəstəyə mesaj göndərmək

#### 3.2.7 Fakturalar
- PDF formatında fakturaları görmək və yükləmək

### 3.3 Diler Paneli

#### 3.3.1 İdarəetmə Paneli
- Diler hesabı icmalını göstərmək
- Kredit limiti və mövcud krediti göstərmək
- Son sifarişləri və statistikanı göstərmək

#### 3.3.2 Toplu Sifariş
- Xüsusi 15% endirim ilə toplu sifarişlər vermək
- Topdansatış qiymətlərinə baxmaq

#### 3.3.3 Kredit İdarəetməsi
- Kredit limitinə baxmaq
- Kredit istifadəsinə və mövcud balansa baxmaq
- Kredit limiti artımı tələb etmək

#### 3.3.4 Satış Statistikası
- Satış hesabatlarına baxmaq
- Filtrasiya ilə sifariş tarixçəsini göstərmək

#### 3.3.5 Excel İdxal/İxrac
- Excel faylı vasitəsilə toplu sifarişləri idxal etmək
- Sifariş məlumatlarını Excel-ə ixrac etmək

### 3.4 Moderator Paneli

#### 3.4.1 İdarəetmə Paneli
- Moderator hesabı icmalını göstərmək
- Son əlavə edilmiş məhsulları və kateqoriyaları göstərmək

#### 3.4.2 Məhsul İdarəetməsi
- Yeni məhsul yaratmaq
- Mövcud məhsulları redaktə etmək
- Məhsul şəkillərini yükləmək
- Məhsul xüsusiyyətlərini təyin etmək
- Məhsul qiymətlərini təyin etmək
- Məhsul ehtiyat səviyyələrini təyin etmək
- Məhsul silmə funksiyası mövcud deyil

#### 3.4.3 Kateqoriya İdarəetməsi
- Yeni kateqoriya yaratmaq
- Mövcud kateqoriyaları redaktə etmək
- Kateqoriya şəkillərini yükləmək
- Kateqoriya silmə funksiyası mövcud deyil

### 3.5 Admin Paneli

#### 3.5.1 İdarəetmə Paneli
- Əsas göstəriciləri göstərmək: ümumi satış, sifarişlər, müştərilər
- Son sifarişləri və fəaliyyətləri göstərmək
- Analitika qrafikləri göstərmək

#### 3.5.2 Məhsul İdarəetməsi
- Məhsulları yaratmaq, redaktə etmək, silmək
- Məhsul kateqoriyalarını idarə etmək
- Məhsul variantlarını, qiymətləndirməni, ehtiyat səviyyələrini təyin etmək
- Məhsul şəkillərini və sənədlərini yükləmək

#### 3.5.3 Sifariş İdarəetməsi
- Bütün sifarişlərə baxmaq
- Sifariş statuslarını yeniləmək
- PDF formatında fakturalar yaratmaq və göndərmək
- Geri qaytarmaları və ləğvetmələri emal etmək

#### 3.5.4 Müştəri İdarəetməsi
- Müştəri siyahısına baxmaq
- Müştəri təfərrüatlarına və sifariş tarixçəsinə baxmaq
- Diler hesablarını təsdiq etmək
- Müştəri kredit limitlərini idarə etmək
- Moderator hesablarını təyin etmək və idarə etmək

#### 3.5.5 CMS İdarəetməsi
- Slayderlər və bannerləri idarə etmək
- Bloq yazıları və xəbər məqalələri yaratmaq və redaktə etmək
- Statik səhifələri idarə etmək
- SEO parametrlərini konfiqurasiya etmək: meta teqlər, sayt xəritəsi, robots.txt
- Media kitabxanasını idarə etmək: şəkillər, videolar, PDF-lər, sənədlər
- E-poçt və SMS bildiriş şablonlarını konfiqurasiya etmək
- Promosyon kampaniyaları yaratmaq və idarə etmək

#### 3.5.6 Analitika və Hesabatlar
- Satış analitikasına baxmaq: gündəlik, həftəlik, aylıq hesabatlar
- Müştəri analitikasına baxmaq
- Hesabatları ixrac etmək

#### 3.5.7 Texniki Alətlər İdarəetməsi
- Texniki hesablayıcı alətləri konfiqurasiya etmək
- Hesablama düsturlarını və parametrlərini yeniləmək
- Alətlər siyahısına yeni alət əlavə etmək
- Mövcud alətləri redaktə etmək və ya silmək

#### 3.5.8 İnteqrasiya İdarəetməsi
- WhatsApp API inteqrasiyasını konfiqurasiya etmək
- E-poçt SMTP parametrlərini konfiqurasiya etmək
- SMS şlüzünü konfiqurasiya etmək
- Google Analytics 4-ü konfiqurasiya etmək
- Meta Pixel və TikTok Pixel-i konfiqurasiya etmək

#### 3.5.9 Təhlükəsizlik Parametrləri
- İstifadəçi rollarını və icazələrini idarə etmək
- İki faktorlu autentifikasiya parametrlərini konfiqurasiya etmək
- Audit jurnallarına və fəaliyyət jurnallarına baxmaq
- Ehtiyat nüsxə və bərpa parametrlərini konfiqurasiya etmək
- Sürət məhdudiyyəti qaydalarını idarə etmək

#### 3.5.10 Tənzimləmələr
- Saytın loqosunu yükləmək və redaktə etmək (mətn və ya SVG formatında)
- Saytın başlığını ITSEC.AZ olaraq redaktə etmək
- WhatsApp sifariş nömrəsini redaktə etmək (sifarişlərin göndəriləcəyi nömrə)
- Əsas sayt parametrlərini idarə etmək

## 4. Biznes Qaydaları və Məntiq

### 4.1 İstifadəçi Qeydiyyatı və Autentifikasiya
- İstifadəçilər e-poçt və şifrə ilə qeydiyyatdan keçir
- Hesabın aktivləşdirilməsi üçün e-poçt təsdiqi tələb olunur
- İstifadəçilər təsdiqlənmiş etimadnamələrlə daxil ola bilər
- Google Authenticator vasitəsilə iki faktorlu autentifikasiyanı dəstəkləmək

### 4.2 Diler Hesabının Təsdiqi
- İstifadəçilər diler hesabı statusu üçün müraciət edə bilər
- Admin diler müraciətlərini nəzərdən keçirir və təsdiq edir
- Təsdiqlənmiş dilerlər 15% endirim ilə diler panelinə giriş əldə edir
- Dilerlər təyin edilmiş kredit limitləri alır

### 4.3 Moderator Rolu və İcazələri
- Admin istifadəçilərə moderator rolu təyin edə bilər
- Moderatorlar admin panelinə daxil ola bilər
- Moderatorlar məhsul və kateqoriya əlavə edə, redaktə edə və şəkil yükləyə bilər
- Moderatorlar məhsul və kateqoriya silə bilməz
- Silmə funksiyası yalnız admin roluna məxsusdur

### 4.4 Məhsul Müqayisəsi
- İstifadəçilər məhsul kataloqu və ya məhsul təfərrüat səhifəsindən məhsulları müqayisəyə əlavə edə bilər
- Maksimum 4 məhsul eyni vaxtda müqayisə edilə bilər
- Müqayisə səhifəsində məhsullar yan-yana göstərilir
- Məhsul xüsusiyyətləri cədvəl formatında göstərilir
- Daha yaxşı göstəriciyə malik xüsusiyyətlər vurğulanır
- Vurğulama meyarları: daha yüksək meqapiksel, daha böyük yaddaş, daha uzun məsafə, daha yüksək həlledilmə və s.

### 4.5 Qiymətləndirmə və Endirimlər
- Pərakəndə müştərilər standart qiymətləndirməni görür
- Təsdiqlənmiş dilerlər 15% endirim ilə topdansatış qiymətləndirməsini görür
- Promosyon kampaniyaları əlavə endirimlər tətbiq edə bilər

### 4.6 Sifariş Emalı
- Müştəri məhsulları səbətə əlavə edir və ödənişə keçir
- Sistem ehtiyat mövcudluğunu təsdiq edir
- Sifariş gözləmə statusu ilə yaradılır
- Admin sifarişi emal edir və statusu yeniləyir: təsdiqləndi, göndərildi, çatdırıldı
- Müştəri status dəyişiklikləri üçün e-poçt/SMS bildirişləri alır
- PDF formatında faktura yaradılır

### 4.7 Dilerlər üçün Kredit İdarəetməsi
- Dilerlər təyin edilmiş kredit limitlərinə malikdir
- Sifarişlər mövcud kreditdən çıxılır
- Ödənişlər kredit balansını bərpa edir
- Dilerlər kredit limiti artımı tələb edə bilər

### 4.8 Çoxdilli Dəstək
- İstifadəçilər başlıqdakı dil dəyişdiricisi vasitəsilə üstünlük verdikləri dili seçir: Azərbaycan (AZ), İngilis (EN), Rus (RU)
- Seçilmiş dil davamlılıq üçün localStorage-də saxlanılır
- LanguageContext UI etiketləri üçün tərcümə sətirləri təmin edir: naviqasiya etiketləri, düymə mətni, bölmə başlıqları, hero mətni, səbət etiketləri, autentifikasiya etiketləri
- Bütün məzmun seçilmiş dildə göstərilir
- Daxil olmuş istifadəçilər üçün dil üstünlüyü saxlanılır

### 4.9 Media Yükləmə və Emal
- Dəstəklənən fayl növləri: şəkillər, videolar, PDF, DOC, XLS, ZIP, APK
- Şəkillər optimallaşdırma üçün avtomatik olaraq WebP/AVIF formatlarına çevrilir
- Fayllar Supabase Storage-də saxlanılır

### 4.10 WhatsApp İnteqrasiyası
- İstifadəçilər veb-saytdakı düymə vasitəsilə WhatsApp çatını başlada bilər
- Çat +994 77 611 77 80 nömrəsinə əvvəlcədən doldurulmuş mesajla açılır

### 4.11 Mobil Tətbiq İnteqrasiyası
- Veb-sayt mobil tətbiqlər üçün linklər və məlumat təqdim edir: Hik-Connect, HikCentral Mobile, iVMS-4500, iVMS-4200, Hik-ProConnect, EZVIZ, HiLookVision

### 4.12 Təhlükəsizlik Tədbirləri
- İstifadəçi seansları üçün JWT autentifikasiyası
- Forma təqdimləri üçün CSRF qorunması
- İstifadəçi girişləri üçün XSS qarşısının alınması
- Parametrləşdirilmiş sorğular vasitəsilə SQL inyeksiyası qorunması
- Sui-istifadənin qarşısını almaq üçün sürət məhdudiyyəti
- Audit jurnalları bütün admin hərəkətlərini qeyd edir
- Verilənlər bazasının müntəzəm ehtiyat nüsxələri

## 5. İstisnalar və Sərhəd Halları

| Ssenari | İdarəetmə |
|---------|----------|
| İstifadəçi ehtiyatda olmayan məhsulu səbətə əlavə etməyə cəhd edir | \"Ehtiyatda Yoxdur\" mesajını göstərmək, \"Səbətə Əlavə Et\" düyməsini deaktiv etmək |
| Diler sifarişi mövcud kredit limitini aşır | Xəta mesajını göstərmək, sifariş təqdiminin qarşısını almaq |
| İstifadəçi şifrəni unudur | E-poçt vasitəsilə şifrə sıfırlama linki təmin etmək |
| Ödəniş zamanı ödəniş uğursuz olur | Xəta mesajını göstərmək, istifadəçiyə yenidən cəhd etməyə və ya fərqli ödəniş üsulu seçməyə icazə vermək |
| Admin mövcud sifarişləri olan məhsulu silir | Məhsul sifariş tarixçəsində qalır, lakin dayandırılmış kimi işarələnir |
| İstifadəçi dəstəklənməyən fayl növünü yükləyir | Dəstəklənən formatların siyahısı ilə xəta mesajını göstərmək |
| Excel idxalı etibarsız məlumat ehtiva edir | Təsdiqləmə xətalarını göstərmək, istifadəçiyə düzəltməyə və yenidən yükləməyə icazə vermək |
| Sifariş təqdimi zamanı şəbəkə vaxt aşımı | Xəta mesajını göstərmək, istifadəçiyə yenidən cəhd etməyə icazə vermək |
| İstifadəçi təsdiqlənmədən diler panelinə daxil olmağa cəhd edir | Gözləyən təsdiq haqqında mesaj göstərmək |
| Səhv şifrə ilə çoxsaylı giriş cəhdləri | Hesabı müvəqqəti olaraq kilidləmək, şifrə sıfırlaması tələb etmək |
| Moderator məhsul və ya kateqoriya silməyə cəhd edir | Xəta mesajını göstərmək, silmə düyməsini moderatorlar üçün gizlətmək |
| İstifadəçi 4-dən çox məhsulu müqayisəyə əlavə etməyə cəhd edir | Xəta mesajını göstərmək, maksimum limit haqqında məlumat vermək |
| Müqayisə səhifəsində məhsul xüsusiyyətləri mövcud deyil | Boş və ya \"Məlumat yoxdur\" mesajını göstərmək |

## 6. Qəbul Meyarları

1. İstifadəçi ana səhifəyə daxil olur, məhsul kataloquna baxır, məhsul seçir
2. İstifadəçi məhsulu səbətə əlavə edir və ödənişə keçir
3. İstifadəçi qeydiyyatı tamamlayır və ya daxil olur
4. İstifadəçi çatdırılma məlumatlarını daxil edir və sifarişi təsdiq edir
5. Sifariş yaradılır və istifadəçi təsdiq e-poçtu alır
6. Admin admin panelində sifarişə baxır və statusu göndərildi olaraq yeniləyir
7. İstifadəçi göndərmə bildirişi alır və istifadəçi panelində sifariş statusuna baxa bilər
8. İstifadəçi sifariş tarixçəsindən PDF formatında fakturanı yükləyir

## 7. Cari Buraxılış üçün Əhatə Dairəsindən Kənar

- Canlı çat dəstək sistemi
- Müştəri məhsul rəyləri və reytinqləri
- Loyallıq xalları və mükafat proqramı
- Qabaqcıl tövsiyə mühərriki
- Çoxvalyutalı dəstək
- Üçüncü tərəf logistika provayderlər ilə inteqrasiya
- Mobil yerli tətbiqlər (iOS/Android)
- Video dərsliklər və quraşdırma bələdçiləri
- Artırılmış reallıq məhsul önizləməsi
- Sosial media girişi (Facebook, Google)
- Abunəliyə əsaslanan məhsul təklifləri
- Avtomatlaşdırılmış inventar doldurma xəbərdarlıqları
- Müştəri istinad proqramı
- Qabaqcıl fırıldaqçılıq aşkarlama sistemi