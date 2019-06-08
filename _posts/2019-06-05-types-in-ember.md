---
layout: blog_post
title: "Static Types in EmberJs?"
image: "/assets/img/blog-posts/types-in-ember/bg.jpg"
description: "So you’ve decided to look into adding Typescript to your Ember project ..."
---

# Static Types in EmberJs?
So you’ve decided to look into adding Typescript to your Ember project. You’ve heard of all the benefits Static Typing will bring you and how it will deliver unto you a more maintainable codebase than plain ol’ javascript (couldn’t be that hard right?).

Well before you dive in headfirst there are a few things I’d recommend you consider. After all, this is a change to your underlying programming language (yes I know it’s a superset, more on that later) so some pros and cons are to be expected. But to start of positive, let’s look at some of the upsides first.

> Note I will not be discussing Classes or decorators much in this doc, if you want an intro to them I highly recommend [this post](https://www.pzuraq.com/coming-soon-in-ember-octane-part-1-native-classes/) by [pzuraq](https://www.pzuraq.com).


## The Good
### The Benefits of Static Typing

<div class="flex justify-center my-6">
  <img src="/assets/img/blog-posts/types-in-ember/meme.jpg" />
</div>

> This is now my favourite meme ever

Probably the most talked about benefit of Typescript is its Static Types. These essentially allow us to specify what king of value we expect from a particular parameter, whether it’s a string, an integer, both or neither. This allows the Typescript compiler to catch a number of potential bugs before we come across them either in development or production.

A simple example of this would be parsing some data structure. Let’s say we are parsing an error but that the error can take a number of shapes. It can be a string or an object containing a list of errors.

If we wanted to just extract all the errors from some error we’ll need to write a function that can handle all these cases. A potential solution would look something like this:

```js
function getAllErrors(error = {}) {
  if (typeof error === 'string') return [error];
  if (typeof error === 'object') return error.errors;

  return [];
}
```

This looks good at first glance, we take in an error, check it’s types and if it matches what we want we return it, otherwise we return an empty list. However there is an error here, if `error` is passed as `null` it will fail the first `if` statement but pass the later (because of course `typeof null === ‘object` ….).

Obviously that is not what we want. Luckily Typescript (Static Typing) will help us catch this error. Let’s start by writing the types (something you should always do first).

```ts
type ErrorMessage = string;

interface Error {
  errors: Array<ErrorMessage>
}

type PotentialError = any | ErrorMessage | Error;
```

Ok now we have a good idea what the shape of our data structures will be and we can express the intent of our function more clearly.

```ts
function getAllErrors(error: PotentialError): Array<ErrorMessage> {
  if (isErrorMessage(error)) return [error];
  if (isError(error)) return error.errors;

  return [];
}
```

But wait! What are those new functions? `isErrorMessage` and `isError`? Well those are type guards. They allow you to tell the typescript compiler what type is being returned. So for instance the `isError` type guard could look like this:

```ts
function isError(error: PotentialError): error is Error {
  return 'errors' in error;
}
```

And now that the compiler knows the type of the error, if we tried to change the return statement to return a parameter not in the `Error` interface or return the first index of `errors.errors` like below our compiler will tell us.

```ts
if (isError(error)) return error.errors[0];
//                               ^
//                               |
// Type string is not assignable to type string[]
```

This is a big win for maintainability, it allows us to be really sure what to expect from functions we have written and more importantly ones which we did not. You could argue it added a lot of boiler plate (which is not inherently bad to begin with) but it made our implementation clearer and allowed us to eliminate a set of bugs that are very hard to test for.

> Notice as well how clear the implementation is, just by reading the names and the types we can tell immediately _what_ is being done within the function


### Documentation
Notice as well how clear the implementation of our example function is now. Previously, since this is a utility function meant for usage throughout the application, I would have written a set of comments like the following:

```js
/* @method getAllErrors/1
* @return List(Object)
*
* If it is a simple error (a
* string) then that will be returned as
* the expected return type.
*
* If a list of errors are found within
* the object they will be returned.
*
* If it is not a string or an object we
* will return an empty list.
*/
function getAllErrors(error = {}) {
  if (typeof error === 'string') return [error];
  if (typeof error === 'object') return error.errors;

  return [];
}
```

As the application becomes more complex I would consider this type of information to be the bare minimum required (more on that in a minute). Knowing the return types and the types of parameter a function accepts will let us both avoid issues when using the function and create a clear boundary within which we can refactor the function itself.

Now if we consider the same Typescript code, it’s obvious these comments are no longer required.

```ts
function getAllErrors(error: PotentialError): Array<ErrorMessage> {
```

More than that these types will _have_ to stay up to date as we refactor (a big problem with regular comments) and they will give us extra information through compiler warnings and editor tools. I did say this was the bar minimum information required though so I will touch on that briefly.

Typescript gives us the types to answer the _what_ of a function but not the _why_. For very simple functions just the name of the function is enough but sometimes a function will be quite complex, have a limited scope or have side effects. These things should still be recorded within the functions documentation. Otherwise we can’t know when to use a function or more importantly _when not too_.

In the case where documentation is still required (the _why_ of a function is complex) the Typescript eco-system provides [TsDoc](https://github.com/Microsoft/tsdoc). This is a standard way of writing documentation that also works with tooling such as the vscode editor.

### Tooling
Another benefit of Typescript is its excellent editor integration, especially with [VsCode](https://code.visualstudio.com/docs/languages/typescript) where it offers intellisense, tools for refactoring, debugging, linting, documentation and formatting.

> For Vim users check out [tsuquyomi](https://github.com/Quramy/tsuquyomi) to get a similar set of tools within your editor

Having these tools will provide a productivity boost for you and your team by removing the overhead that comes with working on a large code base such as searching through documentation or simply trying to figure out the structure a functions parameters. All of these things will be surfaced by your editor and the compiler.

### A Superset
Maybe Typescripts biggest feature and without question one of the biggest reasons for its growth. It’s a superset of javascript, which basically means that any javascript is also valid typescript. This means becoming a typescript developer is as easy as re-naming your `.js` files to `.ts`.

From there you can gradually type more and more of the code and make the compiler stricter until your whole (or whatever amount you want) is fully written with Typescript in mind. This is huge for existing projects that don’t want to start all over again but still want the benefits of a typed language.

> Note you will need to configure some sort of build pipeline but I’m considering that as separate

## The Bad
### Breaking Changes
Unfortunately Typescript does not strictly follow [semver](https://github.com/Microsoft/TypeScript/issues/14116), something we take for granted within the Ember eco-system. Due to marketing pressure breaking changes are introduced through minor versions, though they do maintain some semblance of semver after that. A helpful diagram/comment from [niieani](https://github.com/Microsoft/TypeScript/issues/14116#issuecomment-280915422)  shows how we should approach this.

```
       marketing
           ∨
TypeScript 2.34.2.1
             ∧∧ ∧ ∧
          major ∧ patch
                ∧
              minor
```

This is a problem in an eco-system that expects things to follow server and not make breaking changes on minor releases. But it surfaces a bigger problem. Besides Ember itself (though this applies to all frameworks), Typescript has the potential to require the largest refactors of your codebase.

Any fundamental (although unlikely) changes to Typescript will have a knock on effect to your codebase and potentially a large swath of it. This makes the lack of semver even more concerning and is something that must be considered carefully before diving straight in.

### Conventions & Expertise
Another consideration which I think is often glossed over is conventions and the expertise of your team. Sure Typescript is a super set of javascript but that doesn’t mean your team is positioned to take advantage of that. For instance a quick question that arises from our previous example.

> Should the types we declared above exist within a global types file?

How would you answer this question? I can definitely see the `PotentialError` type being used elsewhere in the application and Typescript offers us a way of declaring a global type within a project.

It sounds reasonable and useful, however my answer would be:

> No. They are too specific, any global `Error` type would have to be far more generic. These types are specific to the structures expected by the functions within the file. At best they could be some sub-type of a broader type within the global types namespace.

I am lucky to have worked with a variety of different languages and frameworks from early in my career that includes both typed and non-typed languages. But not all teams have that kind of experience and coming from a Javascript background it will be important to make sure your team has the expertise they need to make the right decisions. Otherwise you can create one hell of a mess.

### Missing Typings
Unfortunately not every library comes with a set of types fresh out of the oven. As a result you may run into issues where common libraries don’t have types. “Sure no problem, it’s a superset, it will still work” I hear you say.
While true the Typescript compiler & tools are able to strut their stuff better when the configuration is stricter. This will lead to errors & warnings when attempting to compile code that does not have types or at the least no type safety, which kind of defeats the point.

Now there are great projects such as [DefinitelyTyped](https://definitelytyped.org/) which provides a huge library of type definitions but even then common libraries such as [ember-concurrency](http://ember-concurrency.com/docs/introduction/) and [Ember Data Storefront](https://embermap.github.io/ember-data-storefront/) do not have types. This means either adding your own types though a `.d.ts` (a type definitions file) or compromising on the type safety you are supposed to rely on.

## Transitioning To Typescript
So you’ve got this far and you’re undeterred, well then let’s outline a simple method of transitioning your existing Ember application to use Typescript.

Firstly we will install the excellent project [`ember-cli-typescript`](https://github.com/typed-ember/ember-cli-typescript)  which will take care of building & converting our typescript files for us. This is the simplest way of setting up Typescript but it does have [limitations](https://typed-ember.github.io/ember-cli-typescript/docs/ts-guide/current-limitations) that we should be aware of.

As for typing the application itself [Mike North](https://github.com/mike-north)  recommends the following steps:

1. Start with allowing implicit `anys` and just rename all `.js` files to `.ts`
2. Add as much type info as possible without going into detail. Opt for explicit `any`. Ban implicit `any`
3. Go into detail at certain, commonly used, modules (services, models etc)

By following these steps we can convert our whole application to typescript without interfering with other members of the team or preventing feature work.

And there you have it, Typescript in Ember with minimum fuss!
