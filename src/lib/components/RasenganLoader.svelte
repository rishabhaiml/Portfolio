<!--
  RASENGAN LOADER COMPONENT
  High-fidelity animated Rasengan with chaotic chakra swirls
-->
<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import rasenganSoundFile from "$lib/assets/effects/naruto_ha.mp3";
  import { fade } from "svelte/transition";

  export let size: number = 180; // Default larger size for detail
  export let text: string = "Gathering Chakra...";

  const dispatch = createEventDispatcher();
  let audioBlocked = false;
  let showOrb = false; // Start hidden until we confirm playback or user interaction
  let audio: HTMLAudioElement;

  onMount(() => {
    console.log("Initializing Rasengan Audio", rasenganSoundFile);
    audio = new Audio(rasenganSoundFile);
    audio.volume = 1.0;

    // Setup completion listener
    audio.onended = () => {
      console.log("Audio ended, finishing loader");
      dispatch("complete");
    };

    // Attempt playback
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Rasengan audio started successfully");
          showOrb = true;
          // No timeout needed, waiting for onended
        })
        .catch((e) => {
          console.warn(
            "Rasengan audio autoplay blocked. Waiting for interaction.",
            e,
          );
          audioBlocked = true;
          // showOrb remains false
        });
    }
  });

  function startExperience() {
    audioBlocked = false;
    showOrb = true;
    audio.play().catch((e) => {
      console.error("Audio failed even after interaction", e);
      // If it fails here, we should probably just finish to not soft-lock
      dispatch("complete");
    });
  }
</script>

<div class="rasengan-container" style="--size: {size}px;">
  {#if showOrb}
    <div class="rasengan-orb" transition:fade={{ duration: 300 }}>
      <!-- Inner Core -->
      <div class="core-bright"></div>
      <div class="core-glow"></div>

      <!-- Chaotic Chakra Shells -->
      <div class="shell shell-1"></div>
      <div class="shell shell-2"></div>
      <div class="shell shell-3"></div>

      <!-- Fast Spinning Trails -->
      <div class="trails">
        {#each Array(6) as _, i}
          <div class="trail trail-{i}" style="--i: {i}"></div>
        {/each}
      </div>

      <!-- Outer Aura -->
      <div class="aura"></div>
    </div>
  {/if}

  {#if text && showOrb}
    <span class="loader-text" transition:fade>{text}</span>
  {/if}

  {#if audioBlocked}
    <div class="start-overlay" transition:fade>
      <button class="start-btn" on:click={startExperience}>
        <span class="btn-text">Initialize Chakra</span>
      </button>
    </div>
  {/if}
</div>

<style>
  .rasengan-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    position: relative;
    /* Ensure container takes up space even if empty to center button */
    min-width: var(--size);
    min-height: var(--size);
    justify-content: center;
  }

  .rasengan-orb {
    position: relative;
    width: var(--size);
    height: var(--size);
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 500px;
    filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.6));
  }

  /* CORE LAYERS */
  .core-bright {
    position: absolute;
    width: 35%;
    height: 35%;
    background: radial-gradient(circle, #ffffff 20%, #bfdbfe 100%);
    border-radius: 50%;
    box-shadow:
      0 0 40px #ffffff,
      0 0 80px #3b82f6;
    z-index: 10;
    /* Performance: Slower animation, opacity-only to reduce composite updates */
    animation: coreFlicker 0.4s ease-in-out infinite alternate;
    will-change: opacity;
  }

  @keyframes coreFlicker {
    from {
      opacity: 0.85;
    }
    to {
      opacity: 1;
    }
  }

  .core-glow {
    position: absolute;
    width: 60%;
    height: 60%;
    background: radial-gradient(
      circle,
      rgba(59, 130, 246, 0.8) 0%,
      transparent 70%
    );
    border-radius: 50%;
    mix-blend-mode: screen;
    animation: pulse 1s ease-in-out infinite;
  }

  /* SHELL LAYERS - The swirling lines */
  .shell {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(147, 197, 253, 0.4);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    will-change: transform; /* Performance: GPU layer hint */
  }

  .shell-1 {
    border-color: transparent transparent rgba(191, 219, 254, 0.6)
      rgba(191, 219, 254, 0.6);
    animation: spin3D 0.8s linear infinite;
  }

  .shell-2 {
    width: 90%;
    height: 90%;
    border-color: rgba(96, 165, 250, 0.5) transparent transparent
      rgba(96, 165, 250, 0.5);
    animation: spin3DReverse 1.2s linear infinite;
  }

  .shell-3 {
    width: 110%;
    height: 110%;
    border: 1px dashed rgba(219, 234, 254, 0.3);
    animation: spinChaos 2s linear infinite;
  }

  /* TRAILS - Fast swishing lines */
  .trails {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: globSpin 4s linear infinite;
  }

  .trail {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    border-top: 2px solid rgba(255, 255, 255, 0.8);
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-bottom: 1px solid transparent;
    filter: blur(1px);
    transform: translate(-50%, -50%) rotate(calc(var(--i) * 60deg))
      rotateX(calc(var(--i) * 30deg));
    animation: trailSpin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: calc(var(--i) * -0.1s);
    will-change: transform; /* Performance: GPU layer hint */
  }

  /* Performance: disable blur on mobile */
  @media (max-width: 768px) {
    .trail {
      filter: none;
    }
  }

  /* AURA */
  .aura {
    position: absolute;
    width: 140%;
    height: 140%;
    background: radial-gradient(
      circle,
      transparent 40%,
      rgba(59, 130, 246, 0.1) 60%,
      transparent 70%
    );
    border-radius: 50%;
    animation: auraPulse 0.5s ease-out infinite;
  }

  /* ANIMATIONS */
  @keyframes spin3D {
    0% {
      transform: rotate3d(1, 1, 1, 0deg);
    }
    100% {
      transform: rotate3d(1, 1, 1, 360deg);
    }
  }

  @keyframes spin3DReverse {
    0% {
      transform: rotate3d(-1, 0.5, 0, 0deg);
    }
    100% {
      transform: rotate3d(-1, 0.5, 0, 360deg);
    }
  }

  @keyframes spinChaos {
    0% {
      transform: rotate3d(0, 1, 0, 0deg) scale(0.9);
    }
    50% {
      transform: rotate3d(0.5, 1, 0.5, 180deg) scale(1.05);
    }
    100% {
      transform: rotate3d(0, 1, 0, 360deg) scale(0.9);
    }
  }

  @keyframes globSpin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes trailSpin {
    0% {
      transform: translate(-50%, -50%) rotate(calc(var(--i) * 60deg))
        rotateX(60deg) rotateZ(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(calc(var(--i) * 60deg))
        rotateX(60deg) rotateZ(360deg);
    }
  }

  @keyframes auraPulse {
    0% {
      transform: scale(0.9);
      opacity: 0.3;
    }
    100% {
      transform: scale(1.1);
      opacity: 0;
    }
  }

  .loader-text {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    color: #60a5fa;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    animation: textGlow 1.5s ease-in-out infinite;
  }

  @keyframes textGlow {
    0%,
    100% {
      opacity: 0.8;
      text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
    50% {
      opacity: 1;
      text-shadow:
        0 0 20px rgba(59, 130, 246, 0.8),
        0 0 30px rgba(59, 130, 246, 0.4);
    }
  }

  .start-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    backdrop-filter: blur(2px);
    z-index: 100;
  }

  .start-btn {
    background: transparent;
    border: 2px solid #60a5fa;
    color: #60a5fa;
    padding: 0.8rem 1.5rem;
    border-radius: 999px;
    font-family: var(--font-heading);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }

  .start-btn:hover {
    background: rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
    transform: scale(1.05);
  }
</style>
