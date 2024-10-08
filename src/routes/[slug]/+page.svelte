<script lang="ts">
	import { base } from '$app/paths';
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	import { dev } from '$app/environment';
	export let data;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="{base}{data.url}" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:site_name" content={config.title} />
	{#if data.meta.cover}
		<meta
			property="og:image"
			content="{config.repository}/raw/main/src/posts/{data.src}/{data.meta.cover}"
		/>
	{/if}

	{#if data.meta.subtitle}
		<meta property="og:description" content={data.meta.subtitle} />
	{:else if data.meta.description}
		<meta property="og:description" content={data.meta.description} />
	{/if}

	<meta
		property="article:published_time"
		content="{data.meta.date.substring(0, 10)}T00:00:00+00:00}"
	/>

	<meta name="author" content="Samuele C. De Tomasi" data-rh="true" />
	<meta name="robots" content="index,follow,max-image-preview:large" data-rh="true" />
</svelte:head>

<article class="single-post">
	<!-- Title -->
	<hgroup>
		{#if data.meta.column}
			<p class="column">
				<a href="{base}/column/{data.meta.column}" class="column">{data.meta.column}</a>
			</p>
		{/if}
		<h1 class="title">
			{data.meta.title}
		</h1>
		{#if data.meta.subtitle}
			<h2 class="description">
				{data.meta.subtitle}
			</h2>
		{:else if data.meta.description}
			<h2 class="description">
				{data.meta.description}
			</h2>
		{/if}
		<p class="date">
			Published at {formatDate(data.meta.date)}
		</p>

		<!-- Tags -->
		<div class="tags">
			{#each data.meta.categories as tag}
				<a href="{base}/category/{tag}" class="tag">#{tag}</a>
			{/each}
		</div>
	</hgroup>
	<!-- Cover Image -->
	{#if data.meta.cover}
		<div class="cover">
			{#if dev}
				{#await import(/* @vite-ignore */ `/src/posts/${data.src}/${data.meta.cover}`) then { default: src }}
					<img {src} alt={data.meta.title} loading="lazy" />
				{/await}
			{:else}
				<img
					src="{config.repository}/raw/main/src/posts/{data.src}/{data.meta.cover}"
					alt={data.meta.title}
					loading="lazy"
				/>
			{/if}
		</div>
	{/if}

	<!-- Post -->
	<div class="post-text">
		<svelte:component this={data.content} />
	</div>
</article>
