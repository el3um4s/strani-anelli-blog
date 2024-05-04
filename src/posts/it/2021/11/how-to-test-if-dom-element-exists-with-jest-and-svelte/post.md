---
title: Usare Jest per controllare se un elemento esiste in un componente Svelte
published: true
date: 2021-11-17 16:00
categories:
  - Svelte
  - TypeScript
tags:
  - Svelte
  - how-to-test-if-dom-element-exists-with-jest-and-svelte
  - test-sveltekit-app-with-jest
  - TypeScript
lang: it
cover: cover.webp
description: "Un post rapido riguardo un problema che mi ritrovo ad affrontare frequentemente: come testare se un elemento esiste o meno in un componente. Tralascio la parte relativa alla configurazione di Jest con SvelteKit, ne ho parlato estesamente poco tempo fa. Mi concentro solamente su questo aspetto."
---

Un post rapido riguardo un problema che mi ritrovo ad affrontare frequentemente: come testare se un elemento esiste o meno in un componente. Tralascio la parte relativa alla [configurazione di Jest con SvelteKit](https://blog.stranianelli.com/test-sveltekit-app-with-jest-english/), ne ho parlato estesamente poco tempo fa. Mi concentro solamente su questo aspetto.

Ho 3 diverse cose da testare:

1. se un elemento esiste all'interno di una componente Svelte
2. se l'elemento esiste e contiene un dato testo
3. se l'elemento non esiste proprio nella pagina

Uso come esempio i test che sto implementando per il mio componente [svelte-component-info](https://github.com/el3um4s/svelte-component-info)

```ts
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/svelte';
import { SvelteInfo } from '../../lib/index';

test('should render component in the page', () => {
    const svelteInfo = render(SvelteInfo, { name:"Hello", info: { props: [], actions: [] } });
    
    expect(svelteInfo.queryByRole("heading")).toBeTruthy();
    
    const title = svelteInfo.getByRole("heading");
    
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    expect(title).toHaveTextContent("Hello");

    expect(svelteInfo.queryByTestId("description")).toBeNull();
});
```

### Controllare che un elemento esista in un componente Svelte

La prima è facile. Dopo aver creato il componente uso [Jest](https://jestjs.io/) per individuare l'elemento in questione. In questo caso cerco un elemento con tag `H1`:

```ts
expect(svelteInfo.queryByRole("heading")).toBeTruthy();
```

In questo modo Jest controlla se il componente Svelte contiene un elemento con ARIA Role `heading`. Se non lo trova il test non viene superato.

### Controllare che un elemento abbia un testo specifico

Se invece voglio controllare che un elemento abbia una proprietà specifica uso un codice leggermente diverso. Per prima cosa catturo l'elemento

```ts
const title = svelteInfo.getByRole("heading");
```

Poi controllo quello che mi interessa. In questo caso verifico il testo che contiene:

```ts
expect(title).toHaveTextContent("Hello");
```

Oltre al testo posso controllare molte altre cose, ma per questo è meglio consultare il repository [testing-library/jest-dom](https://github.com/testing-library/jest-dom).

### Controllare che un elemento non esista in Svelte

Infine la cosa meno intuitiva: come controllare che un elemento **NON** sia presente in una pagina WEB o in un elemento Svelte. In questo caso uso un codice simile al primo ma invece di usare `expect(..).toBeTruthy()` uso `expect(...).toBeNull()`:

```ts
expect(svelteInfo.queryByTestId("description")).toBeNull();
```

Bene, questo è quanto. Un appunto veloce per ricordare al me futuro come testare l'esistenza o meno di un elemento.
