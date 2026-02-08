import itachiImg from "$lib/assets/authors/itachi.webp";
import jiraiyaImg from "$lib/assets/authors/jiraiya.webp";
import kakashiImg from "$lib/assets/authors/kakashi.webp";
import minatoImg from "$lib/assets/authors/kushina_and_minato.webp";
import narutoImg from "$lib/assets/authors/naruto.webp";
import obitoImg from "$lib/assets/authors/obito.webp";
import painImg from "$lib/assets/authors/pain.webp";
import zabuzaImg from "$lib/assets/authors/zabuza.webp";
import gaaraImg from "$lib/assets/authors/gaara.webp";

export const AUTHORS = [
    {
        name: "Jiraiya Sensei",
        role: "Sage of Mount Myōboku",
        avatar: jiraiyaImg,
    },
    {
        name: "Itachi Uchiha",
        role: "Rogue Ninja",
        avatar: itachiImg,
    },
    {
        name: "Kakashi Hatake",
        role: "The Copy Ninja",
        avatar: kakashiImg,
    },
    {
        name: "Minato Namikaze",
        role: "The Yellow Flash",
        avatar: minatoImg,
    },
    {
        name: "Obito Uchiha",
        role: "The Masked Man",
        avatar: obitoImg,
    },
    {
        name: "Pain",
        role: "Leader of Akatsuki",
        avatar: painImg,
    },
    {
        name: "Zabuza Momochi",
        role: "Demon of the Hidden Mist",
        avatar: zabuzaImg,
    },
    {
        name: "Gaara",
        role: "Kazekage",
        avatar: gaaraImg,
    },
    {
        name: "Naruto Uzumaki",
        role: "Hokage",
        avatar: narutoImg,
    }
];

export function getAuthor(slug: string) {
    // Deterministic assignment based on slug length or char code sum
    if (!slug) return AUTHORS[0];
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AUTHORS.length;
    return AUTHORS[index];
}
