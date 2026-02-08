<!--
  SKILLS SECTION
  Display skills as Chakra Nature Elements
  Each category = a nature transformation (Lightning, Fire, Earth, Water)
-->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { eyeEvolution, currentSection } from "$lib/stores";
  import SharinganEye from "$lib/components/SharinganEye.svelte";
  import chakraNatureSound from "$lib/assets/effects/chakra-nature.mp3";

  let sectionRef: HTMLElement;
  let isVisible = false;
  let activeElement: number | null = null;
  let chakraAudio: HTMLAudioElement;

  type MangekyouVariant = "sasuke" | "itachi" | "madara" | "obito" | "shisui";

  interface ChakraElement {
    name: string;
    kanji: string;
    title: string;
    subtitle: string;
    color: string;
    glowColor: string;
    eyeVariant: MangekyouVariant;
    skills: string[];
  }

  const chakraElements: ChakraElement[] = [
    {
      name: "Lightning",
      kanji: "雷",
      title: "AI/ML & NLP",
      subtitle: "Neural Processing",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.4)",
      eyeVariant: "sasuke", // Sasuke uses Lightning
      skills: [
        "Large Language Models",
        "RAG Pipelines",
        "Speech-to-Text (Whisper)",
        "CNNs & RNNs",
        "Embeddings",
      ],
    },
    {
      name: "Fire",
      kanji: "火",
      title: "Frameworks",
      subtitle: "Power Techniques",
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.4)",
      eyeVariant: "itachi", // Itachi uses Fire
      skills: [
        "PyTorch",
        "FastAPI",
        "Hugging Face",
        "Gemini API",
        "Scikit-learn",
      ],
    },
    {
      name: "Earth",
      kanji: "土",
      title: "Backend",
      subtitle: "Foundation Jutsu",
      color: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.4)",
      eyeVariant: "madara", // Madara essentially earth/meteor
      skills: ["Python", "Docker", "AWS Lambda", "REST APIs", "SQL"],
    },
    {
      name: "Water",
      kanji: "水",
      title: "App Development",
      subtitle: "Flowing Code",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.4)",
      eyeVariant: "shisui", // Shisui flow/teleport
      skills: ["Flutter", "Dart", "Node.js", "GetX", "Reactive UI"],
    },
  ];

  function playChakraSound() {
    if (chakraAudio) {
      chakraAudio.currentTime = 0;
      chakraAudio.volume = 0.3;
      chakraAudio.play().catch(() => {});
    }
  }

  function toggleElement(index: number) {
    if (activeElement !== index) {
      // Opening a new element - play sound
      playChakraSound();
    }
    activeElement = activeElement === index ? null : index;
  }

  onMount(() => {
    // Initialize audio
    chakraAudio = new Audio(chakraNatureSound);
    chakraAudio.preload = "auto";

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible = true;
          eyeEvolution.set(2);
          currentSection.set(1);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef);

    return () => observer.disconnect();
  });

  onDestroy(() => {
    if (chakraAudio) {
      chakraAudio.pause();
      chakraAudio = null!;
    }
  });
</script>

<section id="skills" class="skills section" bind:this={sectionRef}>
  <div class="container">
    <header class="section-header" class:visible={isVisible}>
      <span class="section-label">Chakra Nature</span>
      <h2>Technical <span class="text-gradient-sharingan">Mastery</span></h2>
      <p class="section-desc">Techniques refined through countless missions</p>
    </header>

    <div class="elements-grid">
      {#each chakraElements as element, index}
        <button
          type="button"
          class="element-card"
          class:visible={isVisible}
          class:active={activeElement === index}
          style="
            --element-color: {element.color}; 
            --element-glow: {element.glowColor};
            animation-delay: {index * 0.1}s;
          "
          on:click={() => toggleElement(index)}
          aria-expanded={activeElement === index}
        >
          <!-- Mangekyou Watermark -->
          <div class="mangekyou-watermark">
            <SharinganEye size={120} variant={element.eyeVariant} />
          </div>

          <!-- Chakra symbol -->
          <div class="element-symbol">
            <div class="symbol-ring">
              <div class="symbol-inner">
                <span class="kanji">{element.kanji}</span>
              </div>
            </div>
            <div class="symbol-glow" aria-hidden="true"></div>
          </div>

          <!-- Element info -->
          <div class="element-info">
            <span class="element-name">{element.name} Release</span>
            <h3>{element.title}</h3>
            <span class="element-subtitle">{element.subtitle}</span>
          </div>

          <!-- Skills list -->
          <ul class="skills-list" class:expanded={activeElement === index}>
            {#each element.skills as skill}
              <li>
                <span class="skill-dot" aria-hidden="true"></span>
                <span class="skill-name">{skill}</span>
              </li>
            {/each}
          </ul>

          <!-- Expand indicator -->
          <div class="expand-indicator" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Background effects -->
          <div class="card-bg" aria-hidden="true"></div>
          <div class="chakra-flow" aria-hidden="true"></div>
        </button>
      {/each}
    </div>

    <!-- Decorative pentagon showing all elements -->
    <div class="elements-diagram" class:visible={isVisible} aria-hidden="true">
      <svg viewBox="0 0 200 200" width="120" height="120">
        <!-- Pentagon outline -->
        <polygon
          points="100,10 190,75 155,180 45,180 10,75"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="1"
        />
        <!-- Element points -->
        <circle cx="100" cy="10" r="6" fill="#a855f7" opacity="0.8" />
        <circle cx="190" cy="75" r="6" fill="#ef4444" opacity="0.8" />
        <circle cx="155" cy="180" r="6" fill="#f59e0b" opacity="0.8" />
        <circle cx="45" cy="180" r="6" fill="#3b82f6" opacity="0.8" />
        <circle cx="10" cy="75" r="6" fill="#22c55e" opacity="0.3" />
        <!-- Center -->
        <circle
          cx="100"
          cy="100"
          r="15"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1"
        />
      </svg>
    </div>
  </div>
</section>

<style>
  .skills {
    position: relative;
    background: linear-gradient(
      180deg,
      var(--bg-primary) 0%,
      var(--bg-secondary) 100%
    );
    overflow: hidden;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
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
    color: var(--sharingan-red);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
  }

  .section-desc {
    max-width: 400px;
    margin: 0 auto;
    color: var(--text-secondary);
  }

  /* Elements Grid */
  .elements-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  /* Element Card */
  .element-card {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    text-align: left;
    color: inherit;
    font-family: inherit;
    position: relative;
    padding: 1.5rem;
    border-radius: 16px;
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .element-card.visible {
    animation: cardAppear 0.5s ease forwards;
  }

  @keyframes cardAppear {
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .element-card:hover,
  .element-card.active {
    border-color: var(--element-color);
    box-shadow: 0 0 30px var(--element-glow);
    transform: translateY(-5px);
  }

  .element-card.active {
    padding-bottom: 2rem;
  }

  /* Card Background */
  .card-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 30% 30%,
      var(--element-glow),
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .element-card:hover .card-bg,
  .element-card.active .card-bg {
    opacity: 0.3;
  }

  /* Chakra Flow Animation */
  .chakra-flow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--element-color),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .element-card:hover .chakra-flow,
  .element-card.active .chakra-flow {
    opacity: 1;
    animation: chakraFlow 2s linear infinite;
  }

  @keyframes chakraFlow {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(50%);
    }
  }

  /* Mangekyou Watermark */
  .mangekyou-watermark {
    position: absolute;
    top: -20px;
    right: -20px;
    opacity: 0.05;
    transform: rotate(15deg);
    transition: all 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }

  .element-card:hover .mangekyou-watermark {
    opacity: 0.15;
    transform: rotate(0deg) scale(1.1);
  }

  /* Element Symbol */
  .element-symbol {
    position: relative;
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
    z-index: 1;
  }

  .symbol-ring {
    position: absolute;
    inset: 0;
    border: 2px solid var(--element-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .element-card:hover .symbol-ring,
  .element-card.active .symbol-ring {
    box-shadow: 0 0 20px var(--element-glow);
    animation: symbolPulse 1.5s ease-in-out infinite;
  }

  @keyframes symbolPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .symbol-inner {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kanji {
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--element-color);
    font-family: serif;
  }

  .symbol-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--element-glow), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .element-card:hover .symbol-glow,
  .element-card.active .symbol-glow {
    opacity: 1;
  }

  /* Element Info */
  .element-info {
    position: relative;
    z-index: 1;
    margin-bottom: 0.5rem;
  }

  .element-name {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--element-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
  }

  h3 {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.15rem;
  }

  .element-subtitle {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  /* Skills List */
  .skills-list {
    position: relative;
    z-index: 1;
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.4rem;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .skills-list.expanded {
    max-height: 200px;
    opacity: 1;
    margin-top: 1rem;
  }

  .skills-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
    padding: 0.3rem 0;
  }

  .skill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--element-color);
    flex-shrink: 0;
  }

  /* Expand Indicator */
  .expand-indicator {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    color: var(--text-muted);
    transition: all 0.3s ease;
    opacity: 0.5;
  }

  .element-card:hover .expand-indicator {
    color: var(--element-color);
    opacity: 1;
  }

  .element-card.active .expand-indicator {
    transform: rotate(180deg);
    color: var(--element-color);
    opacity: 1;
  }

  /* Elements Diagram */
  .elements-diagram {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.8s ease 0.5s;
    pointer-events: none;
  }

  .elements-diagram.visible {
    opacity: 0.5;
    transform: scale(1);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .elements-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .element-card {
      padding: 1.25rem;
    }

    .element-symbol {
      width: 50px;
      height: 50px;
    }

    .symbol-inner {
      width: 38px;
      height: 38px;
    }

    .kanji {
      font-size: 1.25rem;
    }

    .elements-diagram {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .element-card {
      padding: 1rem;
    }

    .element-symbol {
      width: 44px;
      height: 44px;
      margin-bottom: 0.75rem;
    }

    .symbol-inner {
      width: 34px;
      height: 34px;
    }

    .kanji {
      font-size: 1.1rem;
    }

    h3 {
      font-size: 1rem;
    }

    .skills-list li {
      font-size: 0.8rem;
    }
  }
</style>
