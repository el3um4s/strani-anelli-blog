---
title: "Genetic Algorithms: Cannon"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-03-14 19:30"
categories:
  - Construct 3
  - JavaScript
  - Machine Learning
tags:
  - Construct 3
  - JavaScript
  - Machine Learning
  - Genetic Algorithms
---

Nei giorni scorsi ho giocato ancora con gli algoritmi genetici. Mi serviva mettermi alla prova per testare la mia comprensione, quindi ho creato un cannone che impara da solo a colpire un bersaglio. Nonostante la logica di fondo sia la stessa del progetto precedente ([ML: Hello World](https://www.patreon.com/posts/genetic-hello-48614130) ([qui in italiano](https://blog.stranianelli.com/genetic-algorithms-hello-world/))) il risultato appare più spettacolare:

![machine learning cannon](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-03-14-genetic-algorithms-cannon/animation.gif)

Questa volta ho usato più a fondo Construct 3, sopratutto per quanto riguarda la gestione grafica. E, oggettivamente, il risultato è più accattivante.

L'idea è semplice: un cannone spara e cerca di colpire il bersaglio. Come per _Hello World_ anche in questo caso la soluzione classica è più performante. Ma è interessante capire come arrivare allo stesso risultato tramite un algoritmo genetico. Per cominciare occorre stabilire cosa usare come geni e quindi come comporre il cromosoma. Ma prima ancora dobbiamo decidere come muovere i proiettili.

In Construct 3 c'è un behavior utilissimo: [Bullet](https://www.construct.net/en/make-games/manuals/construct-3/behavior-reference/bullet). Utilizzarlo ci permette di risolvere due problemi:

1. non dobbiamo essere noi a gestire il movimento di ogni singolo elemento
2. rende un po' più realistica la simulazione aggiungendo un pizzico di casualità ai rimbalzi dei proiettili

Ci sono 3 proprietà che influenzano la traiettoria:

* l'angolo di sparo
* la velocità di partenza
* l'eventuale accelerazione del proiettile

A queste si aggiungono due caratteristiche "fisiche" del mondo:

* la forza della gravità
* la possibilità o meno per i proiettili di rimbalzare su alcuni elementi della simulazione

Sapendo questo possiamo creare un cromosoma contente 3 geni:

1. **speed**
2. **acceleration**
3. **angleOfMotion**

Il passo successivo della simulazione sarà lanciare i proiettili e stare a vedere come si comportano. Possono esserci solamente 2 risultati possibili:

1. si distruggono quando colpiscono un ostacolo
2. si distruggono quando colpiscono l'obiettivo

Poiché il nostro scopo è colpire l'obiettivo, possiamo usare la distanza tra i proiettili e l'obiettivo come base per calcolare il fitness del cromosoma. Fatto questo i passi seguenti sono la selezione degli elementi a cui applicare il crossover (cioè da fare incrociare tra di loro) e quindi la mutazione.

Durante questo passaggio ho aggiunto una condizione: se il fitness di un cromosoma è inferiore a 1000 allora quell'elemento non verrà né mutato né distrutto. In questo modo porto le generazioni a stabilizzarsi pur senza interrompere la simulazione.

Detto questo è il momento di passare al codice. E cominciamo con l'estendere una classe già esistente:

```js
export default class RocketInstance extends globalThis.ISpriteInstance {
	constructor() {
		super();
		
		this.behaviors.Bullet.bounceOffSolids = Globals.WorldDefault.bounceOffSolids;
		this.behaviors.Bullet.gravity = Globals.WorldDefault.gravity;
		
		this.ml_Fitness = 9999;
		this.ml_onCreation_speed = 400;
		this.ml_onCreation_acceleration = 400;
		this.ml_onCreation_angleOfMotion = 400;
	}
}
```

La classe `RocketInstance` estende la classe `Sprite` di Construct 3 permettendoci così di accedere direttamente alle proprietà "native" dell'oggetto. Nel costruttore di classe imposto le regole generali (gravità e la possibilità o meno di rimbalzare) e quelle particolari. Definisco i 3 geni del genoma come:

```js
this.ml_onCreation_speed = 400;
this.ml_onCreation_acceleration = 400;
this.ml_onCreation_angleOfMotion = 400;
```

Aggiungo anche una proprietà `ml_Fitness`.

Per le funzioni **randomize**, **fromDNA** e **calcFitness** rimando al [repository su GitHub](https://github.com/el3um4s/construct-demo/blob/master/machine-learning/002-cannon/source/files/scripts/rocket.js). Guardiamo invece `preserveExperience`

```js
preserveExperience() {
  const memory = new Experience({
    speed: this.ml_onCreation_speed,
    acceleration: this.ml_onCreation_acceleration,
    angleOfMotion: this.ml_onCreation_angleOfMotion,
    fitness: this.ml_Fitness
  });
  return memory;
}
```

Questa funzione serve per preservare i cromosomi anche dopo la distruzione dei proiettili. In sostanza al momento della distruzione eseguiamo un codice simile a questo:

```js
bullet.calcFitness({x,y});
const experience = bullet.preserveExperience();
Globals.Population.generation.add(experience);
bullet.destroy();
```

La classe `Experience` si occupa di eseguire le varie operazioni sui cromosomi salvati. Il suo costruttore è semplicemente:

```js
export default class Experience {
	constructor({speed = 400, acceleration = 0, angleOfMotion = 1, fitness = 9999} = {speed:400, acceleration:0, angleOfMotio:1, fitness:9999}) {
		this.speed = speed;
		this.acceleration = acceleration;
		this.angleOfMotion = angleOfMotion;
		this.fitness = fitness;	
	}
}
```

Possiamo eseguire 3 operazioni: **crossover**, **mutate** e **mutateConservative**. Anche per queste rimando al [codice su GitHub](https://github.com/el3um4s/construct-demo/blob/master/machine-learning/002-cannon/source/files/scripts/experience.js).

Infine c'è la classe `Population`.

```js
export default class Population {
	constructor() {
		this.members = [];
		this.generationNumber = 0;
	}
}
```

I metodi presenti sono del tutto simili a quelli di "[Hello World](https://www.patreon.com/posts/genetic-hello-48614130)" e si possono [vedere su GitHub](https://github.com/el3um4s/construct-demo/blob/master/machine-learning/002-cannon/source/files/scripts/population.js).

Passando invece al codice presente sull'event sheet di C3. Al momento di avvio del layout eseguiamo:

```js
Globals.Population.generation = new Population();
Globals.Population.generation.createRandomGeneration(Globals.Population.size);
```

Invece quando un proiettile viene distrutto usiamo

```js
const rocket = g_runtime.objects.Rocket.getFirstPickedInstance();
const target = g_runtime.objects.Target.getFirstInstance();
const {x, y} = target;
rocket.calcFitness({x,y});

const experience = rocket.preserveExperience();
Globals.Population.generation.add(experience);

rocket.destroy();
```

Infine per avviare una nuova generazione basta scrivere

```js
Globals.Population.generation.generation();
```

Con questo è tutto, ricordo che il codice di questo progetto è disponibile su GitHub:

- [il progetto su GitHub](https://github.com/el3um4s/construct-demo)
- [la demo online](https://c3demo.stranianelli.com/machine-learning/002-cannon/demo/)
- [Patreon](https://www.patreon.com/el3um4s)
