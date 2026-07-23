import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, Shield, QrCode, Download, Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

const SITE_URL = 'https://itsec.az';

import { useSettings } from '@/contexts/SettingsContext';

const QRWidget: React.FC = () => {
  const handleDownload = () => {
    const canvas = document.querySelector('.qr-code-container img') as HTMLImageElement | null;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.src;
    a.download = 'itsec-az-qr.png';
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-2.5 rounded-lg shadow-md inline-block">
        <QRCodeDataUrl
          text={SITE_URL}
          width={96}
          color="#CC0000"
          backgroundColor="#ffffff"
        />
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <Download size={12} />
        Download QR
      </button>
    </div>
  );
};

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();

  const productLinks: [string, string][] = [
    [t('cat_ip'),       '/products?category=ip-cameras'],
    [t('cat_analog'),   '/products?category=analog-cameras'],
    [t('cat_dvr'),      '/products?category=dvr-nvr'],
    [t('cat_switches'), '/products?category=switches'],
    [t('cat_access'),   '/products?category=access-control'],
    [t('cat_ptz'),      '/products?category=ptz-cameras'],
    [t('cat_alarms'),   '/products?category=alarms'],
  ];

  const serviceLinks: [string, string][] = [
    ['Smart Tools',         '/tools'],
    [t('dealer_title'),      '/dealer'],
    ['Blog & News',         '/blog'],
    [t('nav_contact'),       '/contact'],
    [t('footer_about'),      '/about'],
    [t('footer_privacy'),    '/privacy'],
  ];

  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              {settings.site_logo ? (
                <img src={settings.site_logo} alt={settings.site_title} className="h-8 object-contain" />
              ) : (
                <span className="text-xl font-black text-foreground tracking-tight">{settings.site_title || 'itsec.az'}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Professional security systems distributor. Official partner of Hikvision, Dahua, TP-Link, and other leading brands.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield size={13} className="text-primary shrink-0" />
              <span>Official Authorized Distributor</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 red-stripe pl-3">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 red-stripe pl-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {serviceLinks.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QR Code */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 red-stripe pl-3">
              <span className="flex items-center gap-1.5"><QrCode size={13} className="text-primary" />Scan to Visit</span>
            </h4>
            <QRWidget />
            <p className="text-xs text-muted-foreground mt-3 text-center">{SITE_URL}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 red-stripe pl-3">{t('nav_contact')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground mb-4">
              <li>
                <a href="tel:+994776117780" className="flex items-start gap-2 hover:text-primary transition-colors">
                  <Phone size={13} className="text-primary mt-0.5 shrink-0" />+994 77 611 77 80
                </a>
              </li>
              <li>
                <a href="mailto:info@itsec.az" className="flex items-start gap-2 hover:text-primary transition-colors">
                  <Mail size={13} className="text-primary mt-0.5 shrink-0" />info@itsec.az
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
                  <span>Baku, Azadliq prospekti 143</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <Clock size={13} className="text-primary mt-0.5 shrink-0" />
                  <span>09:00–18:00 (Mon–Sat)</span>
                </div>
              </li>
            </ul>

            <h4 className="text-sm font-bold text-foreground mb-3 mt-6">Bizi İzləyin</h4>
            <div className="flex gap-2">
              <a href="https://wa.me/994776117780" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com/itsec.az" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://tiktok.com/@itsec.az" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-black hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.16-3.44-3.37-3.46-5.7-.02-1.29.28-2.58.89-3.71C3.82 11.23 5.92 9.53 8.32 9.17v4.06c-.84.22-1.57.73-2.06 1.45-.63.92-.72 2.12-.22 3.12.5.99 1.51 1.63 2.63 1.63 1.52.01 2.82-1.16 2.96-2.67.01-.13.01-.26.01-.39V.02h.88z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Brand logos */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-5">Rəsmi Distribyutor</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-black tracking-widest text-muted-foreground/50 uppercase">
            {['AVITEL', 'HIKVISION', 'TP-LINK', 'Dahua', 'UNIVIEW', 'tvt', 'unifi', 'CISCO'].map(b => (
              <span key={b} className="hover:text-foreground transition-colors cursor-pointer">{b}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2025 itsec.az — {t('footer_rights')}</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">{t('footer_privacy')}</Link>
            <Link to="/about" className="hover:text-primary transition-colors">{t('footer_terms')}</Link>
          </div>
        </div>
        <div className="mt-6 text-center text-[11px] text-muted-foreground/50 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
          Powered by <a href="#" className="hover:text-primary transition-colors">jozef</a>
        </div>
      </div>
    </footer>
  );
};
