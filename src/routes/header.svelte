<script lang="ts">
	import { browser } from '$app/environment';
	import * as config from '$lib/config';

	// import About from '$lib/icons/about.svelte';
	import Contact from '$lib/icons/contact.svelte';
	import RSS from '$lib/icons/rss.svelte';
	import Logo from '$lib/icons/logo.svelte';
	import Dark from '$lib/icons/dark.svelte';
	import Light from '$lib/icons/light.svelte';
	import Search from '$lib/icons/search.svelte';
	import Thanks from '$lib/icons/thanks.svelte';
	import Comics from '$lib/icons/comics.svelte';

	let theme = browser
		? window.localStorage.getItem('theme') ?? window.localStorage.setItem('theme', 'light')
		: 'light';

	if (browser) {
		if (theme == 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<header>
	<nav>
		<!-- Title -->
		<a href={config.linkSite} class="title">
			<Logo />
			<span>{config.title}</span>
		</a>

		<!-- Navigation -->
		<ul>
			<!-- <li>
			<a href="{config.url}/claudia-falzone">
					<About />
					<span>About</span>
				</a>
			</li>
			<li> -->
			<li>
				<a href="{config.linkSite}/comics/last">
					<Comics />
					<span>Comics</span>
				</a>
			</li>
			<li>
				<a href="{config.linkSite}/search">
					<Search />
					<span>Search</span>
				</a>
			</li>
			<li>
				<a href="{config.linkSite}/contact">
					<Contact />
					<span>Contact</span>
				</a>
			</li>
			<li>
				<a href="{config.linkSite}/thanks">
					<Thanks />
					<span>Thanks</span>
				</a>
			</li>
			<li>
				<a href="{config.url}/rss.xml" target="_blank">
					<RSS />
					<span>RSS</span>
				</a>
			</li>

			<li>
				{#if theme == 'dark'}
					<button
						on:click={() => {
							theme = 'light';
							window.localStorage.setItem('theme', 'light');
							document.documentElement.classList.remove('dark');
						}}
					>
						<Dark />
					</button>
				{:else}
					<button
						on:click={() => {
							theme = 'dark';
							window.localStorage.setItem('theme', 'dark');
							document.documentElement.classList.add('dark');
						}}
					>
						<Light />
					</button>
				{/if}
			</li>
		</ul>
	</nav>
</header>

<style lang="postcss">
</style>
