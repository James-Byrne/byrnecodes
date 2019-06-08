---
layout: blog_post
title: "Ember, A Retrospective"
image: "/assets/img/blog-posts/ember-retro.jpg"
description: "My thoughts on Emberjs, it's strengths and where I hope they goes next"
---

# A Retrospective
  I’ve been programming professionally for a while now, with some Elixir, Erlang and Ruby with a brief stint of contracting with Angular 4 thrown in. Ergo I thought with my new found knowledge why not write some of it down so people on the internet could tell me I’m wrong! ……. wait.

## What I like about ember

### Out of the box

Embers **convention over configuration** setup (the cool kids call this Zero-Config now) allows you to get up and running with your new project in the time it takes to run yarn/npm install. Which is anytime between now and the heat death of the universe, but you get my point.

This is really great for experimenting since you don’t need to spend any time on setup, just get working. With bigger projects you get the same benefit *but*, with the confidence that your project will scale over time.

### Solid Development Experience

One of the things I love about Ember is the development experience. Over the last two years I have learned **alot!** Part of this has been how to best utilise the languages, patterns and frameworks at my disposal.

With Ember I’ve learned how to use the conventions and where I can lean on the framework to do the heavy lifting for me. This means I spend less time bike shedding and more time being productive. But the best part is that I am still seeing these results two years on. Partly due to the ecosystems growth in that time and partly due to a better mastery of existing tools.

The much loved [ember-concurrency](https://github.com/machty/ember-concurrency) addon is a great example of this. Being new I wrote a lot of mixed synchronous/asynchronous state management code that turned out to be hard to manage and inflexible (sue me :P). Over the last year when working on smaller apps I have learned how to massively simplify managing state across an ember application using ember-concurrency tasks (generator functions).

As a result this new code is easier to test, maintain, change and most importantly, it’s simple. Something which is often overlooked in application design and programming but which is vitally important.

### Community

The Ember community is awesome, simple as that. Both the core team and the community at large are extremely friendly and there is a real spirit around the project. It’s not driven by one of the big corporations or by a single person but rather the collective passion of the commun-. Ohh that was close, if I said the “comm” word three times Jono Bacon might appear.

### The PWA Story

Now this is easily the thing I am most excited about. Ember has a number of really cool addons such as [ember-service-worker](https://github.com/DockYard/ember-service-worker), [ember-cli-concat](https://github.com/sir-dunxalot/ember-cli-concat) and [ember-cli-critical](https://github.com/ivanvanderbyl/ember-cli-critical) that make creating Progressive Web Apps  much much easier. Dockyard has made a [great post](https://dockyard.com/blog/2017/07/20/how-to-build-a-pwa-with-ember) showing just how easy it is to upgrade a standard app into a PWA.

And it doesn’t stop there, both [ember-pouch](https://github.com/pouchdb-community/ember-pouch) and [ember-orbit](https://github.com/orbitjs/ember-orbit) create a compelling story for apps that need to allow collaboration and creation while still offline and sync changes once a connection is re-established. A keen interest for me.

This is something I am really excited about and I can’t wait to see what the state of Progressive Web Apps will look like in the future. *shakes fist at safari & iOS*

## Things I don’t like

So here’s the rub, there are not many things I dislike about Ember itself. I am a big believer of the *right tool for the job* mentality. As a result I don’t have many complaints, because the problem isn’t an issue with Ember it’s just not the right tool for the job I want to complete. For instance, if I wasn’t building a Single Page App, I wouldn’t choose Ember. Is that a bad thing? No, it’s just not the right tool. And saying that a framework should be able to do everything is like saying a language should be able to do the same. It’s a fools errand.

As a result I find the things I am not impressed with are not issues with Ember per se, but rather things I wish Javascript had. For instance I am really looking forward to having better Typescript support in Ember. My brief foray back into the Angular world (note to self: don’t mention the war) allowed me to experiment with Typescript in a real world project and I found it very useful in practice.

I would also love for functional programming to become more widely used within the Ember ecosystem, but unfortunately the trend seems to be going in the other direction. Which again, is not a bad thing, just the way the tool works.

### Closing comments

Overall I have really enjoyed my time with Ember. Compared to the other frameworks, libraries and languages I have tried, Ember has struck a cord with me in both the values it maintains and the practical benefits it boasts. Looking forward I am excited to see what comes next for Ember and how it will help me deliver value for my users.

*P.S. Also have you seen the mascots?*[*They are awesome!*](https://www.emberjs.com/mascots/)
