<!--
  NINJA TIMELINE COMPONENT
  Experience timeline styled as a ninja's journey
-->
<script lang="ts">
  import { onMount } from "svelte";

  interface TimelineItem {
    title: string;
    subtitle: string;
    period: string;
    description: string[];
    type: "work" | "education";
  }

  export let items: TimelineItem[] = [];

  let visibleItems: Set<number> = new Set();
  let timelineEl: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
          );
          if (entry.isIntersecting) {
            visibleItems.add(index);
            visibleItems = visibleItems;
          }
        });
      },
      { threshold: 0.3 },
    );

    const itemElements = timelineEl.querySelectorAll(".timeline-item");
    itemElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
</script>

<div class="ninja-timeline" bind:this={timelineEl}>
  <!-- Central path -->
  <div class="timeline-path" aria-hidden="true">
    <div class="path-line"></div>
  </div>

  {#each items as item, index}
    <article
      class="timeline-item"
      class:visible={visibleItems.has(index)}
      class:left={index % 2 === 0}
      class:right={index % 2 !== 0}
      data-index={index}
    >
      <!-- Totsuka Blade Marker -->
      <div class="totsuka-blade-marker" aria-hidden="true">
        <svg viewBox="0 0 40 80" width="40" height="80">
          <defs>
            <linearGradient
              id="bladeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stop-color="#ff4500" />
              <stop offset="50%" stop-color="#ff8c00" />
              <stop offset="100%" stop-color="#ff4500" />
            </linearGradient>
            <filter id="bladeGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <!-- Ethereal Flame Blade Shape -->
          <path
            d="M20 75 Q10 60 12 40 Q8 20 20 2 Q32 20 28 40 Q30 60 20 75 Z"
            fill="url(#bladeGradient)"
            filter="url(#bladeGlow)"
            opacity="0.9"
          />
          <!-- Inner core -->
          <path
            d="M20 70 Q15 50 20 10 Q25 50 20 70"
            fill="#fff"
            opacity="0.6"
          />
        </svg>
      </div>

      <div class="item-content">
        <header class="item-header">
          <span class="period">{item.period}</span>
          <h3>{item.title}</h3>
          <span class="subtitle">{item.subtitle}</span>
        </header>

        <ul class="achievements">
          {#each item.description as desc}
            <li>
              <span class="bullet" aria-hidden="true">✦</span>
              {desc}
            </li>
          {/each}
        </ul>

        <!-- Amaterasu flame effect for highlights -->
        <div class="flame-accent" aria-hidden="true"></div>
      </div>
    </article>
  {/each}
</div>

<style>
  .ninja-timeline {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .timeline-path {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 6px; /* Slightly thicker */
    transform: translateX(-50%);
  }

  .path-line {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      var(--sharingan-red) 10%,
      var(--rinnegan-purple) 90%,
      transparent 100%
    );
    border-radius: 3px;
    box-shadow: 0 0 15px var(--sharingan-red-glow); /* Added glow to path */
  }

  .timeline-item {
    position: relative;
    width: calc(50% - 40px); /* Adjusted for larger marker */
    margin-bottom: 4rem; /* More spacing */
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .timeline-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .timeline-item.left {
    margin-left: 0;
    margin-right: auto;
    text-align: right;
  }

  .timeline-item.right {
    margin-left: auto;
    margin-right: 0;
    text-align: left;
  }

  .totsuka-blade-marker {
    position: absolute;
    top: -10px;
    width: 40px;
    height: 80px;
    z-index: 2;
    filter: drop-shadow(0 0 10px #ff4500);
  }

  .left .totsuka-blade-marker {
    right: -60px; /* Positioned on the line */
    transform: rotate(90deg);
  }

  .right .totsuka-blade-marker {
    left: -60px;
    transform: rotate(-90deg);
  }

  /* ... rest of styles ... */

  .item-content {
    position: relative;
    background: linear-gradient(
      145deg,
      rgba(26, 26, 26, 0.9) 0%,
      rgba(10, 10, 10, 0.95) 100%
    );
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow: hidden;
  }

  .item-header {
    margin-bottom: 1rem;
  }

  .period {
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--sharingan-red);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
  }

  h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.25rem;
  }

  .subtitle {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .achievements {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .achievements li {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .left .achievements li {
    flex-direction: row-reverse;
  }

  .bullet {
    color: var(--chakra-blue);
    font-size: 0.7rem;
    flex-shrink: 0;
    margin-top: 0.3rem;
  }

  .flame-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--sharingan-red),
      var(--sharingan-red-dark),
      transparent
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .timeline-item:hover .flame-accent {
    opacity: 1;
    animation: amaterasuFlicker 1.5s infinite;
  }

  @keyframes amaterasuFlicker {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .timeline-path {
      left: 20px;
    }

    .timeline-item {
      width: calc(100% - 50px);
      margin-left: 50px !important;
      text-align: left !important;
      margin-bottom: 2rem;
    }

    .totsuka-blade-marker {
      left: -60px !important;
      right: auto !important;
      transform: rotate(-90deg) !important;
    }

    .achievements li {
      flex-direction: row !important;
    }

    h3 {
      font-size: 1.1rem;
    }

    .item-content {
      padding: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .timeline-path {
      left: 12px;
      width: 3px;
    }

    .timeline-item {
      width: calc(100% - 35px);
      margin-left: 35px !important;
    }

    .totsuka-blade-marker {
      left: -45px !important;
      transform: scale(0.8) rotate(-90deg) !important;
    }

    .item-content {
      padding: 1rem;
    }

    h3 {
      font-size: 1rem;
    }

    .achievements li {
      font-size: 0.85rem;
    }
  }
</style>
