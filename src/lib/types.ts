export type Categories = 'sveltekit' | 'svelte';

export type Post = {
	title: string;
	slug: string;
	src: string;
	srcP: string[];
	description: string;
	date: string;
	categories: Categories[];
	published: boolean;
	cover?: string;
	column?: string;
	jolly?: any;
	lang?: string;
	content?: string;
	subtitle?: string;
	ignore?: boolean;
};

export type Frontmatter = {
	title: string; //
	description: string; //
	date: string; //
	categories: Categories[]; //
	published: boolean; //
	cover?: string; //
	column?: string; //
	lang?: string; //
	subtitle?: string; //
	ignore?: boolean; //
};
