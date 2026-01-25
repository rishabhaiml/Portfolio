<!--
  MAIN PAGE
  Orchestrates all sections with scroll tracking and Konami code Easter egg
-->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    eyeEvolution,
    currentSection,
    visitedSections,
    konamiProgress,
    KONAMI_CODE,
    sageMode,
    reducedMotion,
    loaderComplete,
  } from "$lib/stores";

  // Components
  import NinjaNavigation from "$lib/components/NinjaNavigation.svelte";
  import ChakraParticles from "$lib/components/ChakraParticles.svelte";
  import KamuiTransition from "$lib/components/KamuiTransition.svelte";
  import RasenganLoader from "$lib/components/RasenganLoader.svelte";

  // Sections
  import HeroSection from "$lib/sections/HeroSection.svelte";
  import SkillsSection from "$lib/sections/SkillsSection.svelte";
  import ProjectsSection from "$lib/sections/ProjectsSection.svelte";
  import ExperienceSection from "$lib/sections/ExperienceSection.svelte";
  import ContactSection from "$lib/sections/ContactSection.svelte";
  // Background Music (Removed: Handled by UchihaGallery)

  let scrollY = 0;
  let isLoading = true;
  function handleKeydown(event: KeyboardEvent) {
    if (KONAMI_CODE[$konamiProgress] === event.code) {
      konamiProgress.update((p) => p + 1);

      if ($konamiProgress >= KONAMI_CODE.length) {
        activateSageMode();
      }
    } else {
      konamiProgress.set(0);
    }
  }

  function activateSageMode() {
    sageMode.set(true);
    konamiProgress.set(0);

    // Show notification
    const notification = document.createElement("div");
    notification.className = "sage-mode-notification";
    notification.innerHTML = `
      <span class="sage-icon">🐸</span>
      <span class="sage-text">Sage Mode Activated!</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Check for reduced motion preference
  onMount(() => {
    // isLoading is now controlled by RasenganLoader event

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.set(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotion.set(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} bind:scrollY />

<svelte:head>
  <title>Rishabh Shukla | AI/ML Engineer</title>
  <meta
    name="description"
    content="Junior AI/ML Engineer specializing in NLP, LLMs, RAG pipelines, and high-performance FastAPI backends. View my portfolio and projects."
  />
  <meta
    name="keywords"
    content="AI, ML, Machine Learning, NLP, LLM, FastAPI, Python, Flutter, Portfolio"
  />
  <meta name="author" content="Rishabh Bipin Shukla" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://rishabhai.me" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://rishabhai.me" />
  <meta property="og:title" content="Rishabh Shukla | AI/ML Engineer" />
  <meta
    property="og:description"
    content="Junior AI/ML Engineer building production-ready NLP and LLM solutions."
  />
  <meta property="og:image" content="https://rishabhai.me/og-image.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://rishabhai.me" />
  <meta name="twitter:title" content="Rishabh Shukla | AI/ML Engineer" />
  <meta
    name="twitter:description"
    content="Junior AI/ML Engineer building production-ready NLP and LLM solutions."
  />
  <meta name="twitter:image" content="https://rishabhai.me/og-image.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Rishabh Shukla",
      "url": "https://rishabhai.me",
      "jobTitle": "AI/ML Engineer",
      "sameAs": [
        "https://github.com/rakshitbhai",
        "https://linkedin.com/in/rishabhbshukla"
      ],
      "description": "Junior AI/ML Engineer specializing in NLP, LLMs, and high-performance backends."
    }
  </script>
</svelte:head>

<!-- Loading Screen -->
{#if isLoading}
  <div class="loading-screen" aria-hidden="true">
    <RasenganLoader
      size={120}
      text="Gathering Chakra..."
      on:complete={() => {
        isLoading = false;
        loaderComplete.set(true);
      }}
    />
  </div>
{/if}

<main id="main-content" class:loaded={!isLoading}>
  <!-- Background Effects -->
  {#if !$reducedMotion}
    <ChakraParticles />
    <KamuiTransition />
  {/if}

  <!-- Navigation -->
  <NinjaNavigation />

  <!-- Sections -->
  <HeroSection />
  <SkillsSection />
  <ProjectsSection />
  <ExperienceSection />
  <ContactSection />
</main>

<!-- Skip to content link for accessibility -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
  main {
    position: relative;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  main.loaded {
    opacity: 1;
  }

  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .skip-link {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    background: var(--chakra-blue);
    color: white;
    font-weight: 600;
    border-radius: 0 0 8px 8px;
    z-index: 10000;
    transition: top 0.3s ease;
  }

  .skip-link:focus {
    top: 0;
  }

  /* Sage Mode notification styles */
  :global(.sage-mode-notification) {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 2.5rem;
    background: linear-gradient(
      135deg,
      rgba(255, 140, 0, 0.2) 0%,
      rgba(255, 200, 0, 0.2) 100%
    );
    border: 2px solid rgba(255, 140, 0, 0.5);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    z-index: 10000;
    animation: sageNotification 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes sageNotification {
    0% {
      opacity: 0;
      transform: translateX(-50%) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  }

  :global(.sage-mode-notification .sage-icon) {
    font-size: 3rem;
  }

  :global(.sage-mode-notification .sage-text) {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: #ff8c00;
  }
</style>
