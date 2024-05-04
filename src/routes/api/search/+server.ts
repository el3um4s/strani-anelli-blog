import { json } from '@sveltejs/kit';
import type { Post, Frontmatter } from '$lib/types';
import matter from 'gray-matter';

// https://joyofcode.xyz/blazing-fast-sveltekit-search
// https://www.npmjs.com/package/gray-matter

const patterns: Record<string, RegExp> = {
	frontmatter: /---.*?---/gs,
	code: /```.*?\n|```/gs,
	inline: /`([^`]*)`/g,
	heading: /^#{1,6}\s.*$/gm,
	link: /\[([^\]]+)\]\(([^)]+)\)/g,
	image: /\!\[.*?\]\(.*?\)/g,
	blockquote: /> /gm,
	bold: /\*\*/g,
	italic: /\b_([^_]+)_(?!\w)/g,
	special: /{%.*?%}/g,
	tags: /[<>]/g
};

const htmlEntities: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;'
};

function stripMarkdown(markdown: string): string {
	for (const pattern in patterns) {
		switch (pattern) {
			case 'inline':
				markdown = markdown.replace(patterns[pattern], '$1');
				break;
			case 'tags':
				markdown = markdown.replace(patterns[pattern], (match) => htmlEntities[match]);
				break;
			case 'link':
				markdown = markdown.replace(patterns[pattern], '$2');
				break;
			case 'italic':
				markdown = markdown.replace(patterns[pattern], '$1');
				break;
			default:
				markdown = markdown.replace(patterns[pattern], '');
		}
	}

	return markdown;
}

async function getPosts() {
	let posts: Post[] = [];

	// const paths = import.meta.glob('/src/posts/**/*.md', { eager: true });
	const paths = import.meta.glob('/src/posts/**/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	posts = Object.entries(paths)
		.map(([path, content]) => {
			const metadata = matter(content).data as unknown as Frontmatter;
			const src = path.replace('/src/posts/', '').replace('/post.md', '');
			const srcP = src.split('/');
			const slug = `${path.split('/').at(-2)}`;

			const post = {
				...metadata,
				date: `${metadata.date}`.substring(0, 10),
				slug,
				src,
				srcP,
				content: stripMarkdown(content as string)
			} satisfies Post;
			return post;
		})
		.filter((x) => x.published);

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
