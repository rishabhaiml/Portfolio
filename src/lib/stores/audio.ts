/**
 * AUDIO CONTROLLER STORE
 * Singleton manager for audio in the blog section.
 * Handles persistence, unlocking, playback state, and dynamic track switching.
 */
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { soundEnabled } from './index'; // Import global sound preference
import { AKATSUKI_THEME } from '$lib/config/audioMaps';

interface AudioState {
    unlocked: boolean;
    playing: boolean;
    currentTrack: string;
    error: string | null;
}

const initialState: AudioState = {
    unlocked: false,
    playing: false,
    currentTrack: AKATSUKI_THEME,
    error: null
};

function createAudioController() {
    const { subscribe, update, set } = writable<AudioState>(initialState);
    let audioInstance: HTMLAudioElement | null = null;
    let fadeInterval: any = null;

    return {
        subscribe,

        /**
         * Initialize the controller (Client-side only)
         */
        init: () => {
            if (!browser) return;

            const persistedUnlock = localStorage.getItem('audioUnlocked') === 'true';

            update(state => ({
                ...state,
                unlocked: persistedUnlock
            }));

            if (persistedUnlock) {
                soundEnabled.set(true);
            }
        },

        /**
         * Set the track to play.
         * If the track is different from current, it stops the old one.
         * If unlocked, it plays the new one immediately.
         */
        setTrack: (trackUrl: string) => {
            if (!trackUrl) return;

            const state = get({ subscribe });
            if (state.currentTrack === trackUrl && audioInstance) {
                // Already on this track. Ensure it's playing if unlocked.
                if (state.unlocked && state.playing && !audioInstance.paused) return;
                // If paused/stopped, logic below might restart it
            }

            update(s => ({ ...s, currentTrack: trackUrl }));

            // If we have an instance, switch source
            if (audioInstance) {
                const wasPlaying = !audioInstance.paused;

                // Fade out old if playing? For simplicity, we just switch.
                if (wasPlaying) {
                    audioInstance.pause();
                }

                audioInstance.src = trackUrl;
                // Loop logic: Akatsuki loops, others (quotes) do not
                audioInstance.loop = false;

                if (state.unlocked) {
                    // Auto-resume if already unlocked
                    // @ts-ignore
                    audioController.play();
                }
            }
        },

        /**
         * Create and configure the audio element if it doesn't exist
         */
        setupAudio: () => {
            if (!browser) return;

            const state = get({ subscribe });

            if (audioInstance) {
                // Ensure src is synced to state
                if (audioInstance.src !== state.currentTrack && !audioInstance.src.endsWith(state.currentTrack)) {
                    audioInstance.src = state.currentTrack;
                }
                return;
            }

            audioInstance = new Audio(state.currentTrack);
            audioInstance.loop = false;
            audioInstance.volume = 0.6;
            audioInstance.preload = 'auto';

            // Event listeners
            audioInstance.onplay = () => update(s => ({ ...s, playing: true }));
            audioInstance.onpause = () => update(s => ({ ...s, playing: false }));
            audioInstance.onerror = (e) => {
                console.error("Audio Error:", e);
                update(s => ({ ...s, error: "Failed to load audio." }));
            };
            audioInstance.onended = () => update(s => ({ ...s, playing: false }));
        },

        /**
         * Unlock and play audio (Must be called from user interaction)
         */
        unlock: async () => {
            if (!browser) return false;

            // Ensure audio exists
            if (!audioInstance) {
                // @ts-ignore
                audioController.setupAudio();
            }

            if (!audioInstance) return false;

            try {
                soundEnabled.set(true);
                await audioInstance.play();
                localStorage.setItem('audioUnlocked', 'true');

                update(state => ({
                    ...state,
                    unlocked: true,
                    playing: true,
                    error: null
                }));

                return true;
            } catch (err) {
                console.warn("Audio unlock failed:", err);
                update(s => ({ ...s, error: "Scroll sealed. Tap to retry." }));
                return false;
            }
        },

        /**
         * Internal play method (safe to call programmatically if unlocked)
         */
        play: async () => {
            if (!browser || !audioInstance) return;
            try {
                await audioInstance.play();
            } catch (e) {
                console.warn("Play blocked/failed", e);
                // If this was an autoplay attempt and it failed, we might need to re-lock
                // But this method is generic.
            }
        },

        /**
         * Attempt to autoplay if already unlocked
         */
        autoplay: async () => {
            if (!browser) return;
            const state = get({ subscribe });
            if (!state.unlocked) return;

            // Ensure audio exists
            if (!audioInstance) {
                // @ts-ignore
                audioController.setupAudio();
            }

            if (audioInstance && get(soundEnabled)) {
                try {
                    await audioInstance.play();
                } catch (e) {
                    console.warn("Autoplay blocked. Reverting to gate.");
                    update(s => ({
                        ...s,
                        unlocked: false,
                        error: "Connection lost. Release the scroll again."
                    }));
                }
            }
        },

        pause: () => {
            if (audioInstance) {
                audioInstance.pause();
                update(s => ({ ...s, playing: false }));
            }
        },

        fadeOut: () => {
            if (!audioInstance || audioInstance.paused) return;
            if (fadeInterval) clearInterval(fadeInterval);

            const startVol = audioInstance.volume;
            let currentVol = startVol;

            fadeInterval = setInterval(() => {
                currentVol -= 0.05;
                if (currentVol <= 0) {
                    if (audioInstance) {
                        audioInstance.pause();
                        audioInstance.volume = startVol;
                    }
                    clearInterval(fadeInterval);
                } else if (audioInstance) {
                    audioInstance.volume = currentVol;
                }
            }, 50);
        },

        toggle: async () => {
            const state = get({ subscribe });
            if (!audioInstance) return;

            if (state.playing) {
                audioInstance.pause();
                update(s => ({ ...s, playing: false }));
            } else {
                if (state.currentTrack) {
                    audioInstance.currentTime = 0; // Replay from start if finished/paused
                    try {
                        await audioInstance.play();
                    } catch (err) {
                        console.warn("Toggle play failed", err);
                    }
                }
            }
        }
    };
}

export const audioController = createAudioController();
