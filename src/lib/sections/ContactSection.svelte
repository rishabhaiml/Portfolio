<!--
  CONTACT SECTION
  Final section with Rinnegan theme and contact info
-->
<script lang="ts">
  import { onMount } from "svelte";
  import { eyeEvolution, currentSection, visitedSections } from "$lib/stores";
  import SharinganEye from "$lib/components/SharinganEye.svelte";

  let sectionRef: HTMLElement;
  let isVisible = false;

  const contactInfo = {
    email: "rishabhshukla092@gmail.com",
    linkedin: "linkedin.com/in/rishabhbshukla",
    location: "Mumbai, India",
    subject: "Project Inquiry / Collaboration",
    body: "Hi Rishabh,\n\nI was impressed by your portfolio and would like to discuss a potential collaboration.\n\nBest regards,",
  };

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible = true;
          eyeEvolution.set(5); // Rinnegan
          currentSection.set(4);
          visitedSections.update((v) => v.add(4));
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(sectionRef);

    return () => observer.disconnect();
  });
</script>

<section id="contact" class="contact section" bind:this={sectionRef}>
  <div class="container">
    <div class="contact-content">
      <!-- Large Rinnegan Display -->
      <div class="rinnegan-display" class:visible={isVisible}>
        <SharinganEye
          variant="sasuke-rinne"
          forceMangekyou={true}
          size={200}
          showLabel={true}
        />
      </div>

      <div class="contact-info" class:visible={isVisible}>
        <header class="section-header">
          <span class="section-label">Ultimate Technique</span>
          <h2>Let's <span class="text-gradient-rinnegan">Connect</span></h2>
          <p class="section-desc">Ready to collaborate on your next mission?</p>
        </header>

        <div class="contact-cards">
          <!-- Email -->
          <a
            href="mailto:{contactInfo.email}?subject={encodeURIComponent(
              contactInfo.subject,
            )}&body={encodeURIComponent(contactInfo.body)}"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-card email"
          >
            <span class="card-icon">✉️</span>
            <div class="card-content">
              <span class="card-label">Email</span>
              <span class="card-value">{contactInfo.email}</span>
            </div>
            <span class="card-arrow">→</span>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://{contactInfo.linkedin}"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-card linkedin"
          >
            <span class="card-icon">💼</span>
            <div class="card-content">
              <span class="card-label">LinkedIn</span>
              <span class="card-value">{contactInfo.linkedin}</span>
            </div>
            <span class="card-arrow">→</span>
          </a>

          <!-- Location -->
          <div class="contact-card location">
            <span class="card-icon">📍</span>
            <div class="card-content">
              <span class="card-label">Location</span>
              <span class="card-value">{contactInfo.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="portfolio-footer">
      <p>Made by AI (to showcase Rishabh Shukla's Work)</p>
      <p class="footer-ninja">The path of the ninja never ends.</p>
    </footer>

    <!-- Uchiha Clan Symbol Footer -->
    <div class="uchiha-footer" aria-hidden="true">
      <div class="uchiha-fan">
        <div class="fan-top"></div>
        <div class="fan-bottom"></div>
        <div class="fan-handle"></div>
      </div>
      <!-- Uchiha name removed as requested -->
    </div>
  </div>

  <!-- Background effects -->
  <div class="rinnegan-bg" aria-hidden="true"></div>
</section>

<style>
  .contact {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, var(--bg-primary) 0%, #0a0510 100%);
    overflow: hidden;
    padding-bottom: 4rem;
  }

  .container {
    width: 100%;
  }

  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 900px) {
    .contact-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .rinnegan-display {
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: scale(0.8);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .rinnegan-display.visible {
    opacity: 1;
    transform: scale(1);
    animation: rinneganPulse 3s ease-in-out infinite;
  }

  /* Rinne Sharingan animation - subtle rotation and pulse */
  @keyframes rinneganPulse {
    0%,
    100% {
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))
        drop-shadow(0 0 40px rgba(139, 92, 246, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8))
        drop-shadow(0 0 60px rgba(139, 92, 246, 0.5));
    }
  }

  .rinnegan-display.visible :global(.eye-svg) {
    animation: rinneganRotate 20s linear infinite;
  }

  @keyframes rinneganRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .contact-info {
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
  }

  .contact-info.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .section-header {
    margin-bottom: 2rem;
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

  h2 {
    margin-bottom: 0.5rem;
  }

  .section-desc {
    color: var(--text-secondary);
  }

  .contact-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  .contact-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--rinnegan-purple);
    transform: translateX(5px);
  }

  .card-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .card-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .card-arrow {
    color: var(--rinnegan-purple);
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
  }

  .contact-card:hover .card-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .portfolio-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    text-align: center;
  }

  .portfolio-footer p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .footer-ninja {
    font-style: italic;
    opacity: 0.6;
  }

  /* Background effect */
  .rinnegan-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at 30% 50%,
        rgba(139, 92, 246, 0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 70% 70%,
        rgba(139, 92, 246, 0.05) 0%,
        transparent 40%
      );
    pointer-events: none;
    z-index: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .contact {
      min-height: auto;
      padding: 4rem 0;
    }

    .rinnegan-display {
      transform: scale(0.6);
    }

    .rinnegan-display.visible {
      transform: scale(0.6);
    }

    .contact-info.visible {
      transform: translateX(0);
    }

    .section-header {
      text-align: center;
    }

    .contact-card {
      padding: 1rem;
    }

    .card-value {
      font-size: 0.85rem;
      word-break: break-word;
    }

    .portfolio-footer {
      margin-top: 2rem;
    }
  }

  @media (max-width: 480px) {
    .rinnegan-display {
      transform: scale(0.5);
      margin: -2rem 0;
    }

    .rinnegan-display.visible {
      transform: scale(0.5);
    }

    .contact-card {
      gap: 0.75rem;
    }

    .card-icon {
      font-size: 1.25rem;
    }

    .card-value {
      font-size: 0.8rem;
    }

    .card-arrow {
      display: none;
    }
  }
</style>
