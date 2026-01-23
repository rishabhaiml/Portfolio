# 🍥 Naruto-Themed Portfolio

An immersive, animation-rich personal portfolio website built with **SvelteKit** featuring a stunning Naruto theme with Sharingan evolution and Kamui effects.

## ✨ Features

### 🔴 Sharingan Evolution System
- **5-stage eye evolution** that progresses as you scroll:
  - 1-Tomoe Sharingan (Hero)
  - 2-Tomoe Sharingan (Skills)
  - 3-Tomoe Sharingan (Projects)
  - Mangekyou Sharingan (Experience)
  - Rinnegan (Contact)

### 🌀 Visual Effects
- **Kamui Transitions** - Portal-style spiral effects
- **Chakra Particles** - Interactive floating particle system
- **Shadow Clone Effect** - Cards duplicate on hover
- **Amaterasu Flames** - Subtle fire accents

### 🎮 Easter Eggs
- **Konami Code** (↑↑↓↓←→←→BA) - Activates Sage Mode theme
- **Hokage Mode** - Unlocked when all sections are visited

### 📱 Responsive Design
Works beautifully on mobile, tablet, and desktop.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── SharinganEye.svelte      # Animated eye with 5 stages
│   │   ├── KamuiTransition.svelte   # Portal transition effect
│   │   ├── ChakraParticles.svelte   # Background particles
│   │   ├── JutsuCard.svelte         # Skill/project cards
│   │   ├── NinjaTimeline.svelte     # Experience timeline
│   │   ├── NinjaNavigation.svelte   # Navigation with eye indicator
│   │   └── RasenganLoader.svelte    # Loading animation
│   ├── sections/
│   │   ├── HeroSection.svelte       # Landing with Sharingan reveal
│   │   ├── SkillsSection.svelte     # Skills as jutsu cards
│   │   ├── ProjectsSection.svelte   # Projects as scrolls
│   │   ├── ExperienceSection.svelte # Timeline journey
│   │   └── ContactSection.svelte    # Rinnegan finale
│   └── stores/
│       └── index.ts                 # Svelte stores for state
├── routes/
│   ├── +layout.svelte               # Root layout
│   └── +page.svelte                 # Main page
└── app.css                          # Global styles
```

## 🎨 Color Palette

| Color | Hex | Use |
|-------|-----|-----|
| Background | `#0a0a0a` | Primary dark |
| Sharingan Red | `#E63946` | Sharingan accents |
| Rinnegan Purple | `#8B5CF6` | Rinnegan accents |
| Chakra Blue | `#3B82F6` | Highlights & links |
| Text | `#F5F5F5` | Primary text |

## ⚡ Tech Stack

- **SvelteKit** - Framework
- **GSAP** - Advanced animations
- **TypeScript** - Type safety
- **Canvas API** - Particle effects

## ♿ Accessibility

- Proper ARIA labels throughout
- Keyboard navigation support
- Skip-to-content link
- Respects `prefers-reduced-motion`

## 📄 License

MIT License - Feel free to use for your own portfolio!

---

*"The path of the ninja never ends."* 🍥
