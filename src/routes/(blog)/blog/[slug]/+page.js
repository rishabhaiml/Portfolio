import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const modules = import.meta.glob('/src/lib/content/posts/*.md');
    const path = `/src/lib/content/posts/${params.slug}.md`;

    if (modules[path]) {
        /** @type {any} */
        const post = await modules[path]();
        return {
            content: post.default,
            // excessive logging removed, just ensure slug is passed
            meta: { ...post.metadata, slug: params.slug }
        };
    }

    error(404, `Could not find ${params.slug}`);
}

export function entries() {
    const modules = import.meta.glob('/src/lib/content/posts/*.md', { eager: true });
    return Object.keys(modules).map((path) => {
        // /src/lib/content/posts/slug.md -> slug
        return { slug: path.split('/').pop()?.slice(0, -3) || '' };
    });
}
