import { browser } from '$app/environment';

class ThemeStore {
    theme = $state('light');

    constructor() {
        // No-op, managed by init
    }

    init() {
        if (typeof window === 'undefined') return;

        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (saved === 'dark' || (!saved && prefersDark)) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        this.apply();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.apply();
    }

    apply() {
        if (typeof document === 'undefined') return;
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

// Export singleton
export const themeStore = new ThemeStore();
