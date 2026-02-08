<!--
  HERO SECTION
  Dramatic intro with Sharingan reveal and kunai-slash text
  Features optional Uchiha Gallery mode with orbital Mangekyou
-->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    eyeEvolution,
    isNavigating,
    currentSection,
    visitedSections,
  } from "$lib/stores";
  import SharinganEye from "$lib/components/SharinganEye.svelte";
  import UchihaGallery from "$lib/components/UchihaGallery.svelte";
  // Performance: GSAP is dynamically imported only when needed

  // Toggle between single eye and full gallery mode
  export let galleryMode: boolean = true;

  let heroRef: HTMLElement;
  let isVisible = false;
  let showName = false;
  let showTitle = false;
  let showSummary = false;
  let showCta = false;

  onMount(() => {
    // Trigger initial eye activation
    setTimeout(() => {
      // Set to Mangekyou (4) for gallery mode to show all variants
      eyeEvolution.set(galleryMode ? 4 : 1);
      isVisible = true;
    }, 500);

    // Staggered reveal animation
    setTimeout(() => (showName = true), 800);
    setTimeout(() => (showTitle = true), 1200);
    setTimeout(() => (showSummary = true), 1600);
    setTimeout(() => (showCta = true), 2000);

    // GSAP animations for extra flair - dynamically imported only when needed
    if (!galleryMode) {
      import("gsap").then(({ gsap }) => {
        gsap.fromTo(
          ".hero-eye-container",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            delay: 0.3,
          },
        );
      });
    }

    // IntersectionObserver to sync navigation when Hero is visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          currentSection.set(0); // Set to Home
          visitedSections.update((v) => v.add(0));
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(heroRef);

    return () => observer.disconnect();
  });

  function navigateWithKamui(
    sectionId: string,
    sectionIndex: number,
    eyeStage: number,
  ) {
    if ($isNavigating) return;

    // Start Kamui effect
    isNavigating.set(true);

    // At midpoint (600ms), scroll to destination
    setTimeout(() => {
      currentSection.set(sectionIndex);
      visitedSections.update((v) => v.add(sectionIndex));
      eyeEvolution.set(eyeStage);

      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "instant" });
    }, 600);
  }

  function scrollToProjects() {
    navigateWithKamui("projects", 2, 3);
  }

  function scrollToContact() {
    navigateWithKamui("contact", 4, 5);
  }
</script>

<section
  id="hero"
  class="hero section"
  class:gallery-mode={galleryMode}
  bind:this={heroRef}
>
  {#if galleryMode}
    <!-- Full Uchiha Gallery Mode -->
    <div class="gallery-hero-layout">
      <div class="gallery-container">
        <UchihaGallery />
      </div>

      <div class="gallery-text-overlay">
        <div class="text-and-scroll-wrapper">
          <div class="text-content">
            <h1 class="hero-name" class:visible={showName}>
              <span class="name-text">
                <span class="first-name">Rishabh</span>
                <span class="last-name">Shukla</span>
              </span>
            </h1>

            <p class="hero-title" class:visible={showTitle}>
              <span class="title-text text-gradient-sharingan"
                >AI/ML Engineer</span
              >
            </p>
          </div>

          <!-- Scroll Indicator -->
          <div class="scroll-indicator" aria-label="Scroll down">
            <div class="kunai-scroll">
              <img
                src="/src/lib/assets/kunai.webp"
                alt=""
                style="height: 40px; width: auto;"
              />
            </div>
            <span class="scroll-text">SCROLL</span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Standard Hero Mode -->
    <div class="container hero-content">
      <div class="hero-eye-container" aria-hidden="true">
        <SharinganEye size={180} />
      </div>

      <!-- Name with kunai slash effect -->
      <h1 class="hero-name" class:visible={showName}>
        <span class="name-text">
          <span class="first-name">Rishabh</span>
          <span class="last-name">Shukla</span>
        </span>
        <span class="kunai-slash" aria-hidden="true"></span>
      </h1>

      <!-- Title -->
      <p class="hero-title" class:visible={showTitle}>
        <span class="title-text text-gradient-sharingan">AI/ML Engineer</span>
      </p>

      <!-- Summary -->
      <p class="hero-summary" class:visible={showSummary}>
        Deploying production-ready NLP, Speech-to-Text, and LLM solutions.<br />
        Building RAG pipelines and high-performance FastAPI backends.
      </p>

      <!-- CTA Buttons -->
      <div class="hero-cta" class:visible={showCta}>
        <button class="btn btn-primary" on:click={scrollToProjects}>
          <span>View My Work</span>
          <svg
            class="btn-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <button class="btn btn-secondary" on:click={scrollToContact}>
          <span>Contact Me</span>
          <svg
            class="btn-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator" aria-label="Scroll down">
        <div class="kunai-scroll">
          <img src="/src/lib/assets/kunai.webp" alt="" width="20" height="35" />
        </div>
        <span class="scroll-text">SCROLL</span>
      </div>
    </div>
  {/if}

  <!-- Background gradient overlay -->
  <div class="hero-bg" aria-hidden="true"></div>
</section>

<style>
  .hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at 50% 0%,
        rgba(230, 57, 70, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 80% 80%,
        rgba(139, 92, 246, 0.05) 0%,
        transparent 40%
      );
    pointer-events: none;
    z-index: 0;
  }

  /* Gallery Mode Styles */
  .gallery-hero-layout {
    position: relative;
    width: 100%;
    /* Subtract navbar height (approx 64px/4rem) to prevent overflow */
    height: calc(100vh - 64px);
    height: calc(100dvh - 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
    padding-bottom: 2rem;
    overflow: hidden;
  }

  .gallery-container {
    position: relative;
    width: 100%;
    flex: 1; /* Take all available space */
    min-height: 0; /* Allow shrinking below content size */
    z-index: 1;
    display: flex;
    align-items: center; /* Center gallery vertically in its space */
    justify-content: center;
  }

  .gallery-text-overlay {
    position: relative;
    z-index: 10;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 auto; /* Auto height based on content */
    width: 100%;
    padding: 0 1rem;
    margin-top: -1rem; /* Slight overlap to tighten visual gap if gallery padding is large */
  }

  .text-and-scroll-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem; /* Space between text and scroll indicator */
    width: 100%;
  }

  .text-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Text Styles */
  .hero.gallery-mode .hero-name {
    margin: 0;
  }

  .hero.gallery-mode .name-text {
    gap: 0;
    line-height: 1;
  }

  .hero.gallery-mode .first-name {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 900;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    line-height: 1;
  }

  .hero.gallery-mode .last-name {
    font-size: clamp(1.5rem, 6vw, 3rem);
    font-weight: 700;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.1em;
    line-height: 1;
  }

  .hero.gallery-mode .hero-title {
    margin: 0.5rem 0 0 0;
  }

  .hero.gallery-mode .title-text {
    font-size: clamp(1rem, 3vw, 1.5rem);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  /* Mobile Overrides - mostly ensuring font sizes are readable */
  @media (max-width: 768px) {
    .gallery-hero-layout {
      padding-top: 1rem;
      padding-bottom: 3rem; /* Extra bottom space for nav bar on mobile */
    }

    .gallery-text-overlay {
      margin-top: -0.5rem;
    }

    .text-and-scroll-wrapper {
      flex-direction: column;
      gap: 1.5rem; /* Reduced gap for mobile */
    }
  }

  /* Landscape mode adjustments */
  @media (max-height: 500px) and (orientation: landscape) {
    .gallery-hero-layout {
      flex-direction: row;
      align-items: center;
      padding: 1rem;
    }

    .gallery-container {
      flex: 1;
      height: 100%;
    }

    .gallery-text-overlay {
      flex: 1;
      align-items: flex-start;
      text-align: left;
      margin-top: 0;
      padding-left: 2rem;
    }

    .hero.gallery-mode .name-text {
      align-items: flex-start;
    }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .hero-eye-container {
    margin-bottom: 1rem;
  }

  .hero-name {
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-name.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .name-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .first-name {
    font-size: clamp(2.5rem, 10vw, 5rem);
    font-weight: 900;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .last-name {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 700;
    color: var(--sharingan-red);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .kunai-slash {
    position: absolute;
    top: 50%;
    left: -10%;
    width: 120%;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--sharingan-red),
      transparent
    );
    opacity: 0;
    animation: slashReveal 0.5s ease-out 1s forwards;
  }

  @keyframes slashReveal {
    0% {
      opacity: 0;
      transform: translateY(-50%) scaleX(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-50%) scaleX(1);
    }
  }

  .hero-title {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-title.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .title-text {
    font-family: var(--font-heading);
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600;
  }

  .hero-summary {
    max-width: 600px;
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-summary.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-cta.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-icon {
    font-size: 1.1rem;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    animation: float 2s ease-in-out infinite;
    z-index: 20; /* ensure it's above background */
  }

  /* Gallery mode: scroll indicator is positioned via flex, not absolute */
  .hero.gallery-mode .scroll-indicator {
    position: static;
    transform: none;
    animation: float-simple 2s ease-in-out infinite;
  }

  @keyframes float-simple {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(-10px);
    }
  }

  @keyframes float-mobile {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .scroll-text {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 768px) {
    .hero-content {
      gap: 1rem;
      padding-top: 4rem;
    }

    .hero-eye-container {
      transform: scale(0.7);
      margin-bottom: 0;
    }

    .hero-cta {
      flex-direction: column;
      width: 100%;
      max-width: 280px;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }

    .hero-summary {
      font-size: 1rem;
      padding: 0 1rem;
    }

    .scroll-indicator {
      bottom: 1rem;
    }
  }

  @media (max-width: 480px) {
    .hero-eye-container {
      transform: scale(0.55);
    }

    .name-text {
      gap: 0;
    }

    .first-name {
      font-size: 2.25rem;
    }

    .last-name {
      font-size: 1.5rem;
      letter-spacing: 0.05em;
    }

    .hero-summary {
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .scroll-indicator {
      /* display: none; */ /* Re-enabled */
      position: absolute; /* Keep absolute to pin to corner */
      bottom: 1.5rem;
      left: 1.5rem;
      right: auto;
      transform: none; /* remove centering */
      margin-top: 0;
      flex-direction: row; /* Horizontal layout for compact look */
      align-items: center;
      gap: 0.5rem;
      animation: float-mobile 2s ease-in-out infinite;
      z-index: 20;
    }

    .scroll-text {
      font-size: 0.7rem;
      writing-mode: vertical-rl; /* Vertical Japanese style text */
      text-orientation: mixed;
      transform: rotate(180deg); /* Read upwards */
      letter-spacing: 0.15em;
      opacity: 0.7;
    }

    /* Ensure Gallery Mode handles scroll indicator nicely on mobile */
    .gallery-hero-layout {
      height: calc(100vh - 64px); /* Restore full Viewport height */
      height: calc(100dvh - 64px);
      padding-bottom: 2rem;
      justify-content: center;
    }
  }
</style>
