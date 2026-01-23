<!--
  ANIME-ACCURATE KAMUI TRANSITION
  Phase 1: Mangekyou Sharingan eye appears and activates (using component)
  Phase 2: Camera shutter style swirl expands to full screen
  Lightweight and resource-friendly
-->
<script lang="ts">
  import { isNavigating } from "$lib/stores";
  import { onMount } from "svelte";
  import kamuiSoundFile from "$lib/assets/kamui.mp3";
  import SharinganEye from "$lib/components/SharinganEye.svelte";

  export let duration: number = 2200;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationFrame: number;
  let audio: HTMLAudioElement;
  let phase: "idle" | "eye" | "swirl" | "peak" | "release" = "idle";
  let rotationAngle = 0;
  let startTime = 0;
  let shouldActivate = false;

  // Configuration
  const ARM_COUNT = 8;
  const LINE_WIDTH = 3;

  $: if ($isNavigating && phase === "idle") {
    startKamui();
  }

  function startKamui() {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }

    phase = "eye";
    shouldActivate = true; // Trigger SharinganEye activation
    rotationAngle = 0;
    startTime = performance.now();
    animate();
  }

  function animate() {
    if (!ctx || phase === "idle") return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    // Full screen diagonal for complete coverage
    const fullRadius = Math.sqrt(w * w + h * h) / 2;

    const elapsed = performance.now() - startTime;

    // Phase timings: eye(800ms) -> swirl(600ms) -> peak(600ms) -> release(600ms)
    // Extended eye duration to allow activation animation (approx 500-700ms)
    const eyeDuration = 800; // Increased to accommodate activation spin
    const swirlDuration = 600;
    const peakDuration = 600;
    const releaseDuration = 600;

    // Update phase transitions
    if (phase === "eye" && elapsed >= eyeDuration) {
      phase = "swirl";
    } else if (phase === "swirl" && elapsed >= eyeDuration + swirlDuration) {
      phase = "peak";
    } else if (
      phase === "peak" &&
      elapsed >= eyeDuration + swirlDuration + peakDuration
    ) {
      phase = "release";
    } else if (phase === "release" && elapsed >= duration + 400) {
      // Adjusted total duration check
      phase = "idle";
      isNavigating.set(false);
      shouldActivate = false;
      ctx.clearRect(0, 0, w, h);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    if (phase === "eye") {
      // Phase 1: Eye component handles animation. Canvas is clear.
      // We keep canvas clear to let the component visual shine through.
    } else if (phase === "swirl") {
      // Phase 2: Eye fades (via CSS), swirl expands from center
      const t = (elapsed - eyeDuration) / swirlDuration;
      const swirlProgress = easeInQuad(t);

      // Draw expanding swirl
      rotationAngle += 0.1;
      const currentRadius = fullRadius * swirlProgress;
      drawKamuiSwirl(cx, cy, currentRadius, swirlProgress);
    } else if (phase === "peak") {
      // Phase 3: Full swirl at maximum
      rotationAngle += 0.12;
      drawKamuiSwirl(cx, cy, fullRadius, 1);
    } else if (phase === "release") {
      // Phase 4: Swirl fades out
      const t =
        (elapsed - eyeDuration - swirlDuration - peakDuration) /
        releaseDuration;
      const fadeOut = 1 - easeOutQuad(t);
      rotationAngle -= 0.06;
      drawKamuiSwirl(cx, cy, fullRadius, fadeOut);
    }

    animationFrame = requestAnimationFrame(animate);
  }

  // Full-screen camera shutter style swirl
  function drawKamuiSwirl(
    cx: number,
    cy: number,
    maxRadius: number,
    intensity: number,
  ) {
    if (!ctx) return;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle);

    // Enable subtle white glow for transparent effect
    ctx.shadowColor = `rgba(255, 255, 255, ${0.6 * intensity})`;
    ctx.shadowBlur = 8;

    for (let i = 0; i < ARM_COUNT; i++) {
      const baseAngle = (i / ARM_COUNT) * Math.PI * 2;

      ctx.beginPath();

      // Draw curved arc from outer edge spiraling toward center
      const steps = 50;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;

        // Radius decreases as we go along the arm (outer to inner)
        const radius = maxRadius * (1 - t * 0.92);

        // Curve amount increases toward center (creates spiral)
        const curveAmount = t * t * 1.5;
        const angle = baseAngle + curveAmount;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        if (s === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = `rgba(30, 30, 30, ${0.8 * intensity})`;
      ctx.lineWidth = LINE_WIDTH + (i % 2);
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Disable shadow for center
    ctx.shadowBlur = 0;

    // Dark center vortex
    const centerSize = 20 * intensity;
    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerSize * 2);
    centerGrad.addColorStop(0, `rgba(0, 0, 0, ${0.9 * intensity})`);
    centerGrad.addColorStop(0.6, `rgba(0, 0, 0, ${0.5 * intensity})`);
    centerGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);

    ctx.beginPath();
    ctx.arc(0, 0, centerSize * 2, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();

    ctx.restore();
  }

  function easeInQuad(t: number): number {
    return t * t;
  }

  function easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  onMount(() => {
    ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    audio = new Audio(kamuiSoundFile);
    audio.volume = 0.8;
    audio.preload = "auto";

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<!-- Center Eye Container -->
<div
  class="eye-container"
  class:visible={phase === "eye" || (phase === "swirl" && rotationAngle < 1)}
  aria-hidden="true"
>
  <SharinganEye
    variant="kakashi"
    size={150}
    forceMangekyou={true}
    triggerActivation={shouldActivate}
  />
</div>

<canvas
  bind:this={canvas}
  class="kamui-canvas"
  class:active={phase !== "idle"}
  aria-hidden="true"
></canvas>

<style>
  .kamui-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.1s ease;
  }

  .kamui-canvas.active {
    opacity: 1;
  }

  .eye-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000; /* Above canvas initially */
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
  }

  .eye-container.visible {
    opacity: 1;
  }
</style>
