<!--
  NARUTO GALLERY COMPONENT
  Interactive orbital display featuring best shinobi eyes:
  - Central interactive eye (cycles variants on click)
  - 10 orbiting character eyes (Mangekyou, Sage Mode, Rinnegan, etc.)
  - Chakra connection lines with traveling particles
  - 3D parallax depth layers
  - Click-to-navigate with Kamui transitions
-->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import {
        eyeEvolution,
        isNavigating,
        currentSection,
        visitedSections,
        SECTIONS,
        loaderComplete,
        soundEnabled,
    } from "$lib/stores";
    import SharinganEye from "./SharinganEye.svelte";
    import { CHARACTER_SUBTITLES } from "$lib/data/subtitles";

    // Audio Assets
    import itachiVoice from "$lib/assets/quotes/itachiquote.webm";
    import jiraiyaVoice from "$lib/assets/quotes/jiraya.opus";
    import madaraVoice from "$lib/assets/quotes/madara.opus";
    import shisuiVoice from "$lib/assets/quotes/shisui.opus";
    import painVoice from "$lib/assets/quotes/pain.opus";
    import narutoVoice from "$lib/assets/quotes/naruto-quote.opus";
    import kakashiVoice from "$lib/assets/quotes/kakashi.opus";
    import gaaraVoice from "$lib/assets/quotes/gaara.opus";
    import sasukeVoice from "$lib/assets/quotes/sasuke.opus";

    // ... (rest of imports/config)

    // Initial activation trigger for Itachi when loader completes
    let initialActivation = false;

    // React to loader completion
    // React to loader completion
    $: if ($loaderComplete) {
        // Small delay to ensure smooth transition from loader to gallery
        setTimeout(() => {
            initialActivation = true;
            // Play initial Itachi audio (User confirmed prior interaction exists via Chakra button)
            playCharacterAudio("itachi");
            // Reset after animation completes
            setTimeout(() => {
                initialActivation = false;
            }, 800);
        }, 100);
    }

    // Gallery configuration
    const ORBITAL_PERIOD = 30000; // 30 seconds per revolution
    const ORBITAL_RADIUS = 280; // Distance from center to orbiting eyes
    const CENTER_SIZE = 180;
    const ORBIT_SIZE = 55;

    // Naruto character eyes for each orbital position
    const orbitalEyes: {
        variant:
            | "itachi"
            | "sasuke"
            | "madara"
            | "obito"
            | "shisui"
            | "kakashi"
            | "naruto"
            | "jiraiya"
            | "pain"
            | "gaara";
        section: number;
        label: string;
        skill?: string;
        isMangekyou?: boolean;
    }[] = [
        // 1. Itachi Mangekyo Sharingan
        {
            variant: "itachi",
            section: 0,
            label: "Home",
            skill: "Amaterasu",
            isMangekyou: true,
        },
        // 2. Jiraiya's eyes
        { variant: "jiraiya", section: 1, label: "Sannin", skill: "Sage Art" },
        // 3. Madara Mangekyo Sharingan
        {
            variant: "madara",
            section: 2,
            label: "Skills",
            skill: "Susanoo",
            isMangekyou: true,
        },
        // 4. Shisui Mangekyo Sharingan
        {
            variant: "shisui",
            section: 3,
            label: "Experience",
            skill: "Kotoamatsukami",
            isMangekyou: true,
        },
        // 5. Pain's eyes (Rinnegan)
        {
            variant: "pain",
            section: 4,
            label: "Akatsuki",
            skill: "Almighty Push",
        },
        // 6. Naruto's eyes
        {
            variant: "naruto",
            section: 0,
            label: "Sage Mode",
            skill: "Rasengan",
        },
        // 7. Kakashi Mangekyo Sharingan
        {
            variant: "kakashi",
            section: 1,
            label: "Projects",
            skill: "Kamui",
            isMangekyou: true,
        },
        // 8. Gaara's eyes
        { variant: "gaara", section: 2, label: "Kazekage", skill: "Sand" },
        // 9. Sasuke Mangekyo Sharingan
        {
            variant: "sasuke",
            section: 3,
            label: "Contact",
            skill: "Inferno Style",
            isMangekyou: true,
        },
    ];

    // Subtitle State
    let currentSubtitle = "";
    import { fade, fly } from "svelte/transition";
    let auraIntensity = 1; // 1 = base, >1 = speaking

    $: auraIntensity = currentSubtitle
        ? 1 + Math.min(currentSubtitle.length / 50, 0.5)
        : 1;

    // Mouse tracking state
    let containerRef: HTMLDivElement;
    let mouseX = 0;
    let mouseY = 0;
    let containerRect: DOMRect | null = null;

    // Smooth pupil position
    const pupilX = tweened(0, { duration: 150, easing: cubicOut });
    const pupilY = tweened(0, { duration: 150, easing: cubicOut });

    // Orbital animation
    let orbitAngle = 0;
    let animationFrame: number;
    let lastTime = 0;
    let isHovering = false;
    let hoveredIndex: number | null = null;
    let isPaused = false;
    let isVisible = true; // Track visibility for pausing animation

    // Connection line particles
    interface Particle {
        progress: number;
        speed: number;
        size: number;
        opacity: number;
    }
    let connectionParticles: Particle[][] = orbitalEyes.map(() => []);

    // Center eye cycling state - PRIORITY LIST SEQUENCE
    interface CharacterData {
        id:
            | "itachi"
            | "jiraiya"
            | "madara"
            | "shisui"
            | "pain"
            | "naruto"
            | "kakashi"
            | "gaara"
            | "sasuke";
        audio: string;
    }

    const CHARACTER_SEQUENCE: CharacterData[] = [
        { id: "itachi", audio: itachiVoice },
        { id: "jiraiya", audio: jiraiyaVoice },
        { id: "madara", audio: madaraVoice },
        { id: "shisui", audio: shisuiVoice },
        { id: "pain", audio: painVoice },
        { id: "naruto", audio: narutoVoice },
        { id: "kakashi", audio: kakashiVoice },
        { id: "gaara", audio: gaaraVoice },
        { id: "sasuke", audio: sasukeVoice },
    ];

    let currentCharacterIndex = 0;
    let centerClicked = false;

    $: currentCharacter = CHARACTER_SEQUENCE[currentCharacterIndex];
    $: centerVariant = currentCharacter.id;

    $: isCenterMangekyou = [
        "itachi",
        "madara",
        "kakashi",
        "shisui",
        "sasuke",
        "obito",
    ].includes(centerVariant);

    $: isCenterCharacterEye = ["naruto", "jiraiya", "pain", "gaara"].includes(
        centerVariant,
    );

    // Audio management - Performance: cache Audio objects
    let currentAudio: HTMLAudioElement | null = null;
    const audioCache: Map<string, HTMLAudioElement> = new Map();

    function playCharacterAudio(characterId: string) {
        if (!$soundEnabled) return;

        const character = CHARACTER_SEQUENCE.find((c) => c.id === characterId);
        if (!character) return;

        // Stop any currently playing audio and clear its listener
        if (currentAudio) {
            currentAudio.ontimeupdate = null; // Prevent ghost updates
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Performance: Reuse cached Audio objects instead of creating new ones
        let audio = audioCache.get(characterId);
        if (!audio) {
            audio = new Audio(character.audio);
            audio.loop = false;
            audio.volume = 0.8;
            audioCache.set(characterId, audio);
        }

        // Reset subtitle state immediately when switching
        currentSubtitle = "";

        currentAudio = audio;
        currentAudio.currentTime = 0;

        // Subtitle Sync
        currentAudio.ontimeupdate = () => {
            // Respect mute state or force empty if muted
            if (!$soundEnabled) {
                currentSubtitle = "";
                return;
            }

            const time = audio.currentTime;
            const subs = CHARACTER_SUBTITLES[characterId];
            if (subs) {
                const match = subs.find((s) => time >= s.start && time < s.end);
                currentSubtitle = match ? match.text : "";
            }
        };

        currentAudio.onended = () => {
            currentSubtitle = "";
        };

        currentAudio.play().catch((e) => {
            console.warn(
                "Audio playback failed (likely browser autoplay policy):",
                e,
            );
        });
    }

    // Reactive: Clear subtitles immediately if sound is disabled
    $: if (!$soundEnabled) {
        currentSubtitle = "";
    }

    // Stop audio when sound is disabled
    $: if (!$soundEnabled && currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Cycle center eye on click
    function cycleCenterEye() {
        centerClicked = true;

        // Move to next character
        currentCharacterIndex =
            (currentCharacterIndex + 1) % CHARACTER_SEQUENCE.length;

        // Play voice for new character
        playCharacterAudio(CHARACTER_SEQUENCE[currentCharacterIndex].id);

        // Reset click animation after delay
        setTimeout(() => {
            centerClicked = false;
        }, 300);
    }

    // Calculate orbital positions
    $: orbitalPositions = orbitalEyes.map((_, i) => {
        const angle = (i / orbitalEyes.length) * Math.PI * 2 + orbitAngle;
        return {
            x: Math.cos(angle) * ORBITAL_RADIUS,
            y: Math.sin(angle) * ORBITAL_RADIUS,
            angle: angle * (180 / Math.PI),
            depth: Math.sin(angle) * 0.3 + 0.7, // Z-depth simulation
        };
    });

    // Mouse move handler for pupil tracking
    function handleMouseMove(e: MouseEvent) {
        if (!containerRect) return;

        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        // Calculate offset from center, clamped
        const dx = (e.clientX - centerX) / containerRect.width;
        const dy = (e.clientY - centerY) / containerRect.height;

        // Max 15% pupil offset
        const maxOffset = 12;
        pupilX.set(Math.max(-maxOffset, Math.min(maxOffset, dx * 30)));
        pupilY.set(Math.max(-maxOffset, Math.min(maxOffset, dy * 30)));
    }

    // Animation loop for orbital rotation
    function animate(time: number) {
        if (!isPaused && isVisible) {
            const delta = time - lastTime;
            const speed = isHovering ? 2 : 1; // Speed up on hover
            orbitAngle += (delta / ORBITAL_PERIOD) * Math.PI * 2 * speed;
        }
        lastTime = time;

        // Update connection particles (only when visible)
        if (isVisible) {
            updateParticles();
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // Performance: Mutate particles in-place to avoid GC pressure
    function updateParticles() {
        for (let i = 0; i < connectionParticles.length; i++) {
            const particles = connectionParticles[i];

            // Add new particles occasionally
            if (Math.random() < 0.03 && particles.length < 5) {
                particles.push({
                    progress: 0,
                    speed: 0.005 + Math.random() * 0.01,
                    size: 2 + Math.random() * 3,
                    opacity: 0.6 + Math.random() * 0.4,
                });
            }

            // Update existing particles in-place (iterate backwards for safe removal)
            for (let j = particles.length - 1; j >= 0; j--) {
                const p = particles[j];
                const speedMultiplier = hoveredIndex === i ? 2 : 1;
                p.progress += p.speed * speedMultiplier;

                if (p.progress > 0.8) {
                    p.opacity = p.opacity * ((1 - p.progress) / 0.2);
                }

                // Remove dead particles
                if (p.progress >= 1) {
                    particles.splice(j, 1);
                }
            }
        }
        // Trigger Svelte reactivity with minimal overhead
        connectionParticles = connectionParticles;
    }

    // Navigate to section with Kamui effect
    function navigateToSection(sectionIndex: number) {
        if ($isNavigating) return;

        // Stop audio when navigating away
        if (currentAudio) {
            const audioToFade = currentAudio; // Capture ref
            // Simple fade out
            let vol = audioToFade.volume;
            const fadeInterval = setInterval(() => {
                vol = Math.max(0, vol - 0.1);
                if (audioToFade) audioToFade.volume = vol;
                if (vol <= 0) {
                    clearInterval(fadeInterval);
                    audioToFade.pause();
                }
            }, 50);
        }

        isPaused = true;
        isNavigating.set(true);

        setTimeout(() => {
            currentSection.set(sectionIndex);
            eyeEvolution.set(sectionIndex + 1);
            visitedSections.update((s) => s.add(sectionIndex));

            const section = document.getElementById(SECTIONS[sectionIndex]);
            section?.scrollIntoView({ behavior: "instant" });

            isPaused = false;
        }, 1400); // Navigate when vortex is 100% complete (800ms eye + 600ms swirl)
    }

    onMount(() => {
        const updateScale = () => {
            if (!containerRef) return;
            containerRect = containerRef.getBoundingClientRect();

            const isMobile = window.innerWidth <= 768;

            // On mobile, treat the "design size" as smaller (zooming in the 600px content)
            // and ignore height constraints to ensure it fills width
            const DESIGN_SIZE = isMobile ? 360 : 600;
            const PADDING_FACTOR = isMobile ? 0.95 : 0.9;

            const availableWidth = containerRect.width;
            const availableHeight = containerRect.height;

            let scale;
            if (isMobile) {
                // Width-based scaling mostly, allow slight overflow
                scale = (availableWidth / DESIGN_SIZE) * PADDING_FACTOR;
            } else {
                // Strict contain for desktop
                scale = Math.min(
                    (availableWidth / DESIGN_SIZE) * PADDING_FACTOR,
                    (availableHeight / DESIGN_SIZE) * PADDING_FACTOR,
                    1,
                );
            }

            containerRef.style.setProperty("--gallery-scale", scale.toString());
        };

        // Initial call
        updateScale();
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(animate);

        const handleResize = () => {
            updateScale();
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        // IntersectionObserver to pause animation when not visible
        const observer = new IntersectionObserver(
            (entries) => {
                isVisible = entries[0].isIntersecting;
            },
            { threshold: 0 },
        );
        observer.observe(containerRef);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            observer.disconnect();
        };
    });
</script>

<div
    class="uchiha-gallery"
    bind:this={containerRef}
    on:mouseenter={() => (isHovering = true)}
    on:mouseleave={() => {
        isHovering = false;
        hoveredIndex = null;
    }}
    role="navigation"
    aria-label="Uchiha Gallery Navigation"
>
    <!-- 3D Parallax Container -->
    <div
        class="parallax-container"
        style="--mouse-x: {$pupilX}px; --mouse-y: {$pupilY}px;"
    >
        <!-- Connection Lines Layer (Behind everything) -->
        <svg class="connection-lines" viewBox="-400 -400 800 800">
            <defs>
                <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.1" />
                    <stop
                        offset="50%"
                        stop-color="#E63946"
                        stop-opacity="0.4"
                    />
                    <stop
                        offset="100%"
                        stop-color="#8B5CF6"
                        stop-opacity="0.1"
                    />
                </linearGradient>
                <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {#each orbitalPositions as pos, i}
                <!-- Base connection line -->
                <line
                    x1="0"
                    y1="0"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="url(#lineGradient)"
                    stroke-width={hoveredIndex === i ? 3 : 1.5}
                    opacity={hoveredIndex === i ? 0.8 : 0.3}
                    filter={hoveredIndex === i ? "url(#lineGlow)" : "none"}
                />

                <!-- Traveling particles -->
                {#each connectionParticles[i] as particle}
                    <circle
                        cx={pos.x * particle.progress}
                        cy={pos.y * particle.progress}
                        r={particle.size}
                        fill="#E63946"
                        opacity={particle.opacity}
                        filter="url(#lineGlow)"
                    />
                {/each}
            {/each}
        </svg>

        <!-- Orbital Ring (Visual guide) -->
        <div class="orbital-ring" aria-hidden="true"></div>

        <!-- Orbiting Mangekyou Eyes -->
        <div class="orbital-eyes-wrapper">
            {#each orbitalPositions as pos, i}
                <div
                    class="orbital-eye"
                    class:hovered={hoveredIndex === i}
                    style="
          --x: {pos.x}px;
          --y: {pos.y}px;
          --depth: {pos.depth};
          --counter-angle: {-pos.angle}deg;
        "
                    on:mouseenter={() => (hoveredIndex = i)}
                    on:mouseleave={() => (hoveredIndex = null)}
                    on:click={() => navigateToSection(orbitalEyes[i].section)}
                    on:keypress={(e) =>
                        e.key === "Enter" &&
                        navigateToSection(orbitalEyes[i].section)}
                    tabindex="0"
                    role="button"
                    aria-label="Navigate to {orbitalEyes[i].label}"
                >
                    <div
                        class="eye-wrapper"
                        style="transform: rotate(var(--counter-angle));"
                    >
                        <SharinganEye
                            size={hoveredIndex === i
                                ? ORBIT_SIZE * 1.3
                                : ORBIT_SIZE}
                            variant={orbitalEyes[i].variant}
                            forceMangekyou={orbitalEyes[i].isMangekyou ?? false}
                            forceCharacterEye={!orbitalEyes[i].isMangekyou}
                        />
                    </div>

                    <!-- Tooltip -->
                    {#if hoveredIndex === i}
                        <div class="eye-tooltip">
                            <span class="tooltip-label"
                                >{orbitalEyes[i].label}</span
                            >
                            {#if orbitalEyes[i].skill}
                                <span class="tooltip-skill"
                                    >{orbitalEyes[i].skill}</span
                                >
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        <!-- Close orbital-eyes-wrapper -->

        <!-- Central Interactive Mangekyou Eye -->
        <div class="central-eye">
            <div
                class="mangekyou-container"
                class:clicked={centerClicked}
                on:click={cycleCenterEye}
                on:keypress={(e) => e.key === "Enter" && cycleCenterEye()}
                tabindex="0"
                role="button"
                aria-label="Click to cycle Mangekyou variant. Current: {centerVariant}"
                style="--aura-intensity: {auraIntensity};"
            >
                <SharinganEye
                    size={CENTER_SIZE}
                    variant={centerVariant}
                    forceMangekyou={isCenterMangekyou}
                    forceCharacterEye={isCenterCharacterEye}
                    triggerActivation={initialActivation}
                />
            </div>

            <!-- Center label - Creative AI/ML Engineer Title or Subtitles -->
            <!-- Center label - Subtitles ONLY -->
            <!-- Center label - Subtitles ONLY -->
            <div class="center-title">
                <span class="center-label">
                    {#key centerVariant}
                        <!-- Force re-render on character change -->
                        {#if currentSubtitle}
                            <div
                                class="subtitle-text-wrapper"
                                in:fly={{ y: 20, duration: 400 }}
                            >
                                <span class="subtitle-text"
                                    >{currentSubtitle}</span
                                >
                            </div>
                        {:else}
                            <!-- Empty placeholder to maintain height/layout -->
                            <span class="subtitle-placeholder">&nbsp;</span>
                        {/if}
                    {/key}
                </span>
            </div>
        </div>
    </div>
</div>

<style>
    .uchiha-gallery {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 350px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        background: radial-gradient(
            circle at center,
            rgba(26, 10, 46, 0.3) 0%,
            transparent 70%
        );
    }

    .parallax-container {
        position: relative;
        width: 600px;
        height: 600px;
        /* max-width/max-height removed to allow proper JS scaling calculation */
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(var(--gallery-scale, 1));
        transform-origin: center center;
    }

    /* Connection Lines */
    .connection-lines {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    /* Orbital Ring (Visual Guide) */
    .orbital-ring {
        position: absolute;
        width: 80%;
        height: 80%;
        border: 1px dashed rgba(139, 92, 246, 0.2);
        border-radius: 50%;
        pointer-events: none;
    }

    /* Orbital eyes wrapper */
    .orbital-eyes-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        /* Center content for orbital positioning */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orbital-eyes-wrapper > .orbital-eye {
        pointer-events: auto;
    }

    /* Orbiting Eyes */
    .orbital-eye {
        position: absolute;
        /* Position from center, then translate by orbital position */
        top: 50%;
        left: 50%;
        transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y)))
            scale(var(--depth));
        z-index: calc(10 + round(var(--depth) * 10));
        cursor: pointer;
        transition: filter 0.3s ease;
    }

    .orbital-eye:hover,
    .orbital-eye.hovered {
        filter: drop-shadow(0 0 20px rgba(230, 57, 70, 0.6));
        z-index: 100;
    }

    .orbital-eye:focus {
        outline: none;
    }

    .orbital-eye:focus-visible .eye-wrapper {
        outline: 2px solid #e63946;
        outline-offset: 4px;
        border-radius: 50%;
    }

    .eye-wrapper {
        transition: transform 0.3s ease;
    }

    /* Tooltip */
    .eye-tooltip {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(139, 92, 246, 0.5);
        border-radius: 4px;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        z-index: 200;
        animation: tooltipFade 0.2s ease-out;
    }

    @keyframes tooltipFade {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    .tooltip-label {
        font-family: var(--font-heading);
        font-size: 0.85rem;
        font-weight: 600;
        color: #e63946;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .tooltip-skill {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.7);
    }

    /* Central Interactive Mangekyou */
    .central-eye {
        position: absolute;
        z-index: 50;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
    }

    .mangekyou-container {
        cursor: pointer;
        /* Default shadow - will be overridden by specific rule below to allow calc */
        filter: drop-shadow(0 0 30px rgba(230, 57, 70, 0.5));
        transition:
            filter 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            transform 0.2s ease;
        border-radius: 50%;
    }

    /* Reactive Aura Pulse */
    .mangekyou-container {
        filter: drop-shadow(
            0 0 calc(30px * var(--aura-intensity, 1)) rgba(230, 57, 70, 0.5)
        );
    }

    .mangekyou-container:hover {
        /* Boost aura on hover regardless of speech */
        filter: drop-shadow(
            0 0 calc(50px * var(--aura-intensity, 1)) rgba(230, 57, 70, 0.8)
        );
        transform: scale(1.05);
    }

    .mangekyou-container:focus {
        outline: none;
    }

    .mangekyou-container:focus-visible {
        outline: 2px solid #e63946;
        outline-offset: 8px;
    }

    .mangekyou-container.clicked {
        animation: eyeClick 0.3s ease-out;
    }

    @keyframes eyeClick {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.9);
            filter: drop-shadow(0 0 60px rgba(230, 57, 70, 1)) brightness(1.3);
        }
        100% {
            transform: scale(1);
        }
    }

    /* Floating Chakra Subtitles */
    .center-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        /* Ghostly radial gradient instead of bar */
        background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.7) 0%,
            transparent 70%
        );
        min-width: 300px;
        justify-content: center;
        margin-top: 1rem; /* Space from eye */
        pointer-events: none; /* Let clicks pass through to eye */
    }

    .center-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1.4;
        min-height: 80px;
        justify-content: center;
        width: 100%;
    }

    .subtitle-text-wrapper {
        display: flex;
        justify-content: center;
    }

    .subtitle-text {
        font-family: var(--font-heading);
        font-size: 1.35rem; /* Larger, more impactful */
        font-weight: 700;
        /* Dynamic Chakra Gradient */
        background: linear-gradient(180deg, #fff 10%, #ffaaaa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-align: center;
        max-width: 450px;
        /* Strong glow for readability */
        filter: drop-shadow(0 0 10px rgba(230, 57, 70, 0.5));
        letter-spacing: 0.05em;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
    }

    .subtitle-placeholder {
        display: inline-block;
        min-height: 1.2em;
    }

    /* Desktop large */
    @media (min-width: 1200px) {
        .parallax-container {
            --gallery-scale: 1;
        }
    }

    /* Desktop */
    @media (max-width: 1199px) and (min-width: 1025px) {
        .parallax-container {
            --gallery-scale: 0.9;
        }
    }

    /* Tablet */
    @media (max-width: 1024px) {
        .parallax-container {
            --gallery-scale: 0.8;
            width: min(500px, 85vw);
            height: min(500px, 85vw);
        }

        .orbital-eye {
            transform: translate(
                    calc(-50% + var(--x) * 0.85),
                    calc(-50% + var(--y) * 0.85)
                )
                scale(var(--depth));
        }
    }

    /* Mobile */
    @media (max-width: 768px) {
        .uchiha-gallery {
            min-height: 60vh;
            width: 100vw;
            overflow: visible;
        }

        .parallax-container {
            --gallery-scale: 0.85;
            width: 100%;
            height: 100%;
            min-height: 400px;
        }

        .orbital-eye {
            transform: translate(
                    calc(-50% + var(--x) * var(--gallery-scale)),
                    calc(-50% + var(--y) * var(--gallery-scale))
                )
                scale(var(--depth));
        }

        .center-title {
            padding: 0.4rem 0.8rem;
            gap: 0.3rem;
            min-width: auto;
            width: 90%;
            bottom: 10%;
        }

        .subtitle-text {
            font-size: 1.6rem;
            max-width: 90vw;
            line-height: 1.3;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
        }

        .eye-tooltip {
            display: none;
        }
    }

    /* Small mobile */
    @media (max-width: 480px) {
        .uchiha-gallery {
            min-height: 50vh;
        }

        .parallax-container {
            --gallery-scale: 0.75;
            min-height: 350px;
        }

        .orbital-eye {
            transform: translate(
                    calc(-50% + var(--x) * var(--gallery-scale)),
                    calc(-50% + var(--y) * var(--gallery-scale))
                )
                scale(var(--depth));
        }

        .subtitle-text {
            font-size: 1.4rem;
            max-width: 95vw;
        }

        .center-label {
            font-size: 0.7rem;
            letter-spacing: 0.1em;
        }
    }
</style>
