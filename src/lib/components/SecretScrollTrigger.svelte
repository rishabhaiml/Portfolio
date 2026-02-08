<!--
  SECRET SCROLL TRIGGER (Forbidden Scrolls Gateway)
  A lore-accurate, premium portal to the blog section.
  - Visual: Sealed chakra scroll with Orochimaru-style curse marks
  - Interaction: Subtle pulse, glow on hover, Kamui on click
  - Memory: Tracks "unsealed" state via sessionStorage
  - Accessibility: Keyboard nav, reduced motion support
-->
<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { isNavigating } from "$lib/stores";
    import { onMount } from "svelte";

    let hasUnsealed = $state(false);
    let isHovered = $state(false);
    let isFocused = $state(false);

    const STORAGE_KEY = "forbiddenScrollsUnsealed";

    onMount(() => {
        hasUnsealed = sessionStorage.getItem(STORAGE_KEY) === "true";
    });

    function handleActivate() {
        if ($isNavigating) return;

        sessionStorage.setItem(STORAGE_KEY, "true");
        hasUnsealed = true;

        isNavigating.set(true);

        // Navigate at Kamui animation midpoint
        setTimeout(() => {
            goto(`${base}/blog`);
        }, 1400);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
        }
    }
</script>

<section class="scroll-gateway" aria-label="Forbidden Scrolls Archive">
    <button
        class="sealed-scroll"
        class:unsealed={hasUnsealed}
        class:hovered={isHovered}
        class:focused={isFocused}
        onclick={handleActivate}
        onkeydown={handleKeydown}
        onmouseenter={() => (isHovered = true)}
        onmouseleave={() => (isHovered = false)}
        onfocus={() => (isFocused = true)}
        onblur={() => (isFocused = false)}
        aria-describedby="scroll-hint"
    >
        <!-- Outer Aura Ring -->
        <div class="aura-ring"></div>

        <!-- SVG Sealed Scroll - Premium Design -->
        <svg
            class="scroll-svg"
            viewBox="0 0 120 160"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <!-- Chakra Glow Gradient -->
                <radialGradient id="chakraGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stop-color="#E63946" stop-opacity="0.4" />
                    <stop
                        offset="70%"
                        stop-color="#E63946"
                        stop-opacity="0.1"
                    />
                    <stop offset="100%" stop-color="#E63946" stop-opacity="0" />
                </radialGradient>

                <!-- Scroll Paper Gradient -->
                <linearGradient
                    id="scrollPaper"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="#1a1a1a" />
                    <stop offset="50%" stop-color="#252525" />
                    <stop offset="100%" stop-color="#1a1a1a" />
                </linearGradient>

                <!-- Seal Glow Filter -->
                <filter
                    id="sealGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood flood-color="#E63946" flood-opacity="0.6" />
                    <feComposite in2="blur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <!-- Crack Texture Filter -->
                <filter id="crackTexture">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05"
                        numOctaves="2"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="2"
                    />
                </filter>
            </defs>

            <!-- Chakra Glow Background -->
            <ellipse
                class="chakra-pulse"
                cx="60"
                cy="80"
                rx="50"
                ry="60"
                fill="url(#chakraGlow)"
            />

            <!-- Scroll Body (Main Parchment) -->
            <rect
                x="25"
                y="30"
                width="70"
                height="100"
                rx="2"
                fill="url(#scrollPaper)"
                stroke="#333"
                stroke-width="1"
            />

            <!-- Scroll Rollers (Top & Bottom) -->
            <g class="scroll-rollers">
                <!-- Top Roller -->
                <rect
                    x="18"
                    y="22"
                    width="84"
                    height="14"
                    rx="7"
                    fill="#1f1f1f"
                />
                <rect
                    x="20"
                    y="24"
                    width="80"
                    height="10"
                    rx="5"
                    fill="#2a2a2a"
                />
                <!-- Roller End Caps -->
                <circle cx="20" cy="29" r="5" fill="#333" />
                <circle cx="100" cy="29" r="5" fill="#333" />

                <!-- Bottom Roller -->
                <rect
                    x="18"
                    y="124"
                    width="84"
                    height="14"
                    rx="7"
                    fill="#1f1f1f"
                />
                <rect
                    x="20"
                    y="126"
                    width="80"
                    height="10"
                    rx="5"
                    fill="#2a2a2a"
                />
                <!-- Roller End Caps -->
                <circle cx="20" cy="131" r="5" fill="#333" />
                <circle cx="100" cy="131" r="5" fill="#333" />
            </g>

            <!-- Central Curse Seal (Orochimaru-style) -->
            <g
                class="curse-seal"
                filter={isHovered || isFocused ? "url(#sealGlow)" : "none"}
            >
                <!-- Outer Ring -->
                <circle
                    cx="60"
                    cy="80"
                    r="28"
                    fill="none"
                    stroke="#8B0000"
                    stroke-width="2"
                    stroke-dasharray="4 2"
                />

                <!-- Inner Ring -->
                <circle
                    cx="60"
                    cy="80"
                    r="20"
                    fill="none"
                    stroke="#720e1e"
                    stroke-width="1.5"
                />

                <!-- Central Kanji (禁 - "Forbidden") -->
                <text
                    x="60"
                    y="85"
                    text-anchor="middle"
                    font-size="16"
                    font-family="serif"
                    fill="#E63946"
                    opacity="0.8">禁</text
                >
            </g>

            <!-- Decorative Seal Lines -->
            <g
                class="seal-lines"
                stroke="#720e1e"
                stroke-width="0.5"
                opacity="0.5"
            >
                <line x1="30" y1="45" x2="90" y2="45" />
                <line x1="30" y1="115" x2="90" y2="115" />
                <line x1="35" y1="50" x2="35" y2="110" />
                <line x1="85" y1="50" x2="85" y2="110" />
            </g>

            <!-- Cracks (Visible when unsealed) -->
            {#if hasUnsealed}
                <g
                    class="cracks"
                    stroke="#E63946"
                    stroke-width="1"
                    stroke-linecap="round"
                    opacity="0.8"
                >
                    <path d="M40 40 L48 55 L42 65" fill="none" />
                    <path d="M80 45 L72 58 L78 70" fill="none" />
                    <path d="M50 120 L58 108 L52 98" fill="none" />
                    <path d="M70 118 L65 105" fill="none" />
                </g>
            {/if}
        </svg>

        <!-- Label (Visible on Hover/Focus) -->
        <span class="scroll-label" class:visible={isHovered || isFocused}>
            Forbidden Scrolls
        </span>
    </button>

    <!-- Hint Text (Always visible, faded) -->
    <p id="scroll-hint" class="scroll-hint">
        Some techniques were never meant for the battlefield.
    </p>
</section>

<style>
    .scroll-gateway {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 5rem 1rem 3rem;
        position: relative;
        z-index: 10;
    }

    .sealed-scroll {
        position: relative;
        width: 120px;
        height: 160px;
        background: transparent;
        border: none;
        cursor: pointer;
        transition:
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.3s ease;
        outline: none;
    }

    .sealed-scroll:hover,
    .sealed-scroll.hovered {
        transform: translateY(-4px) rotate(1deg) scale(1.05);
    }

    .sealed-scroll:focus-visible {
        filter: drop-shadow(0 0 12px rgba(230, 57, 70, 0.7));
    }

    /* Outer Aura Ring */
    .aura-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 140px;
        height: 180px;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(230, 57, 70, 0.1);
        border-radius: 50%;
        pointer-events: none;
        animation: auraExpand 4s ease-in-out infinite;
    }

    @keyframes auraExpand {
        0%,
        100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.95);
        }
        50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.05);
        }
    }

    .sealed-scroll.hovered .aura-ring,
    .sealed-scroll.focused .aura-ring {
        animation: none;
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.1);
        border-color: rgba(230, 57, 70, 0.4);
    }

    .scroll-svg {
        width: 100%;
        height: 100%;
    }

    /* Chakra Pulse Animation */
    .chakra-pulse {
        animation: chakraPulse 4s ease-in-out infinite;
        transform-origin: center;
    }

    @keyframes chakraPulse {
        0%,
        100% {
            opacity: 0.4;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.1);
        }
    }

    /* Intensify glow on hover */
    .sealed-scroll.hovered .chakra-pulse,
    .sealed-scroll.focused .chakra-pulse {
        animation: none;
        opacity: 1;
        transform: scale(1.15);
    }

    /* Curse Seal Rotation on Hover */
    .curse-seal {
        transition: transform 0.5s ease;
        transform-origin: 60px 80px;
    }

    .sealed-scroll.hovered .curse-seal,
    .sealed-scroll.focused .curse-seal {
        transform: rotate(5deg);
    }

    /* Unsealed State - Cracked appearance, steady glow */
    .sealed-scroll.unsealed .chakra-pulse {
        animation: none;
        opacity: 0.9;
    }

    .sealed-scroll.unsealed .aura-ring {
        border-color: rgba(230, 57, 70, 0.5);
        animation: none;
        opacity: 0.7;
    }

    .sealed-scroll.unsealed .curse-seal {
        opacity: 0.6;
    }

    /* Scroll Label */
    .scroll-label {
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        font-family: var(--font-heading, "Outfit", sans-serif);
        font-size: 0.95rem;
        font-weight: 600;
        color: #e63946;
        white-space: nowrap;
        opacity: 0;
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        text-shadow: 0 0 15px rgba(230, 57, 70, 0.6);
        letter-spacing: 0.05em;
    }

    .scroll-label.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(-2px);
    }

    /* Hint Text */
    .scroll-hint {
        margin-top: 3.5rem;
        font-family: var(--font-body, "Merriweather", serif);
        font-size: 0.9rem;
        font-style: italic;
        color: rgba(255, 255, 255, 0.3);
        text-align: center;
        max-width: 300px;
        line-height: 1.5;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        .chakra-pulse,
        .aura-ring {
            animation: none;
        }

        .sealed-scroll:hover,
        .sealed-scroll.hovered {
            transform: scale(1.05);
        }
    }
</style>
