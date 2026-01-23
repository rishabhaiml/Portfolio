<!--
  SHARINGAN EYE COMPONENT - ANIME-ACCURATE REMAKE
  Implements exact SVG paths for authentic tomoe shapes
  Supports: 1/2/3-tomoe, Itachi/Sasuke/Kakashi Mangekyou, Rinnegan
-->
<script lang="ts">
  import { onDestroy } from "svelte";
  import { eyeEvolution, eyeStageName, sageMode } from "$lib/stores";
  import { tweened } from "svelte/motion";
  import { cubicOut, cubicIn, cubicInOut, linear } from "svelte/easing";

  export let size: number = 60;
  export let showLabel: boolean = false;
  export let forceMangekyou: boolean = false;
  export let forceCharacterEye: boolean = false;
  export let variant:
    | "sasuke"
    | "sasuke-rinne"
    | "itachi"
    | "madara"
    | "obito"
    | "shisui"
    | "kakashi"
    | "naruto"
    | "jiraiya"
    | "pain"
    | "gaara" = "itachi";

  export let stage: number | null = null;

  // Trigger activation animation externally
  export let triggerActivation: boolean = false;

  // Check if this is a non-Sharingan character eye
  $: isCharacterEye = ["naruto", "jiraiya", "pain", "gaara"].includes(variant);
  $: isMangekyouVariant = [
    "itachi",
    "sasuke",
    "madara",
    "obito",
    "shisui",
    "kakashi",
  ].includes(variant);

  // Effective evolution level
  $: effectiveEvolution =
    stage !== null
      ? stage
      : forceCharacterEye || isCharacterEye
        ? 6
        : forceMangekyou
          ? 4
          : $eyeEvolution;

  // Character-specific activation configs
  const activationConfigs: Record<
    string,
    {
      direction: number; // 1 = clockwise, -1 = counter-clockwise
      duration: number; // milliseconds
      easing: (t: number) => number;
      rotationAmount: number; // degrees to rotate during activation
    }
  > = {
    itachi: {
      direction: 1, // Clockwise
      duration: 700, // Medium (0.7s)
      easing: cubicInOut, // Smooth ease-in → ease-out
      rotationAmount: 360,
    },
    shisui: {
      direction: 1, // Clockwise
      duration: 350, // Fast (0.35s)
      easing: linear, // Near-linear, minimal easing
      rotationAmount: 360,
    },
    sasuke: {
      direction: -1, // Counter-clockwise
      duration: 450, // Fast (0.45s)
      easing: (t: number) => {
        // Sharp ease-in with slight overshoot
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
      rotationAmount: 400, // Slight overshoot effect
    },
    kakashi: {
      direction: 1, // Clockwise
      duration: 500, // Medium-fast (0.5s)
      easing: linear, // Mostly linear, firm stop
      rotationAmount: 360,
    },
    obito: {
      direction: 1, // Same as Kakashi
      duration: 500,
      easing: linear,
      rotationAmount: 360,
    },
    madara: {
      direction: 1, // Clockwise
      duration: 900, // Slow (0.9s)
      easing: (t: number) => {
        // Slow ease-in, strong ease-out (heavy, deliberate)
        return t < 0.3
          ? cubicIn(t / 0.3) * 0.3
          : 0.3 + cubicOut((t - 0.3) / 0.7) * 0.7;
      },
      rotationAmount: 360,
    },
  };

  // Animation state
  let isActivating = false;
  let activationComplete = false;
  let previousVariant = variant;

  // Performance: Consolidated activation animation state (reduces parallel animation loops)
  const activation = tweened(
    { rotation: 0, glow: 0 },
    { duration: 700, easing: cubicInOut },
  );

  // Continuous rotation for idle state (disabled for Mangekyou after activation)
  const rotation = tweened(0, { duration: 2000, easing: cubicOut });

  // Simple reactive variable instead of tweened store for evolution glow
  let glowIntensity = 0.5;

  let isEvolving = false;
  let previousStage = 0;

  // Performance fix: Track rotation timeout for cleanup
  let rotationTimeout: ReturnType<typeof setTimeout> | null = null;
  let isRotating = false;

  // Trigger activation when variant changes (for cycling in gallery)
  $: if (variant !== previousVariant && isMangekyouVariant && forceMangekyou) {
    previousVariant = variant;
    playActivationAnimation();
  }

  // External trigger support
  $: if (triggerActivation && isMangekyouVariant) {
    playActivationAnimation();
  }

  async function playActivationAnimation() {
    if (isActivating) return;

    const config = activationConfigs[variant] || activationConfigs.itachi;

    isActivating = true;
    activationComplete = false;

    // Reset and start glow
    activation.set({ rotation: 0, glow: 0 }, { duration: 0 });
    activation.set(
      { rotation: 0, glow: 1 },
      { duration: config.duration * 0.3 },
    );

    // Perform character-specific rotation
    await activation.set(
      { rotation: config.direction * config.rotationAmount, glow: 1 },
      { duration: config.duration, easing: config.easing },
    );

    // Fade glow
    activation.set(
      { rotation: config.direction * config.rotationAmount, glow: 0 },
      { duration: 300 },
    );

    // Lock in place
    isActivating = false;
    activationComplete = true;
  }

  // React to evolution changes
  $: if ($eyeEvolution !== previousStage) {
    triggerEvolution();
    previousStage = $eyeEvolution;
  }

  // Performance fix: Guard against redundant rotation starts
  $: {
    if ($eyeEvolution >= 1 && $eyeEvolution <= 3) {
      if (!isRotating) {
        isRotating = true;
        startRotation();
      }
    } else {
      // Stop rotation when evolution changes outside 1-3
      isRotating = false;
      if (rotationTimeout) {
        clearTimeout(rotationTimeout);
        rotationTimeout = null;
      }
    }
  }

  function startRotation() {
    // Clear any existing timeout to prevent stacking
    if (rotationTimeout) {
      clearTimeout(rotationTimeout);
    }

    const speeds: Record<number, number> = {
      1: 6000,
      2: 5000,
      3: 4000,
    };
    const duration = speeds[$eyeEvolution] || 4000;
    const direction = 360;

    rotation.set($rotation + direction, { duration });
    rotationTimeout = setTimeout(() => {
      if ($eyeEvolution >= 1 && $eyeEvolution <= 3 && isRotating) {
        startRotation();
      }
    }, duration);
  }

  // Performance fix: Cleanup on component destroy
  onDestroy(() => {
    if (rotationTimeout) {
      clearTimeout(rotationTimeout);
      rotationTimeout = null;
    }
    isRotating = false;
  });

  function triggerEvolution() {
    isEvolving = true;
    glowIntensity = 1;

    setTimeout(() => {
      isEvolving = false;
      glowIntensity = 0.6;
    }, 1000);
  }

  // Color based on stage
  $: eyeColor = $sageMode
    ? "#FF8C00"
    : $eyeEvolution >= 5
      ? "#8B5CF6"
      : "#E63946";

  $: glowColor = $sageMode
    ? "rgba(255, 140, 0, var(--glow))"
    : $eyeEvolution >= 5
      ? "rgba(139, 92, 246, var(--glow))"
      : "rgba(230, 57, 70, var(--glow))";

  // Combined glow for activation
  $: combinedGlow = Math.max(glowIntensity, $activation.glow);
</script>

<div
  class="sharingan-container"
  style="--size: {size}px; --glow: {combinedGlow}; --eye-color: {eyeColor}; --glow-color: {glowColor}; --activation-glow: {$activation.glow};"
  class:evolving={isEvolving}
  class:activating={isActivating}
  role="img"
  aria-label="Sharingan Eye - {$eyeStageName}"
>
  <!-- Stage 0: Normal Eye -->
  {#if effectiveEvolution === 0}
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      class="eye-svg normal-eye"
    >
      <circle cx="100" cy="100" r="95" fill="#000" />
      <circle cx="100" cy="100" r="92" fill="#f8f8f8" />
      <circle cx="100" cy="100" r="35" fill="#1a1a1a" />
      <circle cx="100" cy="100" r="15" fill="#000" />
      <ellipse cx="88" cy="85" rx="8" ry="12" fill="#fff" opacity="0.6" />
    </svg>

    <!-- Stages 1-3: Tomoe Sharingan with EXACT anime-accurate tomoe -->
  {:else if effectiveEvolution >= 1 && effectiveEvolution <= 3}
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      class="eye-svg sharingan"
    >
      <defs>
        <!-- Anime-accurate iris gradient -->
        <radialGradient id="sharinganIris">
          {#if effectiveEvolution === 2 || effectiveEvolution === 3}
            <!-- User's specific gradient for 2 and 3 tomoe -->
            <stop offset="0" style="stop-color:#660000; stop-opacity: 1;" />
            <stop style="stop-color:#c30000; stop-opacity: 1;" offset="0.6" />
            <stop style="stop-color:#a00000; stop-opacity: 1;" offset="1" />
          {:else}
            <stop offset="0%" stop-color="#ff4444" />
            <stop offset="50%" stop-color="#E63946" />
            <stop offset="100%" stop-color="#cc0000" />
          {/if}
        </radialGradient>
        <!-- Red glow filter -->
        <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feColorMatrix type="saturate" values="1.5" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Black outer ring -->
      <circle cx="100" cy="100" r="95" fill="#000" />

      <!-- White sclera with subtle veins -->
      <circle cx="100" cy="100" r="92" fill="#f8f8f8" />
      <path
        d="M 50,80 Q 70,85 90,82"
        stroke="#ff000018"
        stroke-width="1"
        fill="none"
      />
      <path
        d="M 150,80 Q 130,85 110,82"
        stroke="#ff000018"
        stroke-width="1"
        fill="none"
      />
      <path
        d="M 60,120 Q 75,115 90,118"
        stroke="#ff000015"
        stroke-width="0.8"
        fill="none"
      />
      <path
        d="M 140,120 Q 125,115 110,118"
        stroke="#ff000015"
        stroke-width="0.8"
        fill="none"
      />

      <!-- Red iris with gradient -->
      <circle
        cx="100"
        cy="100"
        r="65"
        fill="url(#sharinganIris)"
        filter="url(#redGlow)"
      />

      <!-- TOMOE: User's exact SVG with polar coordinate placement -->
      <g
        class="tomoe-group"
        style="transform: rotate({$rotation}deg); transform-origin: 100px 100px;"
      >
        {#if effectiveEvolution === 2}
          <!-- User's exact 2-tomoe SVG scaled (0.66x to fit 200px) -->
          <g transform="translate(100, 100) scale(0.66) translate(-150, -150)">
            <!-- Inner ring -->
            <circle
              style="fill:none; stroke:#000000; stroke-width:4;stroke-opacity:0.3"
              cx="150"
              cy="150"
              r="90"
            />
            <!-- Tomoe 1 -->
            <g id="tomoe2-1" transform="rotate(120 150 150)">
              <circle style="fill:#000;" cx="60" cy="150" r="20" />
              <path
                style="fill:#000;"
                d="M 60,170 59.4,152.9 C 43.9,152.9 28.7,154.1 18.8,133.3 22.4,156 32.8,170 60,170 z"
              />
            </g>
            <!-- Tomoe 2 -->
            <use href="#tomoe2-1" transform="rotate(180 150 150)" />
            <!-- Center pupil -->
            <circle style="fill:#000;" cx="150" cy="150" r="25" />
          </g>
        {:else if effectiveEvolution === 3}
          <!-- User's exact 3-tomoe SVG scaled (0.66x) -->
          <g transform="translate(100, 100) scale(0.66) translate(-150, -150)">
            <!-- Inner ring -->
            <circle
              style="fill:none; stroke:#000000; stroke-width:4;stroke-opacity:0.3"
              cx="150"
              cy="150"
              r="90"
            />
            <!-- Tomoe 1 (0 rotation) -->
            <g id="tomoe3-1">
              <circle style="fill:#000;" cx="60" cy="150" r="20" />
              <path
                style="fill:#000;"
                d="M 60,170 59.4,152.9 C 43.9,152.9 28.7,154.1 18.8,133.3 22.4,156 32.8,170 60,170 z"
              />
            </g>
            <!-- Tomoe 2 (120 deg) -->
            <use href="#tomoe3-1" transform="rotate(120 150 150)" />
            <!-- Tomoe 3 (-120 deg) -->
            <use href="#tomoe3-1" transform="rotate(-120 150 150)" />
            <!-- Center pupil -->
            <circle style="fill:#000;" cx="150" cy="150" r="25" />
          </g>
        {:else}
          {#each Array($eyeEvolution) as _, i}
            <!-- Generic 1-tomoe generation (keeps existing logic for stage 1) -->
            {@const angleDeg = i * (360 / $eyeEvolution)}
            {@const angleRad = (angleDeg * Math.PI) / 180}
            {@const radius = 45}
            {@const x = 100 + radius * Math.sin(angleRad)}
            {@const y = 100 - radius * Math.cos(angleRad)}
            {@const rotationToCenter = angleDeg + 180}
            <g transform="translate({x}, {y}) rotate({rotationToCenter}, 0, 0)">
              <g transform="scale(0.39) translate(-60, -150)">
                <circle cx="60" cy="150" r="20" fill="#000000" />
                <path
                  d="M 60,170 59.4,152.9 C 43.9,152.9 28.7,154.1 18.8,133.3 22.4,156 32.8,170 60,170 Z"
                  fill="#000000"
                />
              </g>
            </g>
          {/each}
        {/if}
      </g>

      <!-- Central pupil (hidden for stage 2 and 3 which have their own pupils) -->
      {#if effectiveEvolution !== 2 && effectiveEvolution !== 3}
        <circle cx="100" cy="100" r="15" fill="#000" />
      {/if}

      <!-- Highlight for realism -->
      <ellipse cx="88" cy="85" rx="8" ry="12" fill="#ffffff" opacity="0.5" />
    </svg>

    <!-- Stage 4: Mangekyou Sharingan - Character-specific patterns -->
  {:else if effectiveEvolution === 4}
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      class="eye-svg mangekyou"
    >
      <defs>
        <radialGradient id="mangekyouIris">
          <stop offset="0%" stop-color="#ff0000" />
          <stop offset="50%" stop-color="#E63946" />
          <stop offset="100%" stop-color="#8B0000" />
        </radialGradient>
        <filter id="mangekyouGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Base eye structure -->
      <circle cx="100" cy="100" r="95" fill="#000" />
      <circle cx="100" cy="100" r="92" fill="#f8f8f8" />
      <circle
        cx="100"
        cy="100"
        r="65"
        fill="url(#mangekyouIris)"
        filter="url(#mangekyouGlow)"
      />

      <!-- Character-specific Mangekyou pattern with activation animation -->
      <g
        class="mangekyou-pattern"
        class:activating={isActivating}
        style="transform: rotate({$activation.rotation}deg); transform-origin: 100px 100px;"
      >
        {#if variant === "itachi"}
          <!-- ITACHI'S MANGEKYOU: User's exact curved blade pattern -->
          <!-- Original SVG is 300x300, scale to fit in ~130px diameter (65 radius) -->
          <g transform="translate(100, 100) scale(0.43) translate(-150, -150)">
            <!-- Itachi's curved blade tomoe -->
            <path
              style="fill:#000;"
              d="M 177.6,10.7 C 135,68.4 155.4,100.7 179.8,118.5 C 260.9,160.6 274.8,214.5 255.9,244.9 C 237.3,191.9 198,172.4 158.5,194.9 C 86.9,238.6 40.7,231.2 15.7,196.6 C 58.2,203.1 109.1,193.5 107.9,128.3 C 109.5,97.6 111.5,16.6 177.6,10.7 z"
            />
            <!-- Red center -->
            <circle style="fill:#a00000;" cx="150" cy="150" r="20" />
          </g>
        {:else if variant === "sasuke"}
          <!-- SASUKE'S ETERNAL MANGEKYOU (Standard Gallery Version) -->
          <g transform="translate(100, 100) scale(0.43) translate(-150, -150)">
            <!-- Removed background circle to match standard Mangekyou style -->
            <g id="sasuke-ems-tomoe-1">
              <path
                style="fill:none; stroke:#000; stroke-width: 10;"
                d="M200,150 C 200,215 170,275 150,295 C 130,275 100,215 100,150 C 100,85 130,25 150,5 C 170,25 200,85 200,150 z"
                id="sasuke-ems-tomoe-1a"
              />
              <path
                style="fill:#000;"
                d="M 275,77.5 C 260,40 200,0 150,5 C 170,30 183.4,55.1 190,80 C 215,75 244.2,71.7 275,77.5 z"
                id="sasuke-ems-tomoe-1b"
              />
              <use
                href="#sasuke-ems-tomoe-1b"
                transform="rotate(180 150 150)"
              />
              <path
                style="fill:#000;"
                d="M 150,258.7 C 141,244 131.5,195.8 128.6,162.4 L 150,150 171.4,162.4 C 168.5,195.8 159,244 150,258.7 z"
              />
            </g>
            <use href="#sasuke-ems-tomoe-1" transform="rotate(120 150 150)" />
            <use href="#sasuke-ems-tomoe-1" transform="rotate(-120 150 150)" />
            <circle style="fill:#a00000;" cx="150" cy="150" r="20" />
          </g>
        {:else if variant === "sasuke-rinne"}
          <!-- SASUKE'S RINNE SHARINGAN: 9-tomoe with Rinnegan background -->
          <defs>
            <!-- Duplicated Rinnegan gradients for standalone usage -->
            <radialGradient
              gradientUnits="userSpaceOnUse"
              r="0.69999999"
              cy="0.80000001"
              fy="1"
              id="rsGr"
              cx="0.5"
              fx="0.5"
              gradientTransform="matrix(1.0192207,0,0,1.0192207,-62.432286,3.5298889)"
            >
              <stop style="stop-color:#98a6a9;stop-opacity:1;" offset="0" />
              <stop style="stop-color:#8b7496;stop-opacity:1;" offset="1" />
            </radialGradient>
            <radialGradient
              fx="150"
              cx="150"
              gradientUnits="userSpaceOnUse"
              r="210"
              cy="240"
              fy="300"
              id="rsGr4"
              gradientTransform="matrix(1.0344828,0,0,1.0344828,-5.1724077,-5.1724114)"
            >
              <stop style="stop-color:#98a6a9;stop-opacity:1;" offset="0" />
              <stop style="stop-color:#8b7496;stop-opacity:1;" offset="1" />
            </radialGradient>
          </defs>

          <g transform="translate(100, 100) scale(0.66) translate(-150, -150)">
            <!-- Base Iris using Rinnegan Gradient -->
            <circle
              id="base"
              cx="150"
              cy="149.99991"
              r="150"
              style="fill:url(#rsGr4);stroke:#000000;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none"
            />

            <!-- Central shape -->
            <path
              style="fill:#000000"
              d="m 164,150 c 0,6.59966 -7.40034,14 -14,14 -6.59966,0 -14,-7.40034 -14,-14 0,-6.59966 7.40034,-14 14,-14 6.59966,0 14,7.40034 14,14 z"
              id="centro"
            />

            <!-- Concentric Rings (Iris Groups) -->
            <g id="iris">
              <circle
                id="iris1"
                cx="150"
                cy="150"
                r="50"
                style="fill:none;stroke:#0a0000;stroke-width:2.5;stroke-opacity:1"
              />
              <circle
                id="iris2"
                cx="150"
                cy="150"
                r="87"
                style="fill:none;stroke:#0a0000;stroke-width:2.5;stroke-opacity:1"
              />
              <circle
                id="iris3"
                cx="150"
                cy="150"
                r="122.5"
                style="fill:none;stroke:#0a0000;stroke-width:2.5;stroke-opacity:1"
              />
            </g>

            <!-- Tomoe Group 1 -->
            <g id="tomoe1">
              <path
                style="fill:black;stroke:black;stroke-width:1;stroke-linejoin:round"
                d="m 157.30532,82.667729 c -8.08498,1.425605 -13.34628,5.758173 -16.07194,12.830177 -0.64992,1.625862 -1.11497,5.413334 -0.78894,7.262314 0.93457,5.30024 6.00061,8.84234 11.31033,7.90609 5.30972,-0.93624 8.85877,-5.99743 7.92419,-11.297657 -0.83182,-4.717494 -4.93573,-8.024147 -9.57246,-8.037997 2.85972,-4.109924 7.008,-7.320355 12.00511,-8.939232 -1.5739,-0.09228 -3.18673,-0.0093 -4.80629,0.276305 z"
                id="tomoe1a"
              />
              <use
                href="#tomoe1a"
                transform="matrix(-0.5,0.8660254,-0.8660254,-0.5,354.90381,95.096189)"
              />
              <use
                href="#tomoe1a"
                transform="matrix(-0.5,-0.8660254,0.8660254,-0.5,95.096189,354.90381)"
              />
            </g>

            <!-- Tomoe Group 2 -->
            <g id="tomoe2">
              <path
                id="tomoe2a"
                d="m 145.97342,253.8582 c 7.7146,-2.80789 12.14362,-7.98825 13.59983,-15.42612 0.35772,-1.71402 0.15802,-5.52471 -0.48413,-7.28898 -1.84075,-5.05743 -7.4449,-7.66601 -12.51138,-5.82196 -5.06648,1.84404 -7.68274,7.44462 -5.84199,12.50204 1.63837,4.50138 6.25413,7.04516 10.82282,6.25364 -2.10259,4.54407 -5.63037,8.42607 -10.27044,10.88809 1.56601,-0.18243 3.13992,-0.54424 4.68529,-1.10671 z"
                style="fill:black;stroke:black;stroke-width:1;stroke-linejoin:round"
              />
              <use
                href="#tomoe2a"
                transform="matrix(-0.5,0.8660254,-0.8660254,-0.5,354.90381,95.096189)"
              />
              <use
                href="#tomoe2a"
                transform="matrix(-0.5,-0.8660254,0.8660254,-0.5,95.096189,354.90381)"
              />
            </g>

            <!-- Tomoe Group 3 -->
            <g id="tomoe3">
              <path
                id="tomoe3a"
                d="m 157.30532,9.9672682 c -8.08498,1.4256048 -13.34628,5.7581728 -16.07194,12.8301768 -0.64992,1.625862 -1.11497,5.413331 -0.78894,7.262311 0.93457,5.300237 6.00061,8.842337 11.31033,7.906087 5.30972,-0.93624 8.85877,-5.997427 7.92419,-11.297651 -0.83182,-4.717494 -4.93573,-8.024147 -9.57246,-8.037997 2.85972,-4.109924 7.008,-7.320355 12.00511,-8.9392318 -1.5739,-0.09228 -3.18673,-0.0093 -4.80629,0.276305 z"
                style="fill:black;stroke:black;stroke-width:1;stroke-linejoin:round"
              />
              <use
                href="#tomoe3a"
                transform="matrix(-0.5,0.8660254,-0.8660254,-0.5,354.90381,95.096189)"
              />
              <use
                href="#tomoe3a"
                transform="matrix(-0.5,-0.8660254,0.8660254,-0.5,95.096189,354.90381)"
              />
            </g>
          </g>
        {:else if variant === "kakashi" || variant === "obito"}
          <!-- KAKASHI/OBITO'S MANGEKYOU: User's exact SVG pattern scaled to fit -->
          <!-- Original SVG is 300x300, scale to fit in ~130px diameter (65 radius) -->
          <g transform="translate(100, 100) scale(0.43) translate(-150, -150)">
            <!-- Tomoe 1: Original paths from user's SVG -->
            <g id="tomoe-1">
              <path
                style="fill:#000;"
                d="M 107.5,150 C 110,100 130,20 150,0 C 170,20 190,100 192.5,150 C 168,150 132,150 107.5,150 z"
              />
              <path
                style="fill:#000;"
                d="M 250.2,181.2 C 261.8,142 250.4,46.8 157.4,10 C 154.9,31.7 161.1,51.3 178.8,67.3 C 216.6,76 258.3,118.6 244.6,175.2 C 224.9,193.2 242.3,203.3 250.2,181.2 z"
              />
            </g>
            <!-- Tomoe 2: Rotated 120deg -->
            <use href="#tomoe-1" transform="rotate(120 150 150)" />
            <!-- Tomoe 3: Rotated -120deg -->
            <use href="#tomoe-1" transform="rotate(-120 150 150)" />
            <!-- Center circle -->
            <circle style="fill:#a00000;" cx="150" cy="150" r="28" />
          </g>
        {:else if variant === "madara"}
          <!-- MADARA'S ETERNAL MANGEKYOU: User's exact 3-tomoe SVG pattern -->
          <!-- Original SVG is 300x300, scale to fit in ~130px diameter (65 radius) -->
          <defs>
            <radialGradient id="madaraGr">
              <stop offset="0" style="stop-color:#660000; stop-opacity: 1;" />
              <stop style="stop-color:#c30000; stop-opacity: 1;" offset="0.5" />
              <stop style="stop-color:#a00000; stop-opacity: 1;" offset="1" />
            </radialGradient>
          </defs>
          <g transform="translate(100, 100) scale(0.43) translate(-150, -150)">
            <!-- Madara's tomoe 1 -->
            <g id="madara-tomoe-1">
              <circle
                style="fill:none;stroke:#000;stroke-width:15;"
                cx="150"
                cy="60"
                r="30"
              />
              <path
                style="fill:#000;"
                d="M 151.1 24.6 L 174.1 43.1 L 180 82.5 C 240.9 62.8 255 166.9 244.1 161.2 C 255 183.2 264.5 185 262.9 181.9 C 260.5 177.2 260.8 175.4 260.8 171 C 264.9 103.6 227 34 151.1 24.6 z"
              />
              <path
                style="fill:#000;"
                d="M 115,250 L 115,290 L 150,295 L 185,290 L 185,250 L 115,250 z"
              />
            </g>
            <!-- Madara's tomoe 2: Rotated 120deg -->
            <use href="#madara-tomoe-1" transform="rotate(120 150 150)" />
            <!-- Madara's tomoe 3: Rotated -120deg -->
            <use href="#madara-tomoe-1" transform="rotate(-120 150 150)" />
            <!-- Center circle -->
            <circle style="fill:#000;" cx="150" cy="150" r="28" />
          </g>
        {:else if variant === "shisui"}
          <!-- SHISUI'S MANGEKYOU: User's exact 4-pointed curved star pattern -->
          <!-- Original SVG is 300x300, scale to fit in ~130px diameter (65 radius) -->
          <g transform="translate(100, 100) scale(0.43) translate(-150, -150)">
            <!-- Shisui's 4-pointed curved star (Kotoamatsukami) -->
            <path
              style="fill:#000;"
              d="m 72,135 c -26.4,-1.9 -42.4,-5 -59.2,-9.9 39.1,43.2 79,76.5 123.2,102.7 -1.9,26.4 -5,42.4 -9.9,59.2 43.2,-39.1 76.5,-79 102.7,-123.2 26.4,1.9 42.4,5 59.2,9.9 -39.1,-43.2 -79,-76.5 -123.2,-102.7 1.9,-26.4 5,-42.4 9.9,-59.2 -43.2,39.1 -76.5,79 -102.7,123.2 z"
            />
            <!-- Center circle with red stroke -->
            <circle
              style="fill:#000; stroke:#a00000; stroke-width:20;"
              cx="150"
              cy="150"
              r="22"
            />
          </g>
        {/if}
      </g>

      <!-- Central pupil (hidden for variants with their own styled centers) -->
      {#if variant !== "shisui" && variant !== "sasuke" && variant !== "itachi"}
        <circle cx="100" cy="100" r="15" fill="#000" />
      {/if}

      <!-- Highlight -->
      <ellipse cx="88" cy="85" rx="6" ry="10" fill="#ffffff" opacity="0.4" />
    </svg>

    <!-- Stage 5: Rinnegan - EXACT MATCH to reference image -->
  {:else if effectiveEvolution === 5}
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      class="eye-svg rinnegan"
    >
      <!-- User's exact Rinnegan SVG -->
      <defs>
        <radialGradient
          gradientUnits="userSpaceOnUse"
          r="0.69999999"
          cy="0.80000001"
          fy="1"
          id="rinneganGr"
          cx="0.5"
          fx="0.5"
          gradientTransform="matrix(1.0192207,0,0,1.0192207,-62.432286,3.5298889)"
        >
          <stop style="stop-color:#98a6a9;stop-opacity:1;" offset="0" />
          <stop style="stop-color:#8b7496;stop-opacity:1;" offset="1" />
        </radialGradient>
        <radialGradient
          fx="150"
          cx="150"
          gradientUnits="userSpaceOnUse"
          r="210"
          cy="240"
          fy="300"
          id="rinneganGr4"
          gradientTransform="matrix(1.0344828,0,0,1.0344828,-5.1724077,-5.1724114)"
        >
          <stop style="stop-color:#98a6a9;stop-opacity:1;" offset="0" />
          <stop style="stop-color:#8b7496;stop-opacity:1;" offset="1" />
        </radialGradient>
      </defs>

      <g transform="translate(100, 100) scale(0.66) translate(-150, -150)">
        <circle
          style="fill:url(#rinneganGr4);stroke:#000000;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none"
          cx="150"
          cy="150"
          r="150"
        />
        <circle
          style="fill:url(#rinneganGr);stroke:#000000;stroke-width:10.19220638"
          cx="90.450821"
          cy="156.41299"
          r="0"
        />
        <circle
          style="fill:none;stroke:#000000;stroke-width:4.73349857"
          cx="151.15869"
          cy="148.84169"
          r="23.667494"
        />
        <circle
          style="fill:none;stroke:#000000;stroke-width:4.73349905"
          cx="151.15869"
          cy="148.84169"
          r="44.376549"
        />
        <circle
          style="fill:none;stroke:#000000;stroke-width:4.73349857"
          cx="151.15869"
          cy="148.84169"
          r="65.085602"
        />
        <circle
          style="fill:#000000"
          cx="151.15869"
          cy="148.84169"
          r="5.3251858"
        />
        <circle
          style="fill:none;stroke:#000000;stroke-width:4.73428011;stroke-miterlimit:4;stroke-dasharray:none"
          cx="149.70557"
          cy="150.2948"
          r="105.05045"
        />
        <circle
          style="fill:none;stroke:#000000;stroke-width:4.73383665;stroke-miterlimit:4;stroke-dasharray:none"
          cx="150.43219"
          cy="149.56818"
          r="85.068031"
        />
        <circle
          style="fill:none;stroke:#000000;stroke-width:4.73428011;stroke-miterlimit:4;stroke-dasharray:none"
          cx="150.00887"
          cy="149.99113"
          r="126.06354"
        />
      </g>
    </svg>

    <!-- Stage 6: Character-Specific Eyes (Naruto, Jiraiya, Pain, Gaara) -->
  {:else if effectiveEvolution === 6}
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      class="eye-svg character-eye"
    >
      {#if variant === "naruto"}
        <!-- NARUTO SAGE MODE: Orange toad eyes with horizontal bar pupil -->
        <defs>
          <radialGradient id="narutoSageIris">
            <stop offset="0%" stop-color="#FFD700" />
            <stop offset="40%" stop-color="#FFA500" />
            <stop offset="100%" stop-color="#FF6B00" />
          </radialGradient>
          <filter id="narutoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <!-- Orange pigmentation around eyes effect -->
          <radialGradient id="narutoPigment">
            <stop offset="70%" stop-color="transparent" />
            <stop offset="85%" stop-color="#FF6B0030" />
            <stop offset="100%" stop-color="#FF450050" />
          </radialGradient>
        </defs>

        <!-- Outer glow -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#FFA500"
          stroke-width="4"
          opacity="0.4"
          filter="url(#narutoGlow)"
        />

        <!-- White sclera with orange pigmentation around edges -->
        <circle cx="100" cy="100" r="95" fill="#FFA500" />
        <circle cx="100" cy="100" r="92" fill="#f8f8f8" />
        <circle cx="100" cy="100" r="92" fill="url(#narutoPigment)" />

        <!-- Orange Sage Mode iris -->
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="url(#narutoSageIris)"
          filter="url(#narutoGlow)"
        />

        <!-- Horizontal bar pupil (toad eye characteristic) -->
        <rect x="55" y="92" width="90" height="16" rx="4" fill="#000" />

        <!-- Eye highlight -->
        <ellipse cx="85" cy="80" rx="10" ry="14" fill="#ffffff" opacity="0.6" />
      {:else if variant === "jiraiya"}
        <!-- JIRAIYA: White eyes with black center dot and black outline -->
        <defs>
          <filter id="jiraiyaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Outer glow -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#ffffff"
          stroke-width="3"
          opacity="0.3"
          filter="url(#jiraiyaGlow)"
        />

        <!-- Base eye structure -->
        <circle cx="100" cy="100" r="95" fill="#888888" />
        <circle cx="100" cy="100" r="92" fill="#f8f8f8" />

        <!-- White iris -->
        <circle cx="100" cy="100" r="55" fill="#ffffff" />

        <!-- Black outline at iris circumference -->
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="#000000"
          stroke-width="3"
        />

        <!-- Black center dot (pupil) -->
        <circle cx="100" cy="100" r="12" fill="#000000" />

        <!-- Eye highlight -->
        <ellipse cx="88" cy="82" rx="8" ry="12" fill="#ffffff" opacity="0.7" />
      {:else if variant === "pain"}
        <!-- PAIN: Rinnegan (User's Exact SVG) -->
        <defs>
          <radialGradient
            gradientUnits="userSpaceOnUse"
            r="0.69999999"
            cy="0.80000001"
            fy="1"
            id="rinneganGr"
            cx="0.5"
            fx="0.5"
            gradientTransform="matrix(1.0192207,0,0,1.0192207,-62.432286,3.5298889)"
          >
            <stop style="stop-color:#98a6a9;stop-opacity:1;" offset="0" />
            <stop style="stop-color:#8b7496;stop-opacity:1;" offset="1" />
          </radialGradient>
          <radialGradient
            fx="150"
            cx="150"
            gradientUnits="userSpaceOnUse"
            r="210"
            cy="240"
            fy="300"
            id="rinneganGr4"
            gradientTransform="matrix(1.0344828,0,0,1.0344828,-5.1724077,-5.1724114)"
          >
            <stop style="stop-color:#98a6a9;stop-opacity:1;" offset="0" />
            <stop style="stop-color:#8b7496;stop-opacity:1;" offset="1" />
          </radialGradient>
        </defs>

        <g transform="translate(100, 100) scale(0.66) translate(-150, -150)">
          <circle
            style="fill:url(#rinneganGr4);stroke:#000000;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none"
            cx="150"
            cy="150"
            r="150"
          />
          <circle
            style="fill:url(#rinneganGr);stroke:#000000;stroke-width:10.19220638"
            cx="90.450821"
            cy="156.41299"
            r="0"
          />
          <circle
            style="fill:none;stroke:#000000;stroke-width:4.73349857"
            cx="151.15869"
            cy="148.84169"
            r="23.667494"
          />
          <circle
            style="fill:none;stroke:#000000;stroke-width:4.73349905"
            cx="151.15869"
            cy="148.84169"
            r="44.376549"
          />
          <circle
            style="fill:none;stroke:#000000;stroke-width:4.73349857"
            cx="151.15869"
            cy="148.84169"
            r="65.085602"
          />
          <circle
            style="fill:#000000"
            cx="151.15869"
            cy="148.84169"
            r="5.3251858"
          />
          <circle
            style="fill:none;stroke:#000000;stroke-width:4.73428011;stroke-miterlimit:4;stroke-dasharray:none"
            cx="149.70557"
            cy="150.2948"
            r="105.05045"
          />
          <circle
            style="fill:none;stroke:#000000;stroke-width:4.73383665;stroke-miterlimit:4;stroke-dasharray:none"
            cx="150.43219"
            cy="149.56818"
            r="85.068031"
          />
          <circle
            style="fill:none;stroke:#000000;stroke-width:4.73428011;stroke-miterlimit:4;stroke-dasharray:none"
            cx="150.00887"
            cy="149.99113"
            r="126.06354"
          />
        </g>
      {:else if variant === "gaara"}
        <!-- GAARA: Plain teal eyes with black outline and white tint -->
        <defs>
          <filter id="gaaraGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Outer glow -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#7FFFD4"
          stroke-width="3"
          opacity="0.3"
          filter="url(#gaaraGlow)"
        />

        <!-- Base eye structure -->
        <circle cx="100" cy="100" r="95" fill="#40E0D0" />
        <circle cx="100" cy="100" r="92" fill="#f8f8f8" />

        <!-- Plain teal iris -->
        <circle cx="100" cy="100" r="55" fill="#7FFFD4" />

        <!-- Black outline at iris circumference -->
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="#000000"
          stroke-width="3"
        />

        <!-- White tint/highlight -->
        <ellipse cx="85" cy="78" rx="10" ry="15" fill="#ffffff" opacity="0.5" />
      {/if}
    </svg>
  {/if}

  <!-- Label (optional) -->
  {#if showLabel}
    <span class="eye-label">{$eyeStageName}</span>
  {/if}
</div>

<style>
  .sharingan-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    --size: 60px;
  }

  .eye-svg {
    width: var(--size);
    height: var(--size);
    filter: drop-shadow(0 0 8px var(--glow-color));
    transition: filter 0.3s ease;
  }

  .sharingan-container:hover .eye-svg {
    filter: drop-shadow(0 0 15px var(--glow-color));
  }

  .sharingan-container.evolving .eye-svg {
    animation: evolveFlash 1s ease-out;
  }

  @keyframes evolveFlash {
    0% {
      filter: drop-shadow(0 0 30px var(--eye-color)) brightness(1.5);
      transform: scale(1.1);
    }
    50% {
      filter: drop-shadow(0 0 50px #fff) brightness(2);
    }
    100% {
      filter: drop-shadow(0 0 8px var(--glow-color)) brightness(1);
      transform: scale(1);
    }
  }

  /* Performance: Disable expensive filters on mobile */
  @media (max-width: 768px) {
    .eye-svg {
      filter: none;
    }

    .sharingan-container:hover .eye-svg {
      filter: none;
    }

    .sharingan-container.evolving .eye-svg {
      animation: evolveFlashSimple 1s ease-out;
    }

    .sharingan-container.activating .eye-svg.mangekyou {
      filter: brightness(1.2);
    }
  }

  @keyframes evolveFlashSimple {
    0% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Tomoe rotation animation */
  .tomoe-group {
    transition: transform 0.1s linear;
  }

  /* Mangekyou pattern - no transition during activation for smooth animation */
  .mangekyou-pattern {
    will-change: transform;
  }

  .mangekyou-pattern:not(.activating) {
    transition: transform 0.1s linear;
  }

  /* Activation glow effect */
  .sharingan-container.activating .eye-svg.mangekyou {
    filter: drop-shadow(0 0 20px rgba(230, 57, 70, var(--activation-glow)))
      drop-shadow(
        0 0 40px rgba(230, 57, 70, calc(var(--activation-glow) * 0.5))
      )
      brightness(calc(1 + var(--activation-glow) * 0.3));
  }

  /* Gentle glow animation */
  .sharingan {
    animation: sharinganGlow 3s ease-in-out infinite;
  }

  @keyframes sharinganGlow {
    0%,
    100% {
      filter: drop-shadow(0 0 8px rgba(230, 57, 70, 0.6));
    }
    50% {
      filter: drop-shadow(0 0 15px rgba(230, 57, 70, 0.9));
    }
  }

  .mangekyou {
    animation: mangekyouGlow 2s ease-in-out infinite;
  }

  @keyframes mangekyouGlow {
    0%,
    100% {
      filter: drop-shadow(0 0 10px rgba(230, 57, 70, 0.7));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(230, 57, 70, 1));
    }
  }

  .rinnegan {
    animation: rinneganGlow 4s ease-in-out infinite;
  }

  @keyframes rinneganGlow {
    0%,
    100% {
      filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.9));
    }
  }

  /* Character-specific eye animations */
  .character-eye {
    animation: characterGlow 3s ease-in-out infinite;
  }

  @keyframes characterGlow {
    0%,
    100% {
      filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.5));
    }
    50% {
      filter: drop-shadow(0 0 18px rgba(255, 165, 0, 0.8));
    }
  }

  .eye-label {
    font-family: var(--font-heading);
    font-size: 0.7rem;
    color: var(--eye-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sharingan-container {
      --size: 50px;
    }
  }
</style>
