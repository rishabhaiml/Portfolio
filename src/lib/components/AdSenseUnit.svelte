<script lang="ts">
    import { onMount } from "svelte";

    export let client = "ca-pub-0000000000000000";
    export let slot = "1234567890"; // Dummy slot ID
    export let format = "auto";
    export let responsive = "true";

    let adRef: HTMLElement;

    onMount(() => {
        // Safety check: ensure push happens only if script is loaded
        // and we haven't already filled this specific slot if manually managing (though AdSense handles this).
        try {
            if (typeof window !== "undefined") {
                const ads = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle = ads;
                ads.push({});
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    });
</script>

<div class="my-8 text-center overflow-hidden">
    <!-- google-adsense-post-unit -->
    <ins
        class="adsbygoogle block"
        style="display:block"
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        bind:this={adRef}
    >
    </ins>
</div>
