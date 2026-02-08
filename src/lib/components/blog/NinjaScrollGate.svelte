<script lang="ts">
    import { audioController } from "$lib/stores/audio";
    import { reducedMotion } from "$lib/stores/index";
    import AkatsukiCloud from "$lib/components/AkatsukiCloud.svelte";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    export let onUnlock: () => void;

    let unlocking = false;
    let errorMsg = "";

    async function handleRelease() {
        unlocking = true;
        errorMsg = "";

        const success = await audioController.unlock();

        if (success) {
            if ($reducedMotion) {
                onUnlock();
            } else {
                // Allow animation to play out (parchment unrolling effect)
                setTimeout(() => {
                    onUnlock();
                }, 1500);
            }
        } else {
            unlocking = false;
            errorMsg = "The scroll remains sealed. Tap to try again.";
        }
    }
</script>

<div class="scroll-gate" out:fade={{ duration: 800 }}>
    <!-- Background Akatsuki Pattern -->
    <div class="akatsuki-bg-pattern"></div>

    <div class="scroll-container" class:unlocking>
        <!-- Top Scroll Bar -->
        <div class="scroll-handle top">
            <div class="handle-detail"></div>
            <div class="handle-cap left"></div>
            <div class="handle-cap right"></div>
        </div>

        <!-- Parchment Content -->
        <div class="parchment">
            <div class="seal-container">
                <!-- Akatsuki Cloud Seal -->
                <div class="ninja-seal" class:breaking={unlocking}>
                    <AkatsukiCloud width="120" height="80" />
                    <div class="seal-glow"></div>
                </div>
            </div>

            <div class="content-text" class:fading={unlocking}>
                <h1>Forbidden Knowledge</h1>
                <p>
                    This scroll is protected by the <span class="highlight"
                        >Akatsuki</span
                    >.
                </p>
                <p class="sub-text">Release the seal to hear their anthem.</p>

                {#if errorMsg}
                    <p class="error-text" in:fly={{ y: 10 }}>{errorMsg}</p>
                {/if}

                <button
                    class="release-btn"
                    on:click={handleRelease}
                    disabled={unlocking}
                    aria-label="Enable sound and enter blog"
                >
                    <span class="btn-content">
                        {#if unlocking}
                            Unsealing...
                        {:else}
                            Release the Scroll
                        {/if}
                    </span>
                    <div class="btn-glare"></div>
                </button>
            </div>
        </div>

        <!-- Bottom Scroll Bar -->
        <div class="scroll-handle bottom">
            <div class="handle-detail"></div>
            <div class="handle-cap left"></div>
            <div class="handle-cap right"></div>
        </div>
    </div>
</div>

<style>
    .scroll-gate {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--blog-bg, #09090b);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .akatsuki-bg-pattern {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.05;
        background-image: radial-gradient(#b91c1c 1px, transparent 1px);
        background-size: 30px 30px;
        z-index: 1;
        pointer-events: none;
    }

    .scroll-container {
        position: relative;
        width: 90%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10;
    }

    .scroll-container.unlocking {
        transform: scale(1.1);
    }

    /* Handles */
    .scroll-handle {
        width: 115%;
        height: 48px;
        background: linear-gradient(180deg, #5c1818, #3f1010);
        border-radius: 4px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #2a0a0a;
    }

    .handle-detail {
        width: 80%;
        height: 6px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .handle-cap {
        position: absolute;
        top: -2px;
        width: 12px;
        height: 52px;
        background: #d4af37; /* Gold accent */
        border-radius: 2px;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
    }

    .handle-cap.left {
        left: 15px;
    }
    .handle-cap.right {
        right: 15px;
    }

    /* Parchment */
    .parchment {
        position: relative;
        width: 100%;
        min-height: 450px;
        background: #f5f5dc; /* Beige parchment base */
        color: #1a1a1a;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-shadow:
            0 0 60px rgba(0, 0, 0, 0.7) inset,
            0 0 20px rgba(0, 0, 0, 0.2);
        /* Texture pattern */
        background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
        transform-origin: top center;
        transition: all 1s ease;
    }

    .unlocking .parchment {
        opacity: 0;
        transition: opacity 1s ease 0.5s;
    }

    .unlocking .scroll-handle.top {
        transform: translateY(-250px);
        opacity: 0;
        transition: all 1s ease 0.2s;
    }

    .unlocking .scroll-handle.bottom {
        transform: translateY(250px);
        opacity: 0;
        transition: all 1s ease 0.2s;
    }

    /* Seal */
    .seal-container {
        margin-bottom: 2.5rem;
        position: relative;
    }

    .ninja-seal {
        position: relative;
        transition: all 0.5s ease;
        animation: sealFloat 4s ease-in-out infinite;
        filter: drop-shadow(0 0 15px rgba(185, 28, 28, 0.4));
    }

    .seal-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background: radial-gradient(
            circle,
            rgba(185, 28, 28, 0.3) 0%,
            transparent 70%
        );
        pointer-events: none;
        animation: sealPulse 2s infinite;
    }

    .ninja-seal.breaking {
        transform: scale(1.8) rotate(10deg);
        opacity: 0;
        filter: blur(20px);
        animation: none;
        transition: all 0.6s ease;
    }

    @keyframes sealFloat {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }

    @keyframes sealPulse {
        0%,
        100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.2);
        }
    }

    /* Content */
    .content-text {
        transition: opacity 0.3s ease;
    }

    .content-text.fading {
        opacity: 0;
    }

    h1 {
        font-family: "Outfit", sans-serif;
        font-weight: 800;
        font-size: 2.2rem;
        margin-bottom: 0.75rem;
        color: #0c0a09;
        letter-spacing: -0.03em;
        text-transform: uppercase;
    }

    p {
        font-family: "Merriweather", serif;
        color: #44403c;
        font-size: 1.15rem;
        margin-bottom: 0.5rem;
        line-height: 1.6;
    }

    .sub-text {
        font-size: 0.95rem;
        color: #78716c;
        font-style: italic;
        margin-bottom: 2.5rem;
    }

    .highlight {
        color: #b91c1c;
        font-weight: 900;
    }

    .error-text {
        color: #dc2626;
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
        background: rgba(220, 38, 38, 0.1);
        padding: 0.5rem;
        border-radius: 4px;
    }

    /* Dynamic Button */
    .release-btn {
        position: relative;
        background: #09090b;
        color: #e5e5e5;
        border: none;
        padding: 1rem 2.5rem;
        font-family: "Outfit", sans-serif;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        border-radius: 2px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    .release-btn::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #b91c1c;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 1;
    }

    .release-btn:hover::before {
        transform: translateX(0);
    }

    .release-btn:hover {
        box-shadow: 0 8px 20px rgba(185, 28, 28, 0.4);
        transform: translateY(-2px);
    }

    .btn-content {
        position: relative;
        z-index: 2;
    }

    .btn-glare {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: rotate(45deg) translate(-100%, -100%);
        transition: transform 0.6s;
        pointer-events: none;
        z-index: 3;
    }

    .release-btn:hover .btn-glare {
        transform: rotate(45deg) translate(100%, 100%);
    }

    .release-btn:disabled {
        opacity: 0.8;
        cursor: wait;
        transform: none;
        box-shadow: none;
        background: #44403c;
    }

    /* Mobile */
    @media (max-width: 480px) {
        .scroll-container {
            width: 95%;
        }
        .parchment {
            padding: 3rem 1.5rem;
            min-height: 400px;
        }
        h1 {
            font-size: 1.8rem;
        }
    }
</style>
