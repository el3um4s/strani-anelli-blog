import { json } from '@sveltejs/kit';
import type { Comic } from '$lib/types';

async function getComics() {
	let comics: Comic[] = [];

	const paths = import.meta.glob(['/src/posts/comics/**/*.webp', '/src/posts/comics/**/*.jpg'], {
		eager: true
	});

	for (const path in paths) {
		// const file = paths[path];
		const src = path.replace('/src/posts/comics', '');
		const srcP = src.split('/');
		const category = path.split('/').at(-2);

		const date = src
			.split('-')
			.at(-1)
			?.replaceAll('.webp', '')
			.replaceAll('.jpg', '')
			.replaceAll(' ', '')
			.replaceAll('.', '-');
		const order = src.split('-').at(-2)?.replaceAll(' ', '');

		const comic: Comic = {
			category: category || '',
			src,
			srcP,
			date: date || '1900-01-01',
			order: order || '000'
		};
		comics.push(comic);
	}

	comics = comics
		.sort((first, second) => (second.order < first.order ? -1 : second.order > first.order ? 1 : 0))
		.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

	return comics;
}

export async function GET() {
	const posts = await getComics();
	return json(posts);
}
