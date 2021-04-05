---
layout: blog_post
title: "Ember and tailwindcss"
backdrop: "/assets/img/blog-posts/ember-and-tailwind/backdrop.png"
thumbnail: "/assets/img/blog-posts/ember-and-tailwind/thumbnail.png"
smallBackdropImage: "true"
description: "Have you heard how awesome tailwindcss and ember are together!? ..."
---

### Using tailwindcss

For the last year or more, both in work and at home, I've been using [tailwindcss](tailwindcss.com) for styling. I love composing styles together with css utility classes to create great User Interfaces (UI) & User Experiences (UX). Overall I've found it great and it's functional/compositional nature really gels with me.

> I also love it's component system as well! Reducing the number of abstractions to be made up front is a godsend for any project growing quickly.

Since I like it so much and I use it in pretty much all my examples for all of my posts I thought I'd write up a quick guide for how to get running with tailwindcss and ember.

### Cool! …. but what is it though?

> feel free to skip if you know what tailwind is

Ok for those of you that haven't worked with it yet, tailwindcss is a [utility-first](https://tailwindcss.com/docs/utility-first/) framework. You start with a set of css classes, each of which do one thing well. You then compose these classes together to get more complex behaviour. For example, below is a simple, overly excited, button.

```html
<button class="bg-pink-500 text-white">Press ME!</button>
```

<div class="flex justify-center my-6">
  <img src="/assets/img/blog-posts/ember-and-tailwind/simple-button-step-1.png" />
</div>

Now the classes here are pretty self explanatory but let's go through them anyway.

- `bg-pink-500`: set the background colour to pink with a hue of 500
  - Hue is a bit like `font-weight`, in increments of 100 it gets darker starting at `100` and ending at `900`
- `text-white`: sets the text colour to white

Simple enough right? But it's not really a nice looking button yet. For one the button is only as big as the text we put into it. Let's make it a tad nicer, we'll add a shadow, round the corners, add margin and add some padding.

```html
<button class="shadow bg-pink-500 text-white px-4 py-2 rounded m-10">
  Press ME!
</button>
```

<div class="flex justify-center my-6">
  <img src="/assets/img/blog-posts/ember-and-tailwind/simple-button-step-2.png" />
</div>

Much better! See how easy it is to update the styles of a component, no other files, picking colours or shadows. Just sensible, configurable defaults. I'll do the same as above and go through what we've added just to be sure we're all on the same page too.

- `shadow` : Adds a medium sized shadow
  - We can also use `-sm`, `-lg` etc. for bigger or smaller options
- `px-4`: This adds padding in the x axis, with the `4` relating to the amount of `rem` to add, in this case `1rem`
- `py-2` : The same as `px` but in the y axis and `2` gives us `.5rem`
- `rounded` : This adds a `border-radius`
  - `-sm`, `-lg` etc. applies here too
- `m-10` : Adds margin of `2.5rem` in both the x & y axis

Ok cool, but it's kinda boring right? You hover over it and nothing happens. What if we made it look more interactive. Let's do that, we'll add a simple hover effect to increase the shadow size and darken the button.

```html
<button class="shadow hover:shadow-lg bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded m-10">
    Press ME!
</button>
```

<div class="flex justify-center my-6">
  <img src="/assets/img/blog-posts/ember-and-tailwind/button-hover.gif" />
</div>

I'm going to take it you get the gist by now. By using these small independent classes we can specify good looking and complex designs  without having to worry about writing our own styles. This has a huge impact when creating mocks UIs and helps set a standard set of classes for growing or already large projects.

> For large projects under re-write or time critical tasks you'll find the amount of css you _don't_ need to write is a godsend! Speaking from first hand experience on this one.

Ok now that I have you sold on how awesome tailwindcss is let's add it to your ember project!

### Adding tailwindcss to an ember app

Previously we could install the library using `ember-cli-tailwind` by the great people at [embermap](embermap.com) but it has been deprecated in favour of another package. While more configurable and undoubtably	better there is a little more setup involved and since I use it _a lot_ I wanted to write a small guide on adding it to your projects.

So this post covers how we can get an ember app up and running with tailwind but if your pretty comfortable with embers basics you can check out the excellent documentation on the github page [here](https://github.com/chrism/emberjs-tailwind-purgecss).

### Getting started

> skip this if it's an existing app

First of all let's get ember installed. We'll need a version of node installed first, details here. Then we can install ember using ‘npm' like so:

```bash
npm install ember-cli -g
```

Now that we have ember installed we can create our new project and set it running with the following commands:

```bash
ember new tailwind-app
cd tailwind-app/
```

### A quick proof of concept

Now before we dive into setting up tailwind let's first create a small example that uses tailwind classes, that way we know they are working later. Add the following to your `app/templates/application.hbs` file.

```hbs
<div class="flex items-center justify-center h-screen bg-gray-100">
  <button class="shadow-md hover:shadow-lg hover:bg-green-500 bg-green-400 text-white px-8 py-5 rounded">
    A beautiful button!
  </button>
</div>
```

Now to get our ember app up and running we need to run `ember serve`. Once that's finished building visit `localhost:4200` in your browser. You should see the following beautiful button.

<div class="flex justify-center my-6">
  <img src="/assets/img/blog-posts/ember-and-tailwind/plain-button.png" />
</div>

..... anyway on with the tutorial!

### Configuring PostCSS
The next step is to add tailwind itself and configure it into the ember build pipeline. It's easier than it sounds I swear. To start we will need the following dependencies:

```bash
yarn add ember-cli-postcss tailwindcss autoprefixer postcss-import @fullhuman/postcss-purgecss -D
```

Next we need to generate the tailwind configuration file. To do this we need to enter the tailwind directory within our app and run the tailwind init command using `npx` (`npm install npx -g` if you don't have it).

```bash
mkdir app/tailwind
npx tailwind init app/tailwind/config.js --full
```

> For a real project we wouldn't want to use `--full` as it includes all of Tailwinds default configuration. You can see more info on this [here](https://tailwindcss.com/docs/configuration/#creating-your-configuration-file)

> Before going further you might want to add `/*global module*/` to the top of our new config file to suppress build warnings

Only two more steps left to go! Now we want to configure PostCSS in the Ember Build Pipeline. To do this we need to open `ember-cli-build.js` and update it to look like the following:

```js
// ember-cli-build.js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProduction = EmberApp.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // add extra paths here for components/controllers which include tailwind classes
      './app/index.html',
      './app/templates/**/*.hbs'
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
}

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules']
            }
          },
          require('tailwindcss')('./app/tailwind/config.js'),
          ...isProduction ? [purgeCSS] : []
        ]
      }
    }
  });
  return app.toTree();
};
```

### Wiring up Tailwind
The last step is to create a new css file and ensure that the tailwind css is included. We want to create `app/styles/components.css` and `app/styles/utilities.css` and include them in our existing `app/styles/app.css` file like the following.

```css
@import "tailwindcss/base";

@import "tailwindcss/components";
@import "components.css";

@import "tailwindcss/utilities";
@import "utilities.css";
```

Awesome! Now we can restart our app (running `ember serve`) and we should have a styled application! Our template should look like the below image.

<div class="flex justify-center my-6">
  <img src="/assets/img/blog-posts/ember-and-tailwind/finished-button.png" />
</div>

That's a bit better 😄.
