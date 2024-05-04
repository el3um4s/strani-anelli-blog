<script lang="ts">
	import { slide } from 'svelte/transition';
	import * as config from '$lib/config';
	import type { Post } from '$lib/types';
	import { base } from '$app/paths';
	import { formatDate } from '$lib/utils';

	// import PostPreview from '$lib/components/custom/post-preview.svelte';

	import PostPreview from '$lib/components/search/search-results.svelte';

	// Vite has a special import for workers
	import SearchWorker from '$lib/components/search/search-worker?worker';
	import { onMount } from 'svelte';

	let search: 'idle' | 'load' | 'ready' = 'idle';
	let searchTerm = '';
	let results: Post[] = [];
	let searchWorker: Worker;

	onMount(() => {
		// create worker
		searchWorker = new SearchWorker();
		// listen for messages
		searchWorker.addEventListener('message', (e) => {
			const { type, payload } = e.data;
			type === 'ready' && (search = 'ready');
			type === 'results' && (results = payload.results);
		});
		// initialize when the component mounts
		searchWorker.postMessage({ type: 'load' });
	});

	$: if (search === 'ready') {
		// update results
		searchWorker.postMessage({ type: 'search', payload: { searchTerm } });
	}

	$: if (results.length > 0) {
		console.log('results', results.length);
		console.log(results);
	}
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="form">
	<form>
		<label for="search">Enter your search term...</label>

		<input
			id="search"
			type="search"
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			tabindex="-1"
			bind:value={searchTerm}
		/>
	</form>
</div>

{#if search == 'load'}
	<p>loading...</p>
{/if}

{#if results.length == 0}
	No results found
{/if}

{#if results.length > 0}
	{results.length} results
	<section class="list-posts">
		<ul class="list">
			{#each results as post (post.slug)}
				<li class="post">
					<PostPreview {post}></PostPreview>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style lang="postcss">
	.form {
		display: block;
	}
	form {
		width: 100%;
		max-width: 1280px;
		margin-left: auto;
		margin-right: auto;
		padding-left: 1em;
		padding-right: 1em;
		margin: 0 0 5px 0;
		padding: 1em;
	}

	label {
		display: block;
		color: red;
		cursor: pointer;
		border: 0;
		clip: rect(0, 0, 0, 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}

	input[type='search'] {
		display: block;
		margin-bottom: 0;
		padding: 0;
		border: none;
		outline: none;
		box-shadow: none;
		background-color: transparent;
		box-sizing: border-box;
		width: 100%;
		border-radius: 4px;
		@apply text-3xl font-semibold font-notoSerif;
	}
</style>
