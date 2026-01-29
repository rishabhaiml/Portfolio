<!--
  EXPERIENCE SECTION
  Timeline styled as a ninja's journey with Amaterasu effects
-->
<script lang="ts">
  import { onMount } from "svelte";
  import { eyeEvolution, currentSection } from "$lib/stores";
  import NinjaTimeline from "$lib/components/NinjaTimeline.svelte";

  let sectionRef: HTMLElement;
  let isVisible = false;

  const timelineItems = [
    {
      title: "Secondary School Certificate (SSC)",
      subtitle: "10th Standard",
      period: "2016 - 2017",
      type: "education" as const,
      description: [
        "Percentage: 83.00%",
        "Mathematics: 96/100",
        "Science: 96/100",
      ],
    },
    {
      title: "Higher Secondary Certificate (HSC)",
      subtitle: "12th Standard",
      period: "2017 - 2019",
      type: "education" as const,
      description: [
        "Percentage: 60.92%",
        "Computer Science: 148/200",
        "Developed interest in programming and technology",
      ],
    },
    {
      title: "Bachelor of Computer Applications (BCA)",
      subtitle: "K. P. B. Hinduja College, Mumbai",
      period: "2019 - 2022",
      type: "education" as const,
      description: [
        "CGPA: 8.13/10.0",
        "Foundation in computer science and programming",
        "Developed passion for AI/ML and mobile development",
      ],
    },
    {
      title: "Freelance Application Developer",
      subtitle: "Self-Employed",
      period: "Jan 2021 - Mar 2024",
      type: "work" as const,
      description: [
        "Delivered many production-grade cross-platform mobile apps",
        "Deployed containerized backend microservices using Docker",
        "Built reactive UIs with GetX state management",
      ],
    },
    {
      title: "Master of Computer Applications (MCA)",
      subtitle: "MET Institute of Computer Science, Mumbai",
      period: "2024 - 2026 (Expected)",
      type: "education" as const,
      description: [
        "CGPA: 8.5/10.0",
        "Thesis: Deep Learning for Real-Time Music Visualization",
        "Focus on AI/ML and audio pattern recognition",
      ],
    },
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible = true;
          eyeEvolution.set(4); // Mangekyou Sharingan
          currentSection.set(3);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef);

    return () => observer.disconnect();
  });
</script>

<section id="experience" class="experience section" bind:this={sectionRef}>
  <div class="container">
    <header class="section-header" class:visible={isVisible}>
      <span class="section-label">Ninja Path</span>
      <h2>
        Experience & <span class="text-gradient-sharingan">Education</span>
      </h2>
      <p class="section-desc">My journey from student to AI/ML engineer</p>
    </header>

    <NinjaTimeline items={timelineItems} />
  </div>

  <!-- Amaterasu fire decorations -->
  <div class="amaterasu-decoration left" aria-hidden="true"></div>
  <div class="amaterasu-decoration right" aria-hidden="true"></div>
</section>

<style>
  .experience {
    position: relative;
    background: linear-gradient(
      180deg,
      var(--bg-secondary) 0%,
      var(--bg-primary) 100%
    );
    overflow: hidden;
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
    color: var(--sharingan-red);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
  }

  .section-desc {
    max-width: 500px;
    margin: 0 auto;
    color: var(--text-secondary);
  }

  /* Amaterasu decorations */
  .amaterasu-decoration {
    position: absolute;
    top: 50%;
    width: 200px;
    height: 400px;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.15;
  }

  .amaterasu-decoration.left {
    left: -100px;
    background: radial-gradient(
      ellipse at right,
      var(--sharingan-red) 0%,
      transparent 70%
    );
  }

  .amaterasu-decoration.right {
    right: -100px;
    background: radial-gradient(
      ellipse at left,
      var(--sharingan-red) 0%,
      transparent 70%
    );
  }

  @media (max-width: 768px) {
    .amaterasu-decoration {
      display: none;
    }
  }
</style>
