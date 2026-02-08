<script lang="ts">
    import { onMount } from "svelte";
    import { fetchMarkdownPosts } from "$lib/utils/posts";
    import { cubicOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    let posts: any[] = [];
    let visible = false;

    onMount(() => {
        // Load latest 3 posts - run async without blocking cleanup return
        (async () => {
            posts = (await fetchMarkdownPosts()).slice(0, 3);
        })();

        // Simple intersection observer to trigger animation
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    visible = true;
                }
            },
            { threshold: 0.1 },
        );

        const section = document.getElementById("blog-preview");
        if (section) observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
        };
    });
</script>

<section id="blog-preview" class="py-24 relative overflow-hidden">
    <div class="container mx-auto px-6 relative z-10">
        {#if visible}
            <div
                in:fly={{ y: 50, duration: 1000, easing: cubicOut }}
                class="text-center mb-16"
            >
                <h2 class="text-4xl md:text-5xl font-bold mb-6 font-heading">
                    <span class="text-white">Ninja</span>
                    <span class="text-chakra-blue">Scrolls</span>
                </h2>
                <p class="text-gray-400 max-w-2xl mx-auto text-lg">
                    Insights and techniques from my journey.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {#each posts as post, i}
                    <div
                        in:fly={{
                            y: 50,
                            delay: 200 + i * 100,
                            duration: 1000,
                            easing: cubicOut,
                        }}
                        class="group relative bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-chakra-blue/50 transition-colors duration-300"
                    >
                        <div class="p-6">
                            <div
                                class="flex items-center gap-2 mb-4 text-xs text-chakra-blue font-mono uppercase tracking-wider"
                            >
                                <span
                                    >{new Date(
                                        post.meta.date,
                                    ).toLocaleDateString()}</span
                                >
                            </div>

                            <h3
                                class="text-xl font-bold text-white mb-3 group-hover:text-chakra-blue transition-colors"
                            >
                                <a
                                    href="/Portfolio/blog/{post.slug}"
                                    class="focus:outline-none"
                                >
                                    <span class="absolute inset-0"></span>
                                    {post.meta.title}
                                </a>
                            </h3>

                            <p class="text-gray-400 text-sm line-clamp-3 mb-4">
                                {post.meta.description}
                            </p>

                            <div
                                class="flex items-center text-sm text-chakra-blue font-medium group-hover:translate-x-1 transition-transform"
                            >
                                Read Scroll <span>→</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            {#if posts.length > 0}
                <div
                    in:fly={{ y: 20, delay: 600, duration: 800 }}
                    class="mt-12 text-center"
                >
                    <a
                        href="/Portfolio/blog"
                        class="inline-block px-8 py-3 bg-neutral-900 border border-chakra-blue text-chakra-blue font-bold rounded hover:bg-chakra-blue hover:text-white transition-all duration-300"
                    >
                        View All Scrolls
                    </a>
                </div>
            {/if}
        {/if}
    </div>
</section>

<style>
    :global(.text-chakra-blue) {
        color: #3b82f6; /* Fallback if variable not defined */
        color: var(--chakra-blue, #3b82f6);
    }
    :global(.bg-chakra-blue) {
        background-color: #3b82f6;
        background-color: var(--chakra-blue, #3b82f6);
    }
    :global(.font-heading) {
        font-family: "Space Grotesk", sans-serif; /* Fallback */
        font-family: var(--font-heading, "Space Grotesk", sans-serif);
    }
</style>
