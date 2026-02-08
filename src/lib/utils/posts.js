/**
 * @typedef {Object} Post
 * @property {any} meta
 * @property {string} path
 * @property {string} slug
 */

export const fetchMarkdownPosts = async () => {
    const allPostFiles = import.meta.glob('/src/lib/content/posts/*.md');
    const iterablePostFiles = Object.entries(allPostFiles);

    const allPosts = await Promise.all(
        iterablePostFiles.map(async ([path, resolver]) => {
            // @ts-ignore
            const { metadata } = await resolver();
            // Extract slug from filename: /src/lib/content/posts/my-post.md -> my-post
            const slug = path.split('/').pop()?.slice(0, -3) || '';

            return {
                meta: metadata,
                path: path,
                slug: slug,
            };
        })
    );

    return allPosts.sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });
};
