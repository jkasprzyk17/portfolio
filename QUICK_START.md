# Quick Start Guide

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ✏️ Customization Checklist

Before deploying, make sure to update:

- [ ] **Email address** in:
  - `src/components/Hero.tsx` (line 19)
  - `src/components/Contact.tsx` (line 27)

- [ ] **Projects** in `src/data/projects.ts`:
  - Add more projects from your GitHub
  - Update descriptions
  - Add live URLs if available

- [ ] **Work Experience** in `src/data/experience.ts`:
  - Add your internships, jobs, or freelance work
  - Update descriptions and technologies

- [ ] **Bio text** in `src/components/Hero.tsx`:
  - Personalize the introduction
  - Update technologies you want to showcase

- [ ] **Metadata** in `src/app/layout.tsx`:
  - Update title and description for SEO

## 🎨 Styling

The portfolio uses a blue color scheme. To customize:
- Search for `blue-600` and `blue-400` in components
- Replace with your preferred colors
- Update Tailwind classes accordingly

## 📝 Notes

- The contact form currently logs to console. To make it functional, integrate with:
  - Email service (SendGrid, Resend, etc.)
  - Form service (Formspree, Netlify Forms, etc.)
  - Backend API

- Projects are currently static. To fetch dynamically from GitHub:
  - Use GitHub API
  - Add API route in Next.js
  - Update Projects component

## 🚢 Deployment

Easiest way: Deploy to Vercel
1. Push to GitHub
2. Import on Vercel
3. Deploy!
