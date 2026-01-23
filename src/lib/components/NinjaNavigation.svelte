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
  } from "$lib/stores";
  import SharinganEye from "./SharinganEye.svelte";

  let isMenuOpen = false;
  let scrolled = false;
  let scrollProgress = 0;

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
    <div class="progress-glow" style="left: {scrollProgress}%"></div>
  </div>

  <!-- Persistent Eye Indicator -->
  <div class="eye-indicator" class:scrolled>
    <SharinganEye size={scrolled ? 32 : 40} variant="sasuke" />
  </div>

  <!-- Desktop Navigation -->
  <ul class="nav-list desktop">
    {#each navItems as item, index}
      <li>
        <button
          class="nav-item"
          class:active={$currentSection === item.section}
          class:passed={$currentSection > item.section}
          on:click={() => navigateTo(item.section)}
          aria-current={$currentSection === item.section ? "page" : undefined}
        >
          <span class="nav-label">{item.name}</span>

          <!-- Active indicator - Tomoe style -->
          {#if $currentSection === item.section}
            <span class="active-indicator" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="8" height="8">
                <circle cx="10" cy="10" r="4" fill="currentColor" />
              </svg>
            </span>
          {/if}

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

  <!-- Sound Toggle (Creative Mute) -->
  <button
    class="sound-toggle"
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

  <!-- Mobile Menu Toggle -->
  <button
    class="menu-toggle"
    class:open={isMenuOpen}
    on:click={toggleMenu}
    aria-expanded={isMenuOpen}
    aria-label="Toggle navigation menu"
  >
    <span class="toggle-line"></span>
    <span class="toggle-line"></span>
    <span class="toggle-line"></span>
  </button>

  <!-- Mobile Navigation -->
  {#if isMenuOpen}
    <div class="mobile-nav" role="menu">
      <ul class="nav-list mobile">
        {#each navItems as item}
          <li>
            <button
              class="nav-item"
              class:active={$currentSection === item.section}
              on:click={() => navigateTo(item.section)}
              role="menuitem"
            >
              <span class="nav-label">{item.name}</span>
              {#if $currentSection === item.section}
                <span class="mobile-indicator"></span>
              {/if}
            </button>
          </li>
        {/each}
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
    }
  }

  /* Scroll Progress Indicator */
  .scroll-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.05);
    overflow: visible;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--sharingan-red) 0%,
      var(--rinnegan-purple) 100%
    );
    transition: width 0.1s linear;
  }

  .progress-glow {
    position: absolute;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--sharingan-red);
    box-shadow:
      0 0 10px var(--sharingan-red),
      0 0 20px var(--sharingan-red-glow);
    transform: translateX(-50%);
    transition: left 0.1s linear;
  }

  .eye-indicator {
    flex-shrink: 0;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .eye-indicator.scrolled {
    transform: scale(0.85);
  }

  .nav-list {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 0;
    margin: 0;
    padding: 0;
  }

  .nav-list.desktop {
    display: none;
  }

  @media (min-width: 768px) {
    .nav-list.desktop {
      display: flex;
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
    padding: 0.6rem 1rem;
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
  }

  .nav-label {
    position: relative;
    z-index: 2;
  }

  /* Active indicator - spinning tomoe dot */
  .active-indicator {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--sharingan-red);
    animation: indicatorPulse 2s ease-in-out infinite;
  }

  @keyframes indicatorPulse {
    0%,
    100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
    50% {
      opacity: 0.7;
      transform: translateX(-50%) scale(1.3);
    }
  }

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
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .toggle-line {
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .menu-toggle.open .toggle-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-toggle.open .toggle-line:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.open .toggle-line:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  /* Mobile navigation */
  .mobile-nav {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(20px);
    padding: 1rem;
    border-bottom: 1px solid rgba(230, 57, 70, 0.2);
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .nav-list.mobile {
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-list.mobile .nav-item {
    width: 100%;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }

  .nav-list.mobile .nav-item.active {
    background: rgba(230, 57, 70, 0.1);
    border-left: 3px solid var(--sharingan-red);
  }

  .mobile-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--sharingan-red);
    box-shadow: 0 0 10px var(--sharingan-red-glow);
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
    margin-left: auto;
    margin-right: 0.5rem;
    transition: all 0.3s ease;
    z-index: 1001;
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
</style>
