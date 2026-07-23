import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Volume2 } from 'lucide-react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, CheckCircle, Package, Users, Award, Wrench, ArrowRight, BadgeCheck, CreditCard, Headphones, FileSpreadsheet, MessageCircle, Scale, Camera, Video, Router, Lock, BellRing, Monitor, Webcam, Home, Speaker, HardDrive, Cable, LayoutGrid } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchBanners, fetchFeaturedProducts, fetchCategories, resolvePrice } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Banner, Product, Category } from '@/types/types';
import WhatsAppOrderSheet from '@/components/common/WhatsAppOrderSheet';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';

const DEALER_BENEFITS = [
  { icon: BadgeCheck, key: 'dealer_benefit_1' },
  { icon: CreditCard, key: 'dealer_benefit_2' },
  { icon: Headphones, key: 'dealer_benefit_3' },
  { icon: FileSpreadsheet, key: 'dealer_benefit_4' },
];

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('camera') || n.includes('kamera')) return Camera;
  if (n.includes('nvr') || n.includes('dvr')) return Video;
  if (n.includes('şəbəkə') || n.includes('switch') || n.includes('router')) return Router;
  if (n.includes('keçid') || n.includes('giriş') || n.includes('access')) return Lock;
  if (n.includes('siqnalizasiya') || n.includes('alarm')) return BellRing;
  if (n.includes('monitor') || n.includes('tv')) return Monitor;
  if (n.includes('damafon') || n.includes('domofon')) return Webcam;
  if (n.includes('ev') || n.includes('home')) return Home;
  if (n.includes('səs') || n.includes('audio')) return Speaker;
  if (n.includes('hdd') || n.includes('sərt disk') || n.includes('ssd')) return HardDrive;
  if (n.includes('kabel') || n.includes('cable')) return Cable;
  return LayoutGrid;
};
export const HeroSlider: React.FC<{ banners: Banner[] }> = ({ banners: initialBanners }) => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  
  const DEFAULT_BANNERS: Partial<Banner>[] = [
    {
      title: "Avitel Smart Security",
      subtitle: t('hero_subtitle_1'),
      image_url: "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_99215760-6580-4f0b-83c6-b6eea3f674ac.jpg",
      button_text: t('view_details'),
      link_url: "/products?brand=avitel"
    },
    {
      title: "Hikvision Təhlükəsizlik Kameraları",
      subtitle: t('hero_subtitle_2'),
      image_url: "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_71dbc2e1-f7b4-4eb8-8267-946336d359c5.jpg",
      button_text: t('view_details'),
      link_url: "/products?brand=hikvision"
    },
    {
      title: "TP-Link Şəbəkə Avadanlıqları",
      subtitle: t('hero_subtitle_3'),
      image_url: "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_982b93e1-b588-47b8-89fe-fcc3320be8ef.jpg",
      button_text: t('view_details'),
      link_url: "/products?brand=tp-link"
    }
  ];

  const banners = initialBanners.length > 0 ? initialBanners : (DEFAULT_BANNERS as Banner[]);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayed = useRef(false);

  useEffect(() => {
    if (!settings.intro_audio_url) return;

    const audio = new Audio(settings.intro_audio_url);
    audio.onended = () => setIsPlaying(false);
    audioRef.current = audio;
    
    if (settings.intro_audio_autoplay !== 'false' && !autoPlayed.current) {
      autoPlayed.current = true;
      audio.play().then(() => setIsPlaying(true)).catch(e => {
        console.warn("Autoplay prevented by browser:", e);
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      setIsPlaying(false);
    };
  }, [settings.intro_audio_url, settings.intro_audio_autoplay]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(c => (c - 1 + banners.length) % banners.length);
  const next = useCallback(() => setCurrent(c => (c + 1) % banners.length), [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (!banners.length) return null;

  const b = banners[current];
  return (
    <div className="relative w-full overflow-hidden h-[500px] sm:h-[450px] md:h-[500px] lg:h-[580px] group bg-card">
      {/* Background image with transition */}
      <div className="absolute inset-0">
        <img src={b.image_url} alt={b.title} className="w-full h-full object-cover transition-opacity duration-700" />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Network Effect Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen text-primary overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2"/>
              <circle cx="0" cy="0" r="2" fill="currentColor" fillOpacity="0.8">
                <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="80" r="2" fill="currentColor" fillOpacity="0.8">
                <animate attributeName="r" values="1;3;1" dur="5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="80" r="2" fill="currentColor" fillOpacity="0.8">
                <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="0" r="2" fill="currentColor" fillOpacity="0.8">
                <animate attributeName="r" values="1;3;1" dur="6s" repeatCount="indefinite"/>
              </circle>
              <path d="M0,0 L80,80 M80,0 L0,80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
              </path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)">
            <animate attributeName="x" values="0;-80" dur="20s" repeatCount="indefinite"/>
            <animate attributeName="y" values="0;-80" dur="25s" repeatCount="indefinite"/>
          </rect>
        </svg>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl opacity-0 intersect:opacity-100 intersect:translate-y-0 translate-y-4 transition duration-700">
            <span className="badge-red inline-block mb-4 px-3 py-1 text-[10px] sm:text-xs tracking-widest">{settings.hero_badge_text || 'ITSEC.AZ SECURITY PLATFORM'}</span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] mb-5 tracking-tight break-words text-balance">{b.title}</h1>
            {b.subtitle && <p className="text-muted-foreground font-medium text-xs sm:text-sm md:text-base mb-8 max-w-xl text-pretty">{b.subtitle}</p>}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex flex-wrap gap-3">
                {b.button_text && b.link_url && (
                  <Link to={b.link_url} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 pulse-btn h-11 px-6 font-bold">
                      {b.button_text} <ArrowRight size={16} className="ml-1.5 arrow-bounce" />
                    </Button>
                  </Link>
                )}
                <a href={`https://wa.me/${settings.whatsapp_number || '994776117780'}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 h-11 px-6 font-bold transition-all">
                    {t('whatsapp_order')}
                  </Button>
                </a>
              </div>
              
              {/* Audio Presentation Button */}
              {settings.intro_audio_url && (
                <div className="flex items-center gap-2 mt-2 sm:mt-0 p-1.5 bg-background/40 backdrop-blur-md rounded-xl border border-primary/20">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleAudio}
                    className={`h-9 px-4 gap-2 rounded-lg font-semibold transition-all ${isPlaying ? 'bg-primary text-white shadow-md' : 'text-foreground hover:bg-primary/20 hover:text-primary'}`}
                  >
                    {isPlaying ? <Volume2 size={16} className="animate-pulse" /> : <Speaker size={16} />}
                    {isPlaying ? 'Dayandır' : 'Səsli Təqdimat'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/50 hover:bg-background/90 text-foreground flex items-center justify-center backdrop-blur-md border border-border/30 transition-all shadow-md">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/50 hover:bg-background/90 text-foreground flex items-center justify-center backdrop-blur-md border border-border/30 transition-all shadow-md">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : 'w-2 bg-foreground/40 hover:bg-foreground/70'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { t } = useLanguage();
  const [waOpen, setWaOpen] = useState(false);
  const isCompared = isInCompare(product.id);
  
  return (
    <>
      <Card className="bg-card border-border card-hover group overflow-hidden flex flex-col h-full">
        <Link to={`/products/${product.slug}`}>
          <div className="aspect-square overflow-hidden bg-muted relative">
            <img src={product.thumbnail_url ?? ''} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
            {product.is_featured && (
              <span className="absolute top-2 left-2 badge-red">Featured</span>
            )}
          </div>
        </Link>
        <div className="p-4 flex flex-col flex-1">
          {product.brands && (
            <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{product.brands.name}</div>
          )}
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center justify-between mt-auto gap-2">
            <span className="price-tag text-lg shrink-0">₼{product.price.toFixed(2)}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent text-xs h-8 px-2"
                onClick={() => addToCart(product.id)}>
                <ShoppingCart size={13} className="mr-1" />{t('add_to_cart')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Compare"
                className={`h-8 w-8 p-0 border shrink-0 ${isCompared ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:bg-muted/50'}`}
                onClick={() => isCompared ? removeFromCompare(product.id) : addToCompare(product)}
              >
                <Scale size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Order via WhatsApp"
                className="h-8 w-8 p-0 border border-green-700/60 text-green-500 hover:bg-green-900/20 shrink-0"
                onClick={() => setWaOpen(true)}
              >
                <MessageCircle size={14} />
              </Button>
            </div>
          </div>
          {product.stock_qty < 5 && product.stock_qty > 0 && (
            <p className="text-xs text-yellow-400 mt-2">{t('only_left')} {product.stock_qty} {t('items_left')}</p>
          )}
          {product.stock_qty === 0 && (
            <p className="text-xs text-destructive mt-2">{t('out_of_stock')}</p>
          )}
        </div>
      </Card>

      <WhatsAppOrderSheet
        open={waOpen}
        onClose={() => setWaOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          brand: product.brands?.name,
          price: product.price,
          dealer_price: product.dealer_price,
          warranty_months: product.warranty_months,
          category: product.categories?.name,
          model_number: product.model_number,
        }}
      />
    </>
  );
};

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { profile } = useAuth();
  const role = profile?.role || 'customer';
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    fetchBanners().then(setBanners).catch(console.error);
    fetchFeaturedProducts(8).then(setProducts).catch(console.error);
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const stats = [
    { icon: Package,  value: '2500+', key: 'stat_products' },
    { icon: Wrench,   value: '3500+', key: 'stat_projects' },
    { icon: Users,    value: '5000+', key: 'stat_customers' },
    { icon: Award,    value: '100%',  key: 'stat_warranty' },
  ];

  const features = [
    { icon: Star,        title: t('feat_cart'),        desc: t('feat_cart_desc') },
    { icon: CheckCircle, title: t('feat_compare'),     desc: t('feat_compare_desc') },
    { icon: Users,       title: t('dealer_title'),     desc: t('feat_dealer_desc') },
    { icon: Package,     title: t('feat_lang'),        desc: t('feat_lang_desc') },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <HeroSlider banners={banners} />

      {/* ── Stats bar ── */}
      <div className="border-y border-border bg-secondary/60">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-primary" />
              </div>
              <div>
                <div className="text-xl font-black text-foreground leading-none">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t(s.key)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 space-y-16">

        {/* ── Brands bar ── */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-6">{t('official_distributor')}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <Link to="/products?brand=avitel" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">AVITEL</Link>
            <Link to="/products?brand=hikvision" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">HIKVISION</Link>
            <Link to="/products?brand=tp-link" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">TP-LINK</Link>
            <Link to="/products?brand=dahua" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">DAHUA</Link>
            <Link to="/products?brand=uniview" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">UNIVIEW</Link>
            <Link to="/products?brand=tvt" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">TVT</Link>
            <Link to="/products?brand=unifi" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">UNIFI</Link>
            <Link to="/products?brand=cisco" className="text-base font-black text-muted-foreground/60 hover:text-primary transition-colors tracking-widest">CISCO</Link>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Categories ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground red-stripe pl-3">{t('browse_category')}</h2>
            <Link to="/products" className="flex items-center gap-1 text-sm text-primary hover:underline">
              {t('view_all')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map(cat => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <Link key={cat.id} to={`/products?category=${cat.slug}`}>
                  <Card className="bg-[#f4f5f6] dark:bg-muted border-none overflow-hidden group rounded-2xl hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300 flex flex-col h-full items-center justify-between p-5 min-h-[160px]">
                    <div className="w-full flex-1 relative mb-3 flex items-center justify-center">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name}
                          className="max-h-[100px] w-auto object-contain group-hover:scale-105 transition-transform duration-400" />
                      ) : (
                        <Icon size={48} className="text-muted-foreground/30 group-hover:scale-105 transition-transform duration-400" />
                      )}
                    </div>
                    <div className="text-center mt-auto w-full">
                      <div className="text-primary mb-1.5 flex justify-center">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-[13px] sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{cat.name}</h3>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Featured Products ── */}
        {products.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-foreground red-stripe pl-3">{t('featured_products')}</h2>
              <Link to="/products" className="flex items-center gap-1 text-sm text-primary hover:underline">
                {t('view_all')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* ── Promo Brand Full Poster Showcase ── */}
        {settings.show_promo_brand !== 'false' && (
          <section className="rounded-2xl overflow-hidden border border-primary/25 relative group" style={{ background: 'linear-gradient(135deg, hsl(222 35% 7%) 0%, hsl(222 30% 10%) 60%, hsl(0 60% 10%) 100%)' }}>
            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="particle" style={{
                  left: `${Math.random() * 100}%`,
                  bottom: `-${Math.random() * 20}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 4 + 4}s`,
                  background: Math.random() > 0.5 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.8)',
                  boxShadow: '0 0 10px hsl(var(--primary))'
                }} />
              ))}
            </div>
            
            {/* Background glow blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />

            <div className="relative z-10 p-6 md:p-10">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <span className="badge-red">{t('official_partner')}</span>
                    <span className="text-[10px] sm:text-xs border border-primary/30 text-primary rounded px-2 py-0.5 font-semibold">{t('az_premium_brand')}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance" style={{ color: 'hsl(0 0% 96%)' }}>
                    {settings.promo_brand || 'AVITEL'}
                  </h2>
                  <p className="text-primary font-bold text-xs sm:text-sm uppercase tracking-widest mt-1 text-pretty">{settings.promo_brand_subtitle || 'Smart Security Cameras — Azerbaijan'}</p>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-3 shrink-0">
                  <Link to={`/products?brand=${(settings.promo_brand || 'avitel').toLowerCase()}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 pulse-btn">
                      {t('all_models')} <ArrowRight size={15} className="ml-1 arrow-bounce text-white" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* 3-camera product grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {(products.filter(p => p.brands?.name?.toLowerCase() === (settings.promo_brand || 'avitel').toLowerCase()).slice(0, 3).length > 0
                  ? products.filter(p => p.brands?.name?.toLowerCase() === (settings.promo_brand || 'avitel').toLowerCase()).slice(0, 3)
                  : products.slice(0, 3)
                ).map((p, i) => (
                  <Link key={p.id} to={`/products/${p.slug}`} className={`group ${i === 1 ? 'md:scale-105 md:-mt-2' : ''}`}>
                    <div className={`rounded-xl overflow-hidden transition-all shadow-lg h-full flex flex-col ${i === 1 ? 'border border-primary/40 bg-primary/8 hover:bg-primary/12 hover:border-primary/60 shadow-primary/10' : 'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40'}`}>
                      <div className="aspect-square overflow-hidden bg-white/5 relative shrink-0">
                        <img src={p.thumbnail_url ?? ''}
                          alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        {i === 1 ? (
                           <>
                             <span className="absolute top-3 left-3 badge-red text-[9px]">⭐ BESTSELLER</span>
                             {p.name.includes('4K') && <span className="absolute top-3 right-3 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">4K</span>}
                           </>
                        ) : i === 0 ? (
                           <span className="absolute top-3 left-3 badge-red text-[9px]">AI DETECT</span>
                        ) : (
                           <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">PTZ</span>
                        )}
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-bold text-xs leading-snug line-clamp-2">{p.name}</p>
                          <p className="text-white/60 text-xs truncate mt-0.5">{p.categories?.name || 'Security Camera'}</p>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between mt-auto">
                        <span className="price-tag text-lg font-black">₼{resolvePrice(p, role).toFixed(2)}</span>
                        {resolvePrice(p, role) < p.price && <span className="text-xs text-white/50 line-through">₼{p.price.toFixed(2)}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom: feature pills + trust row */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {['4K Ultra HD', 'AI Human/Vehicle Detect', 'ColorNight Vision', 'IP67 Waterproof', 'Cloud App', '24mo Warranty'].map(f => (
                    <span key={f} className="text-xs bg-white/8 text-white/70 border border-white/10 px-2.5 py-1 rounded-md">{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 shrink-0">
                  <CheckCircle size={12} className="text-primary" />
                  <span>itsec.az — {(settings.promo_brand || 'Avitel').toLowerCase()} {t('official_distributor').toLowerCase()}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Bottom Promo Showcase ── */}
        {settings.show_promo_bottom !== 'false' && (
          <section className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <span className="badge-red inline-block mb-4 w-fit">{settings.promo_bottom_subtitle || 'Hikvision Smart Technology Center'}</span>
                <h2 className="text-2xl font-black text-foreground mb-3">{settings.promo_bottom_title || 'AcuSense & ColorVu Technology'}</h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-sm">
                  {t('promo_bottom_desc')}
                </p>
                <Link to={`/products?brand=${(settings.promo_bottom_subtitle || 'hikvision').toLowerCase().split(' ')[0]}`} className="w-fit">
                  <Button className="bg-primary text-primary-foreground hover:bg-accent">
                    {t('view_details')} <ArrowRight size={15} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="overflow-hidden min-h-56">
                <img src={settings.promo_bottom_image || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f06aa236-b5fc-4d42-8af8-7425ce2f747f.jpg"}
                  alt="Promo Banner" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>
        )}

        {/* ── Dealer CTA ── */}
        <section className="rounded-lg overflow-hidden relative" style={{ background: 'var(--gradient-dealer)' }}>
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative z-10 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="badge-red inline-block mb-4">{t('become_dealer')}</span>
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">{t('dealer_title')}</h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t('dealer_desc')}</p>
                <Link to="/dealer">
                  <Button className="bg-primary text-primary-foreground hover:bg-accent">
                    {t('dealer_apply')} <ArrowRight size={15} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DEALER_BENEFITS.map(({ icon: Icon, key }) => (
                  <div key={key} className="bg-background/10 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                    <Icon size={20} className="text-primary" />
                    <span className="text-xs font-medium text-foreground leading-snug">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Platform Features ── */}
        <section>
          <h2 className="text-xl font-black text-foreground red-stripe pl-3 mb-6">{t('platform_features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <Card key={f.title} className="bg-card border-border p-5 card-hover">
                <f.icon size={22} className="text-primary mb-3" />
                <h3 className="text-sm font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── About Us & Team ── */}
        {(settings.about_us_title || settings.team_members) && (
          <section className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* About Us */}
              {settings.about_us_title && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-foreground red-stripe pl-3">{settings.about_us_title || 'Haqqımızda'}</h2>
                  {settings.about_us_image && (
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img src={settings.about_us_image} alt="About Us" className="w-full aspect-video object-cover" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {settings.about_us_text || 'Azərbaycanda təhlükəsizlik kameraları...'}
                  </p>
                </div>
              )}

              {/* Team Members */}
              {settings.team_members && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-foreground red-stripe pl-3">İşləyən Mütəxəssislər</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(() => {
                      try {
                        const team = JSON.parse(settings.team_members);
                        return team.map((member: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground leading-none">{member.name}</p>
                              <p className="text-xs text-muted-foreground mt-1 leading-none">{member.role}</p>
                            </div>
                          </div>
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Custom Quote CTA ── */}
        <section className="border border-border rounded-lg p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-foreground mb-2">{t('custom_quote')}</h2>
            <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">{t('custom_quote_desc')}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://wa.me/994776117780" target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-800 hover:bg-green-700 text-white">WhatsApp: +994 77 611 77 80</Button>
              </a>
              <Link to="/tools">
                <Button variant="ghost" className="border border-border text-foreground hover:bg-muted">{t('use_smart_tools')}</Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;
