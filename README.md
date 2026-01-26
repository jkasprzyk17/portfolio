# Jakub Kasprzyk - Mobile Software Engineer Portfolio

A modern, professional developer portfolio showcasing 3.5 years of commercial experience in mobile development. Built with Next.js, TypeScript, and Tailwind CSS. Inspired by modern portfolio designs with smooth animations and a clean, responsive layout.

## 👨‍💻 About

Mobile Software Engineer with 3.5 years of commercial experience, programming since age 15. Specializing in React Native, Expo, and cross-platform mobile development. Based in Kraków, Poland.

**Technologies:** React Native, Expo, TypeScript, Kotlin, Swift, Flutter, Node.js, Firebase, AI/ML Integration

## ✨ Features

- 🎨 **Modern Design** - Clean, professional layout with smooth animations
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized for speed with Next.js
- 🌙 **Dark Mode** - Automatic dark mode support
- ✨ **Smooth Animations** - Powered by Framer Motion
- 🎯 **SEO Optimized** - Built-in SEO best practices
- 🖼️ **Visual Portfolio** - Company logos and project images

## 📋 Sections

1. **Hero/Bio** - Introduction with skills, experience, and social links
2. **Work Experience** - Professional journey with detailed project breakdowns
3. **Own Projects** - Personal projects showcasing innovation
4. **Contact** - Social media links (GitHub, LinkedIn, Twitter)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 💼 Work Experience

### Mobile Software Engineer @ App Magic
**Oct 2025 – Present** | Remote

- **TapNote** - AI-powered note-taking and study app (iOS & Android)
  - AI-generated notes from audio, text, and images
  - Interactive flashcards with spaced repetition
  - Cross-platform synchronization
  - Technologies: React Native, Flutter, Kotlin, Swift, TypeScript, Node.js, AI/ML APIs

### Intern @ Software Mansion / SWM
**Mar 2025 – Apr 2025** | Kraków, PL

- **Radon IDE** - VSCode/Cursor extension for React Native and Expo development
  - Full IDE capabilities within VSCode/Cursor
  - Enhanced debugging and development tools
  - Technologies: TypeScript, VSCode Extension API, React Native, Expo, Node.js

### Mobile Software Engineer @ MMLab Cloud / MyMusic
**Dec 2022 – Dec 2025** | Kraków, PL

- **MUGO** - Global music distribution and artist promotion platform
  - Music distribution to 150+ streaming platforms
  - Real-time analytics and promotion tools
  - Technologies: React Native, Kotlin, Swift, TypeScript, Firebase, REST APIs, CI/CD

- **JustWin** - Gamified mobile application
  - Challenge-based gamification system
  - User engagement and social features
  - Technologies: React Native, Kotlin, Swift, TypeScript, Firebase, REST APIs, CI/CD

## 🚀 Own Projects

### Miniliga
**Feb 2025 – Present**

Platform for managing amateur and semi-professional football leagues with both web and mobile applications.

**Features:**
- Team management and league organization
- Match scheduling and results tracking
- Real-time statistics and standings
- Push notifications for match updates
- Mobile app for iOS and Android
- Web dashboard for administrators

**Technologies:** React Native, TypeScript, Next.js, Node.js, PostgreSQL, Expo, Tailwind CSS

## 🛠️ Customization

### Update Personal Information

1. **Hero Section**: Edit `src/components/Hero.tsx`
   - Update name, location, bio text
   - Modify technologies array
   - Update social links

2. **Projects**: Edit `src/data/projects.ts`
   - Add or modify project entries
   - Update descriptions, technologies, and links
   - Add project images to `public/images/`

3. **Experience**: Edit `src/data/experience.ts`
   - Add work experience entries
   - Update job titles, companies, and descriptions
   - Add company/project logos to `public/images/`

4. **Contact**: Edit `src/components/Contact.tsx`
   - Update social media links

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component-specific styles are inline with Tailwind classes

### Colors & Theme

The portfolio uses a blue accent color scheme. To change:
- Update Tailwind classes in components (search for `blue-600`, `blue-400`, etc.)
- Modify CSS variables in `globals.css` for dark mode

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Navigation.tsx   # Navigation bar
│   │   ├── Hero.tsx         # Hero/Bio section
│   │   ├── Projects.tsx     # Projects showcase
│   │   ├── Experience.tsx   # Work experience
│   │   └── Contact.tsx      # Contact section
│   └── data/
│       ├── projects.ts      # Projects data
│       └── experience.ts   # Experience data
├── public/
│   └── images/             # Company logos, project images, profile photo
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

## 🛠️ Technologies Used

### Portfolio Stack
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Development Skills
- **Mobile:** React Native, Expo, Flutter, Kotlin, Swift
- **Web:** React, Next.js, TypeScript
- **Backend:** Node.js, REST APIs, Firebase
- **Tools:** CI/CD, Git, VSCode Extension API
- **AI/ML:** AI/ML APIs, Machine Learning Integration

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

The portfolio can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🎯 Future Enhancements

- [ ] Add blog section
- [ ] Integrate GitHub API for dynamic project fetching
- [ ] Add project filtering by technology
- [ ] Add testimonials section
- [ ] Add analytics
- [ ] Add more project screenshots
- [ ] Add case studies for major projects

## License

This project is open source and available under the MIT License.

## Contact

Jakub Kasprzyk
- GitHub: [@jkasprzyk17](https://github.com/jkasprzyk17)
- LinkedIn: [jakub-kasprzyk](https://www.linkedin.com/in/jakub-kasprzyk/)
- Twitter: [@jkasprzyk17](https://x.com/jkasprzyk17)
