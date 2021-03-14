---
title: "Genetic Algorithms: Cannon (English)"
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2021-03-14 20:30"
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

For the past few days, I have continued to experiment with genetic algorithms. I built a cannon that learns by itself how to hit a target. The logic behind it is the same as in my last post ([ML: Hello World](https://www.patreon.com/posts/genetic-hello-48614130)). The result, however, is more spectacular.

![machine learning cannon](https://raw.githubusercontent.com/el3um4s/strani-anelli-blog/master/_posts/2021/2021-03-14-genetic-algorithms-cannon/animation.gif)

This time I used the graphical aspects of Construct 3 more. Objectively, the result is more captivating.

The idea is simple: a cannon fires and tries to hit the target. As for _Hello World_ the classic solution is more performing. But it is interesting to understand how to achieve the same result through a genetic algorithm. To begin we decide what to use as genes and then how to compose the chromosome. But first we have to decide how to move the bullets.

In Construct 3 there is a very useful behavior: [Bullet](https://www.construct.net/en/make-games/manuals/construct-3/behavior-reference/bullet). Using it allows us to solve two problems:

1. we can delegate to C3 the management of the "physics of the world"
2. leave some randomness to the movement of the bullets

There are 3 properties that affect the trajectory:

* the shooting angle
* the starting speed
* the acceleration of the bullet

To these features we add two world constraints:

* the force of gravity
* the possibility or not for the bullets to bounce off some elements of the simulation

Knowing this we can create a chromosome containing 3 genes:

1. **speed**
2. **acceleration**
3. **angle of motion**

The next step in the simulation is to throw the bullets and see how they behave. There can only be 2 possible outcomes:

1. bullets are destroyed when they hit an obstacle
2. bullets are destroyed when they hit the target

We can use the distance between the bullets and the target as the basis for calculating the fitness of the chromosome. Then we can select the elements to cross and those to change. During this step I added a condition: if the fitness of a chromosome is less than 1000 then that element will not be changed or destroyed. In this way I bring the generations to stabilize without interrupting the simulation.

That said it's time to move on to the code. And let's start by extending an existing class:

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

The `RocketInstance` class extends the Construct 3 `Sprite` class allowing us to directly access the "native" properties of the object. In the class constructor I set the general rules (gravity and the possibility of bouncing) and the particular ones.

I define the 3 genes of the genome as:

```js
this.ml_onCreation_speed = 400;
this.ml_onCreation_acceleration = 400;
this.ml_onCreation_angleOfMotion = 400;
```

I also add an `ml_Fitness` property.

For the **randomize**, **fromDNA** and **calcFitness** functions refer to the [repository on GitHub](https://github.com/el3um4s/construct-demo/blob/master/machine-learning/002-cannon/source/files/scripts/rocket.js). Let's look at `preserveExperience` instead

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

This function preserves the chromosomes even after the destruction of the bullets. Basically at the time of destruction we execute a code similar to this:

```js
bullet.calcFitness({x,y});
const experience = bullet.preserveExperience();
Globals.Population.generation.add(experience);
bullet.destroy();
```

The `Experience` class takes care of performing various operations on the saved chromosomes. Its constructor is simply:

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

We can perform 3 operations: **crossover**, **mutate** and **mutateConservative**. Also for these I refer to the [code on GitHub](https://github.com/el3um4s/construct-demo/blob/master/machine-learning/002-cannon/source/files/scripts/experience.js).

Finally there is the `Population` class.

```js
export default class Population {
	constructor() {
		this.members = [];
		this.generationNumber = 0;
	}
}
```

The methods present are very similar to "[Hello World](https://www.patreon.com/posts/genetic-hello-48614130)" and [can be seen on GitHub]((https://github.com/el3um4s/construct-demo/blob/master/machine-learning/002-cannon/source/files/scripts/population.js)).

Turning instead to the code on the C3 event sheet. When starting the layout we execute:

```js
Globals.Population.generation = new Population();
Globals.Population.generation.createRandomGeneration(Globals.Population.size);
```

Instead when a bullet is destroyed we use

```js
const rocket = g_runtime.objects.Rocket.getFirstPickedInstance();
const target = g_runtime.objects.Target.getFirstInstance();
const {x, y} = target;
rocket.calcFitness({x,y});

const experience = rocket.preserveExperience();
Globals.Population.generation.add(experience);

rocket.destroy();
```

Finally, to start a new generation, just write

```js
Globals.Population.generation.generation();
```

That’s all. The code for this project is available on GitHub:

- [the project to GitHub](https://github.com/el3um4s/construct-demo)
- [the online demo](https://c3demo.stranianelli.com/machine-learning/002-cannon/demo/)
- [Patreon](https://www.patreon.com/el3um4s)
