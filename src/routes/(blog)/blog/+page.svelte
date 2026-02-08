<script lang="ts">
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    // We can load posts here directly since we are pre-rendering
    import { fetchMarkdownPosts } from "$lib/utils/posts";
    import { getAuthor } from "$lib/utils/blog";
    import { audioController } from "$lib/stores/audio";
    import { AKATSUKI_THEME } from "$lib/config/audioMaps";
    import AkatsukiCloud from "$lib/components/AkatsukiCloud.svelte";

    let posts: any[] = [];

    onMount(async () => {
        // Ensure Akatsuki theme is playing for the main listing
        audioController.setTrack(AKATSUKI_THEME);

        posts = await fetchMarkdownPosts();
    });
</script>

<svelte:head>
    <title>Blog | My Portfolio</title>
    <meta name="description" content="Read my latest thoughts and tutorials." />
</svelte:head>

<div class="blog-hero-section">
    <div class="hero-content">
        <h2
            class="blog-article-title"
            style="margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 1rem;"
        >
            <!-- Akatsuki Cloud SVG Icon -->
            <AkatsukiCloud class="akatsuki-cloud-icon hero-cloud-icon" />
            Secret Scrolls
        </h2>
        <p
            style="color: var(--blog-text-muted); font-size: 1.125rem; max-width: 600px; margin: 0 auto;"
        >
            Forbidden knowledge from the shadows.
        </p>
    </div>
</div>

<div class="blog-post-list">
    {#each posts as post}
        {@const author = getAuthor(post.slug)}
        <article class="blog-post-item group">
            <!-- Author Attribution (Medium Style + Naruto Creative) -->
            <div class="blog-post-author">
                <img src={author.avatar} alt={author.name} />
                <div
                    style="display: flex; flex-direction: column; line-height: 1.1;"
                >
                    <span style="font-weight: 700;">{author.name}</span>
                    <span
                        style="font-size: 0.75rem; color: var(--blog-text-muted); font-weight: 400;"
                    >
                        Summoned by <span style="color: var(--blog-accent);"
                            >Rishabh</span
                        >
                    </span>
                </div>
            </div>

            <!-- Title -->
            <h3 class="blog-post-title">
                <a href="{base}/blog/{post.slug}">
                    {post.meta.title}
                </a>
            </h3>

            <!-- Description -->
            <p class="blog-post-desc">
                {post.meta.description}
            </p>

            <!-- Minimal Metadata -->
            <div class="blog-post-meta">
                <time datetime={post.meta.date}>
                    {new Date(post.meta.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </time>
                {#if post.meta.tags && post.meta.tags.length > 0}
                    <span>·</span>
                    <span class="meta-pill">{post.meta.tags[0]}</span>
                {/if}
            </div>
        </article>
    {/each}

    {#if posts.length === 0}
        <div
            style="padding: 4rem 0; text-align: center; color: var(--blog-text-muted);"
        >
            <p>No scrolls found in the archives yet.</p>
        </div>
    {/if}
</div>
