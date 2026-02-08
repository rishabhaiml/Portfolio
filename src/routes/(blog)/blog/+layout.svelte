<script>
    import "../../../app.css";
    import "./blog-theme.css";
    import { onMount, onDestroy } from "svelte";
    import { slide } from "svelte/transition";
    import { base } from "$app/paths";
    import { themeStore } from "$lib/stores/theme.svelte";
    import { audioController } from "$lib/stores/audio";
    import AkatsukiCloud from "$lib/components/AkatsukiCloud.svelte";
    import NinjaScrollGate from "$lib/components/blog/NinjaScrollGate.svelte";
    import BlogAudioToggle from "$lib/components/blog/BlogAudioToggle.svelte";

    let { children } = $props();

    let showGate = $state(false);
    let gatePassed = $state(false);
    let showDisclaimer = $state(false);
    /** @type {import('svelte/store').Unsubscriber} */
    let unsubscribe;

    import { get } from "svelte/store"; // Need get for one-off check

    onMount(() => {
        themeStore.init();
        audioController.init();

        unsubscribe = audioController.subscribe((state) => {
            if (state.unlocked) {
                // Audio is unlocked, proceed to show blog
                gatePassed = true;
                showGate = false;
            } else {
                // Locked state - show gate
                showGate = true;
                gatePassed = false;
            }
        });

        // Initial setup for audio element
        audioController.setupAudio();

        // Try autoplay ONCE on mount if already unlocked
        // We use a small timeout to ensure the audio element is ready and policies are checked
        setTimeout(() => {
            audioController.autoplay();
        }, 100);
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
        audioController.fadeOut(); // Fade out music when leaving blog section
    });
</script>

<svelte:head>
    <!-- Prevent FOUC -->
    <script>
        (function () {
            try {
                var localTheme = localStorage.getItem("theme");
                var supportDarkMode =
                    window.matchMedia("(prefers-color-scheme: dark)")
                        .matches === true;
                if (!localTheme && supportDarkMode)
                    document.documentElement.setAttribute("data-theme", "dark");
                if (localTheme)
                    document.documentElement.setAttribute(
                        "data-theme",
                        localTheme,
                    );
            } catch (e) {}
        })();
    </script>
</svelte:head>

<!-- Ninja Scroll Gate Overlay -->
{#if showGate}
    <NinjaScrollGate
        onUnlock={() => {
            // State update handled inside component->store,
            // subscription will update local state here automatically
        }}
    />
{/if}

<!-- Blog Content (Always in DOM for SEO, but visually hidden until gate passed) -->
<div class="blog-context" class:hidden={!gatePassed}>
    <header class="blog-header">
        <div class="blog-container blog-header-inner">
            <!-- Blog Logo / Title -->
            <h1 class="blog-title">
                <a
                    href="{base}/blog"
                    style="display: flex; align-items: center; gap: 0.5rem;"
                >
                    <!-- Small Akatsuki Cloud Icon -->
                    <AkatsukiCloud
                        class="akatsuki-cloud-icon header-cloud-icon"
                    />
                    Forbidden Scrolls
                </a>
            </h1>

            <!-- Back Link & Toggle -->
            <nav class="blog-controls">
                <BlogAudioToggle />
                <a href="{base}/" class="nav-pill"> Return to Village </a>
            </nav>
        </div>
    </header>

    <main class="blog-container blog-main">
        {@render children()}
    </main>

    <footer class="blog-container blog-footer">
        <p>
            &copy; {new Date().getFullYear()} Rishabh Shukla. All rights reserved.
        </p>
        <div
            style="margin-top: 0.5rem; display: flex; gap: 1rem; justify-content: center;"
        >
            <a href="{base}/" style="text-decoration: underline;">Portfolio</a>
            <a
                href="https://github.com/rishabhaiml"
                target="_blank"
                rel="noreferrer"
                style="text-decoration: underline;">GitHub</a
            >
        </div>
        <div class="disclaimer-accordion">
            <button
                class="disclaimer-toggle"
                onclick={() => (showDisclaimer = !showDisclaimer)}
                aria-expanded={showDisclaimer}
            >
                <span
                    class="text-red"
                    style="letter-spacing: 0.1em; font-weight: 700; text-transform: uppercase;"
                >
                    Sealed with Chakra
                </span>
                <span class="toggle-indicator">
                    {showDisclaimer ? "Hide Protocol" : "View Protocol"}
                </span>
            </button>

            {#if showDisclaimer}
                <p class="disclaimer-text" transition:slide={{ duration: 300 }}>
                    Disclaimer: This portfolio is a non-profit, educational
                    project created solely to demonstrate technical skills. All
                    characters, names, audio, and visual assets related to
                    'Naruto' are identifiers of and copyright to Masashi
                    Kishimoto, Shueisha, Viz Media, and TV Tokyo. No copyright
                    infringement is intended. This project is not affiliated
                    with, endorsed by, or sponsored by the official copyright
                    holders. Usage of these assets falls under 'Fair Use' for
                    educational and transformative purposes.
                </p>
            {/if}
        </div>

        <style>
            .disclaimer-accordion {
                margin-top: 2rem;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 1rem;
            }

            .disclaimer-toggle {
                width: 100%;
                background: none;
                border: none;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                transition: opacity 0.3s ease;
            }

            .disclaimer-toggle:hover {
                opacity: 0.8;
            }

            .toggle-indicator {
                font-size: 0.75rem;
                color: var(--text-muted);
                text-decoration: underline;
                text-underline-offset: 4px;
                opacity: 0.7;
            }

            .disclaimer-text {
                font-size: 0.8rem;
                opacity: 0.7;
                line-height: 1.6;
                text-align: justify;
                padding: 1rem 0.5rem;
                margin: 0;
                color: var(--text-muted);
            }
        </style>
    </footer>
</div>

<style>
    /* SEO: Content always in DOM but hidden until gate passed */
    .blog-context.hidden {
        opacity: 0;
        pointer-events: none;
        position: absolute;
        visibility: hidden;
    }

    .blog-context {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
</style>
