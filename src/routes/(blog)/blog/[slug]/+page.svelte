<script>
    import { onMount } from "svelte";
    import { audioController } from "$lib/stores/audio";
    import { getAuthor } from "$lib/utils/blog";
    import { getAuthorTheme } from "$lib/config/audioMaps";
    import AdSenseUnit from "$lib/components/AdSenseUnit.svelte";
    const { data } = $props();

    // Determine author dynamically based on slug or metadata
    let author = $derived(getAuthor(data.meta.slug));

    // Reactively update audio track when author changes (e.g. navigating between posts)
    $effect(() => {
        const theme = getAuthorTheme(author.name);
        audioController.setTrack(theme);
    });

    // Share Functionality
    let showToast = $state(false);

    async function handleShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.meta.title,
                    text: data.meta.description,
                    url: window.location.href,
                });
            } catch (err) {
                // Ignore abort errors
                // @ts-ignore
                if (err.name !== "AbortError") copyToClipboard();
            }
        } else {
            copyToClipboard();
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(window.location.href);
        showToast = true;
        setTimeout(() => (showToast = false), 2000);
    }

    // Chakra Meter (Scroll Progress)
    let scrollY = $state(0);
    let innerHeight = $state(0);
    let docHeight = $state(0);
    let progress = $derived(
        docHeight > innerHeight
            ? (scrollY / (docHeight - innerHeight)) * 100
            : 0,
    );
</script>

<svelte:window bind:scrollY bind:innerHeight />
<svelte:body bind:clientHeight={docHeight} />

<!-- Chakra Meter Progress Bar -->
<div class="chakra-meter-container">
    <div class="chakra-meter-fill" style="width: {progress}%"></div>
</div>

<svelte:head>
    <title>{data.meta.title}</title>
    <meta name="description" content={data.meta.description} />
    <meta property="og:title" content={data.meta.title} />
    <meta property="og:description" content={data.meta.description} />
    <meta property="og:type" content="article" />
    <meta
        property="og:url"
        content={`https://rishabhai.me/blog/${data.meta.slug || ""}`}
    />
    <meta property="og:image" content="https://rishabhai.me/og-image.png" />
    <link
        rel="canonical"
        href={`https://rishabhai.me/blog/${data.meta.slug || ""}`}
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={data.meta.title} />
    <meta name="twitter:description" content={data.meta.description} />
    <meta name="twitter:image" content="https://rishabhai.me/og-image.png" />

    <!-- Structured Data for LLMs and Search Engines -->
    {@html `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: data.meta.title,
        description: data.meta.description,
        datePublished: data.meta.date,
        author: {
            "@type": "Person",
            name: "Rishabh Shukla",
            url: "https://rishabhai.me",
        },
        publisher: {
            "@type": "Person",
            name: "Rishabh Shukla",
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://rishabhai.me/blog/${data.meta.slug || ""}`,
        },
    })}</script>`}

    <!-- AdSense Script (Loads ONLY on blog post pages) -->
    <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
        crossorigin="anonymous"
    ></script>
</svelte:head>

<article class="blog-article">
    <!-- Header -->
    <header>
        <h1 class="blog-article-title">
            {data.meta.title}
        </h1>
        <h2 class="blog-article-subtitle">
            {data.meta.description}
        </h2>

        <!-- Author Block -->
        <div class="author-block">
            <div class="author-avatar">
                <img src={author.avatar} alt={author.name} />
            </div>
            <div class="author-info">
                <div class="author-name-row">
                    <span>{author.name}</span>
                </div>
                <div class="author-meta-row">
                    <span>{author.role}</span>
                    <span>·</span>
                    <span
                        >{new Date(data.meta.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}</span
                    >
                </div>
            </div>
        </div>

        <!-- Clean Action Bar (Just Share) -->
        <div class="action-bar" style="justify-content: flex-end;">
            <button class="action-btn" aria-label="Share" onclick={handleShare}>
                <span
                    style="font-size: 0.9rem; margin-right: 0.5rem; font-weight: 500;"
                    >Share this scroll</span
                >
                <!-- Share Icon -->
                <svg viewBox="0 0 24 24">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
            </button>
        </div>
    </header>

    <!-- Ad Unit -->
    <div style="margin: 2.5rem 0;">
        <AdSenseUnit />
    </div>

    <!-- Content -->
    <div class="blog-content">
        <data.content />
    </div>

    <!-- Toast Notification -->
    {#if showToast}
        <div class="share-toast">Link Copied!</div>
    {/if}

    <!-- Action Bar (Bottom - Simplified) -->
    <div class="action-bar" style="margin-top: 4rem; border-top: none;">
        <div class="action-group">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                {#if data.meta.tags && data.meta.tags.length}
                    {#each data.meta.tags as tag}
                        <span class="meta-pill">{tag}</span>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="action-group">
            <button class="action-btn" aria-label="Share" onclick={handleShare}>
                <svg viewBox="0 0 24 24"
                    ><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
                    ></path><polyline points="16 6 12 2 8 6"></polyline><line
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="15"
                    ></line></svg
                >
            </button>
        </div>
    </div>
</article>

<style>
    /* Images are already handled in blog-theme.css, but just in case */
    :global(.blog-content img) {
        max-width: 100%;
        height: auto;
    }

    /* Chakra Meter */
    .chakra-meter-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: transparent;
        z-index: 101; /* Above header */
        pointer-events: none;
    }

    .chakra-meter-fill {
        height: 100%;
        background: var(--blog-accent);
        box-shadow: 0 0 10px var(--blog-accent);
        transition: width 0.1s linear;
    }
</style>
