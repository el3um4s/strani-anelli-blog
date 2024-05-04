---
title: "SvelteKit: tag e filtri"
published: true
date: 2021-08-05 10:00
categories:
  - Svelte
  - JavaScript
  - TypeScript
tags:
  - Svelte
  - aggiungere-tag-e-filtri-a-sveltekit
  - JavaScript
  - TypeScript
lang: it
cover: cover.webp
description: "Dopo aver fatto i miei esperimenti ho cominciato (finalmente!) a lavorare su un progetto un po' più utile: sto ricostruendo il mio sito di esperimenti di Construct 3. Ho incontrato alcune difficoltà nell'utilizzare la struttura preesistente ma tutto sommato sono contento della soluzione che ho trovato. Inoltre più vado avanti più sto prendendo dimestichezza e più mi muovo velocemente. E posso cominciare a implementare alcune cosette, a partire dai tag, filtri e ordine personalizzato dei template."
---

Dopo aver fatto i miei esperimenti ho cominciato (finalmente!) a lavorare su un progetto un po' più utile: sto ricostruendo il mio sito di [esperimenti di Construct 3](https://c3demo.stranianelli.com/). Ho incontrato alcune difficoltà nell'utilizzare la struttura preesistente ma tutto sommato sono contento della soluzione che ho trovato. Inoltre più vado avanti più sto prendendo dimestichezza e più mi muovo velocemente. E posso cominciare a implementare alcune cosette, a partire dai tag, filtri e ordine personalizzato dei template.

Ma prima di tutto una nota. Dopo aver fatto un po' di prove ho deciso di passare al lato oscuro del CSS: ho aggiunto [tailwind css](https://tailwindcss.com/). In genere preferisco sbrigarmela senza utilizzare framework ma devo ammettere che questo è particolarmente potente e permette di velocizzare non poco la scrittura del codice.

E, per fortuna, è abbastanza facile da integrare in [SvelteKit](https://kit.svelte.dev/). Dopo aver installato (via npm) tailwind con il comando

```shell
npm install tailwindcss
```

uso [svelte-add/tailwindcss](https://github.com/svelte-add/tailwindcss):

```shell
npx svelte-add@latest tailwindcss
```

Tutto qui.

### Aggiungere tag

Aggiungere la lista dei tag a un post è tutto sommato abbastanza semplice: basta passare i valori al componente

```html
<script>
    export let metadata;

    const { tag, title, href } = metadata
</script>

<Card {tag} {title} {href}>
```

Più interessante è capire come far sì che cliccando sul tag si arrivi a una pagina con solo i post corrispondenti. Per riuscirci creo una cartella `src/routes/tags`  e al suo interno creo il file `[tag].svelte`. Cosa voglio ottenere? Voglio far sì che ogni tag abbia una sua pagina specifica. Per esempio, il tag `maps` farà riferimento alla pagina [c3demo.stranianelli.com/tags/maps](https://c3demo.stranianelli.com/tags/maps).

`[tag].svelte` ha un contenuto molto simile al file principale, `index.svelte`. L'unica vera differenza è nella funzione eseguita al momento di importare la lista dei post. Invece di importare tutto mi limito a filtrare solo i post che hanno il tag cercato 

```js
export const load = async ({ page }) => {
    const allPosts = import.meta.globEager(`../../demos/**/readme.md`);
    const tag = page.params.tag;

    let body = await generateBody(allPosts);
    const filteredPosts = body.filter((p) => p?.metadata?.tags.includes(tag));
    return { props: { posts: filteredPosts, tag } };
};
```

### Ordinare le liste

Il secondo aspetto su cui ho lavorato è la possibilità di ordinare i post in base alla data di creazione, alla data di aggiornamento e al titolo.

Penso ci siano due opzioni. La prima è di ordinare direttamente la lista nel momento in cui importo i post. La seconda, quella che ho scelto, è di permettere un ordine a scelta. In pratica ho aggiunto un componente per scegliere in base a cosa ordinare la lista dei post. Ho scelto di usare uno `store` in modo da mantenere in memoria l'ultima scelta fatta.

```ts
import { Writable, writable } from "svelte/store"

export const settings = {
    subscribe: customSettings.subscribe,

    setOrderASC: () => {
        customSettings.update( s => { return {...s,order: "ascending"}});
    },

    setOrderDESC: () => {
        customSettings.update( s => { return {...s,order: "descending"}});
    },

    setOrderBy: (orderBy) => {
        customSettings.update( s => { return {...s,orderBy}});
    },

    showDeprecated: (showDeprecated) => {
        customSettings.update( s => { return {...s,showDeprecated}});
    }
}
```

Posso integrare lo store all'interno di alcuni componenti:

```html
<script >
	import { settings } from '$lib/store/settings';
    export let orderBy;

    let selectedOrderBy = $settings.orderBy;
	$: settings.setOrderBy(selectedOrderBy);
</script>

<select
	bind:value={selectedOrderBy}
	class="p-2 bg-gray-600 text-gray-300 rounded border-2 border-gray-600 cursor-pointer"
>
	{#each orderBy as o}
		<option value={o.id} selected={o?.selected}>
			{o.text}
		</option>
	{/each}
</select>
```

In questo modo ogni volta che seleziono un tipo di ordine posso eseguire `settings.setOrderBy(selectedOrderBy)` e così facendo ricordare l'ordine che voglio mantenere.

Infine modifico il file `index.svelte` aggiungendo una funzione mutare l'ordine dei post:

```html
<script>
	import { base } from '$app/paths';

	import { settings } from '$lib/store/settings';
	import sortPost from '$lib/ts/order';

	import Card from '$lib/components/Card/Card.svelte';
	import Settings from '$lib/components/Layout/Settings/Settings.svelte';

	export let posts: any[];

	$: listPosts = [...sortPost(posts, $settings.orderBy, $settings.order, $settings.showDeprecated)];
</script>

<Settings />

{#each listPosts as { slugPage, metadata, preview, id }, i ({ id })}
	<Card
		{id}
		deprecated={metadata?.deprecated}
		title={metadata?.title ? metadata.title : slugPage}
		href={`${base}/${slugPage}`}
		preview="{base}/{preview}"
		tags={metadata?.tags ? metadata.tags : []}
		description={metadata?.description ? metadata.description : ''}
		dataCreated={metadata?.date?.created ? metadata.date.created : ''}
		dataUpdated={metadata?.date?.updated ? metadata.date.updated : ''}
	/>
{/each}
```
