import itachiTheme from "$lib/assets/theme/itachi_theme.opus";
import jiraiyaTheme from "$lib/assets/theme/jiraiya_theme.opus";
import madaraTheme from "$lib/assets/quotes/madara.opus"; // Keep Madara as quote if no theme, or maybe use Obito? No madara theme in list.
import shisuiTheme from "$lib/assets/quotes/shisui.opus"; // No shisui theme in list.
import painTheme from "$lib/assets/theme/pain_theme.opus";
import narutoTheme from "$lib/assets/theme/naruto_theme.opus";
import kakashiTheme from "$lib/assets/theme/kakashi_theme.opus";
import gaaraTheme from "$lib/assets/theme/gaara_theme.opus";
import zabuzaTheme from "$lib/assets/theme/zabuza_theme.opus";
import obitoTheme from "$lib/assets/theme/obito_theme.opus";
import minatoTheme from "$lib/assets/theme/kushina_and_minato_theme.opus";
import akatsukiTheme from "$lib/assets/theme/akatsuki_theme.opus";

export const AKATSUKI_THEME = akatsukiTheme;

// Map simplified or full names to audio
export const AUTHOR_THEMES: Record<string, string> = {
    "itachi": itachiTheme,
    "itachi uchiha": itachiTheme,
    "jiraiya": jiraiyaTheme,
    "jiraiya sensei": jiraiyaTheme,
    "madara": madaraTheme,
    "madara uchiha": madaraTheme,
    "shisui": shisuiTheme,
    "shisui uchiha": shisuiTheme,
    "pain": painTheme,
    "naruto": narutoTheme,
    "naruto uzumaki": narutoTheme,
    "kakashi": kakashiTheme,
    "kakashi hatake": kakashiTheme,
    "gaara": gaaraTheme,
    "zabuza": zabuzaTheme,
    "zabuza momochi": zabuzaTheme,
    "obito": obitoTheme,
    "obito uchiha": obitoTheme,
    "minato": minatoTheme,
    "minato namikaze": minatoTheme,
    "kushina": minatoTheme,
    "rishabh shukla": itachiTheme,
};

export function getAuthorTheme(author?: string): string {
    if (!author) return akatsukiTheme;
    const normalized = author.toLowerCase().trim();

    // 1. Direct match
    if (AUTHOR_THEMES[normalized]) return AUTHOR_THEMES[normalized];

    // 2. Partial match (check if any key is contained in the author name)
    // e.g. "Sage of Mount Myōboku (Jiraiya)" -> matches key "jiraiya"
    const partialKey = Object.keys(AUTHOR_THEMES).find(key => normalized.includes(key));
    if (partialKey) return AUTHOR_THEMES[partialKey];

    return akatsukiTheme;
}
