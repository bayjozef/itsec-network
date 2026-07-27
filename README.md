# PROSECURITY.AZ — Security Systems E-Commerce Platform

Azerbaijan's #1 professional security systems platform. Official distributor of Hikvision, Dahua, TP-Link.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Hosting | Render.com (static site) |
| CI/CD | GitHub Actions |

---

## ✅ Working Features

### 🛒 E-Commerce
- Product catalog with search, filter by category/brand/price
- Product detail pages with specs, gallery, stock status
- Shopping cart with quantity management
- Checkout with shipping form → order record in Supabase
- Order history & detail pages

### 👤 User Accounts
- Sign up / Sign in / Sign out (Supabase Auth)
- Profile page with **avatar upload** (auto-compressed WebP)
- Wishlist (save & remove products)
- Order tracking per user

### 📸 Image System (Fully Working)
| Location | Bucket | Feature |
|----------|--------|---------|
| Product thumbnails | `products` | Admin upload + drag-drop + URL paste |
| Site banners | `banners` | Drag-drop, aspect-ratio preview |
| Blog post covers | `blog` | Upload with live preview |
| User avatars | `avatars` | Crop-and-upload, hover to change |
- Auto-compress images >1 MB → WebP at ≤1080p, quality 0.8
- Live progress bar (10% → 25% → 50% → 85% → 100%)
- Success / error toasts
- Public URLs via Supabase Storage (CDN)

### 💬 WhatsApp Ordering
- Order sheet from product cards, product detail, cart
- Quantity selector, quality type (Standard / Premium / Bulk)
- Contract terms checkboxes (installment, delivery, install, warranty, invoice)
- Notes field
- Auto-generates professional message in AZ / EN / RU
- Send directly to WhatsApp or copy to clipboard

### 🏪 Dealer Portal
- Dealer application form
- Dealer dashboard with wholesale pricing (15% off)
- Application status tracking

### 🌐 Multi-language
- Azerbaijani, English, Russian
- Persisted in localStorage

### 🌙 Dark / Light Mode
- Lamp toggle in header
- System preference detection
- Persisted in localStorage

### 🔧 Technical Tools (`/tools`)
- Cable length calculator
- IP camera bandwidth estimator
- Resolution comparison chart

### 📊 Admin Panel (`/admin`)
- Dashboard with stats
- Products CRUD + image upload
- Banner management + image upload
- Blog/News CRUD + image upload
- Order management
- Quote requests
- Customer list

### 📱 QR Code
- Footer QR code for prosecurity.az
- One-click PNG download

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://kdjwhelicqfjxrfjooaq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> Get these from: [Supabase Dashboard](https://supabase.com) → Your Project → Settings → API

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# 3. Start dev server
npm run dev
```

Open: http://localhost:5173

---

## 🏗️ Build for Production

```bash
npm run build
# Output goes to /dist folder
```

---

## 🌐 Deploy to Render.com (Step-by-Step)

### Method A — From GitHub (Recommended + Auto CI/CD)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — PROSECURITY.AZ"
   git remote add origin https://github.com/YOUR_USERNAME/prosecurity-az.git
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com) → Sign in → **New** → **Blueprint**
   - Connect your GitHub account
   - Select the `prosecurity-az` repository
   - Render auto-reads `render.yaml` ✅

3. **Add Environment Variables in Render Dashboard**
   - Go to your Service → **Environment**
   - Add:
     - `VITE_SUPABASE_URL` = `https://kdjwhelicqfjxrfjooaq.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = your anon key

4. **Click Deploy** — Live in ~2 minutes ✅

### Method B — Manual Static Site (from ZIP)

1. Download `prosecurity-az-source.zip`
2. Extract it
3. Go to [render.com](https://render.com) → **New** → **Static Site**
4. Choose **"Deploy from a public Git repository"** OR upload via GitHub
5. Set:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
6. Add environment variables (same as Method A)
7. Deploy ✅

### render.yaml Configuration (already included)
```yaml
services:
  - type: web
    name: prosecurity-az
    runtime: static
    buildCommand: npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html   # SPA routing fix
```

---

## 🔐 Admin Access

| Field | Value |
|-------|-------|
| URL | `/auth` |
| Email | `admin@prosecurity.az` |
| Password | `Admin@ProSecurity2026` |

---

## 📦 Supabase Storage Buckets

| Bucket | Used For | Public |
|--------|----------|--------|
| `products` | Product thumbnail images | ✅ |
| `banners` | Hero / promo banners | ✅ |
| `avatars` | User profile photos | ✅ |
| `blog` | Blog post cover images | ✅ |

All buckets have RLS policies configured. Files are publicly readable, write requires auth.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ImageUpload.tsx        # ← Image upload system
│   │   ├── WhatsAppOrderSheet.tsx # ← WA order sheet
│   │   ├── ProtectedRoute.tsx
│   │   └── PageMeta.tsx
│   ├── layouts/
│   │   ├── Header.tsx             # ← Lang switcher + theme toggle
│   │   ├── Footer.tsx             # ← QR code widget
│   │   ├── MainLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── UserLayout.tsx
│   └── ui/                        # shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── LanguageContext.tsx        # AZ/EN/RU
│   └── ThemeContext.tsx           # Dark/Light
├── pages/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── ToolsPage.tsx
│   ├── BlogPage.tsx
│   ├── ContactPage.tsx
│   ├── admin/                     # Admin panel pages
│   └── user/                      # User dashboard pages
├── services/
│   └── api.ts                     # All Supabase queries
└── types/
    └── types.ts
```

---

## 🔄 CI/CD with GitHub Actions

The `.github/workflows/deploy.yml` file:
- Triggers on every push to `main`
- Runs `npm run lint`
- Runs `npm run build`
- Uploads build artifact
- Render auto-deploys from `render.yaml`

---

## 📞 Support

- WhatsApp: +994 77 611 77 80
- Website: prosecurity.az

