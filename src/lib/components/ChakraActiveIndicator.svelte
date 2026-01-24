<script lang="ts">
    import { onMount, afterUpdate } from "svelte";

    export let level = 0; // 0: Home, 1: Skills, 2: Projects, 3: Experience, 4: Contact

    // Chakra colors - Tuning for "glowing organic"
    const chakraRed = "#ff3333"; // Bright Sharingan Red
    const chakraPale = "#ff9999";

    // Rinnegan colors - Purple
    const rinneganPurple = "#a855f7"; // Bright Purple (Tailwind purple-500 approx)
    const rinneganPale = "#d8b4fe"; // Pale Purple

    $: isContact = level === 4;
    $: mainColor = isContact ? rinneganPurple : chakraRed;
    $: paleColor = isContact ? rinneganPale : chakraPale;

    // Color Matrix for Glow Filter
    // Red: 1, 0, 0
    // Purple (#a855f7): R~0.66, G~0.33, B~0.97
    $: colorMatrix = isContact
        ? `0.66 0 0 0 0
           0 0.33 0 0 0
           0 0 0.97 0 0
           0 0 0 1 0`
        : `1 0 0 0 0
           0 0 0 0 0
           0 0 0 0 0
           0 0 0 1 0`;

    // Dynamic stroke dash calc is handled by CSS, but we can do JS if needed
</script>

<div
    class="chakra-indicator-container"
    aria-hidden="true"
    style="--main-color: {mainColor}; --pale-color: {paleColor}"
>
    <svg class="chakra-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <!-- Glow Filter (Dynamic) -->
            <filter
                id="chakra-glow-strong"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
            >
                <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="3"
                    result="blur"
                />
                <feColorMatrix
                    in="blur"
                    type="matrix"
                    values={colorMatrix}
                    result="coloredBlur"
                />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <!-- Turbulence for Organic Line Jitter -->
            <filter id="chakra-turbulence">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.02"
                    numOctaves="2"
                    result="noise"
                />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>

            <!-- Gradient for Flow (Dynamic) -->
            <linearGradient
                id="flow-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop offset="0%" stop-color={mainColor} stop-opacity="0.3" />
                <stop offset="50%" stop-color={paleColor} stop-opacity="1" />
                <stop offset="100%" stop-color={mainColor} stop-opacity="0.3" />
            </linearGradient>

            <!-- Gradient for Experience (Red to Purple Transition) -->
            <linearGradient
                id="experience-gradient"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0%" stop-color={chakraRed} />
                <stop offset="100%" stop-color={rinneganPurple} />
            </linearGradient>
        </defs>

        <g filter="url(#chakra-turbulence) url(#chakra-glow-strong)">
            <!-- LEVEL 0: HOME - Center Flare (Subtle, background) -->
            <circle
                class="chakra-core"
                class:visible={level === 0}
                cx="50"
                cy="50"
                r="15"
                fill="url(#flow-gradient)"
            />

            <!-- SEGMENTED BUILD-UP (Levels 1 & 2) -->
            <!-- We use a SINGLE continuous path that uses stroke-dashoffset to "grow" -->
            <!-- Total perimeter ~ 317. 
                 L1 (Bottom U) ~ 118 (~37%)
                 L2 (Bottom U + Right) ~ 197 (~62%)
                 L3 (Full Box) ~ 317 (100%)
            -->

            <!-- The Main Growth Path -->
            <!-- Only visible if level >= 1 -->
            <path
                class="chakra-line principal-path"
                class:visible={level >= 1}
                class:level-1={level === 1}
                class:level-2={level === 2}
                class:level-3={level === 3}
                class:contact-mode={level >= 4}
                pathLength="100"
                d="M 5,70 A 25,25 0 0 0 30,95 L 70,95 A 25,25 0 0 0 95,70 L 95,30 A 25,25 0 0 0 70,5 L 30,5 A 25,25 0 0 0 5,30 L 5,70"
            />

            <!-- Nodes: Positioned at the key vertices -->
            <!-- Start Node (Bottom Left) - Always visible if L >= 1 -->
            <circle
                class="chakra-node"
                class:visible={level >= 1}
                cx="5"
                cy="70"
                r="3"
            />

            <!-- L1 End Node (Bottom Right) -->
            <circle
                class="chakra-node"
                class:visible={level === 1}
                cx="95"
                cy="70"
                r="3"
            />

            <!-- L2 End Node (Top Right) -->
            <circle
                class="chakra-node"
                class:visible={level === 2}
                cx="70"
                cy="5"
                r="3"
            />

            <!-- L3/L4: No end nodes, it's a closed loop -->
        </g>

        <!-- LEVEL 4: CONTACT - High Energy Flow -->
        {#if level >= 4}
            <!-- Flow Overlay on top of the base path -->
            <rect
                class="chakra-flow-overlay"
                x="5"
                y="5"
                width="90"
                height="90"
                rx="25"
                ry="25"
            />
        {/if}
    </svg>
</div>

<style>
    .chakra-indicator-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: -1; /* Behind text */
        overflow: visible;
        /* Default CSS vars fallback */
        --main-color: #ff3333;
        --pale-color: #ff9999;
    }

    .chakra-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    /* Core (Home) */
    .chakra-core {
        opacity: 0;
        transform-origin: center;
        transform: scale(0.5);
        transition: all 0.5s ease;
    }
    .chakra-core.visible {
        opacity: 0.6;
        animation: pulseCore 3s infinite alternate;
    }
    @keyframes pulseCore {
        from {
            transform: scale(0.8);
            opacity: 0.4;
        }
        to {
            transform: scale(1.2);
            opacity: 0.7;
        }
    }

    /* Principal Path Logic */
    .chakra-line.principal-path {
        fill: none;
        stroke: var(--main-color);
        stroke-width: 2.5;
        stroke-linecap: round;
        opacity: 0;

        /* Dasharray 100 (normalized by pathLength="100") */
        stroke-dasharray: 100;
        /* Initial offset hides everything */
        stroke-dashoffset: 100;

        transition:
            stroke-dashoffset 0.8s cubic-bezier(0.2, 1, 0.2, 1),
            opacity 0.4s ease,
            stroke 0.5s ease;
    }

    /* Level States for Dashoffset */
    .chakra-line.principal-path.level-1 {
        stroke-dashoffset: 63; /* Show ~37% */
    }
    .chakra-line.principal-path.level-2 {
        stroke-dashoffset: 38; /* Show ~62% */
    }
    .chakra-line.principal-path.level-3 {
        stroke-dashoffset: 0; /* Show 100% */
        stroke: url(#experience-gradient);
    }
    .chakra-line.principal-path.contact-mode {
        stroke-dashoffset: 0;
        stroke: var(--main-color); /* Purple */
    }

    .chakra-line.visible {
        opacity: 1;
        animation: breatheLine 4s infinite ease-in-out;
    }

    /* Nodes: Start Red, flicker to pale red */
    .chakra-node {
        fill: var(--main-color);
        opacity: 0;
        transform: scale(0);
        transform-origin: center;
        transform-box: fill-box;
        transition:
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            fill 0.5s ease;
    }
    .chakra-node.visible {
        opacity: 1;
        transform: scale(1);
        animation: flickerNode 3s infinite alternate;
    }

    @keyframes flickerNode {
        0% {
            fill: var(--main-color);
            transform: scale(1);
        }
        50% {
            fill: var(--pale-color);
            transform: scale(1.2);
        }
        100% {
            fill: var(--main-color);
            transform: scale(1);
        }
    }

    @keyframes breatheLine {
        0% {
            stroke-width: 2.5;
            filter: drop-shadow(0 0 2px var(--main-color));
        }
        50% {
            stroke-width: 3;
            filter: drop-shadow(0 0 6px var(--main-color));
        }
        100% {
            stroke-width: 2.5;
            filter: drop-shadow(0 0 2px var(--main-color));
        }
    }

    /* Flow Overlay */
    .chakra-flow-overlay {
        fill: none;
        stroke: url(#flow-gradient);
        stroke-width: 3;
        stroke-linecap: round;
        stroke-dasharray: 40 120;
        opacity: 0;
        filter: drop-shadow(0 0 8px var(--main-color));
        transition: filter 0.5s ease;
        animation:
            flowCircuit 2s linear infinite,
            glowPulse 1s alternate infinite;
    }

    /* Fade in flow */
    .chakra-flow-overlay {
        animation:
            flowCircuit 1.5s linear infinite,
            fadeIn 0.5s forwards;
    }

    @keyframes flowCircuit {
        to {
            stroke-dashoffset: -160;
        }
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
</style>
