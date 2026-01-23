<!--
  PROJECTS SECTION
  Display projects as authentic Naruto summoning scrolls with lightweight Fūinjutsu seal
-->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { eyeEvolution, currentSection } from "$lib/stores";
  import sealSound from "$lib/assets/naruto_seal.mp3";

  let sectionRef: HTMLElement;
  let isVisible = false;
  let sealAudio: HTMLAudioElement;

  // Track seal state for each project: 'sealed' | 'unsealing' | 'unsealed' | 'sealing'
  type SealState = "sealed" | "unsealing" | "unsealed" | "sealing";
  let sealStates: SealState[] = ["sealed", "sealed", "sealed"];

  // Static kanji positions for scattered seal symbols (pre-calculated for performance)
  // Spread across the full scroll area (viewBox 0 0 400 200)
  const scatterKanji = [
    { char: "封", x: 40, y: 35, rot: -12 },
    { char: "禁", x: 120, y: 25, rot: 8 },
    { char: "印", x: 280, y: 30, rot: 15 },
    { char: "術", x: 360, y: 45, rot: -5 },
    { char: "解", x: 55, y: 165, rot: 10 },
    { char: "呪", x: 140, y: 175, rot: -18 },
    { char: "結", x: 260, y: 170, rot: 6 },
    { char: "陣", x: 345, y: 160, rot: -8 },
    { char: "縛", x: 25, y: 100, rot: 12 },
    { char: "霊", x: 375, y: 100, rot: -10 },
    { char: "契", x: 90, y: 85, rot: 5 },
    { char: "鬼", x: 310, y: 115, rot: -7 },
  ];

  const projects = [
    {
      title: "Deep Learning for Real-Time Music Visualization",
      subtitle: "MCA Thesis - Ongoing",
      seal: "音",
      sealMeaning: "Sound",
      description:
        "Designing a deep learning system to convert complex acoustic features into dynamic real-time visual outputs.",
      details: [
        "Implementing CNN-based models for high-frequency audio feature extraction",
        "Optimizing low-latency audio processing with async FastAPI services",
        "Creating visually stunning real-time visualizations driven by AI",
      ],
      tags: ["PyTorch", "CNN", "FastAPI", "Real-time"],
      color: "red",
      chakraColor: "#E63946",
    },
    {
      title: "Local Privacy-First Knowledge Engine",
      subtitle: "RAG System - 2025",
      seal: "封",
      sealMeaning: "Seal",
      description:
        "Built an offline document question-answering system using the Phi-3.5 language model.",
      details: [
        "Custom pipelines for document chunking and embedding generation",
        "Context-aware RAG to reduce hallucinations",
        "Complete offline operation for maximum privacy",
      ],
      tags: ["Phi-3.5", "RAG", "Embeddings", "LLM"],
      color: "purple",
      chakraColor: "#9333EA",
    },
    {
      title: "Charity Suno - AI Study Assistant",
      subtitle: "Full-Stack App - 2025",
      seal: "学",
      sealMeaning: "Learn",
      description:
        "Integrated Gemini API and open-source LLMs for academic reasoning and assistance.",
      details: [
        "Natural-sounding speech output using Google TTS",
        "Full-stack system with FastAPI backend and Flutter mobile app",
        "Intuitive mobile experience for students",
      ],
      tags: ["Gemini API", "Flutter", "FastAPI", "TTS"],
      color: "blue",
      chakraColor: "#3B82F6",
    },
  ];

  function playSealSound() {
    if (sealAudio) {
      sealAudio.currentTime = 0;
      sealAudio.volume = 0.4;
      sealAudio.play().catch(() => {});
    }
  }

  function toggleSeal(index: number) {
    if (sealStates[index] === "sealed") {
      // Play seal sound
      playSealSound();

      // Unseal animation (CSS handles the visuals)
      sealStates[index] = "unsealing";
      sealStates = sealStates;

      setTimeout(() => {
        sealStates[index] = "unsealed";
        sealStates = sealStates;
      }, 600);
    } else if (sealStates[index] === "unsealed") {
      // Play seal sound
      playSealSound();

      // Seal animation (reverse)
      sealStates[index] = "sealing";
      sealStates = sealStates;

      setTimeout(() => {
        sealStates[index] = "sealed";
        sealStates = sealStates;
      }, 600);
    }
  }

  onMount(() => {
    // Initialize audio
    sealAudio = new Audio(sealSound);
    sealAudio.preload = "auto";

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible = true;
          eyeEvolution.set(3);
          currentSection.set(2);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef);

    return () => observer.disconnect();
  });

  onDestroy(() => {
    if (sealAudio) {
      sealAudio.pause();
      sealAudio = null!;
    }
  });
</script>

<section id="projects" class="projects section" bind:this={sectionRef}>
  <div class="container">
    <header class="section-header" class:visible={isVisible}>
      <span class="section-label">封印術 Fūinjutsu</span>
      <h2>Featured <span class="text-gradient-rinnegan">Projects</span></h2>
      <p class="section-desc">
        Powerful jutsu sealed within these scrolls — click to unseal
      </p>
    </header>

    <div class="scrolls-container">
      {#each projects as project, index}
        <article
          class="scroll-wrapper {project.color}"
          class:visible={isVisible}
          class:unsealed={sealStates[index] === "unsealed"}
          class:unsealing={sealStates[index] === "unsealing"}
          class:sealing={sealStates[index] === "sealing"}
          style="animation-delay: {index * 0.15}s"
        >
          <!-- Top scroll rod -->
          <div class="scroll-rod top" aria-hidden="true">
            <div class="rod-end left"></div>
            <div class="rod-body"></div>
            <div class="rod-end right"></div>
          </div>

          <!-- Scroll paper -->
          <div class="scroll-paper">
            <!-- Fūinjutsu Seal Overlay - Lightweight summoning scroll pattern -->
            {#if sealStates[index] !== "unsealed"}
              <div
                class="seal-overlay"
                class:breaking={sealStates[index] === "unsealing"}
                class:reforming={sealStates[index] === "sealing"}
              >
                <!-- Seal Pattern SVG - Full scroll coverage -->
                <svg
                  class="seal-pattern"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="none"
                >
                  <!-- Radiating lines from center extending to edges -->
                  <g class="radiate-lines">
                    {#each Array(24) as _, i}
                      <line
                        x1="200"
                        y1="100"
                        x2={200 + Math.cos((i * Math.PI) / 12) * 220}
                        y2={100 + Math.sin((i * Math.PI) / 12) * 120}
                        class="radiate-line"
                      />
                    {/each}
                  </g>

                  <!-- Concentric ellipses (dashed) - stretched to fill -->
                  <g class="seal-rings">
                    <ellipse
                      cx="200"
                      cy="100"
                      rx="60"
                      ry="35"
                      class="ring-circle"
                    />
                    <ellipse
                      cx="200"
                      cy="100"
                      rx="120"
                      ry="60"
                      class="ring-circle"
                    />
                    <ellipse
                      cx="200"
                      cy="100"
                      rx="180"
                      ry="90"
                      class="ring-circle"
                    />
                  </g>

                  <!-- Scattered kanji symbols across full area -->
                  <g class="scatter-kanji">
                    {#each scatterKanji as k}
                      <text
                        x={k.x}
                        y={k.y}
                        class="kanji-char"
                        transform="rotate({k.rot}, {k.x}, {k.y})">{k.char}</text
                      >
                    {/each}
                  </g>

                  <!-- Additional seal marks along the rings -->
                  <g class="tick-marks">
                    {#each Array(12) as _, i}
                      <line
                        x1={200 + Math.cos((i * Math.PI) / 6) * 70}
                        y1={100 + Math.sin((i * Math.PI) / 6) * 40}
                        x2={200 + Math.cos((i * Math.PI) / 6) * 85}
                        y2={100 + Math.sin((i * Math.PI) / 6) * 50}
                        class="tick-line"
                      />
                    {/each}
                  </g>
                </svg>

                <!-- Central Ofuda Tag (Red Seal) -->
                <div class="ofuda-tag {project.color}">
                  <span class="ofuda-kanji">{project.seal}</span>
                  <span class="ofuda-meaning">{project.sealMeaning}</span>
                </div>
              </div>
            {/if}

            <!-- Red seal stamp (always visible) -->
            <div class="seal-stamp" aria-hidden="true">
              <span class="seal-char">{project.seal}</span>
            </div>

            <!-- Content - revealed when unsealed -->
            <div
              class="scroll-content"
              class:revealed={sealStates[index] === "unsealed"}
            >
              <header class="project-header">
                <h3>{project.title}</h3>
                <span class="project-subtitle">{project.subtitle}</span>
              </header>

              <p class="project-desc">{project.description}</p>

              {#if sealStates[index] === "unsealed"}
                <div class="scroll-details">
                  <div class="details-inner">
                    <ul class="detail-list">
                      {#each project.details as detail}
                        <li>
                          <span class="kunai-bullet">◆</span>
                          {detail}
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              {/if}

              <div class="project-tags">
                {#each project.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>

            <!-- Unseal button -->
            <button
              class="unseal-btn"
              class:unsealed={sealStates[index] === "unsealed"}
              on:click={() => toggleSeal(index)}
              disabled={sealStates[index] === "unsealing" ||
                sealStates[index] === "sealing"}
              aria-expanded={sealStates[index] === "unsealed"}
            >
              <span class="btn-seal-symbol">印</span>
              <span class="btn-text">
                {sealStates[index] === "unsealed"
                  ? "封印 Seal"
                  : "解放 Release"}
              </span>
            </button>

            <div class="paper-edge top" aria-hidden="true"></div>
            <div class="paper-edge bottom" aria-hidden="true"></div>
          </div>

          <!-- Bottom scroll rod -->
          <div class="scroll-rod bottom" aria-hidden="true">
            <div class="rod-end left"></div>
            <div class="rod-body"></div>
            <div class="rod-end right"></div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .projects {
    position: relative;
    background: var(--bg-secondary);
  }

  .section-header {
    text-align: center;
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .section-header.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .section-label {
    display: inline-block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--rinnegan-purple);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
  }

  .section-desc {
    max-width: 500px;
    margin: 0 auto;
    color: var(--text-secondary);
  }

  .scrolls-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Scroll Wrapper */
  .scroll-wrapper {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.5s ease;
  }

  .scroll-wrapper.visible {
    animation: scrollAppear 0.6s ease forwards;
  }

  @keyframes scrollAppear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scroll Rods */
  .scroll-rod {
    display: flex;
    align-items: center;
    height: 20px;
    position: relative;
    z-index: 2;
  }

  .scroll-rod.top {
    margin-bottom: -2px;
  }

  .scroll-rod.bottom {
    margin-top: -2px;
  }

  .rod-body {
    flex: 1;
    height: 16px;
    background: linear-gradient(
      180deg,
      #8b6914 0%,
      #d4a84b 20%,
      #f5d899 40%,
      #d4a84b 60%,
      #8b6914 100%
    );
    border-radius: 2px;
    box-shadow:
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.4);
  }

  .rod-end {
    width: 28px;
    height: 20px;
    background: linear-gradient(
      180deg,
      #654321 0%,
      #8b6914 30%,
      #a67c31 50%,
      #8b6914 70%,
      #654321 100%
    );
    border-radius: 4px;
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.5),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  .rod-end.left {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .rod-end.right {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  /* Scroll Paper */
  .scroll-paper {
    position: relative;
    background: linear-gradient(
      180deg,
      #f5e6c8 0%,
      #f0ddb8 10%,
      #f5e6c8 50%,
      #e8d4a8 90%,
      #dcc89a 100%
    );
    padding: 2rem;
    min-height: 220px;
    border-left: 4px solid #c4a35a;
    border-right: 4px solid #c4a35a;
    box-shadow:
      inset 0 5px 20px rgba(0, 0, 0, 0.1),
      inset 0 -5px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .scroll-paper::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
  }

  /* ===== FŪINJUTSU SEAL OVERLAY ===== */
  .seal-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      ellipse at center,
      rgba(245, 230, 200, 0.97) 0%,
      rgba(220, 200, 154, 0.99) 100%
    );
    z-index: 10;
  }

  .seal-overlay.breaking {
    animation: sealBreak 1s ease-out forwards;
  }

  .seal-overlay.reforming {
    animation: sealReform 0.8s ease-in forwards;
  }

  @keyframes sealBreak {
    0% {
      opacity: 1;
      filter: brightness(1);
    }
    20% {
      filter: brightness(1.3);
    }
    50% {
      filter: brightness(1.8) saturate(1.5);
    }
    100% {
      opacity: 0;
      filter: brightness(2.5) blur(15px);
      transform: scale(1.15);
    }
  }

  @keyframes sealReform {
    0% {
      opacity: 0;
      filter: blur(15px);
      transform: scale(0.7);
    }
    50% {
      filter: brightness(1.5) blur(5px);
    }
    100% {
      opacity: 1;
      filter: blur(0) brightness(1);
      transform: scale(1);
    }
  }

  /* ===== NEW LIGHTWEIGHT SEAL STYLES ===== */

  /* Seal Pattern SVG - fills entire scroll */
  .seal-pattern {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* Radiating lines (spider web effect) */
  .radiate-line {
    stroke: #2a2520;
    stroke-width: 1;
    stroke-linecap: round;
    opacity: 0.5;
  }

  /* Concentric ring circles */
  .ring-circle {
    fill: none;
    stroke: #2a2520;
    stroke-width: 1;
    stroke-dasharray: 6 4;
    opacity: 0.4;
  }

  /* Scattered kanji characters */
  .kanji-char {
    font-family: serif;
    font-size: 11px;
    font-weight: 700;
    fill: #2a2520;
    opacity: 0.6;
    text-anchor: middle;
    dominant-baseline: central;
  }

  /* Small tick marks */
  .tick-line {
    stroke: #2a2520;
    stroke-width: 1.5;
    stroke-linecap: round;
    opacity: 0.5;
  }

  /* ===== OFUDA TAG (Central Red Seal) ===== */
  .ofuda-tag {
    position: absolute;
    width: 40px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    z-index: 5;
  }

  .ofuda-tag.red {
    background: linear-gradient(135deg, #c62828 0%, #b71c1c 50%, #8e0000 100%);
  }
  .ofuda-tag.purple {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%);
  }
  .ofuda-tag.blue {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
  }

  .ofuda-kanji {
    color: #fff;
    font-family: serif;
    font-size: 1.6rem;
    font-weight: 900;
    line-height: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .ofuda-meaning {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 4px;
  }

  /* Breaking animation - simple fade out */
  .breaking .seal-pattern {
    animation: patternFadeOut 0.6s ease-out forwards;
  }

  .breaking .ofuda-tag {
    animation: ofudaBreak 0.6s ease-out forwards;
  }

  @keyframes patternFadeOut {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.05);
    }
  }

  @keyframes ofudaBreak {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-5px) scale(1.1);
      filter: brightness(1.3);
    }
    100% {
      opacity: 0;
      transform: translateY(10px) scale(0.9);
    }
  }

  /* Reforming animation - reverse fade in */
  .reforming .seal-pattern {
    animation: patternFadeIn 0.6s ease-out forwards;
  }

  .reforming .ofuda-tag {
    animation: ofudaReform 0.6s ease-out forwards;
  }

  @keyframes patternFadeIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes ofudaReform {
    0% {
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
    }
    50% {
      transform: translateY(3px) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Paper edges */
  .paper-edge {
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    pointer-events: none;
  }

  .paper-edge.top {
    top: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), transparent);
  }

  .paper-edge.bottom {
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
  }

  /* Seal Stamp */
  .seal-stamp {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid;
    border-radius: 4px;
    transform: rotate(-8deg);
    opacity: 0.85;
    z-index: 5;
  }

  .red .seal-stamp {
    border-color: #b91c1c;
    background: rgba(185, 28, 28, 0.1);
  }
  .purple .seal-stamp {
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.1);
  }
  .blue .seal-stamp {
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.1);
  }

  .seal-char {
    font-size: 1.5rem;
    font-weight: 900;
    font-family: serif;
  }

  .red .seal-char {
    color: #b91c1c;
  }
  .purple .seal-char {
    color: #7c3aed;
  }
  .blue .seal-char {
    color: #2563eb;
  }

  /* Content */
  .scroll-content {
    position: relative;
    z-index: 1;
    color: #2d2a26;
    opacity: 0.3;
    filter: blur(2px);
    transition: all 0.5s ease;
  }

  .scroll-content.revealed {
    opacity: 1;
    filter: blur(0);
    animation: contentReveal 0.6s ease-out;
  }

  @keyframes contentReveal {
    0% {
      opacity: 0;
      transform: translateY(15px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .project-header {
    margin-bottom: 1rem;
    padding-right: 60px;
  }

  h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1814;
    margin: 0 0 0.25rem;
    line-height: 1.3;
  }

  .project-subtitle {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .red .project-subtitle {
    color: #b91c1c;
  }
  .purple .project-subtitle {
    color: #7c3aed;
  }
  .blue .project-subtitle {
    color: #2563eb;
  }

  .project-desc {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #3d3a35;
    margin-bottom: 1rem;
  }

  /* Expanded Details */
  .scroll-details {
    overflow: hidden;
    animation: unroll 0.5s ease-out;
  }

  @keyframes unroll {
    from {
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      max-height: 300px;
      opacity: 1;
      transform: translateY(0);
    }
  }

  .details-inner {
    padding: 1rem;
    margin-bottom: 1rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    border-left: 3px solid;
  }

  .red .details-inner {
    border-left-color: #b91c1c;
  }
  .purple .details-inner {
    border-left-color: #7c3aed;
  }
  .blue .details-inner {
    border-left-color: #2563eb;
  }

  .detail-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .detail-list li {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    font-size: 0.9rem;
    color: #3d3a35;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .kunai-bullet {
    flex-shrink: 0;
    font-size: 0.6rem;
    margin-top: 0.4rem;
  }

  .red .kunai-bullet {
    color: #b91c1c;
  }
  .purple .kunai-bullet {
    color: #7c3aed;
  }
  .blue .kunai-bullet {
    color: #2563eb;
  }

  /* Tags */
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.08);
    color: #4a4743;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Unseal Button */
  .unseal-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 1.2rem;
    background: rgba(0, 0, 0, 0.08);
    border: 2px solid;
    border-radius: 4px;
    font-family: var(--font-heading);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 20;
  }

  .unseal-btn:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  .btn-seal-symbol {
    font-size: 1.1rem;
    font-weight: 900;
    transition: transform 0.3s ease;
  }

  .unseal-btn:hover:not(:disabled) .btn-seal-symbol {
    transform: rotate(45deg);
  }

  .red .unseal-btn {
    border-color: #b91c1c;
    color: #b91c1c;
  }
  .purple .unseal-btn {
    border-color: #7c3aed;
    color: #7c3aed;
  }
  .blue .unseal-btn {
    border-color: #2563eb;
    color: #2563eb;
  }

  .unseal-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.12);
    transform: scale(1.02);
  }

  .red .unseal-btn:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(185, 28, 28, 0.4);
  }
  .purple .unseal-btn:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
  }
  .blue .unseal-btn:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .scrolls-container {
      gap: 2rem;
    }

    .scroll-paper {
      padding: 1.5rem;
      min-height: 200px;
    }

    .seal-stamp {
      width: 40px;
      height: 40px;
      top: 1rem;
      right: 1rem;
    }

    .seal-char {
      font-size: 1.2rem;
    }

    .project-header {
      padding-right: 50px;
    }

    h3 {
      font-size: 1.1rem;
    }

    .rod-end {
      width: 20px;
    }

    /* seal-pattern removed to maintain full coverage */

    .ofuda-tag {
      width: 35px;
      height: 70px;
    }

    .ofuda-kanji {
      font-size: 1.3rem;
    }
  }

  @media (max-width: 480px) {
    .scroll-paper {
      padding: 1.25rem;
      min-height: 180px;
    }

    .scroll-rod {
      height: 16px;
    }

    .rod-body {
      height: 12px;
    }

    .rod-end {
      width: 16px;
      height: 16px;
    }

    .seal-stamp {
      width: 36px;
      height: 36px;
    }

    .seal-char {
      font-size: 1rem;
    }

    h3 {
      font-size: 1rem;
    }

    .project-desc {
      font-size: 0.85rem;
    }

    .unseal-btn {
      width: 100%;
      justify-content: center;
    }

    /* seal-pattern removed to maintain full coverage */

    .ofuda-tag {
      width: 32px;
      height: 60px;
    }

    .ofuda-kanji {
      font-size: 1.1rem;
    }

    .ofuda-meaning {
      font-size: 0.45rem;
    }
  }
</style>
