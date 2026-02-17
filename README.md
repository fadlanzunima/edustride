# EduStride

Platform edukasi terpadu untuk membangun portofolio digital dan skill dari SMA hingga S3.

## 🎯 Visi

Membangun ekosistem pendidikan yang memfasilitasi pelajar Indonesia untuk membangun portofolio digital dan skill yang relevan dengan industri 2026, mencakup transisi dari SMA ke perguruan tinggi hingga jenjang pakar (S3).

## ✨ Fitur Utama

- **🎨 Auto-Portfolio Generator** - Generate portofolio otomatis dari data pengguna
- **🗺️ Smart Skill Roadmap** - Roadmap skill yang dipersonalisasi berdasarkan level pendidikan
- **🌐 Multi-Language Support** - Dukungan Bahasa Indonesia & English
- **📱 Responsive Design** - Mobile-first approach untuk semua device
- **🎯 Level-Based Experience** - UI yang berbeda untuk SMA, S1, dan S2/S3

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) dengan App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Animation:** [Motion](https://motion.dev/) (Framer Motion)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)
- **Internationalization:** [next-intl](https://next-intl.dev/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🌍 Internationalization (i18n)

EduStride mendukung 2 bahasa:

- 🇮🇩 **Bahasa Indonesia** (Default)
- 🇬🇧 **English**

### Struktur i18n

```
├── messages/
│   ├── id.json          # Bahasa Indonesia
│   └── en.json          # English
├── src/i18n/
│   └── request.ts       # i18n configuration
├── middleware.ts        # Locale routing middleware
└── next-intl.config.ts  # next-intl configuration
```

### Cara Menggunakan

1. **Language Switcher** - Terdapat di navbar untuk mengganti bahasa
2. **Auto-detection** - Bahasa otomatis terdeteksi dari browser
3. **URL Routing** - Format: `/id/dashboard` atau `/en/dashboard`

### Menambah Translation

Tambahkan key di `messages/id.json` dan `messages/en.json`:

```json
// messages/id.json
{
  "header": {
    "title": "EduStride",
    "description": "Platform edukasi terpadu"
  }
}

// messages/en.json
{
  "header": {
    "title": "EduStride",
    "description": "Integrated education platform"
  }
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Mobile-First Approach

Semua komponen didesain mobile-first dengan touch target minimum 44x44px.

## 🎯 Level-Based UI

Platform menyesuaikan tampilan berdasarkan level pendidikan:

### SMA (High School)
- Warna tema: Cyan/Lime (enerjik)
- Fokus: Eksplorasi minat, persiapan SNBT
- Widget: Interactive Career Explorer

### S1 (Undergraduate)
- Warna tema: Deep Blue/Indigo (profesional)
- Fokus: Magang, organisasi, portofolio
- Widget: Live Portfolio Preview

### S2/S3 (Graduate)
- Warna tema: Charcoal/Gold (elegan)
- Fokus: Riset, publikasi jurnal
- Widget: Research Impact Tracker

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/fadlanzunima/edustride.git
cd edustride

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
edustride/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── (landing)/          # Landing page group
│   │   ├── (dashboard)/        # Dashboard group
│   │   ├── about/              # About page
│   │   └── layout.tsx          # Locale layout dengan i18n provider
│   ├── api/                    # API routes
│   ├── layout.tsx              # Root layout
│   └── globals.css
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── bento-grid/             # Bento grid components
│   ├── level-switcher/         # Level switcher components
│   ├── language-switcher/      # Language switcher component
│   └── widgets/                # Dashboard widgets
├── lib/                        # Utilities & configurations
│   ├── utils.ts
│   ├── store/                  # Zustand stores
│   └── data/                   # Static data & constants
├── messages/                    # Translation files
│   ├── id.json
│   └── en.json
├── src/i18n/                   # i18n configuration
│   └── request.ts
├── types/                       # TypeScript types
└── middleware.ts               # Next.js middleware untuk i18n routing
```

## 🧪 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Buat file `.env.local`:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# (Tambahkan variabel lain sesuai kebutuhan)
```

## 📚 Documentation

- **[Responsive Design Guidelines](docs/responsive-design.md)** - Panduan lengkap responsive design
- **[i18n Guide](docs/i18n-guide.md)** - Panduan penggunaan internationalization

## 🗺️ Roadmap

- [x] Setup project & core components
- [x] Multi-language support (ID/EN)
- [x] Responsive design
- [ ] Authentication (NextAuth.js)
- [ ] Database integration (PostgreSQL/Supabase)
- [ ] Portfolio builder
- [ ] Skill hub & roadmap
- [ ] LinkedIn integration
- [ ] PWA support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Fadlan** - [GitHub](https://github.com/fadlanzunima)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
