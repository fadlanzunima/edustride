# Internationalization (i18n) Documentation

## Overview

EduStride menggunakan `next-intl` untuk internationalization dengan dukungan 2 bahasa:
- 🇮🇩 **Bahasa Indonesia** (Default)
- 🇬🇧 **English**

## Struktur File

```
edustride/
├── messages/
│   ├── id.json          # Bahasa Indonesia
│   └── en.json          # English
├── lib/i18n/
│   └── config.ts        # Konfigurasi i18n
├── components/
│   └── language-switcher/
│       └── language-switcher.tsx
└── middleware.ts        # Routing middleware
```

## Cara Menggunakan

### 1. Di Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("about");
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("vision.content")}</p>
    </div>
  );
}
```

### 2. Di Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations();
  
  return (
    <button>{t("navigation.login")}</button>
  );
}
```

### 3. Dengan Namespace

```tsx
const t = useTranslations("features");

// Mengakses: features.autoPortfolio.title
t("autoPortfolio.title");
```

## Format Translation File

```json
{
  "metadata": {
    "title": "EduStride",
    "description": "Platform edukasi..."
  },
  "navigation": {
    "home": "Beranda",
    "about": "Tentang"
  },
  "hero": {
    "title": "Bangun Portofolio...",
    "cta": "Mulai Sekarang"
  }
}
```

## Language Switcher

```tsx
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";

// Di header atau navigation
<LanguageSwitcher />
```

## Routing

### URL Structure

- `/id/landing` - Bahasa Indonesia
- `/en/landing` - English
- `/` - Redirect ke `/id/landing` (default)

### Navigation dengan Locale

```tsx
import { Link } from "next-intl";

// Link akan otomatis include locale
<Link href="/about">About</Link>

// Output: /id/about atau /en/about
```

## Menambah Bahasa Baru

1. Buat file translation baru di `messages/[locale].json`
2. Tambahkan locale ke array di `lib/i18n/config.ts`
3. Update `next.config.ts` dengan locale baru
4. Tambahkan flag dan label di `components/language-switcher/language-switcher.tsx`

## Best Practices

### 1. Gunakan Namespace

```tsx
// ✅ Good
const t = useTranslations("features");
t("autoPortfolio.title");

// ❌ Avoid
const t = useTranslations();
t("features.autoPortfolio.title");
```

### 2. Interpolasi

```json
{
  "greeting": "Halo, {name}!"
}
```

```tsx
t("greeting", { name: "Budi" });
// Output: Halo, Budi!
```

### 3. Pluralization

```json
{
  "items": {
    "one": "{count} item",
    "other": "{count} items"
  }
}
```

```tsx
t("items", { count: 5 });
// Output: 5 items
```

### 4. Rich Text

```tsx
t.rich("description", {
  strong: (chunks) => <strong>{chunks}</strong>,
  link: (chunks) => <a href="/about">{chunks}</a>
});
```

## Testing Translations

1. **Manual Testing:**
   - Switch bahasa via Language Switcher
   - Verify semua text berubah
   - Check URL berubah (/id/ → /en/)

2. **Automated Testing:**
   ```tsx
   // Test component dengan locale
   render(
     <NextIntlClientProvider locale="id" messages={messages}>
       <Component />
     </NextIntlClientProvider>
   );
   ```

## Common Issues

### 1. "Cannot find module"
```bash
# Pastikan next-intl terinstall
npm install next-intl
```

### 2. Locale not found
```tsx
// Pastikan locale valid
if (!locales.includes(locale)) {
  notFound();
}
```

### 3. Static Generation
```tsx
// Generate static params untuk semua locale
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```
