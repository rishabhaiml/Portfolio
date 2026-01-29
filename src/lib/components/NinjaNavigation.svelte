<!--
  NINJA NAVIGATION COMPONENT
  Main navigation with scroll-activated Sharingan indicator
-->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    currentSection,
    isNavigating,
    eyeEvolution,
    SECTIONS,
    visitedSections,
    soundEnabled,
    rinneganMerged,
  } from "$lib/stores";
  import SharinganEye from "./SharinganEye.svelte";
  import ChakraActiveIndicator from "./ChakraActiveIndicator.svelte";
  import rinneganSvg from "$lib/assets/Rinnegan_Sasuke.svg";
  import { slide, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let isMenuOpen = false;
  let scrolled = false;
  let scrollProgress = 0;

  // Eye Integration State
  let eyeScale = 1;
  let eyeStage = 1;
  let eyeRotation = 0;
  let eyeVariant: "sasuke" | "sasuke-rinne" = "sasuke";
  let hasScrolledOnce = false;

  // Merge Target Tracking
  let targetTop = 0;
  let targetLeft = 0;
  let isMerging = false; // New state for merging trigger

  function updateMergeTarget() {
    if (isMerging) {
      const target = document.getElementById("rinnegan-merge-target");
      if (target) {
        const rect = target.getBoundingClientRect();
        targetTop = rect.top + rect.height / 2;
        targetLeft = rect.left + rect.width / 2;
      }
      requestAnimationFrame(updateMergeTarget);
    }
  }

  $: if (isMerging) {
    updateMergeTarget();
    // Set merged state after animation completes (1.2s transition)
    // We trigger slightly earlier (1000ms) to start the implosion effect as the eye arrives
    setTimeout(() => {
      rinneganMerged.set(true);
    }, 1000);
  } else {
    rinneganMerged.set(false);
  }

  const navItems = [
    { name: "Home", section: 0 },
    { name: "Skills", section: 1 },
    { name: "Projects", section: 2 },
    { name: "Experience", section: 3 },
    { name: "Contact", section: 4 },
  ];

  function navigateTo(sectionIndex: number) {
    if ($currentSection === sectionIndex) return;
    if ($isNavigating) return; // Prevent double-clicks

    // Start Kamui dissolve effect
    isNavigating.set(true);

    // Navigate when vortex is at peak (1600ms = eye 800ms + swirl 600ms + 200ms into peak)
    // This ensures the screen is fully covered by the vortex before scrolling
    setTimeout(() => {
      currentSection.set(sectionIndex);
      visitedSections.update((v) => v.add(sectionIndex));
      eyeEvolution.set(sectionIndex + 1);

      // Instant scroll while hidden by vortex
      const section = document.getElementById(SECTIONS[sectionIndex]);
      section?.scrollIntoView({ behavior: "instant" });

      isMenuOpen = false;
    }, 1400); // Navigate when vortex is 100% complete (800ms eye + 600ms swirl)
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Track if we've scrolled past threshold
    scrolled = scrollY > 50;

    // Calculate scroll progress (0-100)
    scrollProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Update Eye State
    if (scrollY > 10) {
      hasScrolledOnce = true;
    } else if (scrollY === 0) {
      /* Reset if at very top */
      hasScrolledOnce = false;
    }

    // Scale eye gradually based on scroll progress (1.0 -> 1.5)
    eyeScale = 1 + (scrollProgress / 100) * 0.5;

    // Determine Evolution Stage based on SECTION scroll progress
    const getSectionProgress = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const height = rect.height;
      // Progress is how much of the section has been scrolled PASt the top of viewport
      // rect.top is distance from viewport top to element top
      // when rect.top is 0, progress is 0.
      // when rect.top is -height, progress is 1 (fully scrolled past)
      return -rect.top / height;
    };

    const homeProgress = getSectionProgress("hero");
    const skillsProgress = getSectionProgress("skills");
    const projectsProgress = getSectionProgress("projects");
    const experienceProgress = getSectionProgress("experience");

    // Default State
    eyeStage = 1;
    eyeVariant = "sasuke";

    // Logic: 70% of section triggers next level until next section reaches 70%
    // We check in reverse order of priority

    if (experienceProgress > 0.45) {
      eyeStage = 5; // Rinnegan
      eyeVariant = "sasuke-rinne";
    } else if (projectsProgress > 0.7) {
      eyeStage = 4; // Mangekyou
    } else if (skillsProgress > 0.7) {
      eyeStage = 3; // 3-Tomoe
    } else if (homeProgress > 0.7) {
      eyeStage = 2; // 2-Tomoe
    }

    // Detach Logic: Experience > 60%
    isMerging = experienceProgress > 0.6;

    // Calculate rotation based on core scroll progress (360 degrees for full scroll)
    eyeRotation = (scrollProgress / 100) * 360;
  }

  onMount(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav class="ninja-nav" class:scrolled aria-label="Main navigation">
  <!-- Scroll Progress Indicator - Chakra Flow Line -->
  <div class="scroll-progress" aria-hidden="true">
    <div class="progress-fill" style="width: {scrollProgress}%"></div>

    <!-- Sharingan Eye as Progress Head/Logo/Merged Entity -->
    <div
      class="eye-progress-indicator"
      class:at-navbar={!hasScrolledOnce}
      class:at-progress={hasScrolledOnce && !isMerging}
      class:merging={isMerging}
      style="--raw-progress: {scrollProgress}; --eye-scale: {eyeScale}; --target-top: {targetTop}px; --target-left: {targetLeft}px;"
    >
      {#if eyeVariant === "sasuke-rinne"}
        <img
          src={rinneganSvg}
          alt="Rinnegan"
          class="progress-rinnegan"
          style="transform: rotate({eyeRotation}deg);"
        />
      {:else}
        <SharinganEye
          size={32}
          variant={eyeVariant}
          stage={eyeStage}
          externalRotation={eyeRotation}
          allowIdleRotation={false}
          triggerActivation={false}
        />
      {/if}
    </div>
  </div>

  <!-- Desktop Navigation -->
  <ul class="nav-list desktop">
    <!-- Spacer in the center list is removed to allow pure centering -->
    <!-- <li class="nav-logo-spacer" aria-hidden="true"></li> -->

    {#each navItems as item, index}
      <li>
        <button
          class="nav-item"
          class:active={$currentSection === item.section}
          class:passed={$currentSection > item.section}
          on:click={() => navigateTo(item.section)}
          aria-current={$currentSection === item.section ? "page" : undefined}
        >
          {#if $currentSection === item.section}
            <ChakraActiveIndicator level={item.section} />
          {/if}

          <span class="nav-label">{item.name}</span>

          <!-- Chakra ripple effect -->
          <span class="ripple" aria-hidden="true"></span>
        </button>
      </li>

      <!-- Connection line between nav items -->
      {#if index < navItems.length - 1}
        <li class="nav-connector" aria-hidden="true">
          <span class="connector-line" class:active={$currentSection > index}
          ></span>
        </li>
      {/if}
    {/each}
  </ul>

  <!-- End of Center Column -->

  <!-- Right Column: Sound Toggle & Mobile Menu Toggle -->
  <div class="nav-right">
    <!-- Sound Toggle (Creative Mute) - Desktop Only -->
    <button
      class="sound-toggle desktop-only"
      class:muted={!$soundEnabled}
      on:click={() => soundEnabled.update((v) => !v)}
      aria-label={$soundEnabled ? "Mute audio" : "Enable audio"}
      title={$soundEnabled ? "Mute" : "Unmute"}
    >
      <div class="sound-icon-wrapper">
        <svg
          viewBox="0 0 24 24"
          class="note-svg"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
          />
        </svg>
      </div>
    </button>
  </div>

  <!-- Mobile Menu Toggle -->
  <button
    class="menu-toggle"
    class:open={isMenuOpen}
    on:click={toggleMenu}
    aria-expanded={isMenuOpen}
    aria-label="Toggle navigation menu"
  >
    <svg
      viewBox="0 0 500 600"
      class="uchiha-symbol-icon"
      width="28"
      height="34"
      aria-label="Uchiha Clan Symbol"
    >
      <defs>
        <clipPath id="uchiha-clip">
          <path
            d="M -382.85715,229.50504 A 167.14285,162.85715 0 1 1 -717.14285,229.50504 A 167.14285,162.85715 0 1 1 -382.85715,229.50504 z"
            transform="translate(0,145.71429)"
          />
        </clipPath>
      </defs>
      <g transform="translate(-81.375319,-28.964096)">
        <path
          style="fill:#e20909;stroke:#000000;stroke-width:3"
          d="M -382.85715,229.50504 A 167.14285,162.85715 0 1 1 -717.14285,229.50504 A 167.14285,162.85715 0 1 1 -382.85715,229.50504 z"
          transform="translate(884.28569,26.154996)"
        />
        <path
          style="fill:#ffffff;stroke:#000000;stroke-width:3"
          clip-path="url(#uchiha-clip)"
          d="M -382.85715,229.50504 A 167.14285,162.85715 0 1 1 -717.14285,229.50504 A 167.14285,162.85715 0 1 1 -382.85715,229.50504 z"
          transform="translate(884.28571,26.892864)"
        />
        <path
          style="fill:#ffffff;stroke:#000000;stroke-width:3;fill-rule:evenodd"
          d="M 306.27502,415.7941 C 291.17226,552.92714 291.17226,552.92714 291.17226,552.92714 C 372.01842,553.13467 371.83449,552.95414 371.83449,552.95414 C 360.59263,415.87341 360.77657,415.73635 360.77657,415.73635"
        />
      </g>
    </svg>
  </button>

  <!-- Mobile Navigation -->
  {#if isMenuOpen}
    <div
      class="mobile-nav"
      role="menu"
      transition:slide={{ duration: 400, easing: cubicOut }}
    >
      <!-- Unrolling Scroll Handles -->
      <div
        class="scroll-handle scroll-handle-top"
        in:fade={{ delay: 100 }}
      ></div>
      <div
        class="scroll-handle scroll-handle-bottom"
        in:fade={{ delay: 100 }}
      ></div>

      <ul class="nav-list mobile">
        {#each navItems as item}
          <li>
            <button
              class="nav-item mobile-item"
              class:active={$currentSection === item.section}
              on:click={() => navigateTo(item.section)}
              role="menuitem"
            >
              <span class="nav-label">{item.name}</span>
              {#if $currentSection === item.section}
                <!-- Jutsu Seal / Tomoe Indicator for active state -->
                <span class="mobile-indicator tomoe-icon">
                  <svg viewBox="0 0 20 20" width="12" height="12">
                    <circle cx="10" cy="10" r="4" fill="currentColor" />
                    <path
                      d="M10 6 C12.2 6 14 7.8 14 10 C14 12.2 12.2 14 10 14 C7.8 14 6 12.2 6 10 C6 7.8 7.8 6 10 6 Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1"
                      opacity="0.5"
                    />
                  </svg>
                </span>
              {/if}
            </button>
          </li>
        {/each}

        <!-- Mobile Sound Toggle -->
        <li class="mobile-sound-wrapper">
          <button
            class="nav-item mobile-item sound-item"
            class:muted={!$soundEnabled}
            on:click={() => soundEnabled.update((v) => !v)}
          >
            <span class="nav-label">
              {$soundEnabled ? "Sound On" : "Sound Off"}
            </span>
            <div class="sound-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                class="note-svg"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                />
              </svg>
            </div>
          </button>
        </li>
      </ul>
    </div>
  {/if}
</nav>

<style>
  .ninja-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: transparent;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    /* Define logo offset for consistent positioning */
    /* Desktop: Padding 2rem (32px) + Toggle Center (~20px) = ~52px */
    --logo-offset: 3.25rem;
  }

  @media (max-width: 768px) {
    .ninja-nav {
      --logo-offset: 46px; /* 2.875rem: Matches right spacing (24px pad + 22px toggle center) */
      /* Mobile: Standardize padding for better symmetry */
      padding: 1rem 1.5rem;
    }
  }

  .ninja-nav.scrolled {
    padding: 0.75rem 2rem;
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }

  /* Performance: reduce backdrop-filter on mobile */
  @media (max-width: 768px) {
    .ninja-nav.scrolled {
      backdrop-filter: blur(4px);
      background: rgba(10, 10, 10, 0.95);
      /* Force mobile padding to remain 1.5rem on sides for symmetry with offset */
      padding: 0.75rem 1.5rem;
    }
  }

  /* Scroll Progress Indicator */
  .scroll-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent; /* hidden track */
    overflow: visible;
  }

  .progress-fill {
    position: absolute;
    height: 100%;
    /* Fill starts from the very left edge (0) */
    left: 0;
    /* Width extends to the eye's position (offset + remaining distance * progress) */
    width: calc(
      var(--logo-offset) + (100vw - var(--logo-offset)) *
        (var(--raw-progress) / 100)
    );
    background: linear-gradient(
      90deg,
      var(--sharingan-red) 0%,
      var(--rinnegan-purple) 100%
    );
    transition: width 0.1s linear;
  }

  /* Eye Progress Indicator - Global Fixed Position Tracker */
  .eye-progress-indicator {
    position: fixed; /* Fixed allows smooth transition between layout states */
    z-index: 2000;
    pointer-events: none;
    will-change: transform, top, left, opacity; /* Performance optimization */
    will-change: transform, top, left, opacity; /* Performance optimization */
    transition:
      top 0.8s cubic-bezier(0.16, 1, 0.3, 1),
      left 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      /* Smoother diagonal follow */ transform 0.8s
        cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.6s ease 0s; /* Immediate fade-in on return */
  }

  /* State 1: Navbar "Logo" Position */
  .eye-progress-indicator.at-navbar {
    top: 2.25rem; /* Vertically centered */
    left: var(--logo-offset);
    transform: translate(-50%, -50%) scale(1.25);
  }

  /* Mobile adjustment for Navbar position */
  @media (max-width: 768px) {
    .eye-progress-indicator.at-navbar {
      top: 41px; /* Exact center of 82px header (1rem + 50px + 1rem) */
      /* left handled by var(--logo-offset) update in .ninja-nav query */
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /* State 2: Progress Bar Head Position */
  .eye-progress-indicator.at-progress {
    /* 
       Vertical Transition:
       - Initial (at navbar): top = 2.25rem (36px) [Center of 1rem + 40px + 1rem navbar]
       - Scrolled (at progress): top = 4rem (64px) [Bottom of 0.75rem + 40px + 0.75rem navbar]
         Scrolled navbar height is 24px + 40px = 64px.
       
       We transition from 36px to 64px over the first 0-10% of scroll.
    */
    top: calc(
      2.25rem +
        clamp(
          0px,
          (var(--raw-progress) / 10) * (4rem - 2.25rem),
          4rem - 2.25rem
        )
    );

    /* Start from logo position and travel to end of screen */
    left: calc(
      var(--logo-offset) + (100vw - var(--logo-offset)) *
        (var(--raw-progress) / 100)
    );

    transform: translate(-50%, -50%) scale(var(--eye-scale));
  }

  /* Mobile adjustment for Progress position */
  @media (max-width: 768px) {
    .eye-progress-indicator.at-progress {
      /* Mobile Scrolled Navbar Height:
         Padding: 0.75rem (12px) * 2 = 24px
         Icon+Pad: 50px (34px img + 8px*2 pad)
         Total: 74px */
      top: calc(
        41px +
          clamp(0px, (var(--raw-progress) / 10) * (74px - 41px), 74px - 41px)
      );
    }
  }

  /* State 3: Merging (Dynamic Target) Position */
  .eye-progress-indicator.merging {
    top: var(--target-top) !important;
    left: var(--target-left) !important;
    /* Scale from 32px to match the 200px Rinnegan in ContactSection (~6.25x) */
    transform: translate(-50%, -50%) scale(6);
    opacity: 0;
    transition:
      top 1.2s cubic-bezier(0.16, 1, 0.3, 1),
      left 1.2s cubic-bezier(0.16, 1, 0.3, 1),
      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.6s ease 0.6s;
    filter: drop-shadow(0 0 30px var(--rinnegan-purple));
  }

  .nav-list {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 0;
    margin: 0;
    padding: 0;
    width: 100%; /* Ensure list takes full width for proper spacing */
  }

  .nav-list.desktop {
    display: none;
  }

  @media (min-width: 768px) {
    .nav-list.desktop {
      display: flex;
      flex: 1; /* Take up available space */
      justify-content: center; /* Center the links strictly */
    }

    /* Right column wrapper for symmetry */
    .nav-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      /* Match width of the left logo/eye area to ensure center column is perfectly centered */
      width: var(--logo-offset);
      min-width: 60px; /* At least 60px */
    }

    /* Create symmetry by matching the right column's width with a ghost element on the left */

    .ninja-nav::before {
      content: "";
      display: block;
      /* Match nav-right width */
      width: var(--logo-offset);
      min-width: 60px;
    }

    .menu-toggle {
      display: none !important;
    }
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem; /* Standardized comfortable padding */
    background: transparent;
    border: none;
    border-radius: 6px;
    color: var(--text-muted);
    font-family: var(--font-heading);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .nav-item:hover {
    color: var(--text-secondary);
  }

  .nav-item.passed {
    color: var(--text-secondary);
  }

  .nav-item.active {
    color: var(--text-primary);
    /* Active styling is now handled by ChakraActiveIndicator */
  }

  /* Remove old active indicator dot styles */
  /* .active-indicator used to be here */

  .nav-label {
    position: relative;
    z-index: 2;
  }

  /* Active indicator - spinning tomoe dot */
  /* Removed old indicatorPulse and .active-indicator styles */

  /* Connection line between items */
  .nav-connector {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }

  .connector-line {
    width: 20px;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .connector-line.active {
    background: rgba(230, 57, 70, 0.3);
  }

  .connector-line.active::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      var(--sharingan-red),
      transparent
    );
    animation: flowPulse 2s ease-in-out infinite;
  }

  @keyframes flowPulse {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  /* Chakra ripple effect */
  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(
      circle,
      rgba(230, 57, 70, 0.3) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition:
      width 0.5s ease,
      height 0.5s ease;
    pointer-events: none;
  }

  .nav-item:hover .ripple {
    width: 150px;
    height: 150px;
  }

  /* Mobile menu toggle */
  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    /* margin-left: auto; REMOVED, handled by nav-right container */
  }

  .uchiha-symbol-icon {
    filter: drop-shadow(0 0 5px rgba(226, 9, 9, 0.3));
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .menu-toggle:hover .uchiha-symbol-icon {
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(226, 9, 9, 0.6));
  }

  .menu-toggle.open .uchiha-symbol-icon {
    transform: rotate(360deg) scale(0.9);
    filter: drop-shadow(0 0 15px var(--sharingan-red));
  }

  /* Mobile navigation - Ninja Scroll Theme (Optimized + Animated) */
  .mobile-nav {
    position: fixed;
    top: 60px;
    left: 1rem;
    right: 1rem;
    background: rgba(15, 5, 5, 0.96);
    padding: 1.5rem;
    border: 1px solid rgba(230, 57, 70, 0.3);
    border-top: 2px solid var(--sharingan-red);
    border-radius: 0 0 12px 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9);
    z-index: 999;
    overflow: hidden; /* Critical for slide transition */
  }

  /* Decorative Scroll Handles */
  .scroll-handle {
    position: absolute;
    left: 0;
    right: 0;
    height: 12px;
    background: linear-gradient(
      90deg,
      #4a1a1a 0%,
      #8b0000 20%,
      #e63946 50%,
      #8b0000 80%,
      #4a1a1a 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    z-index: 1002;
  }

  .scroll-handle-top {
    top: 0;
    border-radius: 4px 4px 0 0;
  }

  .scroll-handle-bottom {
    bottom: 0px;
    border-radius: 0 0 4px 4px;
  }

  /* Remove individual unrollScroll animation as slide handle transition */

  .nav-list.mobile {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-list.mobile .nav-item {
    width: 100%;
    justify-content: space-between;
    padding: 0.85rem 1.25rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .nav-list.mobile .nav-item:active {
    transform: scale(0.98);
  }

  .nav-list.mobile .nav-item.active {
    background: rgba(230, 57, 70, 0.15);
    border-color: rgba(230, 57, 70, 0.4);
    box-shadow: inset 0 0 15px rgba(230, 57, 70, 0.1);
  }

  .mobile-indicator.tomoe-icon {
    display: flex;
    align-items: center;
    color: var(--sharingan-red);
    animation: spinSlow 8s linear infinite;
  }

  @keyframes spinSlow {
    to {
      transform: rotate(360deg);
    }
  }

  .mobile-sound-wrapper {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-item.mobile-item.sound-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-secondary);
  }

  .nav-item.mobile-item.sound-item.muted {
    color: var(--text-muted);
    opacity: 0.7;
  }

  /* Sound Toggle Styles */
  .sound-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
    margin: 0; /* Handled by container */
    transition: all 0.3s ease;
    z-index: 1001;
  }

  /* Hide header sound toggle on mobile */
  @media (max-width: 768px) {
    .sound-toggle.desktop-only {
      display: none;
    }
  }

  @media (min-width: 768px) {
    .sound-toggle {
      margin-left: 1rem;
      margin-right: 0;
    }
  }

  .sound-icon-wrapper {
    position: relative;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .note-svg {
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 8px var(--sharingan-red));
  }

  /* Muted State - Greyed out */
  .sound-toggle.muted {
    color: var(--text-muted);
  }

  .sound-toggle.muted .note-svg {
    opacity: 0.4;
    filter: none;
    transform: scale(0.9);
  }

  .sound-toggle:not(.muted):hover .note-svg {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 12px var(--sharingan-red-glow));
  }
  .progress-rinnegan {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
    /* Animation removed to follow scroll rules */
    transition: transform 0.1s linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
