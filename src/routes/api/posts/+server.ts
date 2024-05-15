import { json } from '@sveltejs/kit';
import type { Post } from '$lib/types';

async function getPosts() {
	let posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/**/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const src = path.replace('/src/posts/', '').replace('/post.md', '');
		const srcP = src.split('/');
		const slug = path.split('/').at(-2);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = {
				...metadata,
				ignore: !!metadata?.ignore,
				date: !metadata?.ignore ? metadata.date.substring(0, 10) : '9999-12-31',
				slug,
				src,
				srcP
			} satisfies Post;

			post.published && !post.ignore && posts.push(post);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
