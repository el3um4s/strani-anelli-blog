---
title: "SvelteKit: routing da altre cartelle"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Bogdan Karlenko**](https://unsplash.com/@bogdan_karlenko)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-07-26 10:00"
categories:
  - SvelteKit
  - GitHub Pages
tags:
  - SvelteKit
  - GitHub Pages
---

Sto continuando ad esplorare [Svelte](https://svelte.dev/), [SvelteKit](https://kit.svelte.dev/) e [GitHub Pages](https://pages.github.com/). Dopo aver capito come fare è abbastanza semplice creare un blog e usare [mdsvex](https://mdsvex.pngwn.io/) per processare file markdown. Ma la struttura delle cartelle imposta è abbastanza limitante per quello che ho in testa io.

Per capirci, le pagine del blog devono per forza stare in una cartella `blog` (o `post`, o qualsiasi altro nome). L'url del post avrà una forma simile a:

```
blog.stranianelli.com/2021/2021-07-26-sveltekit-routing-from-other-folders
```

Ma io preferisco un formato più semplice, nella forma:

```
blog.stranianelli.com/sveltekit-routing-from-other-folders
```

Un po' perché scrivo pochi post, un po' per gusto personale. Poi lo so che non è una pratica molto diffusa ma una condizione sine qua non per passare da Jekyll a Svelte è la possibilità di ottenere lo stesso risultato.

Un'altra condizione per me importante è la possibilità di tenere le immagini dei post nella stessa cartella del testo. Preferisco avere tutto assieme, mi semplifica la vita quando scrivo, quando correggo e anche quando decido di modificare le cose.

Ho dovuto cercare un po', ma alla fine unendo vari pezzetti e, sopratutto, provando e riprovando sono riuscito a ottenere qualcosa di funzionante.

Prima di cominciare un po' di link da cui ho attinto:

- [Building a Better Svelte Data Flow](https://www.ryanfiller.com/blog/building-a-better-svelte-data-flow): contiene alcuni consigli su [Sapper](https://sapper.svelte.dev/), ma possono essere mutuati per SvelteKit
- [Vite - Glob Import](https://vitejs.dev/guide/features.html#glob-import)
- [Sveltekit Markdown Blog](https://www.youtube.com/playlist?list=PLm_Qt4aKpfKgonq1zwaCS6kOD-nbOKx7V)

Il concetto base è poter "mappare" tutti i post del blog come fossero dei "moduli". Dopo di ché sfrutto [Vite](https://vitejs.dev/) per importare i moduli in maniera dinamica nel blog. Per fare i miei test non creo un nuovo repository. Continuo a modificare il template [MEMENTO SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages): aggiungo una cartella `src/news` dentro cui inserire i vari post.

Ho deciso di semplificarmi la vita e di usare una struttura simile a quella che mi servirà nella pratica. Quindi i post saranno divisi per anno ma non per mese. Ogni post starà in una cartella i cui primi caratteri rappresentano la data di pubblicazione. Dentro la cartella metterò le immagini che mi serviranno e un file `index.md` con il post. Penso che in futuro dovrò aggiungere la possibilità di usare anche file markdown con altri nomi. Però per il momento è sufficiente così.

Riassumendo, un post come questo sarà inserito in un percorso simile a:

```
root: /src/news/2021/2021-07-26-sveltekit-routing-from-other-folders/index.md
```

Mi serve poi la possibilità di indicizzare i vari post, nella home page o in un'altra pagina. Comincio da questo modificando `src/routes/index.svelte`, ovvero l'home page.

### index.svelte

Per prima cosa mi serve l'elenco di tutti i file markdown contenuti nella cartella `news`. Per farlo utilizzo una funzione propria di Vite, `globEager`:

```js
const allPosts = import.meta.globEager(`../news/**/*.md`);
```

Questo mi permette di ottenere tutti i file `md` come moduli. Scorro quindi ogni post che ho trovato per estrarre alcuni dati

```js
for (let path in allPosts) {
  // ...
}
```

Premetto che il codice si può pulire ancora un pochetto. Comunque, mi serve il modulo del post da passare alla pagina:

```js
const post = allPosts[path];
```

Poi mi servono i metadata (ovvero il contenuto del Frontmatter):

```js
const metadata = post.metadata;
```

Inserisco tutto questo in un array (`body = []`), array che poi passerò alla pagine tramite la funzione `load()`. Mettendo tutto assieme ottengo:

```html
<script context="module">
  const allPosts = import.meta.globEager(`../news/**/*.md`);
  let body = [];
  for (let path in allPosts) {
      const post = allPosts[path];
      const metadata = post.metadata;
      const p = {
          path, metadata
      }
      body.push(p);
  }

  export const load = async () => {
      return { props: {posts: body} }
  }
</script>
```

Adesso non resta che inserire la parte html in `index.svelte`:

```html
<script lang="ts">
    import { base } from '$app/paths';
    export let posts;
</script>

<h1>News</h1>

<ul>
    {#each posts as {slugPage, metadata: {title, slug}} }
        <li>
            <a href={`${base}/${slug}`} >{title}</a>
        </li>
    {/each}
</ul>
```

Posso anche fare alcuni giochetti interessanti, per esempio invece di usare uno slug inserito nel frontmatter del post posso usare il nome della cartella. Per farlo estraggo il nome della cartella ripulito dalla data:

```js
for (let path in allPosts) {
  //...
  const namePage = path.split("/");
  const slugPage = namePage[namePage.length - 2].slice(11);
  const p = {
    path,
    metadata,
    slugPage,
  };
  body.push(p);
}
```

Poi creo una funzione di aiuto per usare lo slug del post se presente, altrimenti il nome della cartella:

```js
function linkSlug(s: string | undefined, p: string): string {
  let result = "";
  if (!s) {
    result = p;
  } else {
    result = s;
  }
  return result;
}
```

E infine correggo la parte html

```html
<a href={`${base}/${linkSlug(slug, slugPage)}`} sveltekit:prefetch >{title}</a>
```

Il frontmatter può essere usato anche per passare anche altri dati a svelte come tag, data, e così via

### [slug].svelte

Sistemata l'home page non resta che capire come accedere ai vari post usando uno slug semplificato. Per farlo mi serve un [parametro dinamico](https://kit.svelte.dev/docs#routing-pages). Creo un componente `src/routes/[slug].svelte`.

Anche qui devo importare i vari post. Ma questa volta importo anche il modulo dei vari post, non solamente alcune informazioni:

```js
export const ssr = false;
const allPosts = import.meta.globEager(`../news/**/*.md`);
let body = [];

for (let path in allPosts) {
  const post = allPosts[path];
  const metadata = post.metadata;
  const pathArray = path.split("/");
  const slugPage = pathArray[pathArray.length - 2].slice(11);

  const p = { post, slugPage, metadata };

  body.push(p);
}
```

Poi non mi resta che filtrare i vari post per estrarre quello che mi interessa caricare:

```js
export const load = ({ params }) => {
  const posts = body;
  const { slug } = params;

  const filteredPosts = posts.filter((p) => {
    const slugPost = p.metadata.slug;
    const slugToCompare = !slugPost ? p.slugPage : slugPost;
    return slugToCompare.toLowerCase() === slug.toLowerCase();
  });

  return {
    props: {
      page: filteredPosts[0].post.default,
    },
  };
};
```

Il codice del componente è di per sé molto semplice:

```html
<script>
  export let page;
</script>

<svelte:component this="{page}" />
```

Il codice è finito. Adesso non resta che costruire il sito con:

```bash
npm run build
```

e poi caricarlo su GitHub con:

```bash
npm run deploy
```

Per oggi è tutto. Il codice è disponibile su GitHub:

- [MEMENTO - SvelteKit & GitHub Pages](https://github.com/el3um4s/memento-sveltekit-and-github-pages)

Il blog invece è visibile all'indirizzo [el3um4s.github.io/memento-sveltekit-and-github-pages](https://el3um4s.github.io/memento-sveltekit-and-github-pages/).

Ricordo inoltre l'indirizzo del mio Patreon:

- [Patreon](https://www.patreon.com/el3um4s)
