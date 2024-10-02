import { error } from '@sveltejs/kit';

export const prerender = 'auto';

export async function load({ fetch, params }) {
	try {
		const { slug } = params;

		const response = await fetch('../../api/comics');
		// console.log(response);

		const allComics = await response.json();

		let comics = allComics.filter((comic: { slug: string }) => {
			return comic.slug.toLowerCase() == slug.toLowerCase();
		});

		// console.log(comics.length);

		// let comic = comics.length === 0 ? { ...allComics[0] } : { ...comics[0] };

		const comic = comics.length == 0 ? { ...allComics[0] } : { ...comics[0] };

		// console.log(comic);

		// const src = comics[0].src;
		// const srcP = comics[0].srcP;
		// const len = srcP.length;
		// const category = comics[0].category;
		// const date = comics[0].date;
		// const order = comics[0].order;
		// const index = comics[0].index;
		// const title = comics[0].title;

		const index = comic.index;

		// let comic = { ...comics[0] };

		const nextComic =
			index == 0
				? 'none'
				: allComics.filter((c: { index: number }) => {
						return c.index == index - 1;
					})[0].slug;

		const previousComic =
			index == allComics.length - 1
				? 'none'
				: allComics.filter((c: { index: number }) => {
						return c.index == index + 1;
					})[0].slug;

		const first = allComics.at(-1).slug;
		const last = allComics.at(0).slug;
		const random = allComics[Math.floor(Math.random() * allComics.length)].slug;

		return { ...comic, next: nextComic, prev: previousComic, first, last, random };

		// return { ...comic, previousComic: previousComic.slug, nextComic: nextComic.slug };
	} catch (e) {
		error(404, `Could not find ${params.slug}`);
		// const response = await fetch('../api/comics');
		// const allComics = await response.json();
		// const comic = { ...allComics[0] };
		// return comic;
	}
}
