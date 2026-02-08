<script>
    import { audioController } from "$lib/stores/audio";

    // Subscribe to audio state to toggle icon
    let playing = false;
    audioController.subscribe((state) => {
        playing = state.playing;
    });

    function toggleAudio() {
        audioController.toggle();
    }
</script>

<button
    class="audio-toggle-btn"
    on:click={toggleAudio}
    aria-label={playing ? "Mute audio" : "Play audio"}
    title={playing ? "Mute" : "Play Theme"}
>
    {#if playing}
        <!-- Speaker Wave Icon (Playing) -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
    {:else}
        <!-- Speaker X Icon (Muted/Paused) -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
    {/if}
</button>

<style>
    .audio-toggle-btn {
        background: transparent;
        border: 1px solid var(--blog-border, #e5e5e5);
        color: var(--blog-text-muted, #737373);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 8px;
    }

    .audio-toggle-btn:hover {
        border-color: var(--blog-accent, #b91c1c);
        color: var(--blog-accent, #b91c1c);
        background: rgba(185, 28, 28, 0.05);
        transform: scale(1.05);
    }

    .audio-toggle-btn:active {
        transform: scale(0.95);
    }

    svg {
        width: 100%;
        height: 100%;
    }
</style>
