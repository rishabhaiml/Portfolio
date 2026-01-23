/**
 * NARUTO PORTFOLIO - SVELTE STORES
 * State management for Sharingan evolution and app state
 */

import { writable, derived } from 'svelte/store';

/**
 * Eye Evolution Stages:
 * 0 - Normal Eye (not activated)
 * 1 - 1-Tomoe Sharingan (Landing)
 * 2 - 2-Tomoe Sharingan (Skills)
 * 3 - 3-Tomoe Sharingan (Projects)
 * 4 - Mangekyou Sharingan (Experience)
 * 5 - Rinnegan (Contact/About)
 */
export const eyeEvolution = writable<number>(0);

/**
 * Current section being viewed
 */
export const currentSection = writable<number>(0);

/**
 * Section names for reference
 */
export const SECTIONS = [
    'hero',
    'skills',
    'projects',
    'experience',
    'contact'
] as const;

/**
 * Easter Eggs State
 */
export const hokageMode = writable<boolean>(false);
export const sageMode = writable<boolean>(false);
export const byakuganMode = writable<boolean>(false);

/**
 * Navigation state
 */
export const isNavigating = writable<boolean>(false);
export const targetSection = writable<number | null>(null);

/**
 * Derived store for eye stage name
 */
export const eyeStageName = derived(eyeEvolution, ($stage) => {
    const stages = [
        'Normal',
        '1-Tomoe Sharingan',
        '2-Tomoe Sharingan',
        '3-Tomoe Sharingan',
        'Mangekyou Sharingan',
        'Rinnegan'
    ];
    return stages[$stage] || 'Unknown';
});

/**
 * Check if all sections have been visited
 */
export const visitedSections = writable<Set<number>>(new Set());

export const allSectionsVisited = derived(visitedSections, ($visited) => {
    return $visited.size >= SECTIONS.length;
});

/**
 * Konami Code tracking for Sage Mode easter egg
 */
export const konamiProgress = writable<number>(0);
export const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

/**
 * Audio settings
 */
export const soundEnabled = writable<boolean>(true);

/**
 * Animation preferences
 */
export const reducedMotion = writable<boolean>(false);

/**
 * Loader completion state - signals when RasenganLoader finishes
 */
export const loaderComplete = writable<boolean>(false);
