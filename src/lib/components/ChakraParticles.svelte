<!--
  CHAKRA PARTICLES COMPONENT
  Flowing particle system simulating chakra energy
  Reduced on mobile for better readability
-->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { eyeEvolution, sageMode } from "$lib/stores";

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    life: number;
    maxLife: number;
    hue: number;
  }

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let particles: Particle[] = [];
  let animationFrame: number;
  let mouseX = 0;
  let mouseY = 0;
  let isMobile = false;
  let particleCount = 80;
  let globalOpacity = 0.8;
  let isVisible = true; // Track visibility for pausing animation

  // Color based on current state
  $: baseHue = $sageMode
    ? 30
    : $eyeEvolution >= 5
      ? 270
      : $eyeEvolution >= 1
        ? 0
        : 220;

  function detectMobile() {
    const width = window.innerWidth;
    if (width <= 480) {
      // Small mobile - very few particles, lower opacity
      isMobile = true;
      particleCount = 15;
      globalOpacity = 0.4;
    } else if (width <= 768) {
      // Tablet/large mobile - fewer particles
      isMobile = true;
      particleCount = 30;
      globalOpacity = 0.5;
    } else {
      // Desktop - full experience
      isMobile = false;
      particleCount = 80;
      globalOpacity = 0.8;
    }
  }

  function createParticle(x?: number, y?: number): Particle {
    return {
      x: x ?? Math.random() * (canvas?.width || window.innerWidth),
      y: y ?? Math.random() * (canvas?.height || window.innerHeight),
      vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5) - 0.3,
      size: Math.random() * (isMobile ? 2 : 3) + 1,
      opacity: Math.random() * (isMobile ? 0.3 : 0.5) + 0.2,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      hue: baseHue + (Math.random() - 0.5) * 30,
    };
  }

  function initParticles() {
    detectMobile();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function updateParticle(p: Particle): boolean {
    p.x += p.vx;
    p.y += p.vy;
    p.life++;

    // Gentle attraction toward mouse (disabled on mobile for performance)
    if (!isMobile) {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200 && dist > 0) {
        p.vx += (dx / dist) * 0.02;
        p.vy += (dy / dist) * 0.02;
      }
    }

    // Damping
    p.vx *= 0.99;
    p.vy *= 0.99;

    // Fade based on life
    const lifeRatio = p.life / p.maxLife;
    p.opacity = Math.sin(lifeRatio * Math.PI) * (isMobile ? 0.4 : 0.6);

    // Check if particle is dead or out of bounds
    return (
      p.life < p.maxLife &&
      p.x > -50 &&
      p.x < canvas.width + 50 &&
      p.y > -50 &&
      p.y < canvas.height + 50
    );
  }

  function drawParticle(p: Particle) {
    if (!ctx) return;

    ctx.save();

    // Simplified glow on mobile
    if (isMobile) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${p.opacity * 0.5})`;
      ctx.fill();
    } else {
      // Full glow effect on desktop
      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.size * 3,
      );
      gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.opacity})`);
      gradient.addColorStop(
        0.5,
        `hsla(${p.hue}, 70%, 50%, ${p.opacity * 0.5})`,
      );
      gradient.addColorStop(1, `hsla(${p.hue}, 60%, 40%, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Core
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.opacity})`;
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    if (!ctx || !isVisible) {
      // Re-request frame to check again when visible
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles = particles.filter((p) => {
      const alive = updateParticle(p);
      if (alive) drawParticle(p);
      return alive;
    });

    // Spawn new particles
    while (particles.length < particleCount) {
      particles.push(createParticle());
    }

    // Draw connections between nearby particles (desktop only)
    // Performance fix: Use squared distance to avoid sqrt until needed
    if (!isMobile) {
      ctx.strokeStyle = `hsla(${baseHue}, 70%, 50%, 0.1)`;
      ctx.lineWidth = 0.5;
      const maxDistSq = 10000; // 100 * 100

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          // Only calculate sqrt if within threshold
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.globalAlpha = (1 - dist / 100) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isMobile) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  }

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const wasMobile = isMobile;
    detectMobile();

    // Reinitialize if mobile state changed
    if (wasMobile !== isMobile) {
      initParticles();
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d");

    handleResize();
    initParticles();
    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // IntersectionObserver to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="chakra-particles"
  style="opacity: {globalOpacity};"
  aria-hidden="true"
></canvas>

<style>
  .chakra-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
  }
</style>
