import { fetchMarkdownPosts } from '$lib/utils/posts';

export async function load() {
    const posts = await fetchMarkdownPosts();
    return { posts };
}
