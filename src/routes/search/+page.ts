import { error } from '@sveltejs/kit';

export const prerender = 'auto';

export async function load({ fetch }) {
	try {
		const response = await fetch('../../api/search');
		const allPosts = await response.json();

		return { posts: allPosts };

	} catch (e) {
		error(404, `Error (search)!`);
	}
}
