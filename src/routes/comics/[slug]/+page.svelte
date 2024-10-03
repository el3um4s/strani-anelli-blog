<script lang="ts">
	import { base } from '$app/paths';
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	import { dev } from '$app/environment';
	export let data;

	console.log(data);
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.slug}</title>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="{base}{data.url}" />
	<meta property="og:title" content={data.title} />
	<meta property="og:site_name" content={config.title} />
	<meta property="og:description" content={data.category} />

	<!-- <meta property="og:image" content="{config.repository}/raw/main/src/posts/comics{data.src}" /> -->
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/main/src/posts/comics{data.src}"
	/>

	<meta property="article:published_time" content="{data.date.substring(0, 10)}T00:00:00+00:00}" />

	<meta name="author" content="Samuele C. De Tomasi" data-rh="true" />
	<meta name="robots" content="index,follow,max-image-preview:large" data-rh="true" />
</svelte:head>

<article class="single-post">
	<!-- Title -->
	<hgroup>
		<p class="column">
			{data.category}
		</p>

		<h1 class="title">
			{data.title}
		</h1>

		<p class="date">
			Published at {formatDate(data.date)}
		</p>
	</hgroup>

	<!-- Post -->
	<div class="post-text">
		<!-- <svelte:component this={data.content} /> -->
		<div class="comics">
			<div class="comics-navigator">
				<a href="{config.linkSite}/comics/{data.first}"> FIRST </a>

				{#if data.prev != 'none'}
					<a href="{config.linkSite}/comics/{data.prev}">
						<span>PREV</span>
					</a>
				{:else}
					<a class="comics-navigator-button-disabled" href="{config.linkSite}/comics/{data.slug}">
						<span>PREV</span>
					</a>
				{/if}

				<!-- <a href="{config.url}/comics/{data.random}">
					<span>RANDOM</span>
				</a> -->
				{#if data.next != 'none'}
					<a href="{config.linkSite}/comics/{data.next}">
						<span>NEXT</span>
					</a>
				{:else}
					<a class="comics-navigator-button-disabled" href="{config.linkSite}/comics/{data.slug}">
						<span>NEXT</span>
					</a>
				{/if}
				<a href="{config.linkSite}/comics/{data.last}">
					<span>LAST</span>
				</a>
			</div>

			{#if dev}
				{#await import(/* @vite-ignore */ `/src/posts/comics${data.src}`) then { default: src }}
					<img class="comics-image" {src} alt={data.title} loading="lazy" />
				{/await}
			{:else}
				<!-- <img
					class="comics-image"
					src="{config.repository}/raw/main/src/posts/comics{data.src}"
					alt={data.title}
					loading="lazy"
				/> -->
				<img
					class="comics-image"
					src="https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/main/src/posts/comics{data.src}"
					alt={data.title}
					loading="lazy"
				/>
			{/if}
		</div>
	</div>
</article>
